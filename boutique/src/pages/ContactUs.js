import React from 'react';

const ContactUs = () => {
  return (
    <div className="contact-us py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg mb-4">
          We would love to hear from you! Please reach out with any questions, comments, or custom tailoring inquiries.
        </p>
        <p className="text-lg mb-4">
          <strong>Email:</strong> contact@tailorstouch.com
        </p>
        <p className="text-lg mb-4">
          <strong>Phone:</strong> +123 456 7890
        </p>
        <p className="text-lg">
          <strong>Address:</strong> 123 Fashion Street, Boutique City, Country
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
