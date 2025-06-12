// Get API key from config
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
const autocompleteList = document.getElementById('autocomplete-list');
const weatherMainElement = document.querySelector('.weather-main');
const feelsLikeElement = document.getElementById('feels-like');
const localTimeElement = document.getElementById('local-time');
const lastUpdatedElement = document.getElementById('last-updated');
const forecastContainer = document.getElementById('forecast-container');
const airQualityElement = document.getElementById('air-quality');
const precipitationElement = document.getElementById('precipitation');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');
const pressureElement = document.getElementById('pressure');
const visibilityElement = document.getElementById('visibility');
const windDirElement = document.getElementById('wind-dir');
const cloudElement = document.getElementById('cloud');
const heatIndexElement = document.getElementById('heat-index');
const windChillElement = document.getElementById('wind-chill');
const dewPointElement = document.getElementById('dew-point');
const gustElement = document.getElementById('gust');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData(DEFAULT_CITY);
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        autocompleteList.classList.add('hidden');
    }
});

// Add focus and blur events for search input
cityInput.addEventListener('focus', () => {
    document.querySelector('.search-container').classList.add('active');
});

cityInput.addEventListener('blur', () => {
    document.querySelector('.search-container').classList.remove('active');
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
            autocompleteList.classList.add('hidden');
        }
    }
});

// Autocomplete functionality
let typingTimer;
const doneTypingInterval = 200; // Wait time after typing stops (ms)

cityInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    const query = cityInput.value.trim();
    
    if (query.length < 2) { // Minimum 2 characters
        autocompleteList.classList.add('hidden');
        return;
    }
    
    typingTimer = setTimeout(() => {
        searchCities(query);
    }, doneTypingInterval);
});

// Hide autocomplete when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== cityInput && e.target !== autocompleteList) {
        autocompleteList.classList.add('hidden');
    }
});

