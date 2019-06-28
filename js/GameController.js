/* eslint-disable max-len */
class GameController {
  constructor() {
    // html structure
    this.canvasContainer = document.querySelector('#canvas-container');
    this.winnerMessage = document.createElement('div');
    this.newGameBtn = document.createElement('button');
    this.winnerH2 = document.createElement('h2');
    this.playerContainer = '';
    this.playerNum = '';
    this.canvas = '';
    this.scoreDiv = '';
    this.playToStart = document.createElement('h4');
    this.pauseText = document.createElement('h4');

    // create canvas
    this.createCanvasStructure();

    this.soundtrack = new Audio('sounds/fun_level_(underscore)_proud_music_preview.mp3');

 
    // create players game
    this.game1 = new Game('#canvas1');
    this.game2 = new Game('#canvas2');

    // update
    this.update = setInterval(() => {
      this.commands();
      this.checkEnemiesFruits();
      document.querySelector('#score1').innerHTML = this.game1.score;
      document.querySelector('#score2').innerHTML = this.game2.score;
      this.checkEndGame();
    }, 16);
  }

  createMessageStructure() {
    this.canvasContainer.append(this.winnerMessage);
    this.winnerMessage.setAttribute('id', 'winner-message');
    this.winnerMessage.append(this.winnerH2);
    this.winnerMessage.append(this.newGameBtn);
    this.newGameBtn.innerHTML = 'New Game';
    this.newGameBtn.onclick = () => {
      this.removeCanvasStructure();
      setTimeout(() => new GameController(), 10);
    }
  }

  createCanvasStructure() {
    this.canvasContainer.appendChild(this.playToStart);
    this.playToStart.innerHTML = 'Press spacebar to start';
    for (let i = 1; i <= 2; i += 1) {
      this.playerContainer = document.createElement('div');
      this.canvasContainer.append(this.playerContainer);
      this.playerContainer.setAttribute('class', 'player-container');
      this.playerNum = document.createElement('h3');
      this.playerContainer.append(this.playerNum);
      this.playerNum.innerHTML = `Player ${i}`;
      this.canvas = document.createElement('canvas');
      this.playerContainer.append(this.canvas);
      this.canvas.setAttribute('id', `canvas${i}`);
      this.canvas.setAttribute('width', '400px');
      this.canvas.setAttribute('height', '600px');
      this.scoreDiv = document.createElement('div');
      this.playerContainer.append(this.scoreDiv);
      this.scoreDiv.setAttribute('id', `score${i}`);
    }
  }

  removeCanvasStructure() {
    this.canvasContainer.innerHTML = '';
  }

  writeWinner() {
    const sound = new Audio('sounds/cartoon_success.mp3');
    sound.play();
    if (this.game1.gameOver && this.game2.gameOver) {
      if (this.game1.score > this.game2.score) {
        this.winnerH2.innerHTML = `PLAYER 1 WINS!<br><span>${this.game1.score} x ${this.game2.score}</span>`;
      } else if (this.game1.score < this.game2.score) {
        this.winnerH2.innerHTML = `PLAYER 2 WINS!<br><span>${this.game1.score} x ${this.game2.score}</span>`;
      } else {
        this.winnerH2.innerHTML = 'OH, YOU NEED ANOTHER ROUND!<br><span>Prove you are better!</span>';
      }
    }
  }

  drawPause() {
    document.body.insertBefore(this.pauseText, document.body.firstChild);
    this.pauseText.innerHTML = '&#9646;&#9646<br>press spacebar to release';
  }

  checkEnemiesFruits() {
    if (this.game1.enemyFruitsCounter > 0) {
      this.game2.createFruits('bad');
      this.game1.enemyFruitsCounter -= 1;
    }

    if (this.game2.enemyFruitsCounter > 0) {
      this.game1.createFruits('bad');
      this.game2.enemyFruitsCounter -= 1;
    }
  }

  commands() {
    document.onkeydown = (e) => {
      switch (e.keyCode) {
        case 87:
          if (this.game1.gameStatus) this.game1.player.commands.push('up');
          break;
        case 83:
          if (this.game1.gameStatus) this.game1.player.commands.push('down');
          break;
        case 65:
          if (this.game1.gameStatus) this.game1.player.commands.push('left');
          break;
        case 68:
          if (this.game1.gameStatus) this.game1.player.commands.push('right');
          break;

        case 38:
          if (this.game2.gameStatus) this.game2.player.commands.push('up');
          break;
        case 40:
          if (this.game2.gameStatus) this.game2.player.commands.push('down');
          break;
        case 37:
          if (this.game2.gameStatus) this.game2.player.commands.push('left');
          break;
        case 39:
          if (this.game2.gameStatus) this.game2.player.commands.push('right');
          break;

        case 32:
          this.game1.gameStatus = !this.game1.gameStatus;
          this.game2.gameStatus = !this.game2.gameStatus;
          this.playToStart.remove();
          if (this.game1.gameStatus === false && this.game2.gameStatus === false) {
            this.drawPause();
            this.soundtrack.pause();
          }
          if (this.game1.gameStatus === true && this.game2.gameStatus === true && (this.game1.gameOver === false || this.game2.gameOver === false)) {
            this.pauseText.remove();
            this.soundtrack.play();
          }
          break;
        default:
          break;
      }
    };
  }


  checkEndGame() {
    if (this.game1.gameOver && this.game2.gameOver) {
      clearInterval(this.update);
      this.soundtrack.pause();
      setTimeout(() => this.removeCanvasStructure(), 100);
      setTimeout(() => this.createMessageStructure(), 110);
      setTimeout(() => this.writeWinner(), 120);
    }
  }
}

window.onload = () => new GameController();

/* <div > Icons made by < a href = "https://www.flaticon.com/authors/darius-dan"
title = "Darius Dan" > Darius Dan < /a> from <a href="https:/ / www.flaticon.com / "
title="Flaticon ">www.flaticon.com</a> is licensed by <a href="http: //creativecommons.org/licenses/by/3.0/"
title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> */