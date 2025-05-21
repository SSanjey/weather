// OpenWeatherMap API key
const API_KEY = "a345e9d8a3673df8b5459451ecfc0e22";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// DOM Elements
const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const dateTime = document.getElementById("date-time");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const humidityProgress = document.getElementById("humidity-progress");
const windSpeed = document.getElementById("wind-speed");
const windDirection = document.getElementById("wind-direction");
const windDirectionIcon = document.getElementById("wind-direction-icon");
const pressure = document.getElementById("pressure");
const pressureStatus = document.getElementById("pressure-status");
const visibility = document.getElementById("visibility");
const visibilityStatus = document.getElementById("visibility-status");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const sunPosition = document.getElementById("sun-position");
const tempMin = document.getElementById("temp-min");
const tempMax = document.getElementById("temp-max");
const tempRangeFill = document.getElementById("temp-range-fill");
const forecastGrid = document.getElementById("forecast-grid");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");
const errorClose = document.getElementById("error-close");
const celsiusBtn = document.getElementById("celsius");
const fahrenheitBtn = document.getElementById("fahrenheit");
const currentYear = document.getElementById("current-year");

// Weather data objects
let weatherData = {};
let forecastData = [];
let units = "metric";

// Fallback weather icon
const FALLBACK_ICON = "https://openweathermap.org/img/wn/10d@2x.png";

// Initialize the app
initializeApp();

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
locationInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

errorClose.addEventListener("click", hideError);

celsiusBtn.addEventListener("click", () => {
    if (units !== "metric") {
        console.log("Switching to Celsius");
        units = "metric";
        updateUnitsDisplay();
        if (weatherData.name) {
            getWeatherByCity(weatherData.name);
        } else {
            getWeatherByCoordinates(45.133, 7.367); // Fallback to Province of Turin
        }
    }
});

fahrenheitBtn.addEventListener("click", () => {
    if (units !== "imperial") {
        console.log("Switching to Fahrenheit");
        units = "imperial";
        updateUnitsDisplay();
        if (weatherData.name) {
            getWeatherByCity(weatherData.name);
        } else {
            getWeatherByCoordinates(45.133, 7.367); // Fallback to Province of Turin
        }
    }
});

// Initialize app
function initializeApp() {
    // Set current date
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dateTime.textContent = currentDate.toLocaleDateString('en-US', options);
    
    // Set current year in footer
    currentYear.textContent = currentDate.getFullYear();
    
    // Try to get location from browser
    console.log("Initializing app");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Geolocation success:", position.coords);
                getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                // Fallback to default location (Province of Turin)
                getWeatherByCoordinates(45.133, 7.367);
            }
        );
    } else {
        // Fallback to default location
        console.log("Geolocation not supported, using default location");
        getWeatherByCoordinates(45.133, 7.367);
    }
}

// Update units display
function updateUnitsDisplay() {
    celsiusBtn.classList.toggle("active", units === "metric");
    fahrenheitBtn.classList.toggle("active", units === "imperial");
    // Optimistically update unit symbols
    const tempUnit = units === "metric" ? "°C" : "°F";
    if (weatherData.main) {
        temperature.textContent = `${Math.round(weatherData.main.temp)}${tempUnit}`;
        feelsLike.textContent = `Feels like: ${Math.round(weatherData.main.feels_like)}${tempUnit}`;
        tempMin.textContent = `${Math.round(weatherData.main.temp_min)}${tempUnit}`;
        tempMax.textContent = `${Math.round(weatherData.main.temp_max)}${tempUnit}`;
    }
    // Update forecast if available
    if (forecastData.length > 0) {
        displayForecast(forecastData);
    }
}

// Handle search button click
function handleSearch() {
    const location = locationInput.value.trim();
    console.log("Search triggered for:", location);
    
    if (!location) {
        showError("Please enter a city name");
        return;
    }
    
    getWeatherByCity(location);
    locationInput.value = ""; // Clear input
}

