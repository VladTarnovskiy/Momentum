// Time
const time = document.querySelector(".time");
const dateHere = document.querySelector(".date");

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  setTimeout(showTime, 1000);
}

showTime();

function showDate(lang = "en") {
  const date = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const currentDate = date.toLocaleDateString(
    greetingTranslation[lang]["localDate"].toLocaleUpperCase(),
    options
  );
  dateHere.textContent = currentDate;
}

//Greeting and Translater
const english = document.querySelector(".english");
const russian = document.querySelector(".russian");

const greetingTranslation = {
  en: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good night",
    placeholder: "[Enter name]",
    localDate: "en-US",
    "wind speed": "Wind speed: ",
    humidity: "Humidity: ",
    "m/s": " m/s",
    "title-api": "Background source:",
    "Tag for API": "Tag for API:",
    "Hide element": "Hide elements:",
    todo: "Todo",
  },
  ru: {
    morning: "Доброе утро",
    afternoon: "Добрый день",
    evening: "Добрый вечер",
    night: "Доброй ночи",
    placeholder: "[Введите имя]",
    localDate: "ru-RU",
    "wind speed": "Скорость ветра: ",
    humidity: "Влажность: ",
    "m/s": " м/с",
    "title-api": "Источник фоновых изображений:",
    "Tag for API": "Тэги для поиска:",
    "Hide element": "Скрыть элементы:",
    todo: "Cписок дел",
  },
};

showDate();

const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const titleAPI = document.querySelector(".title-api");
const titleTagAPI = document.querySelector(".title-tag-api");
const hideElement = document.querySelector(".title-hide-element");

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  let timeOfDay;

  if (6 <= hours && hours < 12) {
    timeOfDay = "morning";
  } else if (12 <= hours && hours < 18) {
    timeOfDay = "afternoon";
  } else if (18 <= hours && hours <= 24) {
    timeOfDay = "evening";
  } else if (0 <= hours && hours < 6) {
    timeOfDay = "night";
  }
  return timeOfDay;
}

function showGreeting(lang = "en") {
  greeting.textContent = greetingTranslation[lang][getTimeOfDay()];
  name.placeholder = greetingTranslation[lang]["placeholder"];
  titleAPI.textContent = greetingTranslation[lang]["title-api"];
  titleTagAPI.textContent = greetingTranslation[lang]["Tag for API"];
  hideElement.textContent = greetingTranslation[lang]["Hide element"];
  callerTodo.textContent = greetingTranslation[lang]["todo"];

  if (lang == "ru") {
    russian.classList.add("active");
    english.classList.remove("active");
  } else {
    russian.classList.remove("active");
    english.classList.add("active");
  }
  localStorage.setItem("lang", lang);
}

//Change background
const body = document.querySelector("body");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
let randomNum = getRandomNum(19) + 1;
let currentApi = 0;
let tag;

function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

//Github
function getLinkToImagegithub() {
  let bgNum = randomNum.toString().padStart(2, "0");
  const img = new Image();

  img.src = `https://raw.githubusercontent.com/VladTarnovskiy/stage1-tasks/assets/images/${getTimeOfDay()}/${bgNum}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url('https://raw.githubusercontent.com/VladTarnovskiy/stage1-tasks/assets/images/${getTimeOfDay()}/${bgNum}.jpg')`;
  };
}

getLinkToImagegithub();

