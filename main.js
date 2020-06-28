const API_URL = "https://fcc-weather-api.glitch.me/api/current";
const spinner = document.getElementById("spinner");
const weatherTemplate = document.querySelector(".weatherTemplate");
const weatherContainer = document.getElementById("weatherContainer");

/** Use a IIFE as document ready function */
(function () {
  // show and update the clock live
  updateClock();
  setInterval(updateClock, 1000);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherData);
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  registerServiceWorker();
})();

/** Callback invoked after user's location has been retrieved
 * make an API call with the user's location
 *
 * @param {Object} geolocationPosition
 */
function fetchWeatherData({ coords: { latitude, longitude } }) {
  fetch(`${API_URL}?lon=${longitude}&lat=${latitude}`)
    .then((response) => response.json())
    .then((data) => renderData(data))
    .catch((error) => {
      console.warn({ error });
    })
    .finally(() => {
      spinner.style.display = "none";
    });
}

/** Given data as JSONObject, parse it and populate the DOM
 *
 * @param {Object} JSONObject
 */
function renderData(JSONObject) {
  const {
    name,
    visibility,
    sys: { country },
    main: { temp, temp_min, temp_max, feels_like, humidity, pressure },
    wind: { deg, speed },
    clouds: { all },
    weather,
  } = JSONObject;

  const parsedData = {
    name,
    visibility: visibility && Number(visibility) / 1000,
    country,
    temp,
    temp_min,
    temp_max,
    feels_like,
    humidity,
    pressure,
    deg,
    speed,
    all,
  };

  for (let key in parsedData) {
    const span = document.getElementById(key);
    const value = parsedData[key];

    if (value && span) {
      span.innerText = value;
    }
  }

  weather.forEach((e) => {
    renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
    // renderWeatherItem(e);
  });
}

/** renders weather item and appends the resulting node to the DOM
 *
 * @param {Object} item
 * @param {string} [item.main]
 * @param {string} [item.description]
 * @param {string} [item.icon]
 */
function renderWeatherItem({ main, description, icon }) {
  const template = weatherTemplate.cloneNode(true);

  template.hidden = false;
  template.classList = "weather-item";

  if (description) {
    template.querySelector(".description").innerText = description;
  }

  if (icon) {
    const img = template.querySelector(".icon");
    img.src = icon;
    img.alt = description || main || "weather icon";
  } else {
    template.hidden = true;
  }

  weatherContainer.appendChild(template);
}

/** Render the current date to DOM
 */
function updateClock() {
  document.getElementById("time").innerText = new Date().toGMTString();
}

/** Initializes the service worker to provide offline experience
 *
 */
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(() => {})
        .catch((error) =>
          console.error("Failed to register service worker", error)
        );
    });
  }
}
