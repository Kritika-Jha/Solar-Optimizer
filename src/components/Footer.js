import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log({ email, message });
  
    setEmail('');
    setMessage('');
  };

  return (
    <footer>
      <p>&copy; 2024 Solarizer. All rights reserved.</p>
      <p>Made with love by HackSurge</p>
      <form onSubmit={handleSubmit} className="footer-contact-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
          required
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </footer>
  );
}

export default Footer;
