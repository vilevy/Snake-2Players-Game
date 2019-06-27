/* eslint-disable max-len */
class GameController {
  constructor() {
    this.winnerContainer = document.querySelector('#winner-message');
    this.game1 = new Game('#first-canvas');
    this.game2 = new Game('#second-canvas');
    this.winnerH2 = document.createElement('div');
    this.winnerH2.innerHTML = '';
    this.endGame = false;

    this.score1Div = document.querySelector('#score1');
    this.score2Div = document.querySelector('#score2');
    this.players = document.querySelectorAll('.player-container');

    // update
    this.update = setInterval(() => {
      this.commands();
      this.checkEnemiesFruits();
      this.score1Div.innerHTML = this.game1.score;
      this.score2Div.innerHTML = this.game2.score;
      // this.drawObstaclesBothGames();
      this.checkEndGame();
    }, 16);
  }

  // drawObstaclesBothGames() {
  //   this.game1.drawObstacles(this.game2.obstaclesArr);
  //   this.game2.drawObstacles(this.game1.obstaclesArr);
  // }

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
          break;
        default:
          break;
      }
    };
  }

  writeWinner() {
    if (this.game1.gameOver && this.game2.gameOver) {
      if (this.game1.score > this.game2.score) {
        this.winnerH2.innerHTML = `PLAYER 1 WINS! <br> <span>${this.game1.score} x ${this.game2.score}</span>`;
      } else if (this.game1.score < this.game2.score) {
        this.winnerH2.innerHTML = `PLAYER 2 WINS! <br> <span>${this.game1.score} x ${this.game2.score}</span>`;
      } else {
        this.winnerH2.innerHTML = 'OH, YOU NEED ANOTHER ROUND!';
      }
      this.winnerContainer.insertBefore(this.winnerH2, this.winnerContainer.firstChild);
      this.winnerContainer.setAttribute('style', 'display: flex');
      this.score1Div.innerHTML = '';
      // this.score1Div.parentNode.removeChild(this.score1Div);
      // this.score2Div.parentNode.removeChild(this.score2Div);
      // this.game1.canvas.parentNode.removeChild(this.game1.canvas);
      // this.game2.canvas.parentNode.removeChild(this.game2.canvas);

      // this.players[0].parentNode.removeChild(this.players[0]);
      // this.players[1].parentNode.removeChild(this.players[1]);
    }
  }

  checkEndGame() {
    if (this.game1.gameOver && this.game2.gameOver) {
      clearInterval(this.update);
      setTimeout(() => this.writeWinner(), 500);
    }
  }
}

// const newGame = () => new GameController();
const btn = document.querySelector('button');

btn.onclick = () => {
  document.querySelector('#winner-message').setAttribute('style', 'display: none');
  document.querySelector('#winner-message').innerHTML = '<button>New Game</button>';
  document.querySelector('#winner-message').setAttribute('style', 'display: none');
  setTimeout(() => new GameController(), 3000);
};

window.onload = () => new GameController();

/* <div > Icons made by < a href = "https://www.flaticon.com/authors/darius-dan"
title = "Darius Dan" > Darius Dan < /a> from <a href="https:/ / www.flaticon.com / "
title="Flaticon ">www.flaticon.com</a> is licensed by <a href="http: //creativecommons.org/licenses/by/3.0/"
title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> */
