const getGeoLocationButton = document.getElementById("geolocation");
const searchButton = document.getElementById("search");
const unitsButton = document.getElementById("unitsbutton");
const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", restartApp);
unitsButton.addEventListener("click", changeUnits);
searchButton.addEventListener("click", e => searchWeather(e));
getGeoLocationButton.addEventListener("click", getGeoLocation);
let currentUnits = "C";
const APIKEY = "9e2784936f680d48653338cba21190e3";

function restartApp() {
    const mainDisplay = document.querySelector(".weatherbox");
    const weatherInfoDisplay = document.querySelector(".weather-info");
    const location = document.getElementById("location");
    location.value = "";
    weatherInfoDisplay.style.display = "none";
    mainDisplay.style.display = "block";
}

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

function searchWeather(event) {
    const location = document.getElementById("location");
    if (location.checkValidity()) updateDisplay(location.value);
    else location.reportValidity();

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
    if (response.ok) {
        const data = await response.json();
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
    } else return null;



}


function updateDisplay(city, lat, lon) {
    let data;
    if (city == "none") data = getWeather("none", lat, lon);
    if (city != "none") data = getWeather(city);

    data.then(e => {
        if (e != null) {
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

            cityDisplay.textContent = `${e.cityName}, ${e.country}`;
            temperature.textContent = parseFloat(e.currentTemp).toFixed(1);
            feelstemperatureDisplay.textContent = e.feelsLikeTemp.toFixed(1);
            humidityDisplay.textContent = e.humidity;
            pressureDisplay.textContent = Math.floor(parseInt(e.pressure) * 0.02952998307144475);
            minTempDisplay.textContent = e.lowTemp.toFixed(1);
            maxTempDisplay.textContent = e.highTemp.toFixed(1);

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
        } else {
            const errorMessage = document.querySelector(".error");
            errorMessage.style.display = "block";

        }



    });



}

function changeUnits() {
    const temperature = document.getElementById("maintemp");
    const feelstemperatureDisplay = document.getElementById("temp");
    const minTempDisplay = document.getElementById("mintemp");
    const maxTempDisplay = document.getElementById("maxtemp");
    const unitSymbol = document.querySelectorAll(".tempunit");

    let temperatureValue = temperature.textContent;

    function convertToC(tempInF) {
        return ((tempInF - 32) * 5 / 9).toFixed(1);
    }

    function convertToF(tempInC) {
        return (tempInC * 9 / 5 + 32).toFixed(1);
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

function convertToF(tempInC) {
    return Math.floor((parseFloat(tempInC) * (9 / 5)) + 32)
}
