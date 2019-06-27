/* eslint-disable max-len */
class Snake {
  constructor(x, y, size, canvasW, canvasH) {
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.direction = 'up';
    this.nextPos = {};
    this.size = size;
    this.nodes = [{
      x,
      y,
      direction: ['up'],
      type: 'head',
      element: 'snake',
    }];
    this.commands = [];
  }

  nextPosMethod() {
    this.nodes[this.nodes.length - 1].direction = [this.direction];
    if (this.commands.length > 0) {
      [this.direction] = this.commands;
      this.commands.shift();
    }
    switch (this.direction) {
      case 'up':
        this.nextPos.x = this.nodes[0].x;
        this.nextPos.y = this.nodes[0].y - this.size;
        break;
      case 'down':
        this.nextPos.x = this.nodes[0].x;
        this.nextPos.y = this.nodes[0].y + this.size;
        break;
      case 'right':
        this.nextPos.x = this.nodes[0].x + this.size;
        this.nextPos.y = this.nodes[0].y;
        break;
      case 'left':
        this.nextPos.x = this.nodes[0].x - this.size;
        this.nextPos.y = this.nodes[0].y;
        break;
      default:
        break;
    }
  }

  setNewPos() {
    if (this.nextPos.x < 0) this.nextPos.x = this.canvasW - this.size;
    if ((this.nextPos.x + this.size) > this.canvasW) this.nextPos.x = 0;
    if (this.nextPos.y < 0) this.nextPos.y = this.canvasH - this.size;
    if ((this.nextPos.y + this.size) > this.canvasH) this.nextPos.y = 0;

    this.nodes[0].direction.push(this.direction);
    this.nodes[0].type = 'body';
    this.nodes.pop(); // retira o último elemento do array
    this.nodes.unshift({
      x: this.nextPos.x,
      y: this.nextPos.y,
      direction: this.nextPos.direction,
    }); // adiciona um novo elemento no começo do array (com x e y do nextPos)
    this.nodes[0].type = 'body'; // muda o tipo do node para body
    this.nodes[0].direction = []; // adiciona direção
    this.nodes[0].direction.push(this.direction); // adiciona nova direção para o primeiro node do corpo
    this.nodes[0].type = 'head'; // adiciona tipo
    this.nodes[this.nodes.length - 1].type = this.nodes.length > 1 ? 'tail' : 'head'; // seta o último elemento como tail
  }
}

// checkCollision(arrFruits, arrObstacles) {
//   this.nextPos();
//   const newArr = [...arrFruits, ...arrObstacles, ...this.nodes];
//   if (newArr.some(item => item.x === this.nextPos.x && item.y === this.nextPos.y)) {
//     const idx = newArr.findIndex(item => item.x === this.nextPos.x && item.y === this.nextPos.y);
//     return [newArr[idx].type, idx];
//   }
//   return ['none', 'none'];
// }

// move() {
//   this.nextPos();
//   switch (this.checkCollision()[0]) {
//     case 'none':
//       this.setNewPos();
//       break;
//     case 'fruit':
//       this.eatFruit();
//       break;
//     case 'obstacle':
//       this.setNewPos();
//       break;
//     case 'snake':
//       this.setNewPos();
//       break;
//     default:
//       break;
//   }
// }

// eatFruit(arrFruits) {
//   this.nextPos();
//   if (this.checkCollision() === 'fruit') {
//     this.setNewPos();
//     arrFruits.splice(1, 1);
//   }
// }

// drawSnake() {
//   console.log('a');
// }

/* this.nodes.unshift({
  x: this.nodes[0].x,
  y: this.nodes[0].y -= 20,
  pos: [this.x, this.y + this.size, this.x + this.size, this.y],
  direction: this.direction,
  type: 'head',
}); */