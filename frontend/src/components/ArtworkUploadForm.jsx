import React, { useState } from 'react';
import axios from '../api/axios';

const ArtworkUploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('image', image); // Important: must match .single('image') in backend

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      alert('Not authenticated');
      return;
    }

    try {
      await axios.post('/artworks/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Artwork uploaded successfully!');
      setTitle('');
      setDescription('');
      setTags('');
      setImage(null);
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={inputStyles}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={inputStyles}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={inputStyles}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
        style={fileInputStyles}
      />
      <button type="submit" style={buttonStyles}>Upload</button>
    </form>
  );
};

// Inline styles for the form and its components
const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
};

const inputStyles = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const fileInputStyles = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const buttonStyles = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default ArtworkUploadForm;
