const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Artwork = require('../models/Artwork');
const authenticateUser = require('../middleware/authMiddleware');  // Assuming authentication middleware
const router = express.Router();

// Set up multer storage to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });  // Define upload middleware here

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload Artwork
router.post('/upload', authenticateUser, upload.single('image'), async (req, res) => {
  const { title, description, tags } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    // Start the Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },  // Automatically detect image format
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
        }

        // Creating a new artwork document in the database
        const artwork = new Artwork({
          title,
          description,
          tags: tags ? tags.split(',') : [],  // Split tags if present, otherwise empty array
          imageUrl: result.secure_url,  // Cloudinary URL of the uploaded image
          artist: req.user.id,  // Assuming user authentication is done, passing user id
        });

        // Save artwork to the database
        await artwork.save();
        res.status(201).json(artwork);  // Send the artwork object as response
      }
    );

    // Send image buffer to Cloudinary upload stream
    uploadStream.end(image.buffer);
  } catch (err) {
    console.error('Error during upload process:', err);
    res.status(500).json({ message: 'Error uploading artwork', error: err.message });
  }
});

// Like Artwork
// Toggle Like/Unlike Artwork
// Like/Unlike Artwork (Toggle)
router.post('/:id/like', authenticateUser, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const userId = req.user._id.toString(); // Ensure it's a string
    const likedUsers = artwork.likedUsers.map(id => id.toString());

    if (likedUsers.includes(userId)) {
      // Unlike
      artwork.likes = Math.max(artwork.likes - 1, 0); // prevent negative likes
      artwork.likedUsers = artwork.likedUsers.filter(id => id.toString() !== userId);
    } else {
      // Like
      artwork.likes += 1;
      artwork.likedUsers.push(req.user._id); // push ObjectId directly
    }

    await artwork.save();

    res.json({ liked: !likedUsers.includes(userId), likes: artwork.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




router.get('/:id/isLiked', authenticateUser, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const isLiked = artwork.likedUsers.includes(req.user._id);
    res.json({ liked: isLiked });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id/likes', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    res.json({ likes: artwork.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/artworks
// GET /api/artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate('artist', 'username') // 👈 Get username from referenced User model
      .sort({ createdAt: -1 });

    const formattedArtworks = artworks.map(art => ({
      _id: art._id,
      title: art.title,
      description: art.description,
      tags: art.tags,
      imageUrl: art.imageUrl,
      likes: art.likes,
      username: art.artist?.username || 'Unknown', // 👈 Add username to frontend
    }));

    res.json(formattedArtworks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/artworks/mine
router.get('/mine', authenticateUser, async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user.id })
      .populate('artist', 'username');

    const formattedArtworks = artworks.map(art => ({
      _id: art._id,
      title: art.title,
      description: art.description,
      tags: art.tags,
      imageUrl: art.imageUrl,
      likes: art.likes,
      username: art.artist?.username || 'Unknown',
    }));

    res.json(formattedArtworks);
  } catch (err) {
    console.error('Error fetching user artworks:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/artworks/:id
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// DELETE /api/artworks/:id
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    // Optional: Allow only the artist who created the artwork to delete
    if (artwork.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.put('/:id', authenticateUser, upload.single('image'), async (req, res) => {
  const { title, description, tags } = req.body;
  const image = req.file;

  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this artwork' });
    }

    // Update fields if provided
    if (title) artwork.title = title;
    if (description) artwork.description = description;
    if (tags) artwork.tags = tags.split(',');

    // If new image is uploaded, upload to Cloudinary
    if (image) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading image', error: error.message });
          }

          artwork.imageUrl = result.secure_url;

          await artwork.save();
          res.json({ message: 'Artwork updated successfully', artwork });
        }
      );

      uploadStream.end(image.buffer);
    } else {
      // No image to upload, just save updated fields
      await artwork.save();
      res.json({ message: 'Artwork updated successfully', artwork });
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
