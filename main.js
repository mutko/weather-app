const id = (selector) => document.getElementById(selector);

const cityId = 615702;
const proxy = 'https://proxy-requests.herokuapp.com/';
const url = `https://www.metaweather.com/api/location/${cityId}/`;


fetch(proxy+url) 
    .then( response => response.json() )
    .then( response => {
        showWeather(response);
    })

    function showWeather(apiResponse) {
        const weather = apiResponse.consolidated_weather[0];
        console.log(weather);
        const weatherIcon = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        console.log(weatherIcon);
        const conditions = weather.weather_state_name;
        const tempNow = Math.floor(weather.the_temp);
        const wind = Math.floor(weather.wind_speed);
        const humidity = Math.floor(weather.humidity);
        const pressure = Math.floor(weather.air_pressure);
        const tempMin = Math.floor(weather.min_temp);
        const tempMax = Math.floor(weather.max_temp);

        id('temp').innerText = tempNow;

        id('conditions').innerHTML = `<img src=${weatherIcon} alt="Weather conditions"> 
                                        <span>${conditions}</span>
        `;

        id('wind').innerText = wind;
        id('humidity').innerText = humidity;
        id('pressure').innerText = pressure;
        id('temp-now').innerText = tempNow;
        id('temp-min').innerText = tempMin;        
        id('temp-max').innerText = tempMax;
    }