import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./SolarForm.css";

function SolarForm({ setFormData }) {
  const [location, setLocation] = useState("");
  const [roofSize, setRoofSize] = useState("");
  const [month, setMonth] = useState("");
  const [landmark, setLandmark] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [placeInfo, setPlaceInfo] = useState({});

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ location, roofSize, month, weatherData, landmark, placeInfo });
  };

  // Fetch weather data based on latitude and longitude
  const getWeather = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Load from .env
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(weatherUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getPlaceDetails = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Ensure lat and lng are valid
    if (!lat || !lng) {
        console.error('Invalid latitude or longitude:', lat, lng);
        return;
    }

    const placesUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await axios.get(placesUrl);
        console.log("Place Details API Response:", response.data);

        // Check if the response contains valid results
        if (response.data.results.length > 0) {
            const placeDetails = response.data.results[0];
            const { formatted_address, address_components } = placeDetails;
            
            // Set the location and other place details
            setLocation(formatted_address);  // Autofill location field
            setPlaceInfo({
                address: formatted_address,
                city: address_components?.find(comp => comp.types.includes("locality"))?.long_name || "N/A",
            });
        } else {
            console.error("No place details found.");
        }
    } catch (error) {
        console.error("Error fetching place details:", error);
    }
};

const handleMapClick = useCallback(
  (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Ensure lat and lng are valid numbers before passing to getPlaceDetails
    if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid latitude or longitude values:', lat, lng);
        return;
    }

    setLandmark({ lat, lng });
    getPlaceDetails(lat, lng); // Fetch place details using valid lat/lng
    getWeather(lat, lng);      // Fetch weather details
  },
  [] // No dependencies
);

  // Initialize Google Map
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.5937, lng: 78.9629 }, // Default to India
        zoom: 5,
      });

      map.addListener("click", (e) => handleMapClick(e));
    };

    return () => {
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [handleMapClick]);

  return (
    <div className="solar-form">
      <h2>Solar Panel Optimization Form</h2>
      {/* Map Integration */}
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
      <form onSubmit={handleSubmit}>
        <label>
          Location (Auto-Filled):
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
          <select value={month} onChange={(e) => setMonth(e.target.value)} required>
            <option value="">Select a month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            {/* Add more months */}
          </select>
        </label>
        <button type="submit">Optimize</button>
      </form>

      

      {/* Place Details */}
      {placeInfo.address && (
        <div>
          <h3>Place Information</h3>
          <p><strong>Address:</strong> {placeInfo.address}</p>
          <p><strong>City:</strong> {placeInfo.city}</p>
        </div>
      )}

      {/* Weather Data */}
      {weatherData && (
        <div>
          <h3>Weather Information</h3>
          <p><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
          <p><strong>Conditions:</strong> {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default SolarForm;
