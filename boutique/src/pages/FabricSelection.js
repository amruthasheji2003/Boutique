import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fabricOptions = [
  { id: 1, name: 'Cotton', image: require('../assets/cotton.jpg') },
  { id: 3, name: 'Linen', image: require('../assets/linen.jpg') },
  { id: 4, name: 'Silk', image: require('../assets/silk.webp') },
  { id: 5, name: 'Organza', image: require('../assets/organza.webp') },
  { id: 6, name: 'Velvet', image: require('../assets/velvet.jpg') },
  { id: 7, name: 'Satin', image: require('../assets/satin.webp') },
  { id: 8, name: 'Lace', image: require('../assets/lace.webp') },
  { id: 9, name: 'Georgette', image: require('../assets/georgette.jpg') },
  { id: 10, name: 'Crepe', image: require('../assets/crepe.jpg') },
  { id: 11, name: 'Taffeta', image: require('../assets/taffeta.webp') },
  { id: 12, name: 'Brocade', image: require('../assets/brocade.avif') },
  { id: 13, name: 'Polyester', image: require('../assets/polyster.jpg') },
  { id: 14, name: 'Rayon', image: require('../assets/rayon.webp') }
];

const FabricSelection = () => {
  const [selectedFabric, setSelectedFabric] = useState(null);
  const navigate = useNavigate();

  const handleSelectFabric = (fabric) => {
    setSelectedFabric(fabric);
  };

  const handleProceed = () => {
    navigate('/customer'); // Change to your actual path to Customer.js
  };

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '20px',
      marginTop: '20px',
      width: '100%',
      maxWidth: '1200px',
    },
    fabricCard: {
      cursor: 'pointer',
      border: '2px solid transparent',
      borderRadius: '10px',
      overflow: 'hidden',
      textAlign: 'center',
      transition: 'border-color 0.3s ease',
    },
    fabricCardSelected: {
      borderColor: '#28a745',
    },
    fabricImage: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
    },
    fabricName: {
      padding: '10px',
      fontSize: '18px',
      fontWeight: '500',
      backgroundColor: '#f0f0f0',
    },
    selectedMessage: {
      marginTop: '20px',
      fontSize: '20px',
      color: '#28a745',
      fontWeight: 'bold',
    },
    button: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Select Your Fabric</h2>
      <div style={styles.grid}>
        {fabricOptions.map((fabric) => (
          <div
            key={fabric.id}
            style={{
              ...styles.fabricCard,
              ...(selectedFabric && selectedFabric.id === fabric.id
                ? styles.fabricCardSelected
                : {}),
            }}
            onClick={() => handleSelectFabric(fabric)}
          >
            <img src={fabric.image} alt={fabric.name} style={styles.fabricImage} />
            <div style={styles.fabricName}>{fabric.name}</div>
          </div>
        ))}
      </div>

      {selectedFabric && (
        <>
          <div style={styles.selectedMessage}>
            {selectedFabric.name} is selected.
          </div>
          <button style={styles.button} onClick={handleProceed}>
            Proceed to Customer
          </button>
        </>
      )}
    </div>
  );
};

export default FabricSelection;
