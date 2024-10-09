import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header Section with Back Button */}
      <header className='h-16 shadow-md bg-yellow-900 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="text-white text-lg hover:text-blue-300 transition-colors duration-300"
          >
            Back
          </button>

          {/* Page Title */}
          <h1 className='text-green text-2xl font-bold hover:text-pink-100 transition-colors duration-300 ml-4'>
            Contact Us
          </h1>
        </div>
      </header>

      {/* Content Section */}
      <div className="contact-us py-16 px-6 bg-white pt-28"> {/* Added 'pt-28' to compensate for fixed header */}
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-4">
            We would love to hear from you! Please reach out with any questions, comments, or custom tailoring inquiries.
          </p>
          <p className="text-lg mb-4">
            <strong>Email:</strong> contact@tailorstouch.com
          </p>
          <p className="text-lg mb-4">
            <strong>Phone:</strong>+91 813694 2160,+91 92072 34631
          </p>
          <p className="text-lg">
            <strong>Address:</strong> 123 Fashion Street, Boutique City, Country
          </p>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
