// Time

const time = document.querySelector('.time')
const dateHere = document.querySelector('.date')



function showTime () {
    const date = new Date()
    const currentTime = date.toLocaleTimeString()
    time.textContent = currentTime
    setTimeout(showTime, 1000)
    showDate()
    
}

function showDate () {
    const date = new Date()
    const options = {weekday: 'long', month: 'long', day: 'numeric'}
    const currentDate = date.toLocaleDateString('en-US', options)
    dateHere.textContent = currentDate
}

//Greeting
const english = document.querySelector('.english')
const russian = document.querySelector('.russian')

const greetingTranslation = {
    'en': {
        'morning': 'Good morning',
        'afternoon': 'Good afternoon',
        'evening': 'Good evening',
        'night': 'Good night',
        'placeholder': '[Enter name]',
        'localDate': 'en-US'
    },
    'ru': {
        'morning': 'Доброе утро',
        'afternoon': 'Добрый день',
        'evening': 'Добрый вечер',
        'night': 'Доброй ночи',
        'placeholder': '[Введите имя]',
        'localDate': 'ru'
    }
}


const greeting = document.querySelector('.greeting')
const name = document.querySelector('.name')

function getTimeOfDay () {
    const date = new Date()
    const hours = date.getHours()
    let timeOfDay

    if (6 <=hours && hours< 12) {
        timeOfDay = 'morning'
    } else if (12 <=hours && hours< 18) {
        timeOfDay = 'afternoon'
    } else if (18 <=hours && hours<= 24) {
        timeOfDay = 'evening'
    } else if (0 <=hours && hours< 6) {
        timeOfDay = 'night'
    }

    return timeOfDay
}

function showGreeting(lang = 'en') {
    greeting.textContent = greetingTranslation[lang][getTimeOfDay()]
    name.placeholder = greetingTranslation[lang]['placeholder']

    if (lang == 'ru'){
        russian.classList.add('active');
        english.classList.remove('active');
    } else {
        russian.classList.remove('active');
        english.classList.add('active');
    }
      localStorage.setItem('lang', lang)
}
// запуск фнкции при загрузке???
showTime()

//Change background

const body = document.querySelector('body')
const slidePrev = document.querySelector('.slide-prev')
const slideNext = document.querySelector('.slide-next')
let randomNum = getRandomNum(19) + 1

function getRandomNum (max) {
   return Math.floor(Math.random() * max)
}

function setBg () {
    let bgNum = randomNum.toString().padStart(2, "0")
    let timeOfDay = getTimeOfDay().toLowerCase()

    const img = new Image();
    img.src = `https://raw.githubusercontent.com/VladTarnovskiy/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
    img.onload = () => {      
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/VladTarnovskiy/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`
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

async function getWeather (lang = 'en') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=bb636cf0c1822af0ffa882199590a0dd&units=metric`
    try{
        const res = await fetch(url)
        const data = await res.json()

        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)}m/s`;
        humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
    } catch(err) {
        alert('The city doesnt exist!')
    }
}

getWeather()


city.addEventListener('change', () => {
    getWeather()
})


russian.addEventListener('click', () => {
showGreeting('ru');
getWeather('ru')
} 
)
english.addEventListener('click', () => {
    showGreeting('en');
    getWeather('en')
}
)
//Quote

const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const buttonChangeQuote = document.querySelector('.change-quote')

async function getQuote () {
    const url = `/js/data.json`
    const res = await fetch(url)
    const data = await res.json()
    const randomQuoteNumber = getRandomNum(data.length)
    quote.textContent = `${data[randomQuoteNumber].text}`;
    author.textContent = `${data[randomQuoteNumber].author}`;
}

getQuote()


buttonChangeQuote.addEventListener('click', () => {
    getQuote()
})

//Audioplayer
import playList from './playList.js'
const play = document.querySelector('.play')
const butNextAudio = document.querySelector('.play-next')
const butPrevAudio = document.querySelector('.play-prev')
const playerList = document.querySelector('.play-list')
const playerControls = document.querySelector('.player-controls')
let isPlay = false
let playNum = 0
const audio = new Audio();

function playAudio () {
    audio.src = playList[playNum].src
    audio.currentTime = 0;
    play.classList.add('pause')
    isPlay = true
    audio.play()
    
}

function pauseAudio (){
    if (isPlay == true){
        play.classList.remove('pause')
        isPlay = false
        audio.pause();
    }
}

play.addEventListener('click', () => {
    if (isPlay == false){
        playAudio()
    } else {
        pauseAudio()
    }
})

function playNext (){
    if (playNum < 3){
        playNum += 1
    } else {
        playNum = 0
    }
    playAudio()
}
butNextAudio.addEventListener('click', playNext)
audio.addEventListener('ended', playNext)
// При окончании трека глючит маркер

function playPrev (){
    if (playNum > 0){
        playNum -= 1
    } else {
        playNum = 3
    }
    playAudio()
}
butPrevAudio.addEventListener('click', playPrev)

playList.forEach((item, index) => {
    const li = document.createElement('li')
    li.classList.add('play-item')
    li.textContent = playList[index].title
    playerControls.addEventListener('click', () => {
        if (index == playNum){
            li.classList.add('item-active')
        } else {
            li.classList.remove('item-active')
        }
    })
    
    playerList.append(li)
})

//Translater



//Local Storage

function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
  }

window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    let lang = localStorage.getItem('lang')

    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }

    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }

    showGreeting(lang)
    getWeather(lang)

}

window.addEventListener('load', getLocalStorage)
