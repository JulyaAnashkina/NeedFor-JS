'use strict'
const MAX_ENEMY = 7;

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');

const audio = document.createElement('audio');
// const audio = document.createElement('embed');
audio.src = './audio/audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = `position: absolute; 
                    top: -1000px;`;
// audio.style.display = 'none'; 
audio.volume = 0.1;

// gameArea.style.height = document.documentElement.clientHeight + 'px';
car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};
const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

const getQuantityElements = (heightElement) => {
    return document.documentElement.clientHeight / heightElement + 1; // 
}

const startGame = () => {
       audio.play();
    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.y = i * 100;
        line.style.top = line.y + 'px';
        gameArea.append(line);
        // gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.style.background = `transparent url(./img/enemy${randomEnemy}.png) center / cover no-repeat`;
        enemy.style.top = enemy.y + 'px';
        gameArea.append(enemy);
        // gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    // gameArea.appendChild(car);
    gameArea.append(car);
    // document.body.append(audio);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.bottom = '10px';
    car.style.top = 'auto';

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}
const startRun = (event) => {
    if (event.key !== 'F5' && event.key !== 'F12') {
        event.preventDefault();
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
        }
    }
}
const stopRun = (event) => {
    audio.pause();
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
}
const moveRoad = () => {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
        line.y += setting.speed;
        line.style.top = line.y + 'px';
    });
}
const moveEnemy = () => {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
        if (enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';

        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight + 'px';
        }
    });
}
const playGame = () => {
    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = 'SCORE: ' + setting.score;
        // score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < gameArea.clientWidth - 50) {
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < gameArea.clientHeight - 100) {
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
