const canvas = document.querySelector('#main-canvas');
const cx = canvas.getContext('2d');
const canvasWidth = parseInt(canvas.getAttribute('width'), 10);
const canvasHeight = parseInt(canvas.getAttribute('height'), 10);

let gameStatus = true;

let containsObstacle;

let containsAnythingArr = [];
let containsAnything;

let score = 0;

const snakeSize = 20;
const fruitSize = 20;

const fruitType = ['grow', 'blink', 'obstacle'];
let randType;
const fruitsArr = [];
let randX;
let randY;

const obstaclesArr = [];

// let requestUpdate;

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
    this.direction = direction;
    this.size = [{
      scale: 20,
      x: x,
      y: x,
      lastX: 0,
      lastY: 0,
    }];
  }

  move() {
    this.size[0].lastX = this.size[0].x;
    this.size[0].lastY = this.size[0].y;
    switch (this.direction) {
      case 'up':
        this.size[0].y -= 20;
        break;
      case 'down':
        this.size[0].y += 20;
        break;
      case 'right':
        this.size[0].x += 20;
        break;
      case 'left':
        this.size[0].x -= 20;
        break;
      default:
        break;
    }
    this.setNewPos();
  }

  setNewPos() {
    if (this.size[0].x < 0) this.size[0].x = canvasWidth - snakeSize;
    if ((this.size[0].x + snakeSize) > canvasWidth) this.size[0].x = 0;
    if (this.size[0].y < 0) this.size[0].y = canvasHeight - snakeSize;
    if ((this.size[0].y + snakeSize) > canvasHeight) this.size[0].y = 0;
    
    if (this.size.length > 1) {
      if (this.size[0].x === this.size[1].x && this.size[0].y === this.size[1].y) {
        this.size[0].x = this.size[1].x;
        this.size[0].y = this.size[1].y;
      } else {
        for (let i = 1; i < this.size.length; i += 1) {
          this.size[i].lastX = this.size[i].x;
          this.size[i].lastY = this.size[i].y;
          this.size[i].x = this.size[i - 1].lastX;
          this.size[i].y = this.size[i - 1].lastY;
        }
      }
    }

    
    // this.size.forEach((bodyNode) => {
    //   containsAnythingArr.push([bodyNode.x, bodyNode.y]);
    // });
  }


  drawSnake() {
    cx.strokeStyle = 'orange';
    cx.fillStyle = 'black';
    for (let i = 1; i < this.size.length; i += 1) {
      if (i === this.size.length -1) cx.fillStyle = 'darkgreen';
      cx.strokeRect(this.size[i].x, this.size[i].y, snakeSize, snakeSize);
      cx.fillRect(this.size[i].x, this.size[i].y, snakeSize, snakeSize);
    }
    cx.fillStyle = 'pink';
    cx.fillRect(this.size[0].x, this.size[0].y, snakeSize, snakeSize);
  }

  eatFruit() {
    for (let i = 0; i < fruitsArr.length; i += 1) {
      if (this.size[0].x < (fruitsArr[i].x + fruitSize) &&
        (this.size[0].x + snakeSize) > fruitsArr[i].x &&
        this.size[0].y < (fruitsArr[i].y + fruitSize) &&
        (this.size[0].y + snakeSize) > fruitsArr[i].y) {
        if (fruitsArr[i].type !== 'obstacle') {
          this.size.push({
            scale: 0,
            x: 0,
            y: 0,
            lastX: 0,
            lastY: 0,
          });
        } else {
          obstaclesArr.push({
            x: fruitsArr[i].x,
            y: fruitsArr[i].y
          });
        }
        fruitsArr.splice(i, 1);
        score += 10;
      }
    }
  }

  checkObstacleHit() {
    for (let i = 0; i < obstaclesArr.length; i += 1) {
      if (this.size[0].x === (obstaclesArr[i].x) &&
        (this.size[0].x) === obstaclesArr[i].x &&
        this.size[0].y === (obstaclesArr[i].y) &&
        (this.size[0].y) === obstaclesArr[i].y) {
        this.size.forEach((bodyNode) => {
          bodyNode.x = bodyNode.lastX;
          bodyNode.y = bodyNode.lastY;
        });
        this.size[0].x = this.size[0].x;
        this.size[0].y = this.size[0].y;
        gameStatus = !gameStatus;
      }
    }
  }

  checkSuicide() {
    if (this.size.length > 1) {
      for (let i = 1; i < this.size.length; i += 1) {
        if (this.size[0].x === (this.size[i].x) &&
          (this.size[0].y) === this.size[i].y) {
          gameStatus = !gameStatus;
        }
      }
    }
    if (!gameStatus) {
      this.size[0].x = this.size[0].lastX;
      this.size[0].y = this.size[0].lastY;
    }
  }
}

