import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSolarPanel } from '@fortawesome/free-solid-svg-icons'; // Import the solar panel icon
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <FontAwesomeIcon icon={faSolarPanel} size="2x" /> {/* Add the FontAwesome icon */}
        <span className="logo-text">Solarizer</span> {/* Add the name next to the icon */}
      </div>
      <nav>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#form">Optimize</a></li>
          <li><a href="#results">Results</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
