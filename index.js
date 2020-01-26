const canvas = document.querySelector('#canvas');
const initialStateElements = document.querySelector('.initial-patterns').children;

const counter = document.querySelector('#counter');

const colorPickerAliveCell = document.getElementById('alive');
const colorPickerDeadCell = document.getElementById('dead');
const btnStart = document.querySelector('.btn-start');
const btnContinue = document.querySelector('.btn-continue');
const btnStop = document.querySelector('.btn-stop');
const numOfRowsElem = document.querySelector('#x-dimension');
const numOfColsElem = document.querySelector('#y-dimension');

let canvasSize = 600;
canvas.clientWidth = `${canvasSize}px`;
canvas.clientHeight = `${canvasSize}px`;
canvas.style.width = `${canvasSize}px`;
canvas.style.height = `${canvasSize}px`;
let ctx = canvas.getContext('2d');

let COLOR_ALIVE = colorPickerAliveCell.defaultValue;
let COLOR_DEAD = colorPickerDeadCell.defaultValue;

colorPickerAliveCell.addEventListener('change', (e) => {
  COLOR_ALIVE = e.target.value;
});

colorPickerDeadCell.addEventListener('change', (e) => {
  COLOR_DEAD = e.target.value;
});


class Cell {
  constructor(xSize, ySize, alive) {
    this.width = canvasSize / xSize;
    this.height = canvasSize / ySize;
    this.state = alive;
    this.newState = this.state;
    this.color = this.state === 'dead' ? COLOR_DEAD : COLOR_ALIVE;
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

const initialStates = [
  [10, 10, 12, 10, 12, 9, 12, 11, 11, 11],
  [10, 10, 11, 9, 12, 9, 13, 9, 14, 9, 14, 10, 14, 11, 13, 12, 10, 12],
  [10, 10, 11, 10, 10, 11, 13, 12, 13, 13, 12, 13],
  [10, 10, 11, 10, 11, 11, 16, 9, 15, 11, 16, 11, 17, 11],
  [10, 10, 9, 12, 10, 12, 12, 11, 13, 12, 14, 12, 15, 12],
  'random'
];
let choosenState;

let time = 0;
let interval;

let xSize = 56;
let ySize = 56;
let speed = 100;
let t = 3000;

let grid;



Array.prototype.forEach.call(initialStateElements, (state, index) => {
  state.style.background = `url(./images/${index + 1}.png) center no-repeat`;
  state.addEventListener('click', (e) => {
    clearInterval(interval);
    grid = [];
    for (let i = 0; i < xSize; i++) {
      grid.push([]);
      for (let j = 0; j < ySize; j++) {
        grid[i].push(new Cell(xSize, ySize, 'dead'));
      }
    }
    choosenState = initialStates[index];
    if (choosenState === 'random') {
      return console.log('cekaj');
    }
    for (let i = 0; i < choosenState.length; i += 2) {
      grid[choosenState[i]][choosenState[i + 1]].state = 'alive';
      grid[choosenState[i]][choosenState[i + 1]].newState = 'alive';
      grid[choosenState[i]][choosenState[i + 1]].color = COLOR_ALIVE;
    }
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        cell.draw(ctx, i * (canvasSize / xSize), j * (canvasSize / ySize));
      });
    });
    time = 0;
    interval = setInterval(() => {
      counter.textContent = `${++time}`;
      loop();
    }, speed);
  });

});


function loop() {
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      let countLiveNeighbours = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          let x = i + k;
          let y = j + l;
          if (x == -1) x = xSize - 1;
          if (x == xSize) x = 0;

          if (y == -1) y = ySize - 1;
          if (y == ySize) y = 0;

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
      cell.draw(ctx, i * (canvasSize / xSize), j * (canvasSize / ySize));
    });
  });
}

btnContinue.addEventListener('click', () => {
  if (time !== 0 && interval === undefined) {
    interval = setInterval(() => {
      counter.textContent = `${++time}`;
      loop();
    }, speed);
  }
});

btnStop.addEventListener('click', () => {
  interval = clearInterval(interval);
});
