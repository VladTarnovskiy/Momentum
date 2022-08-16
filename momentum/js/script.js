// Time
const time = document.querySelector('.time')
const dateHere = document.querySelector('.date')

function showTime () {
    const date = new Date()
    const currentTime = date.toLocaleTimeString()
    time.textContent = currentTime
    setTimeout(showTime, 1000)
}

showTime()

function showDate (lang = 'en') {
    const date = new Date()
    const options = {weekday: 'long', month: 'long', day: 'numeric'}
    const currentDate = date.toLocaleDateString(greetingTranslation[lang]['localDate'].toLocaleUpperCase(), options)
    dateHere.textContent = currentDate
}

//Greeting and Translater
const english = document.querySelector('.english')
const russian = document.querySelector('.russian')

const greetingTranslation = {
    'en': {
        'morning': 'Good morning',
        'afternoon': 'Good afternoon',
        'evening': 'Good evening',
        'night': 'Good night',
        'placeholder': '[Enter name]',
        'localDate': 'en-US',
        'wind speed': 'Wind speed: ',
        'humidity': 'Humidity: ',
        'm/s': ' m/s',
        'title-api':'Background source:',
        'Tag for API':'Tag for API:',
        'Hide element':'Hide elements:'
    },
    'ru': {
        'morning': 'Доброе утро',
        'afternoon': 'Добрый день',
        'evening': 'Добрый вечер',
        'night': 'Доброй ночи',
        'placeholder': '[Введите имя]',
        'localDate': 'ru-RU',
        'wind speed': 'Скорость ветра: ',
        'humidity': 'Влажность: ',
        'm/s': ' м/с',
        'title-api':'Источник фоновых изображений:',
        'Tag for API':'Тэги для поиска:',
        'Hide element':'Скрыть элементы:'
    }
}

const greeting = document.querySelector('.greeting')
const name = document.querySelector('.name')
const titleAPI = document.querySelector('.title-api')
const titleTagAPI = document.querySelector('.title-tag-api')
const hideElement = document.querySelector('.title-hide-element')

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
    greeting.textContent = greetingTranslation[lang][getTimeOfDay()];
    name.placeholder = greetingTranslation[lang]['placeholder'];
    titleAPI.textContent = greetingTranslation[lang]['title-api'];
    titleTagAPI.textContent = greetingTranslation[lang]['Tag for API'];
    hideElement.textContent = greetingTranslation[lang]['Hide element'];

    if (lang == 'ru'){
        russian.classList.add('active');
        english.classList.remove('active');
    } else {
        russian.classList.remove('active');
        english.classList.add('active');
    }
      localStorage.setItem('lang', lang)
}

//Change background
const body = document.querySelector('body')
const slidePrev = document.querySelector('.slide-prev')
const slideNext = document.querySelector('.slide-next')
let randomNum = getRandomNum(19) + 1
let currentApi = 0
let tag 

function getRandomNum (max) {
   return Math.floor(Math.random() * max)
}

//Github
function getLinkToImagegithub () {
    let bgNum = randomNum.toString().padStart(2, "0")
    const img = new Image();

    img.src = `https://raw.githubusercontent.com/VladTarnovskiy/stage1-tasks/assets/images/${getTimeOfDay()}/${bgNum}.jpg`
    img.onload = () => {      
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/VladTarnovskiy/stage1-tasks/assets/images/${getTimeOfDay()}/${bgNum}.jpg')`
  }; 
}

getLinkToImagegithub ()

//Unsplash
async function getLinkToImageUs (tag) {
        const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${getTimeOfDay()}, ${tag}&client_id=ECUiydZwXI6wEs2xJwIF59HG_jIZnTyOxFNErJhxnEc`
    try {
        const res = await fetch(url)
        const data = await res.json()
        const img = new Image();
        img.src = data.urls.regular
        img.onload = () => {      
            body.style.backgroundImage = `url('${data.urls.regular}')`
    }
    } catch(err) {
        alert("Unsplash huor's limit exeed! Try in one hour please!!")
    }
    console.log(url)
}

//Flicker
async function getLinkToImageFl (tag) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c8d7ef4034e937f3fd469f94389fa00f&tags=${getTimeOfDay()}, ${tag}&extras=url_h&format=json&nojsoncallback=1`
    const res = await fetch(url)
    const data = await res.json()
    const photosObject = await data.photos.photo
    let getRandomNumForFc = getRandomNum(100)
    const img = new Image();
    img.src = `https://farm${photosObject[getRandomNumForFc].farm}.staticflickr.com/${photosObject[getRandomNumForFc].server}/${photosObject[getRandomNumForFc].id}_${photosObject[getRandomNumForFc].secret}.jpg`
    img.onload = () => {      
        body.style.backgroundImage = `url(https://farm${photosObject[getRandomNumForFc].farm}.staticflickr.com/${photosObject[getRandomNumForFc].server}/${photosObject[getRandomNumForFc].id}_${photosObject[getRandomNumForFc].secret}.jpg)`
  }; 
  console.log(url)
}

function setBg (currentApi, tag) {
    localStorage.setItem('currentApi', currentApi)
    if (currentApi == 0){
        getLinkToImagegithub()
    } else if (currentApi == 1) {
        getLinkToImageUs(tag)
    } else {
        getLinkToImageFl(tag)
    }
}

