const id = (selector) => document.getElementById(selector);
const searchBtn = id('search-btn');
const mapBtn = id('map-btn')
const proxy = 'https://proxy-requests.herokuapp.com/';

let cityId;
let mainTitle = id('city-name');


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, showError);
  } else {
    mainTitle.innerHTML = "Location is not supported by browser.";
  }
}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        mainTitle.innerHTML = "Location denied. Try manual search."
        break;
      case error.POSITION_UNAVAILABLE:
        mainTitle.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        mainTitle.innerHTML = "Location request timed out."
        break;
      case error.UNKNOWN_ERROR:
        mainTitle.innerHTML = "An unknown error."
        break;
    }
  }

function getPosition(position) {

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude; 

    const geoSearch = `https://www.metaweather.com/api/location/search/?lattlong=${latitude},${longitude}`;

    fetch(proxy+geoSearch) 
        .then( response => response.json() )
        .then( response => {
            console.log(response[0]);
            cityId = response[0].woeid;     
            showWeather(cityId);
        })
}

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

        mainTitle.innerHTML = cityName;

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

function findCityById() {
    const citySearch = id('search-value').value;
    const cityQuery = `https://www.metaweather.com/api/location/search/?query=${citySearch}`;
    
    fetch(proxy+cityQuery)
        .then( response => response.json() )
        .then( response => {
            if (response[0] == undefined) {
                id('city-name').innerHTML = `Can't find ${citySearch} :(`;
            } else {
                cityId = response[0].woeid;     
                showWeather(cityId);
            }   
        })
}

// function call display nearest city
getLocation();

searchBtn.addEventListener('click', findCityById);

mapBtn.addEventListener('click', getLocation);