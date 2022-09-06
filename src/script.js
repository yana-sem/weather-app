let apiKey = "4bc4526b9c376d5f0c645084585c4fe5";
let apiNewKey = "c95d60a1e3adbeb286133f1ebebc2579";

function formatDate(timestamp) {
  let calcTime = new Date(timestamp);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[calcTime.getMonth()];
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[calcTime.getDay()];
  let hours = calcTime.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = calcTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = calcTime.getDate();
  return `${day}, ${month} ${date}, ${hours}:${minutes}`;
}

//  showForecast
function showForecast(coordinates) {
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiNewKey}&units=metric`;
  // console.log(apiForecastUrl);
  axios.get(apiForecastUrl).then(displayForecast);
}
//
// showWeatherParams
function showWeatherParams(response) {
  // clear error message, if any
  document.getElementById("error-message").innerHTML = ``;
  // RESET TO DEFAULT CLASSES AND BEHAVIOR TEMP UNITS ELEMENTS
  document.querySelector(".celsius-unit").classList.remove("inactive-unit");
  document.querySelector(".celsius-unit").classList.add("click-prevention");
  document.querySelector(".fahrenheit-unit").classList.add("inactive-unit");
  document
    .querySelector(".fahrenheit-unit")
    .classList.remove("click-prevention");
  document.getElementById("feels-like-temp-unit").innerHTML = "°C";
  //description
  document.getElementById("description").innerHTML =
    response.data.weather[0].description;
  let currentCityH1 = document.querySelector("h1");
  currentCityH1.innerHTML = response.data.name;
  // current temperature celsius
  tempC = Math.round(response.data.main.temp);
  document.getElementById("current-temp").innerHTML = tempC;
  tempCFeels = Math.round(response.data.main.feels_like);
  document.getElementById("feels-like-temp").innerHTML = tempCFeels;
  // current temperature fahrenheit
  tempF = Math.round(tempC * 1.8 + 32);
  tempFFeels = Math.round(tempCFeels * 1.8 + 32);
  // change weather icon
  document
    .getElementById("current-weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .getElementById("current-weather-icon")
    .setAttribute("alt", response.data.weather[0].description);
  // humidity
  let humidity = response.data.main.humidity;
  document.getElementById("humidity").innerHTML = `${humidity}%`;
  // wind.speed Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
  let wind = Math.round(response.data.wind.speed);
  document.getElementById("wind").innerHTML = `${wind} m/s`;
  // sunrise
  let timezone = response.data.timezone * 1000;
  let sunrise = response.data.sys.sunrise;
  sunrise = new Date(sunrise * 1000 + timezone);
  let sunriseIso = sunrise.toISOString().match(/(\d{2}:\d{2})/);
  // console.log(sunriseIso[1]);
  document.getElementById("sunrise").innerHTML = sunriseIso[1];
  // sunset
  let sunset = response.data.sys.sunset;
  sunset = new Date(sunset * 1000 + timezone);
  let sunsetIso = sunset.toISOString().match(/(\d{2}:\d{2})/);
  document.getElementById("sunset").innerHTML = sunsetIso[1];
  // timestamp
  document.getElementById("calculation-time").innerHTML = formatDate(
    response.data.dt * 1000
  );
  showForecast(response.data.coord);
}

function showErrorMessage(response) {
  document.getElementById(
    "error-message"
  ).innerHTML = `City not found. Please, check your request`;
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = document.getElementById("forecast");
  let forecastDays = [
    "Wed, Sep 7",
    "Thu, Sep 8",
    "Fri, Sep 9",
    "Sat, Sep 10",
    "Sun, Sep 11",
  ];
  let forecastHTML =
    '<div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 my-5 g-2">';
  forecastDays.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col">
            <div class="card border-0 px-2 card-custom">
              <div class="card-body">
                <h5 class="card-title text-nowrap card-title-forecast">
                  ${day}
                </h5>
                <div class="card-content-container">
                  <img
                    src="http://openweathermap.org/img/wn/10d@2x.png"
                    alt=""
                    width="60px"
                  />
                  <span class="highest-lowest-temp">
                    <span class="highest"> 32<sup>°C</sup> <br /></span>
                    <span class="lowest"> 22<sup>°C</sup></span>
                  </span>
                </div>
              </div>
            </div>
          </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function search(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeatherParams, showErrorMessage);
}
// SEARCH FIELD INPUT
function handleSubmitSearch(event) {
  event.preventDefault();
  let city = document.getElementById("search-city-input").value.trim();
  if (city) {
    search(city);
  } else {
  }
}
document
  .getElementById("search-form")
  .addEventListener("submit", handleSubmitSearch);

// current-location button
function getWeatherByGeo(event) {
  navigator.geolocation.getCurrentPosition(function getCurrentCoords(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    // console.log(url);
    axios.get(url).then(showWeatherParams);
    // clear input search
    let searchInput = document.querySelector("#search-city-input");
    searchInput.value = "";
  });
}

document
  .getElementById("current-location")
  .addEventListener("click", getWeatherByGeo);

// Display the city name from List of frequently used cities under Search field
function searchSelectedCity(event) {
  let selectedCity = event.target.innerText;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeatherParams);
  // clear input search
  let searchInput = document.querySelector("#search-city-input");
  searchInput.value = "";
}
document
  .querySelector("ul.city-choices")
  .addEventListener("click", searchSelectedCity);

//TEMPERATURE CONVERSION
function convertCtoF(event) {
  event.target.classList.remove("inactive-unit");
  event.target.classList.add("click-prevention");
  document.querySelector(".celsius-unit").classList.add("inactive-unit");
  document.querySelector(".celsius-unit").classList.remove("click-prevention");
  document.getElementById("current-temp").innerHTML = tempF;
  document.getElementById("feels-like-temp").innerHTML = tempFFeels;
  document.getElementById("feels-like-temp-unit").innerHTML = "°F";
}
//
document
  .querySelector(".fahrenheit-unit")
  .addEventListener("click", convertCtoF);
//
function convertFtoC(event) {
  event.target.classList.remove("inactive-unit");
  event.target.classList.add("click-prevention");
  document.querySelector(".fahrenheit-unit").classList.add("inactive-unit");
  document
    .querySelector(".fahrenheit-unit")
    .classList.remove("click-prevention");
  document.getElementById("current-temp").innerHTML = tempC;
  document.getElementById("feels-like-temp").innerHTML = tempCFeels;
  document.getElementById("feels-like-temp-unit").innerHTML = "°C";
}
//
document.querySelector(".celsius-unit").addEventListener("click", convertFtoC);
// GLOBAL VARIABLES
let tempC = null;
let tempF = null;
let tempCFeels = null;
let tempFFeels = null;
// Display city info by default Chernivtsi
search("Chernivtsi");
// displayForecast();
