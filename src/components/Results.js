import React from 'react';
import './Results.css';

function Results({ formData }) {
  const { location, roofSize, month } = formData;

  const getTiltAngle = (month) => {
    const monthTiltAngles = {
      January: 40,
      February: 35,
      March: 30,
      April: 30,
      May: 30,
      June: 30,
      July: 25,
      August: 25,
      September: 30,
      October: 35,
      November: 40,
      December: 40,
    };
    return monthTiltAngles[month] || 30; // Default angle if month is not found
  };

  const tiltAngle = getTiltAngle(month);

  // Example values based on inputs
  const estimatedEnergyProduction = "1200 kWh"; 
  const estimatedSavings = "$150"; 

  return (
    <div className="results">
      <h2>Optimization Results</h2>
      <img src={`${process.env.PUBLIC_URL}/pic.jpeg`} alt="Optimization Results" className="results-image" />
      <div className="results-content"> {/* Wrap content inside this div */}
        <p>Location: {location}</p>
        <p>Roof Size: {roofSize} sq. ft.</p>
        <p>Month: {month}</p>
        <p>Estimated Energy Production: {estimatedEnergyProduction}</p>
        <p>Estimated Savings: {estimatedSavings}</p>
        <p>Tilt Angle: {tiltAngle}°</p>
      </div>
    </div>
  );
}

export default Results;
