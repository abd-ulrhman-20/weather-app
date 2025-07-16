import { useState, useEffect } from 'react';

import './App.css';
import CityEditor from './CityEditor';
import SearchCard from './SearchCard';
import Loading from './Loading';
import Search from './Search';
import TopCities from './TopCities';
import SearchOutput from './SearchOutput';

function App() {
  const API_KEY = '144f3e43ccf46de4c2568bdaf09efe62';

  const defaultCities = ['New York', 'London', 'Tokyo', 'Paris'];
  const [topCities, setTopCities] = useState([...defaultCities]);
  const [topCitiesWeather, setTopCitiesWeather] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);

  const isMetric = unit === 'metric';
  const unitSymbol = isMetric ? '°C' : '°F';

  // Load top cities from cookies
  useEffect(() => {
    const saved = getCookie('topCities');
    if (saved) {
      try {
        const cities = JSON.parse(decodeURIComponent(saved));
        if (Array.isArray(cities) && cities.length === 4) {
          setTopCities(cities);
        }
      } catch { }
    }
  }, []);

  useEffect(() => {
    const fetchTopCitiesWeather = async () => {
      const citiesData = await Promise.all(
        topCities.map(async (city) => {
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
            );
            const data = await res.json();
            return {
              name: data.name,
              temp: `${Math.round(data.main.temp)}${unitSymbol}`,
              icon: data.weather[0].icon,
              description: data.weather[0].description,
            };
          } catch (error) {
            console.error(`Error fetching ${city}:`, error);
            return null;
          }
        })
      );
      setTopCitiesWeather(citiesData.filter(Boolean));
    };

    fetchTopCitiesWeather();
  }, [topCities, unit]);

  useEffect(() => {
    const savedCity = getCookie('lastCity');
    if (savedCity) fetchWeather(savedCity);
  }, [unit]);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const deleteCookies = () => {
    document.cookie = 'lastCity=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'topCities=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setHasSearched(false);
    setWeather(null);
    setForecast([]);
    setTopCities([...defaultCities]);
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`
      );

      const data = await res.json();
      const forecastData = await forecastRes.json();

      if (data.cod === 200 && forecastData.cod === '200') {
        setWeather({
          city: data.name,
          temp: `${Math.round(data.main.temp)}${unitSymbol}`,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          wind: data.wind.speed,
        });

        const days = [];
        const used = new Set();
        for (let item of forecastData.list) {
          const day = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
          if (!used.has(day) && days.length < 5) {
            used.add(day);
            days.push({
              day,
              temp: `${Math.round(item.main.temp)}${unitSymbol}`,
              icon: item.weather[0].icon,
            });
          }
        }

        setForecast(days);
        setHasSearched(true);
        setCookie('lastCity', city, 7);
      } else {
        alert('City not found!');
      }
    } catch (err) {
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      );

      const data = await res.json();
      const forecastData = await forecastRes.json();

      if (data.cod === 200 && forecastData.cod === '200') {
        setWeather({
          city: data.name,
          temp: `${Math.round(data.main.temp)}${unitSymbol}`,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          wind: data.wind.speed,
        });

        const days = [];
        const used = new Set();
        for (let item of forecastData.list) {
          const day = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
          if (!used.has(day) && days.length < 5) {
            used.add(day);
            days.push({
              day,
              temp: `${Math.round(item.main.temp)}${unitSymbol}`,
              icon: item.weather[0].icon,
            });
          }
        }

        setForecast(days);
        setHasSearched(true);
        setCookie('lastCity', data.name, 7);
      }
    } catch (error) {
      alert('Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 position-relative">
      <h2 className="text-center mb-4">🌤️ Weather App</h2>

      <div className='btn-conta'>
        <button className="btn-conta-btn-1" onClick={getCurrentLocationWeather}>
          📍 Use My Location
        </button>
        <button className="btn-conta-btn-2" onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}>
          Switch to {unit === 'metric' ? '°F' : '°C'}
        </button>
      </div>

      <TopCities topCitiesWeather={topCitiesWeather} />

      <Search
        fetchWeather={fetchWeather}
      />

      {loading && (
        <Loading />
      )}

      {!hasSearched && !loading && (
        <SearchCard />
      )}

      {hasSearched && weather && !loading && (
        <SearchOutput weather={weather} isMetric={isMetric} forecast={forecast} />
      )}

      <CityEditor onUpdate={(cities) => {
        setTopCities(cities);
        setCookie('topCities', JSON.stringify(cities), 30);
      }} />

      <button
        className="btn btn-danger position-fixed"
        style={{ bottom: '20px', right: '20px', zIndex: 9999 }}
        onClick={deleteCookies}
      >
        ❌ Reset Cookies
      </button>
    </div>
  );
}


export default App;