//Unsplash
async function getLinkToImageUs(tag) {
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${getTimeOfDay()}, ${tag}&client_id=ECUiydZwXI6wEs2xJwIF59HG_jIZnTyOxFNErJhxnEc`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    img.src = data.urls.regular;
    img.onload = () => {
      body.style.backgroundImage = `url('${data.urls.regular}')`;
    };
  } catch (err) {
    alert("Unsplash huor's limit exeed! Try in one hour please!!");
  }
  console.log(url);
}

//Flicker
async function getLinkToImageFl(tag) {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c8d7ef4034e937f3fd469f94389fa00f&tags=${getTimeOfDay()}, ${tag}&extras=url_h&format=json&nojsoncallback=1`;
  const res = await fetch(url);
  const data = await res.json();
  const photosObject = await data.photos.photo;
  let getRandomNumForFc = getRandomNum(100);
  const img = new Image();
  img.src = `https://farm${photosObject[getRandomNumForFc].farm}.staticflickr.com/${photosObject[getRandomNumForFc].server}/${photosObject[getRandomNumForFc].id}_${photosObject[getRandomNumForFc].secret}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url(https://farm${photosObject[getRandomNumForFc].farm}.staticflickr.com/${photosObject[getRandomNumForFc].server}/${photosObject[getRandomNumForFc].id}_${photosObject[getRandomNumForFc].secret}.jpg)`;
  };
  console.log(url);
}

function setBg(currentApi, tag) {
  localStorage.setItem("currentApi", currentApi);
  if (currentApi == 0) {
    getLinkToImagegithub();
  } else if (currentApi == 1) {
    getLinkToImageUs(tag);
  } else {
    getLinkToImageFl(tag);
  }
}

function getSlidePrev() {
  if (randomNum > 1) {
    randomNum -= 1;
  } else {
    randomNum = 20;
  }

  setBg(currentApi, tag);
}

function getSlideNext() {
  if (randomNum < 20) {
    randomNum += 1;
  } else {
    randomNum = 1;
  }

  setBg(currentApi, tag);
}

//Whether
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");

async function getWeather(lang = "en") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=bb636cf0c1822af0ffa882199590a0dd&units=metric`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.style.display = "block";
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${greetingTranslation[lang]["wind speed"]}${Math.round(
      data.wind.speed
    )}${greetingTranslation[lang]["m/s"]}`;
    humidity.textContent = `${
      greetingTranslation[lang]["humidity"]
    }${Math.round(data.main.humidity)}%`;
  } catch (err) {
    weatherIcon.style.display = "none";
    temperature.textContent = "City doesn't exist!";
    weatherDescription.textContent = "";
    wind.textContent = "";
    humidity.textContent = "";
  }
}

getWeather();

city.addEventListener("change", () => {
  getWeather();
});

russian.addEventListener("click", () => {
  showGreeting("ru");
  getWeather("ru");
  showDate("ru");
  getQuote("ru");
  quoteTranslate("ru");
});

english.addEventListener("click", () => {
  showGreeting("en");
  getWeather("en");
  showDate("en");
  getQuote("en");
  quoteTranslate("en");
});

//Quote
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const buttonChangeQuote = document.querySelector(".change-quote");

async function getQuote(lang = "en") {
  const url = `./js/${lang}data.json`;
  const res = await fetch(url);
  const data = await res.json();
  const randomQuoteNumber = getRandomNum(data.length);
  quote.textContent = `${data[randomQuoteNumber].text}`;
  author.textContent = `${data[randomQuoteNumber].author}`;
}

getQuote();

function quoteTranslate(lang = "en") {
  if (lang == "en") {
    buttonChangeQuote.addEventListener("click", () => {
      getQuote("en");
    });
  } else {
    buttonChangeQuote.addEventListener("click", () => {
      getQuote("ru");
    });
  }
}

//Audioplayer
import playList from "./playList.js";
const play = document.querySelector(".play");
const butNextAudio = document.querySelector(".play-next");
const butPrevAudio = document.querySelector(".play-prev");
const playerList = document.querySelector(".play-list");
const playerControls = document.querySelector(".player-controls");
const songName = document.querySelector(".song-name");
let isPlay = false;
let playNum = 0;
const audio = new Audio();
audio.src = playList[playNum].src;

function playAudio() {
  musicMarker();
  play.classList.add("pause");
  isPlay = true;
  audio.play();
}

function pauseAudio() {
  if ((isPlay = true)) {
    play.classList.remove("pause");
    playListItem.forEach((e) => e.classList.remove("item-active"));
    isPlay = false;
    audio.pause();
  }
}

