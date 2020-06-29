// global variable to the script but local to the app that will embed this script
let weatherWidgetDomContainer;

// Load everything as soon as the tab is loaded
window.onload = function () {
  weatherWidgetDomContainer = document.getElementById(
    "weatherWidgetDomContainer"
  );

  // render the widget only if the document does contain a place holder for it
  if (!weatherWidgetDomContainer) {
    return;
  }

  weatherWidgetDomContainer.setAttribute(
    "style",
    "position: relative; color: #21489b; padding: 0; margin:0; overflow:hidden"
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
  fetch(
    `https://fcc-weather-api.glitch.me/api/current?lon=${longitude}&lat=${latitude}`
  )
    .then((response) => response.json())
    .then((data) => renderData(data))
    .catch(() => {})
    .finally(() => {
      document.getElementById("spinner").style.display = "none";
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

  template.classList = "weather-item";

  if (description) {
    template.querySelector(".description").innerText = description;
    template.hidden = false;
  }

  const img = template.querySelector(".icon");
  if (icon) {
    img.src = icon;
    img.alt = description || main || "weather icon";
  } else {
    img.hidden = true;
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

  wrapper.setAttribute(
    "style",
    "display: flex; position: relative; width: 100%;"
  );

  wrapper.innerHTML = `
      <div id='weatherContainer' style="background: white; z-index:3"> </div>
      <div style="background: white; z-index:2"> <i id='temp' style='font-size: x-large;'></i> </div>
      <div id='roller' style='display: flex; white-space: nowrap; padding: 0 1rem;'>
        <div> <i id='time'></i> </div>
        <div> <i id='name' style='white-space: nowrap;'></i> </div>
        <div> <i>hi: </i><i id='temp_max'></i> </div>
        <div> <i>lo: </i><i id='temp_min'></i> </div>
        <div> <i>feels like: </i><i id='feels_like'></i> </div>
        <div> <i>Humidity:</i> <i id='humidity'></i> </div>
        <div> <i>Pressure:</i> <i id='pressure'></i> </div>
        <div> <i>Wind dir:</i> <i id='deg'></i> </div>
        <div> <i>Wind Speed:</i> <i id='speed'></i> </div>
        <div> <i>Cloud cover: </i> <i id='all'></i> </div>
        <div> <i>Visibility: </i> <i id='visibility'></i> </div>
      </div>
    `;

  weatherWidgetDomContainer.appendChild(wrapper);

  addFigureTemplate();
  addSpinner();
  addCSS();
}

/** Manually create a Figure template, which will be cloned
 * to create more figures to display weather icons
 */
function addFigureTemplate() {
  const figure = document.createElement("figure");

  figure.classList = "weatherTemplate";
  figure.setAttribute("style", "padding:0; margin:0");
  figure.hidden = true;
  figure.innerHTML = `<img class='icon' alt='icon'>
          <figcaption style="position: relative">
            <p class='description' style='margin:0; position: absolute; bottom:10%; white-space: nowrap;'></p>
          </figcaption>`;

  weatherWidgetDomContainer.appendChild(figure);
}
/** Manually create and add a loader spinner to the dom */
function addSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "spinner";
  spinner.setAttribute(
    "style",
    "'position: absolute; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); '"
  );
  spinner.innerHTML = `
        <div class='loader'
        style='border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #3498db; -webkit-animation: spin 2s linear infinite; position: absolute; left: 50%; top: 50%;'>
      </div>
  `;
  weatherWidgetDomContainer.appendChild(spinner);
}

/** Create and append the css to the DOM */
function addCSS() {
  const style = document.createElement("style");
  style.innerHTML = `
    #roller {
      -webkit-animation: roll 20s linear infinite;
      animation: roll 20s linear infinite;
    }

    #roller div {
      margin-right: 0.1rem;
      padding: 1rem 0.2rem;
    }

    #weatherWidgetDomContainer i,
    p {
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.8;
    }

    @keyframes roll {
      from {
        margin-left: 10%;
      }

      to {
        margin-left: -80%;
      }
    }

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
  `;
  weatherWidgetDomContainer.appendChild(style);
}

/** render mock data instead of making requests to the actual weather web-service
 * This to avoid being blocked and for performance reasons
 */
function renderMockData() {
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
