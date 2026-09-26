function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky ☀️";

    } else if (code === 1) {
        return "Mainly clear 🌤️";

    } else if (code === 2) {
        return "Partly cloudy ⛅";

    } else if (code === 3) {
        return "Overcast ☁️";

    } else if (code >= 51 && code <= 55) {
        return "Drizzle 🌦️";

    } else if (code >= 61 && code <= 65) {
        return "Rain 🌧️";

    } else if (code >= 71 && code <= 75) {
    return "Snow ❄️";

    } else if (code === 95) {
    return "Thunderstorm ⚡";

    } else {
    return "Unknown weather";
}    
    
}
const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.querySelector("button");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");

weatherForm.addEventListener("submit", function(event) {

    event.preventDefault();

const city = cityInput.value.trim();

if (city.trim() === "") {
    cityName.textContent = "Please enter a city";
    return;
}

temperature.textContent = "";
descriptionElement.textContent = "";

searchButton.disabled = true;
cityName.textContent = city;
descriptionElement.innerHTML = `
    <div class="loader"></div>
`;

    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=10&language=en&format=json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
           

if (!data.results) {
    console.log("No city found");
    cityName.textContent = "City not found";
    searchButton.disabled = false;
    return;
}

const location = data.results.find(function(result) {
    return result.name.toLowerCase() === city.toLowerCase();
});

if (!location) {
    cityName.textContent = "City not found";
    searchButton.disabled = false;
    return;
}
const latitude = location.latitude;
const longitude = location.longitude;


console.log(latitude);
console.log(longitude);
fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,weather_code")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

    console.log(data.current);

    const weatherCode = data.current.weather_code;
    console.log(weatherCode);

const description = getWeatherDescription(weatherCode);

console.log(description);

const celsius = data.current.temperature_2m;
const fahrenheit = celsiusToFahrenheit(celsius).toFixed(1);

temperature.textContent = celsius + " °C / " + fahrenheit + " °F";
descriptionElement.textContent = description;
searchButton.disabled = false;


})
.catch(function(error) {
    console.log(error);
    cityName.textContent = "Unable to get weather";
    searchButton.disabled = false;
});

        });

});

