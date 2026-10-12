# Weather Dashboard

A simple weather dashboard that shows the current weather for any city using the OpenWeatherMap API.

## Features

- Search weather by city name
- Shows temperature, description, weather icon, feels like, humidity and wind speed
- Loading spinner while fetching data
- Error messages for an empty search, wrong city names, a missing or invalid API key, too many requests, network problems and other failed requests
- Works on mobile and desktop

## Setup

1. Create a free account at https://openweathermap.org and get an API key from the "API keys" page. New keys can take a little while to activate.
2. Copy `config.example.js` and rename the copy to `config.js`.
3. Open `config.js` and replace `YOUR_API_KEY_HERE` with your key.
4. Open `index.html` in your browser.

`config.js` is in `.gitignore` so the API key is not uploaded to GitHub.

## Files

- `index.html` - page structure
- `style.css` - styling (colors stored as CSS variables)
- `script.js` - fetching and displaying the weather
- `config.example.js` - template for the API key

## Screenshot

![Screenshot](image.png)
