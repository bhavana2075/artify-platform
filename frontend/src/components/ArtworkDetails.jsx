// src/components/ArtworkDetails.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await axios.get(`https://artify-platform-backend.onrender.com/api/artworks/${id}`);
        setArtwork(response.data);
      } catch (err) {
        console.error('Error fetching artwork', err);
      }
      setLoading(false);
    };

    fetchArtwork();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="artwork-details">
      <img src={artwork.imageUrl} alt={artwork.title} />
      <h2>{artwork.title}</h2>
      <p>{artwork.description}</p>
      <p>Tags: {artwork.tags.join(', ')}</p>
      <p>Likes: {artwork.likes}</p>
    </div>
  );
};

export default ArtworkDetails;