// CREATE FRUITS FUNCTION
const createFruits = () => {
  // const randomNum = Math.floor(Math.random() * 6) + 4;
  for (let i = 0; i < 6; i += 1) {
    randX = Math.round(Math.random() * (canvasWidth - fruitSize) / snakeSize) * snakeSize;
    randY = Math.round(Math.random() * (canvasHeight - fruitSize) / snakeSize) * snakeSize;
    randType = Math.floor(Math.random() * fruitType.length);
    // fruitsArr.push(new Fruits(randX, randY, fruitType[randType]));
    containsAnything = false;
    for (let j = 0; j < containsAnythingArr.length; j += 1) {
      if (randX < (containsAnythingArr[j][0] + fruitSize) &&
        (randX + snakeSize) > containsAnythingArr[j][0] &&
        randY < (containsAnythingArr[j][1] + fruitSize) &&
        (randY + snakeSize) > containsAnythingArr[j][1]) {
        containsAnything = true;
      }
    }
    if (containsAnything) {
      if (i === 0) {
        i = 0;
      } else {
        i -= 1;
      }
    } else {
      fruitsArr.push(new Fruits(randX, randY, fruitType[randType]));
      containsAnythingArr.push([randX, randY]);
    }
  }
  cx.fillStyle = 'red';
  fruitsArr.forEach((fruit) => {
    fruit.drawFruit();
  });
};

// DRAW OBSTACLES FUNCTION
const drawObstacles = () => {
  obstaclesArr.forEach((obstacle) => {
    cx.fillStyle = 'blue';
    cx.fillRect(obstacle.x, obstacle.y, snakeSize, snakeSize);
  });
};

// DRAW SCORE
const drawScore = () => {
  cx.font = '35px Verdana';
  cx.fillStyle = '#ffcc00';
  cx.fillText(`Score: ${score}`, 15, 50);
};

// DRAW SNAKE AND FRUITS
const player1 = new Snake((canvasWidth / 2), (canvasHeight / 2), 'up');
createFruits();

// PUSH TO CONTAINSANYTHINGARR
const checkPos = (arr) => {
  arr.forEach((element) => {
    containsAnythingArr.push([element.x, element.y]);
  });
};

const checkPosAll = (arr1, arr2, arr3) => {
  checkPos(arr1);
  checkPos(arr2);
  checkPos(arr3);
}


// requestUpdate = window.requestAnimationFrame(updateCanvas);
const updateCanvas = () => {
  if (gameStatus) {
    containsAnythingArr = [];
    cx.clearRect(0, 0, canvasWidth, canvasHeight);
    player1.eatFruit();
    drawObstacles();
    if (fruitsArr.length === 0) {
      createFruits();
    }
    fruitsArr.forEach((fruit) => {
      if (fruit.type === 'grow') cx.fillStyle = 'lightgreen';
      if (fruit.type === 'blink') cx.fillStyle = 'orange';
      if (fruit.type === 'obstacle') cx.fillStyle = 'red';
      fruit.drawFruit();
    });
    player1.move();
    player1.checkSuicide();
    player1.checkObstacleHit();
    cx.fillStyle = 'black';
    player1.drawSnake();
    drawScore();
    checkPosAll(obstaclesArr, fruitsArr, player1.size);
    // requestUpdate = window.requestAnimationFrame(updateCanvas);
  }
};

// KEYBOARD ACTIONS
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


setInterval(updateCanvas, 60);