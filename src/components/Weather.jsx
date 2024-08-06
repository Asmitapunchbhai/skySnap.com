import React, { useState, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import debounce from 'lodash.debounce'; // Ensure lodash.debounce is installed

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(''); // Start with an empty city
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useRef(
    debounce(async (city) => {
      setLoading(true);
      setError(null);

      try {
        if (city.trim() === "") {
          setError("Please enter a city name.");
          return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        
        const weatherIcons = {
          clear: clear_icon,
          clouds: cloud_icon,
          drizzle: drizzle_icon,
          rain: rain_icon,
          snow: snow_icon,
        };

        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: city,
          icon: weatherIcons[data.weather[0].main.toLowerCase()] || clear_icon,
        });
      } catch (error) {
        setError("Invalid city name.");
      } finally {
        setLoading(false);
      }
    }, 500) // Debounce delay in milliseconds
  ).current;

  const handleSearch = () => {
    debouncedSearch(city);
  };

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <>
      <div className='title'>WeatherApp</div>
      <div className='weather'>
        <div className='search-bar'>
          <input
            ref={inputRef}
            type='text'
            placeholder='Search city'
            value={city}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <img
            src={search_icon}
            alt='Search icon'
            onClick={handleSearch}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          error ? (
            <p>{error}</p>
          ) : (
            weatherData ? (
              <>
                <img
                  src={weatherData.icon}
                  alt='Weather icon'
                  className='weather-icon'
                />
                <p className='temperature'>{weatherData.temperature}°C</p>
                <p className='location'>{weatherData.location}</p>
                <div className='weather-data'>
                  <div className='col'>
                    <img src={humidity_icon} alt='Humidity icon' />
                    <div>
                      <p>{weatherData.humidity} %</p>
                      <span>Humidity</span>
                    </div>
                  </div>
                  <div className='col'>
                    <img src={wind_icon} alt='Wind speed icon' />
                    <div>
                      <p>{weatherData.windSpeed} km/hr</p>
                      <span>Wind speed</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>No data available</p>
            )
          )
        )}
      </div>
    </>
  );
};

export default Weather;



