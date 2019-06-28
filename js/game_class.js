/* eslint-disable max-len */
class Game {
  constructor(canvasId) {
    // canvas elements
    this.canvas = document.querySelector(canvasId);
    this.cx = this.canvas.getContext('2d');
    this.canvasWidth = parseInt(this.canvas.getAttribute('width'), 10);
    this.canvasHeight = parseInt(this.canvas.getAttribute('height'), 10);

    this.gameStatus = false;
    this.gameOver = false;
    this.frames = 0;
    this.speed = 5;
    this.score = 0;
    this.elementsSize = 20;


    // player elements
    this.player = new Snake((this.canvasWidth / 2), (this.canvasHeight / 2), this.elementsSize, this.canvasWidth, this.canvasHeight);

    // fruits elements
    this.fruitsArr = [];
    this.obstaclesArr = [];
    this.maxFruits = 3;
    this.createFruits('good');

    // enemy elements
    this.enemyFruitsArr = [];
    this.enemyFruitsCounter = 0;
    this.enemyObstaclesArr = [];

    // update
    this.update = setInterval(() => {
      this.updateCanvas();
    }, 16);
  }

  createFruits(type) {
    this.maxFruits = type === 'good' ? 3 : 1;
    for (let i = 0; i < this.maxFruits; i += 1) {
      const randX = Math.round(Math.random() * (this.canvasWidth - this.elementsSize) / this.elementsSize) * this.elementsSize;
      const randY = Math.round(Math.random() * (this.canvasHeight - this.elementsSize) / this.elementsSize) * this.elementsSize;
      const compareObj = {
        x: randX,
        y: randY,
      };
      const compareArr = [...this.fruitsArr, ...this.obstaclesArr, ...this.player.nodes];
      if (!compareArr.some(item => item.x === compareObj.x && item.y === compareObj.y)) {
        this.fruitsArr.push(new Fruits(randX, randY, type));
      } else {
        i -= 1;
      }
    }
  }

  eatFruit(result) {
    this.fruitsArr.splice(result[1], 1);

    if (result[0].type === 'good') {
      const sound = new Audio('sounds/bip1.mp3');
      sound.play();
      // const randX = Math.round(Math.random() * (this.canvasWidth - this.elementsSize) / this.elementsSize) * this.elementsSize;
      // const randY = Math.round(Math.random() * (this.canvasHeight - this.elementsSize) / this.elementsSize) * this.elementsSize;
      this.enemyFruitsCounter += 1;
    }

    if (result[0].type === 'bad') {
      const sound = new Audio('sounds/bip2.mp3');
      sound.play();
      const newObstacle = result[0];
      newObstacle.element = 'obstacle';
      // const randX = Math.round(Math.random() * (this.canvasWidth - this.elementsSize) / this.elementsSize) * this.elementsSize;
      // const randY = Math.round(Math.random() * (this.canvasHeight - this.elementsSize) / this.elementsSize) * this.elementsSize;
      this.obstaclesArr.push(newObstacle);
    }

    // this.player.nodes[this.player.nodes.length - 1].type = 'body';
    this.player.nodes.push(result[0]);
    this.player.nodes[this.player.nodes.length - 1].type = 'tail';
    this.player.nodes[this.player.nodes.length - 1].direction = [this.player.direction];
    // const newObs = { x: result[0].x, y: result[0].y, element: 'obstacle' };
    // this.obstaclesArr.push(newObs);
    this.score += 10;
  }

  checkCollision() {
    this.player.nextPosMethod();
    const newArr = [...this.fruitsArr, ...this.obstaclesArr, ...this.player.nodes];
    if (newArr.length === 597) {
      this.die();
    }
    let result;
    if (newArr.some(item => item.x === this.player.nextPos.x && item.y === this.player.nextPos.y)) {
      const idx = newArr.findIndex(item => item.x === this.player.nextPos.x && item.y === this.player.nextPos.y);
      let realIdx;
      if (idx < this.fruitsArr.length) {
        realIdx = idx;
        newArr[idx].element = 'fruit';
      } else if (idx >= this.fruitsArr.length && idx < (this.fruitsArr.length + this.obstaclesArr.length)) {
        realIdx = idx - this.fruitsArr.length;
        newArr[idx].element = 'obstacle';
      } else {
        realIdx = idx - (this.fruitsArr.length + this.obstaclesArr.length);
        newArr[idx].element = 'snake';
      }
      result = [newArr[idx], realIdx];
    } else {
      result = [''];
    }


    switch (result[0].element) {
      case undefined:
        this.player.setNewPos();
        break;
      case 'fruit':
        this.eatFruit(result);
        this.player.setNewPos();
        break;
      case 'obstacle':
        this.die();
        break;
      case 'snake':
        this.die();
        break;
      default:
        break;
    }
  }

