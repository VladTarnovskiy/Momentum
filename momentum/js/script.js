// Time

const time = document.querySelector('.time')
const dateHere = document.querySelector('.date')



function showTime () {
    const date = new Date()
    const currentTime = date.toLocaleTimeString()
    time.textContent = currentTime
    setTimeout(showTime, 1000)
    showDate()
    showGreeting()
}

function showDate () {
    const date = new Date()
    const options = {weekday: 'long', month: 'long', day: 'numeric'}
    const currentDate = date.toLocaleDateString('en-US', options)
    dateHere.textContent = currentDate
}

//Greeting

const greeting = document.querySelector('.greeting')

function getTimeOfDay () {
    const date = new Date()
    const hours = date.getHours()
    let timeOfDay

    if (6 <=hours && hours< 12) {
        timeOfDay = 'Morning'
    } else if (12 <=hours && hours< 18) {
        timeOfDay = 'Day'
    } else if (18 <=hours && hours<= 24) {
        timeOfDay = 'Evening'
    } else if (0 <=hours && hours< 6) {
        timeOfDay = 'Night'
    }

    return timeOfDay
}

function showGreeting() {
    let greet = `Good ${getTimeOfDay()},`

    greeting.textContent = greet
}

showTime()

//Change background

const body = document.querySelector('body')
const slidePrev = document.querySelector('.slide-prev')
const slideNext = document.querySelector('.slide-next')
let randomNum = getRandomNum(20)

function getRandomNum (max) {
   return Math.floor(Math.random() * max)
}

function setBg () {
    let bgNum = randomNum.toString().padStart(2, "0")
    let timeOfDay = getTimeOfDay().toLowerCase()

    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
    img.onload = () => {      
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`
  }; 
}

setBg()

function getSlidePrev () {
    if (randomNum > 1){
        randomNum -= 1
    } else {
        randomNum = 20
    }
    
    setBg()
}

slidePrev.addEventListener('click', getSlidePrev)

function getSlideNext () {
    if (randomNum < 20){
        randomNum += 1
    } else {
        randomNum = 1
    }

    setBg()
}

slideNext.addEventListener('click', getSlideNext)

//Whether
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')
const weatherDescription = document.querySelector('.weather-description')
const city = document.querySelector('.city')
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')

async function getWeather () {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=bb636cf0c1822af0ffa882199590a0dd&units=metric`
    const res = await fetch(url)
    const data = await res.json()

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${data.wind.speed}m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
}

getWeather()


city.addEventListener('change', () => {
    getWeather()
})

//Quote

const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const buttonChangeQuote = document.querySelector('.change-quote')

async function getQuote () {
    const url = `/momentum/data/data.json`
    const res = await fetch(url)
    const data = await res.json()
    const randomQuoteNumber = getRandomNum(3)
    quote.textContent = `${data[randomQuoteNumber].text}`;
    author.textContent = `${data[randomQuoteNumber].author}`;
}

getQuote()


buttonChangeQuote.addEventListener('click', () => {
    getQuote()
})

//Local Storage
const name = document.querySelector('.name')

function setLocalStorage() {
    localStorage.setItem('name', name.value);
  }
  window.addEventListener('beforeunload', setLocalStorage)

  function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
  }
  window.addEventListener('load', getLocalStorage)
