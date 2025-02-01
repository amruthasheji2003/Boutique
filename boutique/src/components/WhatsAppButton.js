import React from 'react';
import './styles.css'; // Import the CSS styles

const WhatsAppButton = () => {
    return (
        <a href="https://wa.me/918136942160" target="_blank" className="whatsapp-icon">
           <i className="fab fa-whatsapp whatsapp-button"></i> {/* Ensure this class is correct */}
        </a>
    );
};

export default WhatsAppButton;