// Get weather data by city name
async function getWeatherByCity(city) {
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;
        console.log("Fetching weather for city:", city, "URL:", url);
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            console.log("Weather data received:", data);
            hideError();
            weatherData = data;
            displayWeatherData(data);
            // Fetch 5-day forecast
            await getForecast(city);
        } else {
            console.error("API error:", data.message);
            showError(data.message || "City not found. Please try again.");
            clearWeatherDisplay();
            clearForecast();
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Failed to fetch weather data. Please check your connection and try again.");
        clearWeatherDisplay();
        clearForecast();
    }
}

// Get weather data by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
        console.log("Fetching weather for coordinates:", lat, lon, "URL:", url);
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            console.log("Weather data received:", data);
            hideError();
            weatherData = data;
            displayWeatherData(data);
            // Fetch 5-day forecast
            await getForecast(null, lat, lon);
        } else {
            console.error("API error:", data.message);
            showError(data.message || "Location not found. Please try again.");
            clearWeatherDisplay();
            clearForecast();
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Failed to fetch weather data. Please check your connection and try again.");
        clearWeatherDisplay();
        clearForecast();
    }
}

// Get 5-day/3-hour forecast data
async function getForecast(city, lat, lon) {
    try {
        let url;
        if (city) {
            url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;
        } else {
            url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
        }
        console.log("Fetching 5-day forecast:", url);
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === "200") {
            console.log("Forecast data received:", data);
            forecastData = data.list; // Up to 40 data points (5 days, 3-hour intervals)
            displayForecast(forecastData);
        } else {
            console.error("Forecast API error:", data.message);
            showError(data.message || "Unable to fetch forecast data.");
            clearForecast();
        }
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        showError("Failed to fetch forecast data. Please check your connection and try again.");
        clearForecast();
    }
}

