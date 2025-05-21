# Weather Dashboard Web Application

![image](https://github.com/user-attachments/assets/92691d63-e832-4c80-ba39-33adcc5baf5a)

A responsive, modern weather dashboard built with HTML5, CSS3, and JavaScript, leveraging the OpenWeatherMap API to provide real-time weather data and 5-day forecasts. The application features a dynamic user interface with temperature unit toggling, weather-specific backgrounds, and detailed weather metrics, optimized for both desktop and mobile devices.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Usage](#usage)

## Features
- **Real-Time Weather Data**: Fetches current weather conditions for user-specified locations or geolocation-based coordinates using the OpenWeatherMap API.
- **5-Day Forecast**: Displays a 5-day weather forecast with 3-hour intervals, including temperature, precipitation probability, and weather icons.
- **Temperature Unit Toggle**: Allows users to switch between Celsius and Fahrenheit with real-time UI updates.
- **Dynamic UI**: Features weather-specific background gradients (e.g., sunny, rainy, snowy) and smooth animations (fade-in, scale-in, slide-in).
- **Weather Metrics**: Visualizes humidity, wind speed, wind direction, atmospheric pressure, visibility, and sunrise/sunset times with progress bars and icons.
- **Responsive Design**: Adapts seamlessly to various screen sizes using CSS Grid, Flexbox, and media queries.
- **Error Handling**: Provides user-friendly error messages for invalid inputs or API failures.
- **Geolocation Support**: Automatically retrieves weather data based on the user's location, with a fallback to a default location (Province of Turin, Italy).

## Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **APIs**: OpenWeatherMap API, Fetch API, Geolocation API
- **Styling**: CSS Grid, Flexbox, Custom Animations, Glassmorphism Design
- **Tools**: Visual Studio Code, Browser Developer Tools
- **Dependencies**: Font Awesome (for icons), Montserrat Font (via Google Fonts)

## Usage
- **Search for a Location**: Enter a city name in the search bar and click the search button or press Enter. Example: London, New York, Tokyo.
- **Use Geolocation:**: On first load, the app attempts to use the browser's Geolocation API to fetch weather data for your current location.If geolocation is unavailable, it defaults to a predefined location (Province of Turin, Italy).
- **Toggle Units**: Click the °C or °F button to switch between Celsius and Fahrenheit units.
- **View Weather Details**: Visual Studio Code, Browser Developer Tools
- **Dependencies**: Font Awesome (for icons), Montserrat Font (via Google Fonts)
