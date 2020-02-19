const canvas = document.querySelector('#canvas');
const btnStop = document.querySelector('.btn-stop');
const btnContinue = document.querySelector('.btn-continue');
const iterationCounteElem = document.querySelector('#iteration-counter');

let ctx = canvas.getContext('2d');

btnContinue.addEventListener('click', playGame);
btnStop.addEventListener('click', stopGame);

subscribers.iterate.push(() => {
  draw();
  updateIterationCounter();
});

subscribers.initializeGrid.push(() => {
  clearCanvas();
  drawGrid();
  updateIterationCounter();
  draw();
});

subscribers.updateGridSize.push(() => {
  clearCanvas();
  drawGrid();
  draw();
});

subscribers.updateColor.push(() => {
  clearCanvas();
  drawGrid();
  draw();
});


const draw = () => {
  let cellWidth = canvas.clientWidth / currentState.rows;
  let cellHeight = canvas.clientHeight / currentState.cols;

  currentState.grid.forEach((row, row_idx) => {
    row.forEach((cell, col_idx) => {
      ctx.beginPath();
      if (cell) {
        ctx.fillStyle = currentState.alive_cell_color;
        ctx.fillRect(row_idx * cellWidth + 2, col_idx * cellHeight + 2, cellWidth - 4, cellHeight - 4);
      } else {
        ctx.fillStyle = currentState.dead_cell_color;
        ctx.fillRect(row_idx * cellWidth + 1, col_idx * cellHeight + 1, cellWidth - 2, cellHeight - 2);
      }
    });
  });
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawGrid = () => {
  let cellWidth = canvas.clientWidth / currentState.rows;
  let cellHeight = canvas.clientHeight / currentState.cols;
  for (let i = 0; i < canvas.clientWidth / cellWidth; i++) {
    for (let j = 0; j < canvas.clientHeight / cellHeight; j++) {
      ctx.beginPath();
      ctx.rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'lightgray';
      ctx.stroke();
    }
  }
  let img = canvas.toDataURL();
  canvas.style.background = `url(${img})`;
};

const updateIterationCounter = () => {
  iterationCounteElem.textContent = currentState.iterationCount;
};

drawGrid();