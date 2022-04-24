const getGeoLocationButton = document.getElementById("geolocation");
const searchButton = document.getElementById("search");
const unitsButton = document.getElementById("unitsbutton");
unitsButton.addEventListener("click", changeUnits);
searchButton.addEventListener("click", searchWeather);
getGeoLocationButton.addEventListener("click", getGeoLocation);
let currentUnits = "C";
const APIKEY = "9e2784936f680d48653338cba21190e3";

function getGeoLocation() {

    navigator.geolocation.getCurrentPosition(success, error);

    function success(pos) {
        let lat = pos.coords.latitude;
        let long = pos.coords.longitude;
        updateDisplay("none", lat, long);

    }

    function error() {
        console.log("Error");
    }


}

function searchWeather() {
    const location = document.getElementById("location");
    updateDisplay(location.value);
}


async function getCoordinates(zipCode, countryCode) {
    const geoAPIURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${APIKEY}`;
    const response = await fetch(geoAPIURL);
    const data = await response.json();
    return { lat: data.lat, lon: data.lon };

}

async function getWeather(city, lat, lon) {
    let weatherAPIURL;
    if (city == "none") {
        weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`
    }
    else {
        weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`
    }

    const response = await fetch(weatherAPIURL);
    const data = await response.json();
    console.log(data);
    let cityName = data.name;
    let country = data.sys.country;
    let currentTemp = data.main.temp;
    let cloudness = data.clouds.all;
    let feelsLikeTemp = data.main.feels_like;
    let lowTemp = data.main.temp_min;
    let highTemp = data.main.temp_max;
    let pressure = data.main.pressure;
    let humidity = data.main.humidity;

    return { currentTemp, feelsLikeTemp, lowTemp, highTemp, pressure, humidity, cityName, country, cloudness }
}


function updateDisplay(city, lat, lon) {
    let data;
    if (city == "none") data = getWeather("none", lat, lon);
    if (city != "none") data = getWeather(city);
    const mainDisplay = document.querySelector(".weatherbox");
    mainDisplay.style.display = "none";
    const weatherInfoDisplay = document.querySelector(".weather-info");
    weatherInfoDisplay.style.display = "block";
    const temperature = document.getElementById("maintemp")
    const skyConditionDisplay = document.getElementById("skycondition");
    const cloudDetail = document.getElementById("clouddetails");
    const cityDisplay = document.querySelector(".city");
    const feelstemperatureDisplay = document.getElementById("temp");
    const humidityDisplay = document.getElementById("humidity");
    const pressureDisplay = document.getElementById("pressure");
    const minTempDisplay = document.getElementById("mintemp");
    const maxTempDisplay = document.getElementById("maxtemp");

    data.then(e => {
        cityDisplay.textContent = `${e.cityName}, ${e.country}`;
        temperature.textContent = e.currentTemp;
        feelstemperatureDisplay.textContent = e.feelsLikeTemp;
        humidityDisplay.textContent = e.humidity;
        pressureDisplay.textContent = Math.floor(parseInt(e.pressure) * 0.02952998307144475);
        minTempDisplay.textContent = e.lowTemp;
        maxTempDisplay.textContent = e.highTemp;

        if (parseInt(e.cloudness) == 0) {
            skyConditionDisplay.textContent = "Clear";
            cloudDetail.textContent = "Clear Skies"
        }
        if (parseInt(e.cloudness) > 0) {
            skyConditionDisplay.textContent = "Clouds";
            cloudDetail.textContent = "Some Clouds";
        }
        if (parseInt(e.cloudness) > 50) {
            skyConditionDisplay.textContent = "Clouds";
            cloudDetail.textContent = "Very Cloudy";
        }

    })


}

function changeUnits() {
    const temperature = document.getElementById("maintemp");
    const feelstemperatureDisplay = document.getElementById("temp");
    const minTempDisplay = document.getElementById("mintemp");
    const maxTempDisplay = document.getElementById("maxtemp");
    const unitSymbol = document.querySelectorAll(".tempunit");


    function convertToC(tempInF) {
        return Math.floor((parseInt(tempInF) - 32) * (5 / 9));
    }

    function convertToF(tempInC) {
        return Math.floor((parseInt(tempInC) * (9 / 5)) + 32);
    }

    if (currentUnits == "C") {
        temperature.textContent = convertToF(temperature.textContent);
        feelstemperatureDisplay.textContent = convertToF(feelstemperatureDisplay.textContent);
        minTempDisplay.textContent = convertToF(minTempDisplay.textContent);
        maxTempDisplay.textContent = convertToF(maxTempDisplay.textContent);
        unitSymbol.forEach(e => e.textContent = "F");
        currentUnits = "F";
    }

    else if (currentUnits == "F") {
        temperature.textContent = convertToC(temperature.textContent);
        feelstemperatureDisplay.textContent = convertToC(feelstemperatureDisplay.textContent);
        minTempDisplay.textContent = convertToC(minTempDisplay.textContent);
        maxTempDisplay.textContent = convertToC(maxTempDisplay.textContent);
        unitSymbol.forEach(e => e.textContent = "C");
        currentUnits = "C";
    }

}


