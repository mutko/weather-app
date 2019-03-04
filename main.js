const id = (selector) => document.getElementById(selector);

const searchBtn = id('search-btn');

const proxy = 'https://proxy-requests.herokuapp.com/';


let latitude;
let longitude;

let cityId;


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function getPosition(position) {
    console.log(position);
    latitude = position.coords.latitude;
    console.log(latitude);
    longitude = position.coords.longitude; 
    console.log(longitude);

    const geoSearch = `https://www.metaweather.com/api/location/search/?lattlong=${latitude},${longitude}`;

    fetch(proxy+geoSearch) 
        .then( response => response.json() )
        .then( response => {
            console.log(response[0]);
            cityId = response[0].woeid;     
            showWeather(cityId);
        })
}

getLocation();































function showWeather(cityForDisplay) {

    const url = `https://www.metaweather.com/api/location/${cityId}/`;

    fetch(proxy+url) 
    .then( response => response.json() )
    .then( response => {
        const cityName = response.title; 
        const weather = response.consolidated_weather[0];
        const weatherIcon = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        const conditions = weather.weather_state_name;
        const tempNow = Math.floor(weather.the_temp);
        const wind = Math.floor(weather.wind_speed);
        const humidity = Math.floor(weather.humidity);
        const pressure = Math.floor(weather.air_pressure);
        const tempMin = Math.floor(weather.min_temp);
        const tempMax = Math.floor(weather.max_temp);

        id('city-name').innerHTML = cityName;
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
    })
}
// function call display default city
// showWeather(cityId);
   

// function call display search city
searchBtn.addEventListener('click', function() {

    const citySearch = id('search-value').value;
    const cityQuery = `https://www.metaweather.com/api/location/search/?query=${citySearch}`;
    
    fetch(proxy+cityQuery)
        .then( response => response.json() )
        .then( response => {
            if (response[0] == undefined) {
                id('city-name').innerHTML = `There is no ${citySearch} in our aplication`;
            } else {
                cityId = response[0].woeid;     
                showWeather(cityId);
            }   
        })

})