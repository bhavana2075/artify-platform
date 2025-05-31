import { useEffect, useState } from 'react';
import axios from '../api/axios';

const LikeButton = ({ artworkId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  // Fetch initial like state
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`/artworks/${artworkId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;

        const likedByUser = res.data.likedUsers?.some(id => id === userId);
        setLiked(likedByUser);
        setLikesCount(res.data.likes);
      } catch (err) {
        console.error('Failed to fetch artwork details:', JSON.stringify(err.response?.data || err.message));
      }
    };

    if (token) fetchLikeStatus();
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
