import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section" id="features">
      <h2>Key Features</h2>
      <div className="features-container">
        <div className="feature-card">
          <h3>Sunlight Exposure Analysis</h3>
          <p>
            Accurately analyze sunlight exposure throughout the year to find the
            best placement for your solar panels.
          </p>
        </div>
        <div className="feature-card">
          <h3>Shading Detection</h3>
          <p>
            Detect any shading from nearby objects like trees or buildings to
            maximize efficiency.
          </p>
        </div>
        <div className="feature-card">
          <h3>Local Climate Consideration</h3>
          <p>
            Take into account your local climate and weather patterns for
            accurate solar energy predictions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
