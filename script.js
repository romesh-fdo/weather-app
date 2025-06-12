// Get API key from environment variables via config
const API_KEY = config.API_KEY;
const DEFAULT_CITY = 'Colombo';

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const conditionElement = document.getElementById('condition');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const uvIndexElement = document.getElementById('uv-index');
const weatherIconElement = document.getElementById('weather-icon');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData(DEFAULT_CITY);
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Function to fetch weather data
async function getWeatherData(city) {
    showLoading();
    
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        showError();
        console.error('Error fetching weather data:', error);
    }
}

// Function to display weather data
function displayWeatherData(data) {
    const { location, current } = data;
    
    locationElement.textContent = `${location.name}, ${location.country}`;
    temperatureElement.textContent = `${current.temp_c}°C`;
    conditionElement.textContent = current.condition.text;
    humidityElement.textContent = `${current.humidity}%`;
    windSpeedElement.textContent = `${current.wind_kph} km/h`;
    uvIndexElement.textContent = current.uv;
    weatherIconElement.src = `https:${current.condition.icon}`;
    
    hideLoading();
    weatherInfo.style.display = 'block';
    errorElement.style.display = 'none';
}

// Helper functions for UI states
function showLoading() {
    loadingElement.style.display = 'flex';
    weatherInfo.style.display = 'none';
    errorElement.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError() {
    loadingElement.style.display = 'none';
    weatherInfo.style.display = 'none';
    errorElement.style.display = 'block';
}