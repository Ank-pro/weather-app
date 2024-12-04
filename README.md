**Weather App**
Overview
A responsive weather application built with React, Vite, and PNPM that provides current weather and 5-day forecast information.
Features

-Search weather by city
-Toggle between Celsius and Fahrenheit
-Add cities to favorites
-View detailed weather information

**Tech Stack**
-React
-Vite
-PNPM
-Axios
-Ant Design
-JSON Server
-OpenWeatherMap API

**Prerequisites**

-Node.js (v18+)
-PNPM
-OpenWeatherMap API Key

Installation

**Clone the repository**
git clone https://github.com/Ank-pro/weather-app.git
cd weather-app

**Install node modules**
pnpm install

**Json-server**
pnpm json-server cities.json --port 3001

**Development Server**
pnpm run dev

**Configuration**
Weather API Key: 07c15051991d97ea48955e160d3d5d1c
JSON Server Port: 3001

**API Reference**
Weather Data: OpenWeatherMap API
Base URL: https://api.openweathermap.org/data/2.5/forecast
Favorites: Local JSON Server at http://localhost:3001/favorites
