const API_KEY = "7cda47d7e361e7388dcdbcecef2a82b2";

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");

const weatherDiv = document.getElementById("weather");
const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const iconEl = document.getElementById("icon");

/* ---------- AUTO SUGGEST (GEOCODING API) ---------- */
let debounceTimer;

cityInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchCities, 400);
});

async function fetchCities() {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
  const res = await fetch(url);
  const cities = await res.json();

  suggestionsBox.innerHTML = "";
  cities.forEach(city => {
    const div = document.createElement("div");
    div.textContent = `${city.name}, ${city.country}`;
    div.onclick = () => {
      cityInput.value = div.textContent;
      suggestionsBox.innerHTML = "";
      fetchWeather(city.lat, city.lon, city.name);
    };
    suggestionsBox.appendChild(div);
  });
}

/* ---------- WEATHER FETCH ---------- */
async function fetchWeather(lat, lon, cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  displayWeather(data, cityName);
}

/* ---------- DISPLAY WEATHER ---------- */
function displayWeather(data, cityName) {
  weatherDiv.style.display = "block";

  cityEl.textContent = cityName;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descEl.textContent = data.weather[0].description;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} km/h`;
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  changeBackground(data.main.temp, data.weather[0].icon);
}

/* ---------- DYNAMIC BACKGROUND ---------- */
function changeBackground(temp, icon) {
  const isNight = icon.includes("n");

  if (isNight) {
    document.body.style.background =
      "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
  } else if (temp > 30) {
    document.body.style.background =
      "linear-gradient(135deg, #ff512f, #f09819)";
  } else if (temp > 15) {
    document.body.style.background =
      "linear-gradient(135deg, #56ccf2, #2f80ed)";
  } else {
    document.body.style.background =
      "linear-gradient(135deg, #83a4d4, #b6fbff)";
  }
}
