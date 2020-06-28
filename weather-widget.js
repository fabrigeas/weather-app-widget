// global variable to the script but local to the app that will embed this script
let weatherWidgetDomContainer;

// Load everything as soon as the tab is loaded
window.onload = function () {
  weatherWidgetDomContainer = document.getElementById(
    "weatherWidgetDomContainer"
  );

  if (!weatherWidgetDomContainer) {
    return;
  }

  weatherWidgetDomContainer.setAttribute(
    "style",
    "position: relative; color: #21489b; border: solid #21489b 1px; padding: 0.2rem; margin:0;"
  );

  getUserLocation();
  createDOM();
  startClock();
};

/** Get the user's location then fetch the data*/
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherData);
  } else {
    document.getElementById("spinner").style.display = "none";
  }
}

/** Callback invoked after user's location has been retrieved
 * make an API call with the user's location
 *
 * @param {Object} geolocationPosition
 */
function fetchWeatherData({ coords: { latitude, longitude } }) {
  // fetch(
  //   `https://fcc-weather-api.glitch.me/api/current?lon=${longitude}&lat=${latitude}`
  // )
  //   .then((response) => response.json())
  //   .then((data) => renderData(data))
  //   .catch(() => {})
  //   .finally(() => {
  //     document.getElementById("spinner").style.display = "none";
  //   });

  renderData({
    coord: {
      lon: 8.43,
      lat: 49.48,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon:
          "https://cdn.glitch.com/6e8889e5-7a72-48f0-a061-863548450de5%2F04d.png?1499366020964",
      },
    ],
    base: "stations",
    main: {
      temp: 24.56,
      feels_like: 24.99,
      temp_min: 22.22,
      temp_max: 26.11,
      pressure: 1013,
      humidity: 65,
    },
    visibility: 10000,
    wind: {
      speed: 3.1,
      deg: 190,
    },
    clouds: {
      all: 81,
    },
    dt: 1593249854,
    sys: {
      type: 1,
      id: 1291,
      country: "DE",
      sunrise: 1593228104,
      sunset: 1593286611,
    },
    timezone: 7200,
    id: 2875376,
    name: "Ludwigshafen am Rhein",
    cod: 200,
  });
  document.getElementById("spinner").style.display = "none";
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
    clouds: { all: cloud },
    weather,
  } = JSONObject;

  const parsedData = {
    name,
    visibility: visibility && Number(visibility) / 1000,
    country,
    temp: temp && `${temp}°`,
    temp_min: temp_min && `${temp_min}°`,
    temp_max: temp_max && `${temp_max}°`,
    feels_like: feels_like && `${feels_like}°`,
    humidity: humidity && `${humidity}%`,
    pressure: pressure && `${pressure}mbar`,
    deg: deg && `${deg}°`,
    speed: `${speed}km/h`,
    could: cloud && `${cloud}°`,
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
  const template = document.querySelector(".weatherTemplate").cloneNode(true);
  const weatherContainer = document.getElementById("weatherContainer");

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

/** Displays the system time every second */
function startClock() {
  const updateClock = () =>
    (document.getElementById("time").innerText = new Date().toGMTString());
  updateClock();
  setInterval(updateClock, 1000);
}

/** Manually creates HTMLElements that will  be uses by this */
function createDOM() {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = `<h4>
      <span id='name'></span> - <i id='country'></i> - <span id='time'></span>
    </h4>
    <div style='display: flex'>

      <div style='width:50%; position: relative;'>
        <div><span>feels like: </span> <span id='feels_like'></span></div>
        <div><span>Humidity:</span> <span id='humidity'></span></div>
        <div><span>Pressure:</span> <span id='pressure'></span></div>
        <div><span>Direction:</span> <span id='deg'></span></div>
        <div><span>Speed:</span> <span id='speed'></span></div>
        <div><span>Cloud cover: </span> <span id='all'></span></div>
        <div><span>Visibility: </span> <span id='visibility'></span></div>
      </div>

      <div style='width: 100%;display: flex; flex-direction: column; text-align: center;'>
        <span id='temp' style='font-size: 3rem;'></span>
        <div>
          <span id='temp_min'></span> -- <span id='temp_max'></span>
        </div>
        <div id='weatherContainer'> </div>
      </div>

      <div id='spinner' class='modal spinner'
        style='position: absolute; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); '>
        <div class='loader'
          style='border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #3498db; -webkit-animation: spin 2s linear infinite; position: absolute; left: 50%; top: 50%;'>
          <style>
            @-webkit-keyframes spin {
              0% {
                -webkit-transform: rotate(0deg);
              }

              100% {
                -webkit-transform: rotate(360deg);
              }
            }

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }

              100% {
                transform: rotate(360deg);
              }
            }
          </style>
        </div>
      </div>`;

  const figure = document.createElement("figure");
  figure.classList = "weatherTemplate";
  figure.hidden = true;
  figure.innerHTML = `<img class='icon' alt='icon'>
      <figcaption>
        <p class='description' style='margin:0'></p>
      </figcaption>`;
  weatherWidgetDomContainer.appendChild(figure);
  weatherWidgetDomContainer.appendChild(wrapper);
}