// Display 5-day forecast
function displayForecast(data) {
    forecastGrid.innerHTML = "";
    const tempUnit = units === "metric" ? "°C" : "°F";
    
    data.forEach((forecast) => {
        const dateTime = new Date(forecast.dt * 1000);
        const dateStr = dateTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
        const timeStr = formatTime(dateTime);
        const temp = Math.round(forecast.main.temp);
        const iconCode = forecast.weather[0]?.icon || "10d";
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const pop = Math.round((forecast.pop || 0) * 100);
        
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p>${dateStr}</p>
            <p>${timeStr}</p>
            <img src="${iconUrl}" alt="${forecast.weather[0]?.description || 'Weather icon'}">
            <p>${temp}${tempUnit}</p>
            <p class="pop"><i class="fas fa-tint"></i> ${pop}%</p>
        `;
        forecastGrid.appendChild(card);
    });
}

// Clear forecast display
function clearForecast() {
    forecastGrid.innerHTML = "";
    forecastData = [];
}

// Display weather data
function displayWeatherData(data) {
    // City name and country
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Weather icon and description
    const iconCode = data.weather[0]?.icon || "10d";
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    console.log("Setting weather icon:", iconUrl);
    weatherIcon.src = iconUrl;
    weatherIcon.alt = data.weather[0]?.description || "Weather icon";
    weatherDescription.textContent = data.weather[0]?.description || "Unknown";
    
    // Temperature data
    const tempUnit = units === "metric" ? "°C" : "°F";
    temperature.textContent = `${Math.round(data.main.temp)}${tempUnit}`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}${tempUnit}`;
    tempMin.textContent = `${Math.round(data.main.temp_min)}${tempUnit}`;
    tempMax.textContent = `${Math.round(data.main.temp_max)}${tempUnit}`;
    
    // Calculate temperature range percentage
    const minTemp = data.main.temp_min;
    const maxTemp = data.main.temp_max;
    const currentTemp = data.main.temp;
    const tempRange = maxTemp - minTemp;
    const rangePercent = tempRange > 0 ? ((currentTemp - minTemp) / tempRange) * 100 : 50;
    tempRangeFill.style.width = `${rangePercent}%`;
    
    // Weather details
    humidity.textContent = `${data.main.humidity}%`;
    humidityProgress.style.width = `${data.main.humidity}%`;
    
    const windUnit = units === "metric" ? "m/s" : "mph";
    const windSpeedValue = units === "metric" ? data.wind.speed : (data.wind.speed * 2.23694).toFixed(1);
    windSpeed.textContent = `${windSpeedValue} ${windUnit}`;
    
    const windDeg = data.wind.deg || 0;
    windDirectionIcon.style.transform = `rotate(${windDeg}deg)`;
    windDirection.textContent = getWindDirection(windDeg);
    
    pressure.textContent = `${data.main.pressure} hPa`;
    setPressureStatus(data.main.pressure);
    
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    visibility.textContent = units === "metric" ? `${visibilityKm} km` : `${(visibilityKm * 0.621371).toFixed(1)} mi`;
    setVisibilityStatus(data.visibility);
    
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    sunrise.textContent = formatTime(sunriseTime);
    sunset.textContent = formatTime(sunsetTime);
    
    updateSunPosition(data.dt, data.sys.sunrise, data.sys.sunset);
    updateBackgroundByWeather(data.weather[0]?.id || 800);
}

// Clear weather display on error
function clearWeatherDisplay() {
    cityName.textContent = "Enter a city";
    weatherIcon.src = FALLBACK_ICON;
    weatherDescription.textContent = "Enter a location to get started";
    temperature.textContent = "--°C";
    feelsLike.textContent = "Feels like: --°C";
    humidity.textContent = "--%";
    humidityProgress.style.width = "0%";
    windSpeed.textContent = "-- m/s";
    windDirection.textContent = "--";
    windDirectionIcon.style.transform = "rotate(0deg)";
    pressure.textContent = "-- hPa";
    pressureStatus.textContent = "Normal";
    visibility.textContent = "-- km";
    visibilityStatus.textContent = "--";
    sunrise.textContent = "--:--";
    sunset.textContent = "--:--";
    tempMin.textContent = "--°C";
    tempMax.textContent = "--°C";
    tempRangeFill.style.width = "50%";
    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'stormy', 'misty', 'snowy');
}

// Format time to HH:MM format
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Get wind direction from degrees
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Set pressure status
function setPressureStatus(pressureValue) {
    if (pressureValue < 1000) {
        pressureStatus.textContent = "Low";
        pressureStatus.style.color = "#f44336";
    } else if (pressureValue > 1030) {
        pressureStatus.textContent = "High";
        pressureStatus.style.color = "#2196f3";
    } else {
        pressureStatus.textContent = "Normal";
        pressureStatus.style.color = "#4caf50";
    }
}

// Set visibility status
function setVisibilityStatus(visibilityValue) {
    const visibilityKm = visibilityValue / 1000;
    if (visibilityKm < 1) {
        visibilityStatus.textContent = "Poor";
        visibilityStatus.style.color = "#f44336";
    } else if (visibilityKm < 5) {
        visibilityStatus.textContent = "Moderate";
        visibilityStatus.style.color = "#ff9800";
    } else {
        visibilityStatus.textContent = "Good";
        visibilityStatus.style.color = "#4caf50";
    }
}

// Update sun position
function updateSunPosition(currentTime, sunriseTime, sunsetTime) {
    const now = currentTime * 1000;
    const sunrise = sunriseTime * 1000;
    const sunset = sunsetTime * 1000;
    
    let positionPercent;
    if (now < sunrise) {
        positionPercent = 0;
    } else if (now > sunset) {
        positionPercent = 100;
    } else {
        const dayLength = sunset - sunrise;
        const timeElapsed = now - sunrise;
        positionPercent = (timeElapsed / dayLength) * 100;
    }
    
    sunPosition.style.left = `${positionPercent}%`;
}

// Update background by weather
function updateBackgroundByWeather(weatherId) {
    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'stormy', 'misty', 'snowy');
    if (weatherId >= 200 && weatherId < 300) {
        document.body.classList.add('stormy');
    } else if (weatherId >= 300 && weatherId < 600) {
        document.body.classList.add('rainy');
    } else if (weatherId >= 600 && weatherId < 700) {
        document.body.classList.add('snowy');
    } else if (weatherId >= 700 && weatherId < 800) {
        document.body.classList.add('misty');
    } else if (weatherId === 800) {
        document.body.classList.add('sunny');
    } else if (weatherId > 800) {
        document.body.classList.add('cloudy');
    }
}

// Show error message
function showError(message) {
    errorContainer.style.display = 'flex';
    errorMessage.textContent = message;
}

// Hide error message
function hideError() {
    errorContainer.style.display = 'none';
    errorMessage.textContent = '';
}