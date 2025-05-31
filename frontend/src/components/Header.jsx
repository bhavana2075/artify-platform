import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check localStorage for user login on component mount and on changes
  useEffect(() => {
    const checkUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser || null);
    };

    checkUser();

    // Optional: listen to changes across tabs
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    window.location.reload(); // Refresh to update Header
  };

  const headerStyles = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    textAlign: 'center',
  };

  const navStyles = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'center',
  };

  const linkStyles = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    padding: '8px 16px',
    borderRadius: '4px',
  };

  const buttonStyles = {
    backgroundColor: '#ff5733',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '1.1rem',
  };

  return (
    <header style={headerStyles}>
      <nav style={navStyles}>
        <Link to="/" style={linkStyles}>
          Home
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" style={linkStyles}>
              Dashboard
            </Link>
            <button onClick={handleLogout} style={buttonStyles}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyles}>
              Login
            </Link>
            <Link to="/register" style={linkStyles}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
