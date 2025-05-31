import React, { useState } from 'react';
import LikeButton from './LikeButton';

const FullImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        cursor: 'pointer',
      }}
    >
      <img
        src={imageUrl}
        alt="Full Artwork"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking image
        style={{
          maxHeight: '90%',
          maxWidth: '90%',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
          cursor: 'default',
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          fontSize: '2rem',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
        }}
        aria-label="Close full image"
      >
        &times;
      </button>
    </div>
  );
};

const ArtworkCard = ({ artwork }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardStyles = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  };

  const imageStyles = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const detailsStyles = {
    padding: '15px',
    cursor: 'default',  // avoid pointer on details to only have image clickable
  };

  const titleStyles = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  };

  const uploaderStyles = {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '10px',
  };

  const descriptionStyles = {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '10px',
  };

  const tagsStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginBottom: '10px',
  };

  const tagStyles = {
    fontSize: '0.9rem',
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '20px',
    color: '#555',
  };

  // Open modal on image click
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div style={cardStyles}>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          style={imageStyles}
          onClick={openModal}
        />
        <div style={detailsStyles}>
          <h3 style={titleStyles}>{artwork.title}</h3>
          {artwork.username && (
            <p style={uploaderStyles}>
              Uploaded by: <strong>{artwork.username}</strong>
            </p>
          )}
          <p style={descriptionStyles}>{artwork.description}</p>
          <div style={tagsStyles}>
            {artwork.tags.map((tag, index) => (
              <span key={index} style={tagStyles}>
                {tag}
              </span>
            ))}
          </div>
          <LikeButton artworkId={artwork._id} />
        </div>
      </div>

      {isModalOpen && (
        <FullImageModal imageUrl={artwork.imageUrl} onClose={closeModal} />
      )}
    </>
  );
};

export default ArtworkCard;