play.addEventListener("click", () => {
  if (isPlay == false) {
    playAudio();
  } else {
    pauseAudio();
  }
});

function changeSongName() {
  songName.textContent = playList[playNum].title;
}

function playNext() {
  if (playNum < 3) {
    playNum += 1;
  } else {
    playNum = 0;
  }
  audio.src = playList[playNum].src;
  changeSongName(playNum);
  playAudio();
  musicMarker();
}
butNextAudio.addEventListener("click", playNext);
audio.addEventListener("ended", playNext);

function playPrev() {
  if (playNum > 0) {
    playNum -= 1;
  } else {
    playNum = 3;
  }
  audio.src = playList[playNum].src;
  changeSongName(playNum);
  playAudio();
  musicMarker();
}
butPrevAudio.addEventListener("click", playPrev);
changeSongName(playNum);

function musicMarker() {
  const li = document.querySelectorAll(".play-item");
  li.forEach((item, index) => {
    if (index == playNum) {
      item.classList.add("item-active");
    } else {
      item.classList.remove("item-active");
    }
  });
}

playList.forEach((item, index) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = playList[index].title;
  playerList.append(li);
});

const playListItem = document.querySelectorAll(".play-item");
playListItem.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    playNum = index;
    if (!e.target.classList.contains("item-active")) {
      audio.src = playList[playNum].src;
      playAudio();
      changeSongName();
    } else {
      pauseAudio();
    }
  });
});

//prefer Player
const audioPlayer = document.querySelector(".player");
audio.addEventListener(
  "loadeddata",
  () => {
    let musicTimer = document.querySelector(".length");
    musicTimer.textContent = getTimeCodeFromNum(audio.duration);
    audio.volume = 0.75;
  },
  false
);

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.querySelector(".volume-percentage").style.width =
      newVolume * 100 + "%";
  },
  false
);

setInterval(() => {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  const currentTimer = document.querySelector(".current");
  currentTimer.textContent = getTimeCodeFromNum(audio.currentTime);
}, 500);

