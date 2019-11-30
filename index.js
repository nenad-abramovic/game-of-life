let canvasSize = 500;
const app = document.querySelector('#app');
app.clientWidth = `${canvasSize}px`;
app.clientHeight = `${canvasSize}px`;
app.style.width = `${canvasSize}px`;
app.style.height = `${canvasSize}px`;
let ctx = app.getContext('2d');
const counter = document.querySelector('#counter');
let size = Number(prompt());
let t = 3000;

class Cell {
  constructor(size) {
    this.width = canvasSize / size;
    this.height = canvasSize / size;
    this.state = (Math.random() < 0.90) ? 'dead' : 'alive';
    this.newState = (Math.random() < 0.90) ? 'dead' : 'alive';
    this.color = this.state == 'dead' ? 'black' : 'white';
  }
  getState() {
    return this.state;
  }
  setNewState(newState) {
    this.newState = newState;
  }
  updateState() {
    this.state = this.newState;
    this.color = this.state == 'dead' ? 'black' : 'white';
  }
  draw(ctx, x, y) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
  }
}


let grid = [];

for (let i = 0; i < size; i++) {
  grid.push([]);
  for (let j = 0; j < size; j++) {
    grid[i].push(new Cell(size));
  }
}

function loop() {
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      let countLiveNeighbours = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          let x = i + k;
          let y = j + l;
          if (x == -1) x = size - 1;
          if (x == size) x = 0;

          if (y == -1) y = size - 1;
          if (y == size) y = 0;

          if (grid[x][y].getState() == 'alive') {
            countLiveNeighbours++;
          }
        }
      }
      if (cell.getState() == 'alive') {
        countLiveNeighbours--;
        if (countLiveNeighbours < 2 || countLiveNeighbours > 3) {
          cell.setNewState('dead');
        }
      } else {
        if (countLiveNeighbours == 3) {
          cell.setNewState('alive');
        }
      }
    });
  });
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      cell.updateState();
      cell.draw(ctx, i * (canvasSize / size), j * (canvasSize / size));
    });
  });
}

let time = 0;
let interval = setInterval(() => {
  counter.textContent = `${++time}/${t}`;
  loop();
  if (time == t) clearInterval(interval);
}, 100);
