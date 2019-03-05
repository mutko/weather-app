const id = (selector) => document.getElementById(selector);

const proxy = 'https://proxy-requests.herokuapp.com/';
const mapBtn = id('map-btn')
const searchByEnterKey = id("search-value");
const searchBtn = id('search-btn');
const dailyBtn = id('daily');
const weeklyBtn = id('weekly');
const appHeader = id('app-header');
const weeklyWrapper = id('app-body__weekly-wrapper');

let bodyIcons = document.getElementsByClassName('app-body__icon');
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
           // console.log(response[0]);
            cityId = response[0].woeid;     
            displayWeather(cityId);
        })
}

function displayWeather(cityForDisplay) {

    const url = `https://www.metaweather.com/api/location/${cityId}/`;

    fetch(proxy+url) 
    .then( response => response.json() )
    .then( response => {
       // console.log(response);
        const weeklyWeather = response.consolidated_weather;

        const currentTime = response.time.substring(11,13);

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

        if ( currentTime > 6 && currentTime < 18 ) {
          appHeader.classList.add('app-header__day');
          for (let i = 0; i < bodyIcons.length; i++) {
            bodyIcons[i].classList.add('icons-bg__day');
          }

          appHeader.classList.remove('app-header__night');
          for (let i = 0; i < bodyIcons.length; i++) {
            bodyIcons[i].classList.remove('icons-bg__night');
          }

        } else {
          appHeader.classList.add('app-header__night');
          for (let i = 0; i < bodyIcons.length; i++) {
            bodyIcons[i].classList.add('icons-bg__night');
          }

          appHeader.classList.remove('app-header__day');
          for (let i = 0; i < bodyIcons.length; i++) {
            bodyIcons[i].classList.remove('icons-bg__day');
          }

        }

        mainTitle.innerHTML = cityName;

        id('temp').innerHTML = `${tempNow}<sup>o</sup>`;
        id('conditions').innerHTML = `<img src=${weatherIcon} alt="Weather conditions" class="weather-img"> 
                                        <span>${conditions}</span>
        `;
        id('wind').innerText = wind;
        id('humidity').innerText = humidity;
        id('pressure').innerText = pressure;
        id('temp-now').innerText = tempNow;
        id('temp-min').innerText = tempMin;        
        id('temp-max').innerText = tempMax;

        let weeklyWeatherPlaceholder = ``;
        

        for ( let i = 1; i < weeklyWeather.length; i++ ) {
          console.log( weeklyWeather[i] );
          weeklyWeatherPlaceholder += `
            <div class="weekly-data">
              <div>
                ${weeklyWeather[i].applicable_date}
              </div>
              <div>
                ${Math.floor(weeklyWeather[i].the_temp)}&#176;
              </div>
              <div>
                ${weeklyWeather[i].weather_state_name}
              </div>
              <img src="https://www.metaweather.com/static/img/weather/${weeklyWeather[i].weather_state_abbr}.svg" width="35">
            </div>
          `;
        }
        weeklyWrapper.innerHTML = "";
        weeklyWrapper.innerHTML += weeklyWeatherPlaceholder;

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
                id('conditions').innerHTML = "";
                id('temp').innerText = "";
                id('wind').innerText = "";
                id('humidity').innerText = "";
                id('pressure').innerText = "";
                id('temp-now').innerText = "";
                id('temp-min').innerText = "";        
                id('temp-max').innerText = "";
                weeklyWrapper.innerHTML = "No data to display";

                // appHeader.classList.remove('app-day');
                appHeader.classList.remove('app-header__night');
                appHeader.classList.remove('app-header__day');

                for (let i = 0; i < bodyIcons.length; i++) {
                  bodyIcons[i].classList.remove('icons-bg__day');
                  bodyIcons[i].classList.remove('icons-bg__night');
                }

            } else {
                cityId = response[0].woeid;     
                displayWeather(cityId);
            }   
        })
}

// function call display nearest city by default
getLocation();

mapBtn.addEventListener('click', getLocation);

searchBtn.addEventListener('click', findCityById);
searchByEnterKey.addEventListener("keydown", function(event) {
    if (event.which == 13 || event.keyCode == 13) {
        event.preventDefault();
        findCityById();
    }
});

weeklyBtn.addEventListener('click', function() {
  dailyBtn.classList.remove('active');
  this.classList.add('active');
  document.querySelector('.app-body__daily-wrapper').classList.add('active-not');
  id('app-body__weekly-wrapper').classList.remove('active-not');
})

dailyBtn.addEventListener('click', function() {
    weeklyBtn.classList.remove('active');
    this.classList.add('active');
    document.querySelector('.app-body__daily-wrapper').classList.remove('active-not');
    id('app-body__weekly-wrapper').classList.add('active-not');
  })