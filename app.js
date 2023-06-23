
const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', searchCity);
function searchCity(event) {
    event.preventDefault();
    const city = document.querySelector('#city-search-input').value;
    const apiKey = '6396472fe69db39bf65d5d4c15597f4c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeatherCondition);
    axios.get(apiUrl).then(getCoordinates);
}

function getCoordinates(coordinates){
    const apiKey = '397911865a408e6c7d71ebd32b1ffa7e';
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast)
}

function displayWeatherCondition(response){
    document.querySelector(".current-city").innerHTML = response.data.name;
    document.querySelector(".temp").innerHTML = Math.round(response.data.main.temp); 
    document.querySelector(".condition").innerHTML = response.data.weather[0].main;
    document.querySelector(".wind-speed").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector(".hum-condition").innerHTML = response.data.main.humidity;
    document.querySelector("#icon").setAttribute('src', `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    getCoordinates(response.data.coord);
}

const date = document.querySelector('.date');
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
date.innerHTML = `Today, ${day} ${months[month]}`;

function forecastDate(timestamp){
    const date = new Date(timestamp * 1000);
    const newFormatDate = date.toLocaleString("en-US", { month: "short", day: "numeric"});
    return newFormatDate;
}

function displayForecast(response){
    const forecast = response.data.daily.slice(0, 6);
    const divForecast = document.querySelector('.forecast');
    let forecastHTML = '';
    forecast.forEach(forecastDay => {
        forecastHTML += `
        <div class="forecast-day">
            <span class="weather-forecast-date">${forecastDate(forecastDay.dt)}</span>
            <img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="icon" class="weather-forecast-icon">
            <span class="weather-forecast-temp">${Math.round(forecastDay.temp.min)}°</span>
        </div>`;
    })
    divForecast.innerHTML = forecastHTML;
}


function defaultForecast(){
    navigator.geolocation.getCurrentPosition(function (position) {
        const apiKey = '397911865a408e6c7d71ebd32b1ffa7e';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(displayWeatherCondition)}, function (error){
            console.log('ошибка геолокации:',error);
            alert('ошибка геолокации');
        }
    )
}

defaultForecast();

