import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  });

  const toDateFunction = () => {
    // ... (Your existing date function)
  };

  // Refactored getWeather function
  const getWeather = async () => {
    if (input.trim() === '') return; // Prevent empty searches
    setWeather({ ...weather, loading: true, error: false });
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const api_key = '602dc24bede6785d8611f3d2390bead4';
    try {
      const res = await axios.get(url, {
        params: {
          q: input,
          units: 'imperial',
          appid: api_key,
        },
      });
      setWeather({ ...weather, data: res.data, loading: false, error: false });
    } catch (error) {
      console.log(error);
      setWeather({ ...weather, loading: false, data: null, error: true });
    }
    setInput(''); // Clear the input field
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if inside a form
      getWeather();
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Weather App</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Search City"
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {/* Added Search Button */}
        <button class="button" onClick={getWeather}>Search</button>
      </div>
      {weather.loading && (
        <>
          <br />
          <br />
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: '20px' }}> City not found</span>
          </span>
        </>
      )}
      {weather.data && (
        <div>
          <div className="city-name">
            <h2>
              {weather.data.name}, {weather.data.sys.country}
            </h2>
          </div>
          <div className="date">
            <span>{toDateFunction()}</span>
          </div>
          <div className="icon-temp">
            <img
              className=""
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0]?.icon}@2x.png`}
              alt={weather.data.weather[0]?.description}
            />
            {Math.round(weather.data.main.temp)}
            <sup className="deg">°F</sup>
          </div>
          <div className="des-wind">
            <p>{weather.data.weather[0]?.description}</p>
            <p>Wind Speed: {weather.data.wind.speed} mph</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
