import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkUploadForm from '../components/ArtworkUploadForm';
import UpdateArtworkForm from '../components/UpdateArtworkForm';
import DeleteArtwork from '../components/DeleteArtwork';
import backgroundImage from '../assets/dashboard-bg.jpg';

const Dashboard = () => {
  const [action, setAction] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleActionChange = (actionType) => {
    setAction(actionType);
  };

  return (
    <div style={dashboardContainerStyles}>
      <div style={dashboardContentStyles}>
        <h2>Dashboard</h2>
        {user && (
          <p style={{ marginBottom: '20px' }}>
            Welcome, <strong>{user.username}</strong>!
          </p>
        )}

        <div style={actionButtonsStyles}>
          <button style={buttonStyle} onClick={() => handleActionChange('upload')}>
            Upload
          </button>
          <button style={buttonStyle} onClick={() => handleActionChange('update')}>
            Update
          </button>
          <button style={buttonStyle} onClick={() => handleActionChange('delete')}>
            Delete
          </button>
        </div>

        {action === 'upload' && <ArtworkUploadForm />}
        {action === 'update' && <UpdateArtworkForm />}
         {action === 'delete' && <DeleteArtwork />} {/* updated here */}
        
      </div>
    </div>
  );
};

const dashboardContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '85vh',
   backgroundImage: `url(${backgroundImage})`,  
  backgroundColor: '#f9f9f9',
  padding: '20px',
};

const dashboardContentStyles = {
  textAlign: 'center',
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 7px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '550px',
};

const actionButtonsStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default Dashboard;
