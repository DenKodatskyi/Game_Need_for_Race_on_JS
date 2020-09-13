/* Game Need for Race on JavaScript */
/* VARIABLES */
const maxCars = 9;
const heightElem100 = 100;
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.game_area');
const topScore = document.querySelector('#topScore');
const car = document.createElement('div');

const audio = document.createElement('audio');

const iAmRock = new Audio('./src/assets/sound/iAmRock.mp3');
const crash = new Audio('./src/assets/sound/CRASH.wav');
let allow = false;
iAmRock.addEventListener('loadeddata', () => {
  allow = true;
});

car.classList.add('car');

gameArea.style.height = Math.floor(document.documentElement.clientHeight / heightElem100) * heightElem100;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  w: false,
  s: false,
  d: false,
  a: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0,
  level: 0,
};

let level = setting.level;

const getLocalStorage = () => {
  scoreLocalSt = parseInt(localStorage.getItem('race_score', setting.score));
}; 

topScore.textContent = getLocalStorage() ? getLocalStorage() : 0;
  
const addToLocalStorage = () => {
  const scoreLocalSt = getLocalStorage();
  if (!scoreLocalSt || scoreLocalSt < setting.score) {
    localStorage.setItem('race_score', setting.score);
    topScore.textContent = setting.score;
  }
};


/* FUNCTIONS */
const getQuantityElements = (heightElement) => {
  return (gameArea.offsetHeight / heightElement);
}

const startGame = (event) => {
  const target = event.target;

  if (target === start) return;
  switch (target.id) {
    case 'easy':
      setting.speed = 10;
      setting.traffic = 2;
      break;
    case 'medium':
      setting.speed = 14;
      setting.traffic = 1.8;
      break;
    case 'hard':
      setting.speed = 18;
      setting.traffic = 1.8;
      break;
  }

  start.classList.add('hide');
  gameArea.innerHTML = '';
  for (let i = 0; i < getQuantityElements(heightElem100) + 1; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * heightElem100}px`;
    line.style.height = (heightElem100 / 2) + 'px';
    line.y = i * heightElem100;
    gameArea.append(line);
  };
  for (let i = 0; i < getQuantityElements(heightElem100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    console.log('enemy: ', enemy);
    const randomCar = Math.floor(Math.random() * maxCars) + 1;
    enemy.classList.add('enemy');
    const periodEnemy = -heightElem100 * setting.traffic * (i + 1);
    enemy.y = periodEnemy < 100 ? -100 * setting.traffic * (i + 1) : periodEnemy;
    enemy.style.top = enemy.y + 'px';
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
    enemy.style.background = `transparent url(./src/assets/img/car${randomCar}.png) center / cover no-repeat`;
    gameArea.append(enemy);
  };
  if (allow) {
    iAmRock.play();
  }
  setting.start = true;
  gameArea.append(car);
  document.body.append(audio);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
};

const playGame = () => {
  setting.level = Math.floor(setting.score / 4000);
  if (setting.level !== level) {
    level = setting.level;
    setting.speed += 1;
  }
  if (setting.start) {
    setting.score += setting.speed;
    score.textContent = 'SCORE: ' + setting.score;
    moveRoad();
    moveEnemy();
    if ((keys.ArrowLeft || keys.a) && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if ((keys.ArrowRight || keys.d) && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }
    if ((keys.ArrowUp || keys.w) && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if ((keys.ArrowDown || keys.s) && setting.y > (gameArea.offsetHeight = car.offsetHeight)) {
      setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  } else {
    iAmRock.remove();
    crash.remove();
  }
};

const moveRoad = () => {
  let lines = document.querySelectorAll('.line');
  lines.forEach((line) => {
    line.y += setting.speed;
    line.style.top = line.y + 'px';
    if (line.y >= gameArea.offsetHeight) {
      line.y = -heightElem100;
    };
  });
};

const moveEnemy = () => {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach((item) => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if (carRect.top <= enemyRect.bottom &&
      carRect.right - 8 >= enemyRect.left &&
      carRect.left + 8 <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      iAmRock.pause();
      crash.play();
      console.log('CRASH!!!');
      start.classList.remove('hide');
      addToLocalStorage();
    }
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -heightElem100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
    }
  });
};

const startRun = (e) => {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
};

const stopRun = (e) => {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = false;
  }
};


/* EVENTS */
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
















