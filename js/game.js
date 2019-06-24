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
    this.size = [{
      scale: 20,
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
    }];
    this.fast = false;
  }

  move() {
    switch (this.direction) {
      case 'up':
        if (this.fast === false) this.y -= 20;
        if (this.fast === true) this.y -= 20;
        break;
      case 'down':
        if (this.fast === false) this.y += 20;
        if (this.fast === true) this.y += 20;
        break;
      case 'right':
        if (this.fast === false) this.x += 20;
        if (this.fast === true) this.x += 20;
        break;
      case 'left':
        if (this.fast === false) this.x -= 20;
        if (this.fast === true) this.x -= 20;
        break;
      default:
        break;
    }
  }

  setNewPos() {
    for (let i = 0; i < this.size.length; i += 1) {

      if (i > 0) {
        this.size[i].lastX = this.size[i].x;
        this.size[i].lastY = this.size[i].y;
        this.size[i].x = this.size[i - 1].lastX;
        this.size[i].y = this.size[i - 1].lastY;
      } else {
        this.size[i].lastX = this.size[i].x;
        this.size[i].lastY = this.size[i].y;
        this.size[i].x = this.x;
        this.size[i].y = this.y;
      }
    }
  };

  checkSuicide() {
    this.size.forEach((bodyNode) => {
      if (this.x < (bodyNode.x + snakeSize) &&
        (this.x + snakeSize) > bodyNode.x &&
        this.y < (bodyNode.x + snakeSize) &&
        (this.y + snakeSize) > bodyNode.x) {
      }
    });
  }

  drawSnake() {
    if (this.x < 0) this.x = canvasWidth - snakeSize;
    if ((this.x + snakeSize) > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight - snakeSize;
    if ((this.y + snakeSize) > canvasHeight) this.y = 0;
    // cx.fillStyle = 'black';
    this.setNewPos();
    cx.fillStyle = 'pink';
    cx.fillRect(this.x, this.y, snakeSize, snakeSize);
    cx.strokeStyle = 'orange';
    for (let i = 1; i < this.size.length; i += 1) {
      cx.fillStyle = 'black';
      cx.strokeRect(this.size[i].x, this.size[i].y, snakeSize, snakeSize);
      cx.fillRect(this.size[i].x, this.size[i].y, snakeSize, snakeSize);
    }
  }
}

const player1 = new Snake((canvasWidth / 2), (canvasHeight / 2), 'up');


const eatFruit = () => {
  for (let i = 0; i < fruitsArr.length; i += 1) {
    if (player1.x < (fruitsArr[i].x + fruitSize) &&
      (player1.x + snakeSize) > fruitsArr[i].x &&
      player1.y < (fruitsArr[i].y + fruitSize) &&
      (player1.y + snakeSize) > fruitsArr[i].y) {
      fruitsArr.splice(i, 1);
      player1.size.push({
        scale: 0,
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
      });
      console.log(player1.fast)
    }
  }
};

const createFruits = () => {
  const randomNum = Math.floor(Math.random() * 6) + 4;
  for (let i = 0; i < randomNum; i += 1) {
    randX = Math.round(Math.random() * (canvasWidth - fruitSize) / snakeSize) * snakeSize;
    randY = Math.round(Math.random() * (canvasHeight - fruitSize) / snakeSize) * snakeSize;
    randType = Math.floor(Math.random() * fruitType.length);
    fruitsArr.push(new Fruits(randX, randY, fruitType[randType]));
  }
};


const updateCanvas = () => {
  if (gameStatus) {
    cx.clearRect(0, 0, canvasWidth, canvasHeight);
    eatFruit();
    if (fruitsArr.length === 0) {
      createFruits();
      player1.fast = !player1.fast;
      setTimeout(() => {
        player1.fast = !player1.fast;
      }, 5000);
    }
    fruitsArr.forEach((fruit) => {
      if (fruit.type === 'grow') cx.fillStyle = 'red';
      if (fruit.type === 'blink') cx.fillStyle = 'orange';
      if (fruit.type === 'fast') cx.fillStyle = 'lightgreen';
      fruit.drawFruit();
    });
    player1.move();
    cx.fillStyle = 'black';
    player1.drawSnake();
    // requestUpdate = window.requestAnimationFrame(updateCanvas);
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

// requestUpdate = window.requestAnimationFrame(updateCanvas);

setInterval(updateCanvas, 60);
