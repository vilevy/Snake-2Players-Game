const canvas = document.querySelector('#main-canvas');
const cx = canvas.getContext('2d');
const canvasWidth = parseInt(canvas.getAttribute('width'), 10);
const canvasHeight = parseInt(canvas.getAttribute('height'), 10);

let gameStatus = true;

const snakeSize = 20;
const fruitSize = 10;

const fruitType = ['grow', 'blink', 'fast'];
let randType;
const fruitsArr = [];
let randX;
let randY;

let requestUpdate;

class Fruits {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  drawFruit() {
    cx.fillRect(this.x, this.y, fruitSize, fruitSize);
  }
}

class Snake {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.size = ['head'];
  }

  move() {
    switch (this.direction) {
      case 'up':
        this.y -= 5;
        break;
      case 'down':
        this.y += 5;
        break;
      case 'right':
        this.x += 5;
        break;
      case 'left':
        this.x -= 5;
        break;
      default:
        break;
    }
  }

  drawSnake() {
    if (this.x < 0) this.x = canvasWidth - 20;
    if ((this.x + snakeSize) > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight - 20;
    if ((this.y + snakeSize) > canvasHeight) this.y = 0;
    cx.fillRect(this.x, this.y, snakeSize, snakeSize);
  }
}

const player1 = new Snake((canvasWidth / 2), (canvasHeight / 2), 'up');

const eatFruit = () => {
  for (let i = 0; i < fruitsArr.length; i += 1) {
    if (player1.x <= (fruitsArr[i].x + fruitSize)
      && (player1.x + snakeSize) >= fruitsArr[i].x
      && player1.y <= (fruitsArr[i].y + fruitSize)
      && (player1.y + snakeSize) >= fruitsArr[i].y) {
      fruitsArr.splice(i, 1);
      console.log(fruitsArr.length);
    }
  }
};

const createFruits = () => {
  const randomNum = Math.floor(Math.random() * 6) + 4;
  for (let i = 0; i < randomNum; i += 1) {
    randX = Math.round(Math.random() * (canvasWidth - fruitSize) / 5) * 5;
    randY = Math.round(Math.random() * (canvasHeight - fruitSize) / 5) * 5;
    randType = Math.floor(Math.random() * fruitType.length);
    fruitsArr.push(new Fruits(randX, randY, fruitType[randType]));
  }
};


const updateCanvas = () => {
  if (gameStatus) {
    cx.clearRect(0, 0, canvasWidth, canvasHeight);
    eatFruit();
    if (fruitsArr.length === 0) createFruits();
    cx.fillStyle = 'red';
    fruitsArr.forEach((fruit) => {
      fruit.drawFruit();
    });
    player1.move();
    cx.fillStyle = 'black';
    player1.drawSnake();
    requestUpdate = window.requestAnimationFrame(updateCanvas);
  }
};

document.onkeydown = (e) => {
  switch (e.keyCode) {
    case 38:
      if (gameStatus) player1.direction = 'up';
      break;
    case 40:
      if (gameStatus) player1.direction = 'down';
      break;
    case 37:
      if (gameStatus) player1.direction = 'left';
      break;
    case 39:
      if (gameStatus) player1.direction = 'right';
      break;
    case 32:
      gameStatus = !gameStatus;
      updateCanvas();
      break;
    default:
      break;
  }
};




player1.drawSnake();
createFruits();
cx.fillStyle = 'red';
fruitsArr.forEach((fruit) => {
  fruit.drawFruit();
});

requestUpdate = window.requestAnimationFrame(updateCanvas);