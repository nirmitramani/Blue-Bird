import React from 'react';

const CustomAlert = ({ message, type, onClose }) => {
  // Use CSS to style the alert as a popup overlay
  const alertStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    zIndex: 1000, // Ensure the alert is above other elements
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={alertStyle}>
      <p>{message}</p>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
        Close
      </button>
    </div>
  );
};

export default CustomAlert;
