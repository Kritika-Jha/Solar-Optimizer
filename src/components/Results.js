import React from 'react';
import './Results.css';
import optimizationImage from '../pic.jpeg'; // Update with the correct path to your image

function Results() {
  return (
    <div className="results">
      <h2>Optimization Results</h2>
      <img src={optimizationImage} alt="Optimization Results" className="results-image" />
      <p>Results will be displayed here after optimization.</p>
    </div>
  );
}

export default Results;
