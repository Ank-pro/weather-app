import { useState, useEffect } from "react";
import axios from "axios";
import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Switch } from "antd";
import { FavContainer } from "./components/fav-container/FavContainer";


function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [nextFiveDaysForcast, setNextFiveDaysForcast] = useState([]);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [IsFahrenheit,setIsFahrenheit] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const response = await axios.get("http://localhost:3001/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  function cityName(name) {
    setCity(name);
  }

  async function fetchData() {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=07c15051991d97ea48955e160d3d5d1c&units=metric`
      );

      // Get today's date
      const today = new Date().toISOString().split("T")[0];

      // Separate today's forecast and next 5 days
      const filteredForecasts = data.list.filter((forecast) => {
        const forecastDate = forecast.dt_txt.split(" ")[0];
        return forecastDate !== today;
      });

      // Filter to get one forecast per day for next 5 days
      const dailyForecasts = filteredForecasts
        .filter((forecast, index) => index % 8 === 0)
        .slice(0, 5);

      // Get today's forecast
      const todaysForecast = data.list.find(
        (forecast) => forecast.dt_txt.split(" ")[0] === today
      );

      // Set dynamic background based on weather condition
      const mainWeather = todaysForecast.weather[0].main;
      console.log(todaysForecast);
      setTodayWeather(todaysForecast);
      setNextFiveDaysForcast(dailyForecasts);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Could not fetch weather data. Please try again.");
      setTodayWeather(null);
      setNextFiveDaysForcast([]);
    }
  }

  useEffect(() => {
    if (city) {
      fetchData();
    }
  }, [city]);

  // Add city to favorites with weather details
  async function addToFavorites(cityName) {
    const existingFav = favorites.find((fav) => fav.name === cityName);

    if (!existingFav && todayWeather) {
      try {
        const newFavorite = {
          name: cityName,
          temp: Math.round(todayWeather.main.temp),
          icon: todayWeather.weather[0].icon,
        };

        const response = await axios.post(
          "http://localhost:3001/favorites",
          newFavorite
        );
        setFavorites([...favorites, response.data]);
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
  }

  // Remove city from favorites
  async function removeFavorite(cityId) {
    try {
      await axios.delete(`http://localhost:3001/favorites/${cityId}`);
      setFavorites(favorites.filter((fav) => fav.id !== cityId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  }

  // Select favorite city
  function selectFavoriteCity(cityName) {
    setCity(cityName);
  }

  // function to get day name
  const getDayName = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const convertTemperature = (temp) => {
    return !IsFahrenheit ? temp : (temp * 9) / 5 + 32;
  };

  return (
    <main>
      <div className="fav-container">
        <FavContainer
          favorites={favorites}
          removeFavorite={removeFavorite}
          selectFavoriteCity={selectFavoriteCity}
        />
      </div>
      <div className="weather-container">
        <Dashboard cityName={cityName} />

        {/* Error Handling */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Today's Weather */}
        {todayWeather && (
          <div className="today-weather">
            <div className="current-weather">
              <p id="city-weather">
                {city}, {getDayName(todayWeather.dt_txt)}
              </p>
              <span id="toggle-icon">
              <Switch defaultChecked checkedChildren="°C" unCheckedChildren="°F"
              style={{
                backgroundColor: IsFahrenheit ? '#FFB347' : '#FF6961'
              }}
               onClick={()=>setIsFahrenheit(!IsFahrenheit)}/>
              </span>
              <span
                className={`material-symbols-outlined ${
                  favorites.some((fav) => fav.name === city) ? `filled` : ""
                }`}
                onClick={() => addToFavorites(city)}
              >
                favorite
              </span>
            </div>
            <div className="today-details">
              <div className="main-weather-section">
                <img
                  src={`https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                  alt={todayWeather.weather[0].description}
                  className="weather-icon-large"
                />
                <div className="temp-details">
                  <h3>{convertTemperature(Math.round(todayWeather.main.temp))}{!IsFahrenheit ? '°C' : '°F'}</h3>
                  <p>{todayWeather.weather[0].description}</p>
                </div>
              </div>

              <div className="additional-weather-details">
                <div className="weather-detail">
                  <i className="fas fa-tint"></i>
                  <div>
                    <h4>Humidity</h4>
                    <p>{todayWeather.main.humidity}%</p>
                  </div>
                </div>
                <div className="weather-detail">
                  <i className="fas fa-wind"></i>
                  <div>
                    <h4>Wind Speed</h4>
                    <p>{todayWeather.wind.speed} m/s</p>
                  </div>
                </div>
                <div className="weather-detail">
                  <i className="fas fa-compress"></i>
                  <div>
                    <h4>Pressure</h4>
                    <p>{todayWeather.main.pressure} hPa</p>
                  </div>
                </div>
                <div className="weather-detail">
                  <i className="fas fa-thermometer-half"></i>
                  <div>
                    <h4>Feels Like</h4>
                    <p>{convertTemperature(Math.round(todayWeather.main.temp))}{!IsFahrenheit ? '°C' : '°F'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next 5 Days Forecast */}
        {nextFiveDaysForcast.length > 0 && (
          <div className="forecast-container">
            {nextFiveDaysForcast.map((day, index) => (
              <div key={index} className="forecast-day">
                <h3>{getDayName(day.dt_txt)}</h3>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <div className="forecast-temp">
                  <p>{convertTemperature(Math.round(day.main.temp))}{!IsFahrenheit ? '°C' : '°F'}</p>
                  <p>{day.weather[0].description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
