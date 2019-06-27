class GameController {
  constructor() {
    this.game1 = new Game('#first-canvas');
    this.game2 = new Game('#second-canvas');

    this.endGame = false;

    // update
    this.update = setInterval(() => {
      this.commands();
      this.checkEnemiesFruits();
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

  checkEndGame() {
    if (this.game1.gameOver && this.game2.gameOver) {
      clearInterval(this.update);
    }
  }
}
const newGame = new GameController();
