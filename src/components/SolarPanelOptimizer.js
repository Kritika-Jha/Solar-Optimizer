import React, { useState } from 'react';
import SolarForm from './SolarForm';
import Results from './Results';
import './SolarPanelOptimizer.css'; // Add CSS for styling if needed

function SolarPanelOptimizer() {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data); // Update the state with form data
  };

  return (
    <div className="solar-panel-optimizer">
      <SolarForm onSubmit={handleFormSubmit} />
      {formData && <Results formData={formData} />} {/* Render Results if formData exists */}
    </div>
  );
}

export default SolarPanelOptimizer;