  draw() {
    // draw fruits
    this.cx.save();
    this.cx.shadowColor = '#000';
    this.cx.shadowBlur = 10;
    this.cx.shadowOffsetX = 10;
    this.cx.shadowOffsetY = 10;
    for (let i = 0; i < this.fruitsArr.length; i += 1) {
      const fruitImg = new Image();
      fruitImg.src = (this.fruitsArr[i].type === 'good') ? 'img/watermelon.png' : 'img/poison.png';
      fruitImg.onload = this.cx.drawImage(fruitImg, this.fruitsArr[i].x, this.fruitsArr[i].y, this.elementsSize + 5, this.elementsSize + 5);
      // this.cx.fillStyle = (this.fruitsArr[i].type === 'good') ? '#a60000' : '#8c730e';
      // this.cx.fillRect(this.fruitsArr[i].x, this.fruitsArr[i].y, 20, 20);
    }
    this.cx.restore();

    // draw obstacles
    this.obstaclesArr.forEach((obstacle) => {
      this.cx.fillStyle = '#737373';
      this.cx.fillRect(obstacle.x, obstacle.y, this.elementsSize, this.elementsSize);
    });

    // draw snake

    // body
    this.cx.fillStyle = '#ffcc00';
    for (let i = 1; i < this.player.nodes.length; i += 1) {
      if (i === this.player.nodes.length - 1) this.cx.fillStyle = '#ffcc00';
      switch (this.player.nodes[i].direction.join('')) {
        case 'upup':
        case 'downdown':
          this.cx.fillRect(this.player.nodes[i].x, this.player.nodes[i].y, this.elementsSize, this.elementsSize);
          this.cx.lineWidth = 2;
          this.cx.strokeStyle = '#1a1a1a';
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x, this.player.nodes[i].y + this.elementsSize / 2);
          this.cx.lineTo(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y + this.elementsSize / 2);
          this.cx.stroke();
          this.cx.closePath();
          break;
        case 'leftleft':
        case 'rightright':
          this.cx.fillRect(this.player.nodes[i].x, this.player.nodes[i].y, this.elementsSize, this.elementsSize);
          this.cx.lineWidth = 2;
          this.cx.strokeStyle = '#1a1a1a';
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x + this.elementsSize / 2, this.player.nodes[i].y);
          this.cx.lineTo(this.player.nodes[i].x + this.elementsSize / 2, this.player.nodes[i].y + 20);
          this.cx.stroke();
          this.cx.closePath();
          break;
        case 'upleft':
        case 'rightdown':
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x, this.player.nodes[i].y + this.elementsSize);
          this.cx.arc(this.player.nodes[i].x, this.player.nodes[i].y + this.elementsSize, this.elementsSize, Math.PI * 1.5, 0, false);
          this.cx.closePath();
          this.cx.fill();
          this.cx.lineWidth = 2;
          this.cx.strokeStyle = '#1a1a1a';
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x, this.player.nodes[i].y + this.elementsSize);
          this.cx.lineTo(this.player.nodes[i].x + this.elementsSize / 2 + 4, this.player.nodes[i].y + this.elementsSize / 2 - 4);
          this.cx.stroke();
          this.cx.closePath();
          break;
        case 'upright':
        case 'leftdown':
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y + this.elementsSize);
          this.cx.arc(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y + this.elementsSize, this.elementsSize, Math.PI, Math.PI * 1.5, false);
          this.cx.closePath();
          this.cx.fill();
          this.cx.lineWidth = 2;
          this.cx.strokeStyle = '#1a1a1a';
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y + this.elementsSize);
          this.cx.lineTo(this.player.nodes[i].x + this.elementsSize / 2 - 4, this.player.nodes[i].y + this.elementsSize / 2 - 4);
          this.cx.stroke();
          this.cx.closePath();
          break;
        case 'downleft':
        case 'rightup':
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x, this.player.nodes[i].y);
          this.cx.arc(this.player.nodes[i].x, this.player.nodes[i].y, this.elementsSize, 0, Math.PI / 2, false);
          this.cx.closePath();
          this.cx.fill();
          this.cx.lineWidth = 2;
          this.cx.strokeStyle = '#1a1a1a';
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x, this.player.nodes[i].y);
          this.cx.lineTo(this.player.nodes[i].x + this.elementsSize / 2 + 4, this.player.nodes[i].y + this.elementsSize / 2 + 4);
          this.cx.stroke();
          this.cx.closePath();
          break;
        case 'downright':
        case 'leftup':
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y);
          this.cx.arc(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y, this.elementsSize, Math.PI / 2, Math.PI, false);
          this.cx.closePath();
          this.cx.fill();
          this.cx.lineWidth = 2;
          this.cx.strokeStyle = '#1a1a1a';
          this.cx.beginPath();
          this.cx.moveTo(this.player.nodes[i].x + this.elementsSize, this.player.nodes[i].y);
          this.cx.lineTo(this.player.nodes[i].x + this.elementsSize / 2 - 4, this.player.nodes[i].y + this.elementsSize / 2 + 4);
          this.cx.stroke();
          this.cx.closePath();
          break;
        default:
          break;
      }
    }

    // head
    this.cx.fillStyle = '#ffcc00';
    if (!this.gameStatus) this.cx.fillStyle = 'red';
    this.cx.beginPath();
    switch (this.player.nodes[0].direction[0]) {
      case 'up':
        if (this.player.nodes.length === 1) {
          this.cx.moveTo(this.player.nodes[0].x + this.elementsSize / 2, this.player.nodes[0].y + this.elementsSize * 2);
        }
        this.cx.arc(this.player.nodes[0].x + this.elementsSize / 2, this.player.nodes[0].y + this.elementsSize, this.elementsSize / 2, Math.PI, Math.PI * 2, false);
        break;
      case 'down':
        if (this.player.nodes.length === 1) {
          this.cx.moveTo(this.player.nodes[0].x + this.elementsSize / 2, this.player.nodes[0].y - this.elementsSize);
        }
        this.cx.arc(this.player.nodes[0].x + this.elementsSize / 2, this.player.nodes[0].y, this.elementsSize / 2, 0, Math.PI, false);
        break;
      case 'left':
        if (this.player.nodes.length === 1) {
          this.cx.moveTo(this.player.nodes[0].x + this.elementsSize * 2, this.player.nodes[0].y + this.elementsSize / 2);
        }
        this.cx.arc(this.player.nodes[0].x + this.elementsSize, this.player.nodes[0].y + this.elementsSize / 2, this.elementsSize / 2, Math.PI / 2, Math.PI * 1.5, false);
        break;
      case 'right':
        if (this.player.nodes.length === 1) {
          this.cx.moveTo(this.player.nodes[0].x - this.elementsSize, this.player.nodes[0].y + this.elementsSize / 2);
        }
        this.cx.arc(this.player.nodes[0].x, this.player.nodes[0].y + this.elementsSize / 2, this.elementsSize / 2, Math.PI * 1.5, Math.PI / 2, false);
        break;
      default:
        break;
    }

    this.cx.closePath();
    this.cx.fillStyle = '#ffcc00';
    this.cx.fill();
  }


  drawScore() {
    this.cx.font = '35px Verdana';
    this.cx.fillStyle = '#ffcc00';
    this.cx.fillText(`Score: ${this.score}`, 15, 50);
  }


  showGameScore() {
    // setTimeout(this.clearCanvas(), 2000);
    this.cx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    this.cx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    // this.cx.font = '22px Rubik Mono One';
    this.cx.textAlign = 'center';
    // this.cx.fillStyle = '#fff';
    // this.cx.fillText('Player 1', this.canvasWidth / 2, 100);
    this.cx.font = '30px Rubik Mono One';
    this.cx.fillStyle = '#ffcc00';
    this.cx.fillText('FINAL SCORE:', this.canvasWidth / 2, this.canvasHeight / 2 - 30);
    this.cx.fillText(this.score, this.canvasWidth / 2, this.canvasHeight / 2 + 15);
  }

  clearCanvas() {
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  die() {
    const soundGameOver = new Audio('sounds/gameover.mp3');
    soundGameOver.play();
    this.player.setNewPos();
    this.gameOver = true;
    clearInterval(this.update);
    this.draw();
    setTimeout(() => this.clearCanvas(), 200);
    setTimeout(() => this.showGameScore(), 210);
  }

  updateCanvas() {
    if (this.gameStatus) {
      this.frames += 1;
      if (this.frames % this.speed === 0) {
        this.clearCanvas();
        if (this.fruitsArr.length === 0) {
          this.createFruits('good');
        }
        this.checkCollision();
        if (!this.gameOver) {
          this.draw();
          // this.drawObstacles();
          // this.drawScore();
        }
      }
    }
  }
}

// const game = new Game('#first-canvas');
// const game2 = new Game('#second-canvas');
// setInterval(game.updateCanvas(), 16);

// setInterval(game2.updateCanvas(), 16);

// console.log(game.gameStatus);
// console.log(game.player.nodes[game.player.nodes.length - 1].type);

// console.log(game2);
// console.log(game.elementsSize);