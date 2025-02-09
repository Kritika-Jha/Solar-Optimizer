import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log({ name, email, message });
  };

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Message:
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Contact;
