import { useEffect, useState } from 'react';
import axios from '../api/axios';

const LikeButton = ({ artworkId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        // Get like status
        const isLikedRes = await axios.get(`/artworks/${artworkId}/isLiked`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Get total likes
        const likesRes = await axios.get(`/artworks/${artworkId}/likes`);

        setLiked(isLikedRes.data.liked);
        setLikesCount(likesRes.data.likes);
      } catch (err) {
        console.error('Error fetching like data:', JSON.stringify(err.response?.data || err.message));
      }
    };

    if (token) fetchLikeData();
  }, [artworkId, token]);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `/artworks/${artworkId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked(res.data.liked);
      setLikesCount(res.data.likes);
    } catch (err) {
      console.error('Like request failed:', JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <button onClick={handleLike}>
      {liked ? '❤️ Liked' : '🤍 Like'} ({likesCount})
    </button>
  );
};

export default LikeButton;