// Function to search for cities
async function searchCities(query) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`);
        
        if (!response.ok) {
            throw new Error('City search failed');
        }
        
        const cities = await response.json();
        displayCitySuggestions(cities);
    } catch (error) {
        console.error('Error searching cities:', error);
    }
}

// Function to display city suggestions
function displayCitySuggestions(cities) {
    autocompleteList.innerHTML = '';
    
    if (cities.length === 0) {
        autocompleteList.classList.add('hidden');
        return;
    }
    
    cities.forEach(city => {
        const item = document.createElement('div');
        item.classList.add('autocomplete-item');
        item.textContent = `${city.name}, ${city.country}`;
        
        item.addEventListener('click', () => {
            cityInput.value = `${city.name}, ${city.country}`;
            autocompleteList.classList.add('hidden');
            getWeatherData(city.name);
        });
        
        autocompleteList.appendChild(item);
    });
    
    autocompleteList.classList.remove('hidden');
}

// Function to format time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to get time since update
function getTimeSinceUpdate(dateString) {
    const updateTime = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hr ago';
    return `${diffHours} hrs ago`;
}

// Function to fetch weather data
async function getWeatherData(city) {
    showLoading();
    
    try {
        // Use current.json endpoint for basic weather data
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
    try {
        const { location, current } = data;
        
        // Display current weather - check if elements exist first
        if (locationElement) locationElement.textContent = `${location.name}, ${location.country}`;
        if (temperatureElement) temperatureElement.textContent = `${current.temp_c}°C`;
        if (conditionElement) conditionElement.textContent = current.condition.text;
        if (humidityElement) humidityElement.textContent = `${current.humidity}%`;
        if (windSpeedElement) windSpeedElement.textContent = `${current.wind_kph} km/h`;
        if (uvIndexElement) uvIndexElement.textContent = current.uv;
        if (weatherIconElement) {
            weatherIconElement.src = `https:${current.condition.icon}`;
            weatherIconElement.alt = current.condition.text;
        }
        if (feelsLikeElement) feelsLikeElement.textContent = `${current.feelslike_c}°C`;
        if (localTimeElement) localTimeElement.textContent = formatTime(location.localtime);
        if (lastUpdatedElement) lastUpdatedElement.textContent = getTimeSinceUpdate(current.last_updated);
        
        // Additional weather details
        if (precipitationElement) precipitationElement.textContent = `${current.precip_mm} mm`;
        if (pressureElement) pressureElement.textContent = `${current.pressure_mb} mb`;
        if (visibilityElement) visibilityElement.textContent = `${current.vis_km} km`;
        if (windDirElement) windDirElement.textContent = current.wind_dir;
        if (cloudElement) cloudElement.textContent = `${current.cloud}%`;
        if (heatIndexElement) heatIndexElement.textContent = `${current.heatindex_c}°C`;
        if (windChillElement) windChillElement.textContent = `${current.windchill_c}°C`;
        if (dewPointElement) dewPointElement.textContent = `${current.dewpoint_c}°C`;
        if (gustElement) gustElement.textContent = `${current.gust_kph} km/h`;
        
        // Create or update weather widgets
        createWeatherWidgets(data);
        
        hideLoading();
        if (weatherInfo) {
            weatherInfo.classList.remove('hidden');
            // Add animation class
            weatherInfo.classList.add('animate-fadeIn');
        }
        if (errorElement) errorElement.classList.add('hidden');
    } catch (error) {
        console.error('Error displaying weather data:', error);
        showError();
    }
}

// Helper functions for UI states
function showLoading() {
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
        loadingElement.classList.add('active');
    }
    if (weatherInfo) weatherInfo.classList.add('hidden');
    if (errorElement) errorElement.classList.add('hidden');
}

function hideLoading() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
        loadingElement.classList.remove('active');
    }
}

function showError() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
        loadingElement.classList.remove('active');
    }
    if (weatherInfo) weatherInfo.classList.add('hidden');
    if (errorElement) errorElement.classList.remove('hidden');
}

// Function to create responsive weather widgets
function createWeatherWidgets(data) {
    const { location, current } = data;
    
    // Create container for widgets if it doesn't exist
    let widgetsContainer = document.getElementById('weather-widgets');
    if (!widgetsContainer) {
        widgetsContainer = document.createElement('div');
        widgetsContainer.id = 'weather-widgets';
        weatherInfo.appendChild(widgetsContainer);
    } else {
        widgetsContainer.innerHTML = ''; // Clear existing widgets
    }
    
    // Create widgets for all available data
    const widgets = [
        { title: 'Humidity', value: `${current.humidity}%`, icon: '<i class="fas fa-tint"></i>' },
        { title: 'Wind Speed', value: `${current.wind_kph} km/h`, icon: '<i class="fas fa-wind"></i>' },
        { title: 'UV Index', value: current.uv, icon: '<i class="fas fa-sun"></i>' },
        { title: 'Feels Like', value: `${current.feelslike_c}°C`, icon: '<i class="fas fa-thermometer-half"></i>' },
        { title: 'Precipitation', value: `${current.precip_mm} mm`, icon: '<i class="fas fa-cloud-rain"></i>' },
        { title: 'Pressure', value: `${current.pressure_mb} mb`, icon: '<i class="fas fa-compress-alt"></i>' },
        { title: 'Visibility', value: `${current.vis_km} km`, icon: '<i class="fas fa-eye"></i>' },
        { title: 'Wind Direction', value: current.wind_dir, icon: '<i class="fas fa-compass"></i>' },
        { title: 'Cloud Cover', value: `${current.cloud}%`, icon: '<i class="fas fa-cloud"></i>' },
        { title: 'Wind Gust', value: `${current.gust_kph} km/h`, icon: '<i class="fas fa-wind"></i>' }
    ];
    
    // Create each widget with modern design
    widgets.forEach(widget => {
        const widgetElement = document.createElement('div');
        widgetElement.className = 'weather-widget';
        
        widgetElement.innerHTML = `
            <div class="widget-icon">${widget.icon}</div>
            <div class="widget-value">${widget.value}</div>
            <div class="widget-title">${widget.title}</div>
        `;
        
        widgetsContainer.appendChild(widgetElement);
    });
}