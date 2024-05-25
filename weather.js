function fetchWeather() {
    const apiKey = "eea01c4857e0645a8c63a9600333c440";
    const cityInput = document.getElementById('city-input').value;

    if (!cityInput) {
        alert("Please enter a city");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error);
            alert("Error fetching current weather data. Please try again.");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            updateHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            alert("Error fetching forecast data. Please try again.");
        });
}

function updateCurrentWeather(data) {
    const temperatureDiv = document.getElementById('temperature');
    const weatherDetailsDiv = document.getElementById('weather-details');
    const weatherIconImage = document.getElementById('weather-icon-image');
    const hourlyForecastContainer = document.getElementById('hourly-forecast-container');

    weatherDetailsDiv.innerHTML = "";
    hourlyForecastContainer.innerHTML = "";
    temperatureDiv.innerHTML = "";

    if (data.cod === '404') {
        weatherDetailsDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}&deg;C</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

        temperatureDiv.innerHTML = temperatureHTML;
        weatherDetailsDiv.innerHTML = weatherHTML;
        weatherIconImage.src = iconUrl;
        weatherIconImage.alt = description;

        displayWeatherIcon();
    }
}

function updateHourlyForecast(hourlyData) {
    const hourlyForecastContainer = document.getElementById('hourly-forecast-container');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `
            <div class="hourly-forecast-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastContainer.innerHTML += hourlyItemHTML;
    });
}

function displayWeatherIcon() {
    const weatherIconImage = document.getElementById('weather-icon-image');
    weatherIconImage.style.display = 'block'; 
}
