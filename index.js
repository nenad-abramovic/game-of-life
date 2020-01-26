const canvas = document.querySelector('#canvas');
const initialStateElements = document.querySelector('.initial-patterns').children;

const counter = document.querySelector('#counter');

const colorPickerAliveCell = document.getElementById('alive');
const colorPickerDeadCell = document.getElementById('dead');
const btnStart = document.querySelector('.btn-start');
const btnContinue = document.querySelector('.btn-continue');
const btnStop = document.querySelector('.btn-stop');

let canvasSize = 600;
canvas.clientWidth = `${canvasSize}px`;
canvas.clientHeight = `${canvasSize}px`;
canvas.style.width = `${canvasSize}px`;
canvas.style.height = `${canvasSize}px`;
let ctx = canvas.getContext('2d');

const initialStates = [1, 2, 3, 4, 5, 6];
let choosenState;

let time = 0;
let interval;

Array.prototype.forEach.call(initialStateElements, (state, index) => {
  state.addEventListener('click', (e) => {
    choosenState = initialStates[index];
    time = 0;
    interval = setInterval(() => {
      counter.textContent = `${++time}`;
      loop();
    }, 400);
  });

});

let size = 56;
let SPEED = 400;
let t = 3000;

let COLOR_ALIVE = colorPickerAliveCell.defaultValue;
let COLOR_DEAD = colorPickerDeadCell.defaultValue;

colorPickerAliveCell.addEventListener('change', (e) => {
  COLOR_ALIVE = e.target.value;
});

colorPickerDeadCell.addEventListener('change', (e) => {
  COLOR_DEAD = e.target.value;
});

class Cell {
  constructor(size) {
    this.width = canvasSize / size;
    this.height = canvasSize / size;
    this.state = (Math.random() < 0.50) ? 'dead' : 'alive';
    this.newState = (Math.random() < 0.50) ? 'dead' : 'alive';
    this.color = this.state == 'dead' ? COLOR_DEAD : COLOR_ALIVE;
  }
  getState() {
    return this.state;
  }
  setNewState(newState) {
    this.newState = newState;
  }
  updateState() {
    this.state = this.newState;
    this.color = this.state == 'dead' ? COLOR_DEAD : COLOR_ALIVE;
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

btnContinue.addEventListener('click', () => {
  if (time !== 0 && interval === undefined) {
    interval = setInterval(() => {
      counter.textContent = `${++time}`;
      loop();
    }, 400);
  }
});

btnStop.addEventListener('click', () => {
  interval = clearInterval(interval);
  console.log(interval)
});
