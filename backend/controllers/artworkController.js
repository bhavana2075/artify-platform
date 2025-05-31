const cloudinary = require('cloudinary').v2;
const Artwork = require('../models/Artwork');

// Upload Artwork
exports.uploadArtwork = async (req, res) => {
  const { title, description, tags } = req.body;
  const image = req.file; // The uploaded image

  // Check if image is provided
  if (!image) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    // Upload image to Cloudinary
    cloudinary.uploader.upload(image.path, { resource_type: 'image' }, async (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
      }

      // Create a new artwork document
      const artwork = new Artwork({
        title,
        description,
        tags: tags ? tags.split(',') : [], // Split tags if provided
        imageUrl: result.secure_url,  // Cloudinary URL of the uploaded image
        artist: req.user.id,  // The authenticated user ID
      });

      // Save artwork to the database
      await artwork.save();
      res.status(201).json(artwork);  // Send the artwork object as response
    });
  } catch (err) {
    console.error('Error during upload process:', err);
    res.status(500).json({ message: 'Error uploading artwork', error: err.message });
  }
};

// Like Artwork
exports.likeArtwork = async (req, res) => {
  try {
    // Find the artwork by its ID
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Increment the likes count
    artwork.likes += 1;
    await artwork.save();  // Save the updated artwork

    res.json(artwork);  // Return the updated artwork with incremented likes
  } catch (err) {
    console.error('Error liking artwork:', err);
    res.status(500).json({ message: 'Error liking artwork', error: err.message });
  }
};
// Update Artwork
exports.updateArtwork = async (req, res) => {
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

    // Update text fields
    if (title) artwork.title = title;
    if (description) artwork.description = description;
    if (tags) artwork.tags = tags.split(',');

    // If new image is uploaded, upload it to Cloudinary
    if (image) {
      cloudinary.uploader.upload(image.path, { resource_type: 'image' }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading image', error: error.message });
        }

        artwork.imageUrl = result.secure_url;

        await artwork.save();
        return res.json({ message: 'Artwork updated successfully', artwork });
      });
    } else {
      // Save without uploading image
      await artwork.save();
      res.json({ message: 'Artwork updated successfully', artwork });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// PUT /api/artworks/:id
exports.updateArtwork = async (req, res) => {
  const { title, description, tags } = req.body;
  const image = req.file;  // Image uploaded via multer

  try {
    const artwork = await Artwork.findById(req.params.id);  // Find artwork by ID

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check if the authenticated user is the artist
    if (artwork.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this artwork' });
    }

    // Update fields if provided
    if (title) artwork.title = title;
    if (description) artwork.description = description;
    if (tags) artwork.tags = tags.split(',');  // Assume tags are provided as comma-separated string

    // If a new image is uploaded, handle the Cloudinary upload
    if (image) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading image', error: error.message });
          }

          // Update the image URL of the artwork with Cloudinary's URL
          artwork.imageUrl = result.secure_url;

          await artwork.save();  // Save the updated artwork
          res.json({ message: 'Artwork updated successfully', artwork });
        }
      );

      uploadStream.end(image.buffer);  // Upload image buffer to Cloudinary
    } else {
      // No image to upload, just save the updated fields
      await artwork.save();
      res.json({ message: 'Artwork updated successfully', artwork });
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// DELETE /api/artworks/:id
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);  // Find artwork by ID
    
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    // Optional: Check if the authenticated user is the artist who created the artwork
    if (artwork.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });  // User is not authorized
    }

    await artwork.deleteOne();  // Delete the artwork from the database
    res.json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
