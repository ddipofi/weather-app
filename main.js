class WeatherData {
    #location;
    #temperature;
    #conditions;

    constructor(location, temperature, conditions) {
        this.#location = location;
        this.#temperature = temperature;
        this.#conditions = conditions;
    }

    get location() {
        return this.#location;
    }
    get temperature() {
        return this.#temperature;
    }
    get conditions() {
        return this.#conditions;
    }
}

class ImageData {
    #src;

    constructor(src) {
        this.#src = src;
    }

    get src() {
        return this.#src;
    }
}

async function getWeather(city, units) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${units}&key=N2KDJJ9KDQ83AFW4NWBGQU373&contentType=json`,
        { mode: "cors" }
    );
    const json = await response.json();
    return json;
}

async function getGif(term) {
    const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=a17lF53opStP4snkjiTgGs6ZEtKLIN1u&s=${term}`,
        { mode: "cors" }
    );
    const json = await response.json();
    return json;
}

function processJson(json) {}

function processWeather(json) {
    const location = json.resolvedAddress;
    const temperature = json.currentConditions.temp;
    const conditions = json.currentConditions.conditions;

    return new WeatherData(location, temperature, conditions);
}

function processGif(json) {
    const src = json.data.images.original.url;

    return new ImageData(src);
}

async function showWeather(city, units) {
    const start = new Date();
    let json = await getWeather(city, units);
    const weather = processWeather(json);
    json = await getGif(weather.conditions);
    const gif = processGif(json);
    const end = new Date();

    const location = document.querySelector(".location");
    const temperature = document.querySelector(".temperature");
    const background = document.querySelector("body");
    const requestTime = document.querySelector(".request-time");

    location.textContent = weather.location;
    temperature.textContent = `${weather.temperature} `;
    background.style.backgroundImage = `url("${gif.src}")`;
    requestTime.textContent =
        "Request Time: " + Math.round((end - start) / 1000) + "s";
}

//showWeather("toledo", "us");

const form = document.querySelector("form");
const search = document.querySelector("input");
const button = document.querySelector("button");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = search.value;
    const degree = button.textContent;
    let units = "us";

    if (degree === "°C") {
        units = "metric";
    }

    showWeather(city, units);
});

button.addEventListener("click", () => {
    const city = search.value;
    const degree = button.textContent;

    let units = "us";

    if (button.textContent === "°F") {
        units = "metric";
    }

    showWeather(city, units);

    if (degree === "°F") {
        button.textContent = "°C";
    } else {
        button.textContent = "°F";
    }
});
