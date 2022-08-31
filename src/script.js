// TODO list:
// 1) current time must be also local ---->>> .dt???

let apiKey = "4bc4526b9c376d5f0c645084585c4fe5";
// Display the current date and time using JavaScript
function showCurrentDateTime() {
  let now = new Date();
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
  let month = months[now.getMonth()];
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  // let hours = now.getHours();
  // let minutes = now.getMinutes();
  document.querySelector(
    "#day-month-date"
  ).innerHTML = `${day}, ${month} ${date}`;
  document.querySelector("#time").innerHTML = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
showCurrentDateTime();

// showWeatherParams
function showWeatherParams(response) {
  // clear error message, if any
  document.getElementById("error-message").innerHTML = ``;
  // console.log(response.data.cod);
  let currentCityH1 = document.querySelector("h1");
  currentCityH1.innerHTML = response.data.name;
  // current temperature
  let tempC = Math.round(response.data.main.temp);
  document.getElementById("current-temp").innerHTML = tempC;
  let tempCFeels = Math.round(response.data.main.feels_like);
  document.getElementById("feels-like-temp").innerHTML = tempCFeels;
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
}

function showErrorMessage(response) {
  document.getElementById(
    "error-message"
  ).innerHTML = `City not found. Please, check your request`;
}

function search(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log(url);
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

// Convert temperature units
let tempC = Number(document.getElementById("current-temp").innerText);
let tempF = Math.round(tempC * 1.8 + 32);
let currentTempValues = {
  celsius: tempC,
  fahrenheit: tempF,
};
//
let tempCFeels = Number(document.getElementById("feels-like-temp").innerText);
let tempFFeels = Math.round(tempCFeels * 1.8 + 32);
let currentTempFeelsValues = {
  celsius: tempCFeels,
  fahrenheit: tempFFeels,
};
//
function convertCtoF(event) {
  event.target.classList.remove("inactive-unit");
  event.target.classList.add("click-prevention");
  document.querySelector(".celsius-unit").classList.add("inactive-unit");
  document.querySelector(".celsius-unit").classList.remove("click-prevention");
  document.getElementById("current-temp").innerHTML =
    currentTempValues.fahrenheit;
  document.getElementById("feels-like-temp").innerHTML =
    currentTempFeelsValues.fahrenheit;
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
  document.getElementById("current-temp").innerHTML = currentTempValues.celsius;
  document.getElementById("feels-like-temp").innerHTML =
    currentTempFeelsValues.celsius;
  document.getElementById("feels-like-temp-unit").innerHTML = "°C";
}
//
document.querySelector(".celsius-unit").addEventListener("click", convertFtoC);

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

// Display city info by default Chernivtsi
search("Chernivtsi");