function getSlidePrev () {
    if (randomNum > 1){
        randomNum -= 1
    } else {
        randomNum = 20
    }
    
    setBg(currentApi, tag)
}



function getSlideNext () {
    if (randomNum < 20){
        randomNum += 1
    } else {
        randomNum = 1
    }

    setBg(currentApi, tag)
}



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
        wind.textContent = `${greetingTranslation[lang]['wind speed']}${Math.round(data.wind.speed)}${greetingTranslation[lang]['m/s']}`;
        humidity.textContent = `${greetingTranslation[lang]['humidity']}${Math.round(data.main.humidity)}%`;
    } catch(err) {
        alert('The city doesnt exist!')
    }
}

getWeather()

city.addEventListener('change', () => {
    getWeather()
})

russian.addEventListener('click', () => {
    showGreeting('ru')
    getWeather('ru')
    showDate('ru')
    getQuote('ru')
    quoteTranslate('ru')
} 
)

english.addEventListener('click', () => {
    showGreeting('en')
    getWeather('en')
    showDate('en')
    getQuote('en')
    quoteTranslate('en')
}
)

//Quote
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const buttonChangeQuote = document.querySelector('.change-quote')

async function getQuote (lang = 'en') {
    const url = `./js/${lang}data.json`
    const res = await fetch(url)
    const data = await res.json()
    const randomQuoteNumber = getRandomNum(data.length)
    quote.textContent = `${data[randomQuoteNumber].text}`;
    author.textContent = `${data[randomQuoteNumber].author}`;
}

getQuote ()

function quoteTranslate (lang = 'en') {
    if(lang == 'en'){
        buttonChangeQuote.addEventListener('click', () => {
            getQuote('en')
        })
    } else {
        buttonChangeQuote.addEventListener('click', () => {
            getQuote('ru')
        })
    }
}


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

//Settings
const closer = document.querySelector('.closer-svg')
const setting = document.querySelector('.setting')
const settingSvg = document.querySelector('.setting-svg-wrap')

const apiList = document.querySelectorAll('.api-item')
const github = document.querySelector('.github')
const unsplash = document.querySelector('.unsplash')
const flickr = document.querySelector('.flickr')

settingSvg.addEventListener('click', () => {
    setting.classList.add('center')
})

closer.addEventListener('click', () => {
    setting.classList.remove('center')
})


function changeApiMarker (currentApi = 0) {
    apiList.forEach((item, index) => {
        if (currentApi == index){
            item.classList.add('active')
        } else {
            item.classList.remove('active')
        }
    })
}

changeApiMarker()

github.addEventListener('click', () => {
    currentApi = 0
    changeApiMarker (currentApi)
    setBg(currentApi)
})

unsplash.addEventListener('click', () => {
    currentApi = 1
    changeApiMarker (currentApi)
    setBg(currentApi)
})

flickr.addEventListener('click', () => {
    currentApi = 2
    changeApiMarker (currentApi)
    setBg(currentApi)
})  

slidePrev.addEventListener('click', getSlidePrev)
slideNext.addEventListener('click', getSlideNext)
 
//API tag
const tagAnimal = document.querySelector('#animal')
const tagPeople = document.querySelector('#people')

tagAnimal.addEventListener ('click', () => {
    tag = tagAnimal.value
    setBg(currentApi, tag)
})

tagPeople.addEventListener ('click', () => {
    tag = tagPeople.value
    setBg(currentApi, tag)
})

//Hide block

const divTime = document.querySelector('.time')
const divDate = document.querySelector('.date')
const divGreeting = document.querySelector('.greeting-container')
const divQuote = document.querySelector('.footer')
const divWeather = document.querySelector('.weather')
const divPlayer = document.querySelector('.player')

const inputTime = document.querySelector('#time')
const inputDate = document.querySelector('#date')
const inputGreeting = document.querySelector('#greeting')
const inputQuote = document.querySelector('#quote')
const inputWeather = document.querySelector('#weather')
const inputPlayer = document.querySelector('#audio')
const formHideElements = document.querySelector('.form-hide-elements').elements

const blocks = [[inputTime, divTime], [inputDate, divDate], [inputGreeting, divGreeting], [inputQuote, divQuote], [inputWeather, divWeather], [inputPlayer, divPlayer]]

blocks.forEach((item) => { 
    item[0].addEventListener ('change', () => {
        item[1].classList.toggle('hide')
    })
})

// for (let i = 0; i < formHideElements.length; i++){
//     formHideElements[i].addEventListener('change', ()=>{
//         localStorage.setItem(formHideElements[i].name, formHideElements[i].checked)
//     })
// }

//Local Storage
function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
  }

window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    let lang = localStorage.getItem('lang')
    let api = localStorage.getItem('currentApi')

    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }

    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }

    if(localStorage.getItem('currentApi')) {
        currentApi = localStorage.getItem('currentApi');
    }

    if(localStorage.getItem('lang')) {
        showGreeting(lang)
        getWeather(lang)
        showDate(lang)
        getQuote(lang)
        quoteTranslate(lang)
    } else {    
        showGreeting()
    }
    // for (let i = 0; i < formHideElements.length; i++){
    //     formHideElements[i].checked = localStorage.getItem(formHideElements[i].name) === 'true' ? true : false;
    // }

   
    setBg(api)
    changeApiMarker(api)
}

window.addEventListener('load', getLocalStorage)

