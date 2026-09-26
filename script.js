async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name");
        return;
    }
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        if (!geoData.results?.length) { throw new Error("City not found"); }
        const { latitude, longitude, name, country } = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` + `&temperature_unit=celsius&wind_speed_unit=kmh`;
        const weatherResponse = await fetch(weatherUrl); if (!weatherResponse.ok) { throw new Error("Weather request failed"); } const weather = await weatherResponse.json();
        cityName.textContent = `${name}, ${country}`; temperature.textContent = `${weather.current.temperature_2m}°C`;
        humidity.textContent = `Humidity: ${weather.current.relative_humidity_2m}%`;
        feelsLike.textContent = `Feels like: ${weather.current.apparent_temperature}°C`;
        wind.textContent = `Wind: ${weather.current.wind_speed_10m} km/h`;
    }
    catch (error) { showError(error.message); }
}

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { getWeather(); }
});