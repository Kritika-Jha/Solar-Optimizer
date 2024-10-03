import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Solar Optimizer" />
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
