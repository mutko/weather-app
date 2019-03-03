const cityId = 615702;
const proxy = 'https://proxy-requests.herokuapp.com/';
const url = `https://www.metaweather.com/api/location/${cityId}/`;


fetch(proxy+url) 
    .then( response => response.json() )
    .then( response => {
        console.log(response.consolidated_weather);
    })