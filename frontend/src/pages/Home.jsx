import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ArtworkCard from '../components/ArtworkCard';

const Home = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    axios.get('/artworks').then(res => setArtworks(res.data));
  }, []);

  const homeStyles = {
    textAlign: 'center',
    fontSize: '2rem',
    margin: '20px 0',
    color: '#333',
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div>
      <h2 style={homeStyles}>Explore Artworks</h2>
      <div style={gridStyles}>
        {artworks.map(art => <ArtworkCard key={art._id} artwork={art} />)}
      </div>
    </div>
  );
};

export default Home;
