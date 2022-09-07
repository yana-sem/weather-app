let apiKey = "4bc4526b9c376d5f0c645084585c4fe5";
let apiNewKey = "c95d60a1e3adbeb286133f1ebebc2579";
let apiNewKeySheCodes = "5f472b7acba333cd8a035ea85a0d4d4c";
// ____________DATE CONVERSION____________________________
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

function formatDateForecast(timestamp) {
  let forecastDay = new Date(timestamp);
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
  let month = months[forecastDay.getMonth()];
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[forecastDay.getDay()];
  let date = forecastDay.getDate();
  return `${day}, ${month} ${date}`;
}

//  showForecast
function showForecast(coordinates) {
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiNewKeySheCodes}&units=metric`;
  console.log(apiForecastUrl);
  axios.get(apiForecastUrl).then(displayForecast);
}
// ______________!!!ShowWeatherParams!!!__________________
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
  let forecast = response.data.daily;
  let forecastElement = document.getElementById("forecast");
  let forecastHTML =
    '<div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 my-5 g-2">';
  forecast.forEach(function (day, i) {
    if (i > 0 && i < 6) {
      tempForecastMax = day.temp.max;
      tempForecastMin = day.temp.min;
      tempForecastMaxFahren = Math.round(tempForecastMax * 1.8 + 32);
      tempForecastMinFahren = Math.round(tempForecastMin * 1.8 + 32);
      forecastHTML =
        forecastHTML +
        `<div class="col">
            <div class="card border-0 px-2 card-custom">
              <div class="card-body">
                <h5 class="card-title text-nowrap card-title-forecast">
                 ${formatDateForecast(day.dt * 1000)}
                </h5>
                <div class="card-content-container">
                  <img
                    src="http://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }@2x.png"
                    alt="${day.weather[0].description}"
                    width="60px"
                  />
                  <span class="highest-lowest-temp">
                    <span class="highest-cel" style="display: inline">${Math.round(
                      tempForecastMax
                    )}°</span>
                    <span class="highest-fah" style="display: none">${Math.round(
                      tempForecastMaxFahren
                    )}°</span>
                    <br />
                    <span class="lowest-cel" style="display: inline">${Math.round(
                      tempForecastMin
                    )}°</span>
                    <span class="lowest-fah" style="display: none">${Math.round(
                      tempForecastMinFahren
                    )}°</span>
                  </span>
                </div>
              </div>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
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

//_______________________TEMPERATURE CONVERSION_______________________________
function convertCtoF(event) {
  event.target.classList.remove("inactive-unit");
  event.target.classList.add("click-prevention");
  document.querySelector(".celsius-unit").classList.add("inactive-unit");
  document.querySelector(".celsius-unit").classList.remove("click-prevention");
  document.getElementById("current-temp").innerHTML = tempF;
  document.getElementById("feels-like-temp").innerHTML = tempFFeels;
  document.getElementById("feels-like-temp-unit").innerHTML = "°F";
  // _____________________________forecast_____________________________________
  document.querySelectorAll(".highest-cel").forEach(function (element, index) {
    element.style.display = "none";
  });
  document.querySelectorAll(".lowest-cel").forEach(function (element, index) {
    element.style.display = "none";
  });
  document.querySelectorAll(".highest-fah").forEach(function (element, index) {
    element.style.display = "inline";
  });
  document.querySelectorAll(".lowest-fah").forEach(function (element, index) {
    element.style.display = "inline";
  });
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
  // _____________________________forecast___________________________________________________________________________
  document.querySelectorAll(".highest-cel").forEach(function (element, index) {
    element.style.display = "inline";
  });
  document.querySelectorAll(".lowest-cel").forEach(function (element, index) {
    element.style.display = "inline";
  });
  document.querySelectorAll(".highest-fah").forEach(function (element, index) {
    element.style.display = "none";
  });
  document.querySelectorAll(".lowest-fah").forEach(function (element, index) {
    element.style.display = "none";
  });
}
//
document.querySelector(".celsius-unit").addEventListener("click", convertFtoC);
// GLOBAL VARIABLES
let tempC = null;
let tempF = null;
let tempCFeels = null;
let tempFFeels = null;
let tempForecastMax = null;
let tempForecastMin = null;
let tempForecastMaxFahren = null;
let tempForecastMinFahren = null;

// Display city info by default Chernivtsi
search("Chernivtsi");
