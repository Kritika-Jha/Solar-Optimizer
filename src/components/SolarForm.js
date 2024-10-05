import React, { useState } from 'react';
import './SolarForm.css';

function SolarForm() {
  const [location, setLocation] = useState('');
  const [roofSize, setRoofSize] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here, such as sending data to the backend
    console.log({ location, roofSize, selectedMonth });
  };

  return (
    <div className="solar-form">
      <h2>Solar Panel Optimization Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </label>
        <label>
          Roof Size (in sq. ft.):
          <input 
            type="number" 
            value={roofSize} 
            onChange={(e) => setRoofSize(e.target.value)} 
            required 
          />
        </label>
        <label>
          Month:
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
            required
          >
            <option value="" disabled>Select a month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </label>
        <button type="submit">Optimize</button>
      </form>
    </div>
  );
}

export default SolarForm;
