import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SolarForm from './components/SolarForm';
import Features from './components/Features';
import About from './components/About';
import Results from './components/Results';
import './App.css';

function App() {
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
          <SolarForm />
        </section>
        <section id="results">
          <Results />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
