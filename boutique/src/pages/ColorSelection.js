import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const colorOptions = [
'#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57', '#33FFBD', '#33DBFF', '#3375FF', '#5733FF', '#BD33FF',
  '#FF33DB', '#FF3375', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FF0066', '#FF0099', '#FF33FF', '#CC33FF',
  '#9933FF', '#6633FF', '#3366FF', '#3399FF', '#33CCFF', '#33FFFF', '#33FFCC', '#33FF99', '#33FF66', '#66FF33',
  '#99FF33', '#CCFF33', '#FFFF33', '#FFCC33', '#FF9933', '#FF6633', '#FF3333', '#FF3366', '#FF3399', '#FF33CC',
  '#FF6699', '#FF66CC', '#FF99CC', '#FF99FF', '#CC99FF', '#9999FF', '#6699FF', '#3399FF', '#0099FF', '#00CCFF',
  '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#00FF00', '#33FF00', '#66FF00', '#99FF00', '#CCFF00',
  '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#FF0000', '#CC0000', '#990000', '#660000', '#330000',
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#0000FF', '#000080', '#008080', '#008000', 
  '#800000', '#800080', '#FFFFE0', '#F0E68C', '#FFA500', '#FFD700', '#B8860B', '#DAA520', '#D2691E', '#A0522D',
  '#CD853F', '#8B4513', '#C0C0C0', '#808080', '#2F4F4F', '#000080', '#483D8B', '#4682B4', '#5F9EA0', '#B0E0E6',
  '#ADD8E6', '#87CEEB', '#778899', '#B22222', '#DC143C', '#FF4500', '#FF6347', '#FF7F50','#C71585', '#FF1493', 
  '#EEE8AA', '#F0E68C', '#F5DEB3', '#D2B48C', '#DEB887', '#F5F5DC', '#FFF5EE', '#FAEBD7', '#FFEFD5', '#FFF5EE',
  '#F0FFF0', '#F5FFFA', '#FFEBCD', '#FFFAF0', '#E6E6FA', '#FFF0F5', '#FAFAD2', '#FFD700', '#BDB76B', '#C0C0C0',
  '#A9A9A9', '#808080', '#696969', '#778899', '#708090', '#2F4F4F', '#B0C4DE', '#4682B4', '#87CEFA', '#B0E0E6',
  '#00BFFF', '#1E90FF', '#6495ED', '#7B68EE', '#9370DB', '#8A2BE2', '#A020F0', '#BA55D3', '#DA70D6', '#FF00FF',
  '#DDA0DD', '#EE82EE', '#FFE4E1', '#FFE4B5', '#FFDEAD', '#F5FFFA', '#B0E0E6', '#C0C0C0', '#A52A2A', '#FF4500',
  '#B22222', '#DC143C', '#FF6347', '#FF7F50','#DB7093', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFF0F5', '#FFE4E1', 
  '#FFE4B5', '#FFDAB9'
];

const ColorSelection = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFabric = location.state?.selectedFabric ||'your dress' ;

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const handleProceedToPlaceOrder = () => {
    if (selectedColor) {
      navigate('/custom-order', {
        state: { selectedFabric, selectedColor },
      });
    } else {
      alert('Please select a color.');
    }
  };

  // Styles
  const styles = {
    container: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    colorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
      gap: '10px',
      marginTop: '20px',
      width: '100%',
      maxWidth: '800px',
    },
    colorBox: (color) => ({
      width: '40px',
      height: '40px',
      backgroundColor: color,
      borderRadius: '8px',
      border: selectedColor === color ? '3px solid #000' : '2px solid #fff',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
    }),
    proceedButton: {
      marginTop: '30px',
      padding: '10px 20px',
      backgroundColor: selectedColor ? '#28a745' : '#888',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: selectedColor ? 'pointer' : 'not-allowed',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Select a Color for {selectedFabric}</h2>
      <div style={styles.colorGrid}>
        {colorOptions.map((color) => (
          <div
            key={color}
            style={styles.colorBox(color)}
            onClick={() => handleSelectColor(color)}
          />
        ))}
      </div>

      {selectedColor && (
        <div style={{ marginTop: '20px' }}>
          <p>Selected Color: <strong>{selectedColor}</strong></p>
        </div>
      )}

      <button
        style={styles.proceedButton}
        onClick={handleProceedToPlaceOrder}
        disabled={!selectedColor}
      >
        Proceed to Place Order
      </button>
    </div>
  );
};

export default ColorSelection;
