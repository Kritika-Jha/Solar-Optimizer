import React, { useState } from 'react';
import './SolarForm.css';

function SolarForm() {
  const [location, setLocation] = useState('');
  const [roofSize, setRoofSize] = useState('');
  const [shading, setShading] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here, such as sending data to the backend
    console.log({ location, roofSize, shading });
  };

  return (
    <div className="solar-form">
      <h2>Solar Panel Optimization Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </label>
        <label>
          Roof Size (in sq. ft.):
          <input type="number" value={roofSize} onChange={(e) => setRoofSize(e.target.value)} required />
        </label>
        <label>
          Shading (in %):
          <input type="number" value={shading} onChange={(e) => setShading(e.target.value)} required />
        </label>
        <button type="submit">Optimize</button>
      </form>
    </div>
  );
}

export default SolarForm;
