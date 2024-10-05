import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SolarForm from './components/SolarForm';
import Features from './components/Features';
import About from './components/About';
import Results from './components/Results';
import './App.css';

function App() {
  const [formData, setFormData] = useState(null); // State to hold form data

  return (
    <div className="App">
      <Header />
      <main>
        <section id="about">
          <About />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="form">
          <SolarForm setFormData={setFormData} /> {/* Pass the setFormData function */}
        </section>
        <section id="results">
          {formData && <Results formData={formData} />} {/* Pass formData to Results */}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
