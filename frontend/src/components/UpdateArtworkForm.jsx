import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const UpdateArtworkForm = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    if (!token) return;

    const fetchArtworks = async () => {
      try {
        const res = await axios.get('/artworks/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArtworks(res.data || []);
      } catch (err) {
        console.error('Failed to fetch artworks', err);
      }
    };

    fetchArtworks();
  }, [token]);

  const handleSelectChange = (e) => {
    const artwork = artworks.find(a => a._id === e.target.value);
    setSelectedId(artwork._id);
    setTitle(artwork.title);
    setDescription(artwork.description);
    setTags(artwork.tags?.join(', ') || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    if (image) formData.append('image', image);

    try {
      await axios.put(`/artworks/${selectedId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Artwork updated!');
      setSelectedId('');
      setTitle('');
      setDescription('');
      setTags('');
      setImage(null);
    } catch (error) {
      console.error('Update failed:', error);
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h3>Select Artwork to Update</h3>
      <select onChange={handleSelectChange} value={selectedId} style={inputStyles}>
        <option value="">-- Select Artwork --</option>
        {artworks.map((art) => (
          <option key={art._id} value={art._id}>{art.title}</option>
        ))}
      </select>

      {selectedId && (
        <form onSubmit={handleUpdate} style={formStyles}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={inputStyles}
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={inputStyles}
            required
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            style={inputStyles}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={inputStyles}
          />
          <button type="submit" style={buttonStyles}>Update Artwork</button>
        </form>
      )}
    </div>
  );
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '20px',
};

const inputStyles = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyles = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default UpdateArtworkForm;
