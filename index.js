const app = document.querySelector('#app');
const counter = document.querySelector('#counter');
let size = Number(prompt());
let t = 300;

app.style.width = app.style.height = `${500 + size * 2}px`;

let cells = [];

for (let i = 0; i < size; i++) {
  cells.push([]);
  for (let j = 0; j < size; j++) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.width = cell.style.height = `${500 / size}px`;
    cells[i].push([cell, (Math.random() < 0.9) ? 'dead' : 'alive']);
    cells[i][j][0].style.backgroundColor = (cells[i][j][1] == 'dead') ? 'black' : 'white';
    app.appendChild(cell);
  }
}
function loop() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let countLiveNeighbours = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          if (cells[i + k] != undefined) {
            if (cells[i + k][j + l] != undefined) {
              if (cells[i + k][j + l][1] == 'alive') {
                countLiveNeighbours++;
              }
            }
          }
        }
      }
      if (cells[i][j][1] == 'alive') {
        countLiveNeighbours--;
        if (countLiveNeighbours < 2 || countLiveNeighbours > 3) {
          cells[i][j][1] = 'dead';
          cells[i][j][0].style.backgroundColor = 'black';
        }
      } else {
        if (countLiveNeighbours == 3) {
          cells[i][j][1] = 'alive';
          cells[i][j][0].style.backgroundColor = 'white';
        }
      }
    }
  }
}
let time = 0;
let interval = setInterval(() => {
  time++;
  counter.textContent = `${time}/${t}`;
  loop();
  if (time == t) clearInterval(interval);
}, 500);