document.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = document.querySelector(".volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});
//Settings
const closer = document.querySelector(".closer-svg");
const setting = document.querySelector(".setting");
const settingSvg = document.querySelector(".setting-svg-wrap");

const apiList = document.querySelectorAll(".api-item");
const github = document.querySelector(".github");
const unsplash = document.querySelector(".unsplash");
const flickr = document.querySelector(".flickr");

settingSvg.addEventListener("click", () => {
  setting.classList.add("center");
});

closer.addEventListener("click", () => {
  setting.classList.remove("center");
});

function changeApiMarker(currentApi = 0) {
  apiList.forEach((item, index) => {
    if (currentApi == index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

changeApiMarker();

github.addEventListener("click", () => {
  currentApi = 0;
  changeApiMarker(currentApi);
  setBg(currentApi);
});

unsplash.addEventListener("click", () => {
  currentApi = 1;
  changeApiMarker(currentApi);
  setBg(currentApi);
});

flickr.addEventListener("click", () => {
  currentApi = 2;
  changeApiMarker(currentApi);
  setBg(currentApi);
});

slidePrev.addEventListener("click", getSlidePrev);
slideNext.addEventListener("click", getSlideNext);

//API tag
const tagAnimal = document.querySelector("#animal");
const tagPeople = document.querySelector("#people");

tagAnimal.addEventListener("click", () => {
  tag = tagAnimal.value;
  setBg(currentApi, tag);
});

tagPeople.addEventListener("click", () => {
  tag = tagPeople.value;
  setBg(currentApi, tag);
});

//Hide block

const divTime = document.querySelector(".time");
const divDate = document.querySelector(".date");
const divGreeting = document.querySelector(".greeting-container");
const divQuote = document.querySelector(".footer");
const divWeather = document.querySelector(".weather");
const divPlayer = document.querySelector(".player");
const divTodo = document.querySelector(".call-todo");

const inputTime = document.querySelector("#time");
const inputDate = document.querySelector("#date");
const inputGreeting = document.querySelector("#greeting");
const inputQuote = document.querySelector("#quote");
const inputWeather = document.querySelector("#weather");
const inputPlayer = document.querySelector("#audio");
const inputTodo = document.querySelector("#todoDiv");
const formHideElements = document.querySelector(".form-hide-elements").elements;

let stime = true;
let sdate = true;
let sgreeting = true;
let squote = true;
let sweather = true;
let splayer = true;
let stodo = true;

const blocks = [
  [inputTime, divTime, stime],
  [inputDate, divDate, sdate],
  [inputGreeting, divGreeting, sgreeting],
  [inputQuote, divQuote, squote],
  [inputWeather, divWeather, sweather],
  [inputPlayer, divPlayer, splayer],
  [inputTodo, divTodo, stodo],
];

function hideElements() {
  blocks.forEach((item, index) => {
    item[0].addEventListener("change", () => {
      if (item[0].checked) {
        item[1].classList.add("hide");
        item[2] = false;
      } else {
        item[1].classList.remove("hide");
        item[2] = true;
      }
      localStorage.setItem(`block${index}`, item[2]);
    });
  });
}
hideElements();

// ToDo List
const todoButton = document.querySelector(".todo-button");
const outDiv = document.querySelector(".out");
const todoDiv = document.querySelector(".todo");
const closerTodo = document.querySelector(".icono-cross");
var todoList = [];

todoButton.addEventListener("click", () => {
  let todoText = document.querySelector(".in").value;
  let temp = {};
  temp.todo = todoText;
  temp.check = false;
  let i = todoList.length;
  todoList[i] = temp;
  out();
  localStorage.setItem("todo", JSON.stringify(todoList));
});

function out() {
  const outText = document.querySelector(".out");
  var out = "";
  for (let key in todoList) {
    if (todoList[key].check == true) {
      out += `<div><input type="checkbox" id=${key} class="did" checked><span class = "did">${todoList[key].todo}</span> <span class="closersign${key}" id="closersign">&#10006</span></div>`;
    } else {
      out += `<div><input type="checkbox" id=${key} class="did"><span>${todoList[key].todo}</span> <span id="closersign" class="closersign${key}">&#10006</span></div>`;
    }
  }
  outText.innerHTML = out;
}

outDiv.addEventListener("click", (event) => {
  let clickInput = event.target.id;
  let closerSign = event.target.className;
  todoList.forEach((item, index) => {
    if (`${index}` === clickInput) {
      item.check = !item.check;
    }
    if (`closersign${index}` == closerSign) {
      todoList.splice(index, 1);
    }
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
  out();
});

const callerTodo = document.querySelector(".call-todo");

callerTodo.addEventListener("click", () => {
  todoDiv.classList.add("appear-todo");
});

closerTodo.addEventListener("click", () => {
  todoDiv.classList.remove("appear-todo");
});

//Local Storage
function setLocalStorage() {
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
}

window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  let lang = localStorage.getItem("lang");
  let api = localStorage.getItem("currentApi");

  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }

  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }

  if (localStorage.getItem("currentApi")) {
    currentApi = localStorage.getItem("currentApi");
  }

  if (localStorage.getItem("todo")) {
    todoList = JSON.parse(localStorage.getItem("todo"));
    out();
  }

  if (localStorage.getItem("lang")) {
    showGreeting(lang);
    getWeather(lang);
    showDate(lang);
    getQuote(lang);
    quoteTranslate(lang);
  } else {
    showGreeting();
  }

  setBg(api);
  changeApiMarker(api);

  blocks.forEach((item, index) => {
    if (localStorage.getItem(`block${index}`) === "false") {
      item[1].classList.add("hide");
      item[0].checked = "checked";
    } else {
      item[1].classList.remove("hide");
    }
  });
}

window.addEventListener("load", getLocalStorage);
