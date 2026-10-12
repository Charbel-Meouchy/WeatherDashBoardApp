// like assignment 3 i will comment on the new stuff (fetch, async/await, errors) and on what isnt basic

const form = document.getElementById("search-form");     // finds the <form> by its id
const cityInput = document.getElementById("city-input"); // finds the text box
const loading = document.getElementById("loading");      // finds the loading message with the spinner
const errorText = document.getElementById("error");      // finds the <p> that will show the errors
const result = document.getElementById("result");        // finds the weather card

form.addEventListener("submit", function (e) {           // runs when clicking Search or pressing Enter
  e.preventDefault();                                    // stops the page from reloading like assignment 3
  const city = cityInput.value.trim();                   // the typed text without the spaces at the start and end

  if (city === "") {                                     // if the box is empty show an error and stop
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
});

async function getWeather(city) {                        // async is new, it lets me use await inside this function
  if (typeof API_KEY === "undefined") {                  // API_KEY comes from config.js, if that file is missing the variable doesnt exist
    showError("API key missing. Copy config.example.js to config.js and add your key."); // so i show a message instead of a red error in the console
    return;
  }

  result.classList.add("hidden");                        // hide the old result and the old error before the new search
  errorText.classList.add("hidden");
  loading.classList.remove("hidden");                    // show the loading indicator while we wait

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&units=metric&appid=" + API_KEY;
  // the link we ask the api with: q is the city, units=metric gives celsius and appid is my key
  // encodeURIComponent makes the city safe to put in a link (for example the space in "New York")

  try {                                                  // try because the request can fail
    const response = await fetch(url);                   // fetch asks the server and await waits for the answer without freezing the page

    if (response.status === 404) {                       // fetch doesnt fail on 404 or 401 by itself so i check the status myself
      throw new Error("City not found. Check the spelling and try again."); // throw jumps straight to the catch below with this message
    } else if (response.status === 401) {                // 401 means the key is wrong or not active yet
      throw new Error("Invalid API key. Check your config.js file.");
    } else if (response.status === 429) {                // 429 means too many requests (rate limit)
      throw new Error("Too many requests. Please wait a bit and try again.");
    } else if (!response.ok) {                           // ok is false for any other non 200 answer
      throw new Error("Something went wrong (error " + response.status + ").");
    }

    const data = await response.json();                  // the response isnt the data yet, .json() turns the body into a js object
    showWeather(data);
  } catch (error) {                                      // every error from above ends up here so nothing is left uncaught in the console
    if (error instanceof TypeError) {                    // when there is no internet fetch fails with a TypeError
      showError("Network error. Check your internet connection.");
    } else {
      showError(error.message);                          // otherwise show the message i wrote in the throw
    }
  } finally {                                            // finally runs at the end no matter if it worked or failed
    loading.classList.add("hidden");                     // so the loading always disappears
  }
}

function showWeather(data) {                             // puts the api data on the page
  document.getElementById("city-name").textContent = data.name + ", " + data.sys.country; // following the dots in the json to get each value
  document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";        // Math.round so 26.4 becomes 26
  document.getElementById("description").textContent = data.weather[0].description;      // weather is an array so [0] takes the first one
  document.getElementById("feels-like").textContent = Math.round(data.main.feels_like) + "°C";
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("wind").textContent = data.wind.speed + " m/s";

  const icon = document.getElementById("icon");
  icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"; // the api only gives a code like "01d" so i build the image link
  icon.alt = data.weather[0].description;               // alt text in case the image doesnt load

  result.classList.remove("hidden");                    // now there is data so the card shows
}

function showError(message) {                            // shows any error message to the user
  errorText.textContent = message;                       // textContent so the text is shown as plain text
  errorText.classList.remove("hidden");
  result.classList.add("hidden");                        // hide the old weather so it doesnt look like its for the wrong city
}
