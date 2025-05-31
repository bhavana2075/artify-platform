import React from 'react';

const Footer = () => {
  const footerStyles = {
    position: 'relative',
    bottom: '0',
    width: '100%',
    backgroundcolor:'black',
    color: 'black',
    textAlign: 'center',  
    padding: '0px 0',
    fontSize: '1rem',
  };

  return (
    <footer style={footerStyles}>
      <p>© 2025 Artify. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
