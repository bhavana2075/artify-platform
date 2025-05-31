import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const DeleteArtwork = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedId, setSelectedId] = useState('');
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

  const handleDelete = async () => {
    if (!selectedId) return alert('Please select an artwork to delete.');

    if (!window.confirm('Are you sure you want to delete this artwork?')) return;

    try {
      await axios.delete(`/artworks/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Artwork deleted successfully.');

      // Remove deleted artwork from list
      setArtworks((prev) => prev.filter((a) => a._id !== selectedId));
      setSelectedId('');
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h3>Delete Your Artwork</h3>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={inputStyles}
      >
        <option value="">-- Select Artwork --</option>
        {artworks.map((art) => (
          <option key={art._id} value={art._id}>
            {art.title}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} style={buttonStyles}>
        Delete Artwork
      </button>
    </div>
  );
};

const inputStyles = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginBottom: '10px',
};

const buttonStyles = {
  padding: '10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default DeleteArtwork;
