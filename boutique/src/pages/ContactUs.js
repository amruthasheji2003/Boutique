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
            <strong>Phone:</strong>+91 813694 2160, +91 92072 34631
          </p>
          <p className="text-lg mb-8">
            <strong>Address:</strong> 123 Fashion Street, Boutique City, Country
          </p>
        </div>

       {/* Google Map Embed */}
<div className="max-w-4xl mx-auto mt-8">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2154.6701490474775!2d76.55534504152551!3d9.67014638124271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07d37b608e9e13%3A0xe19691b596c0387a!2sMH93%2BRWW%2C%20Ettumanoor%2C%20Kerala%20686631!5e1!3m2!1sen!2sin!4v1729699760203!5m2!1sen!2sin"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Google Map"
    aria-label="Google Map showing our location"
  ></iframe>
</div>
      </div>
    </>
  );
}

export default ContactUs;