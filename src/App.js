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

  const api_key = '602dc24bede6785d8611f3d2390bead4';

  const processForecastData = (list) => {
    // Create a map keyed by date (YYYY-MM-DD)
    const forecastByDate = {};

    list.forEach(item => {
      const dateTime = item.dt_txt;
      const datePart = dateTime.split(' ')[0];
      if (!forecastByDate[datePart]) {
        forecastByDate[datePart] = [];
      }
      forecastByDate[datePart].push(item);
    });

    // Choose one entry per date (using the midday forecast)
    const dailyForecasts = Object.keys(forecastByDate).map(date => {
      const dayData = forecastByDate[date];
      // Find a forecast closest to 12:00:00, or pick the middle one
      const middayIndex = Math.floor(dayData.length / 2);
      return dayData[middayIndex];
    });

    // You likely only want 5 days
    return dailyForecasts.slice(0, 5);
  };

  // Fetch current weather to get coords, then fetch 5-day forecast
  const getWeather = async () => {
    if (input.trim() === '') return; // Prevent empty searches
    setWeather({ ...weather, loading: true, error: false });

    // Using the 5 day/3 hour forecast endpoint
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    try {
      const res = await axios.get(url, {
        params: {
          q: input,
          units: 'imperial',
          appid: api_key,
        },
      });

      const processed = processForecastData(res.data.list);

      setWeather({
        ...weather,
        data: res.data,
        dailyForecast: processed,
        loading: false,
        error: false
      });
    } catch (error) {
      console.log(error);
      setWeather({ ...weather, loading: false, data: null, dailyForecast: [], error: true });
    }
    setInput(''); // Clear the input field
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
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
        <button className="button" onClick={getWeather}>Search</button>
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
          {/* Current City and Country */}
          <div className="city-name">
            <h2>
              {weather.data.city.name}, {weather.data.city.country}
            </h2>
          </div>
  
          {/* 5-Day Forecast */}
          <h3>5-Day Forecast</h3>
          <div className="forecast-container">
            {weather.dailyForecast.map((day, index) => {
              const dayDate = new Date(day.dt_txt); 
              const options = { weekday: 'long', month: 'long', day: 'numeric' };
              /* Convert the date to a human-readable format */
              const dateString = dayDate.toLocaleDateString(undefined, options);
              return (
                <div key={index} className="forecast-day">
                  <div className="forecast-date">{dateString}</div>
                  <img
                    className="forecast-icon"
                    src={`https://openweathermap.org/img/wn/${day.weather[0]?.icon}@2x.png`}
                    alt={day.weather[0]?.description}
                  />
                  <div className="forecast-temps">
                    <span className="temp">{Math.round(day.main.temp)}°F</span>
                  </div>
                  <div className="forecast-description">{day.weather[0]?.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;