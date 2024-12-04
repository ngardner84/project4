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
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const WeekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;
    return date;
  };

  const getWeather = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ weather, loading: true });
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
        setWeather({ weather, data: res.data, loading: false, error: false });
      } catch (error) {
        console.log(error);
        setWeather({ weather, loading: false, data: null, error: true });
      }
      console.log(weather.data.weather.icon);
      console.log(weather);
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
          onKeyDown={getWeather}
        />
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
              alt={weather.data.weather.description}
            />
            {Math.round(weather.data.main.temp)}
            <sup className="deg">°F</sup>
          </div>
          <div className="des-wind">
            <p>{weather.data.weather.description}</p>
            <p>Wind Speed: {weather.data.wind.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
