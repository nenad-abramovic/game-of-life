const initialStates = [
  [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }, { x: 2, y: 2 }],
  [{ x: 1, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 4, y: 3 }, { x: 1, y: 3 }],
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
  [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 7, y: 0 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }],
  [{ x: 1, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }],
  'random'
];

const currentState = {
  grid: [],
  iterationCount: 0,
  timer: undefined,
  speed: parseInt(speedChangeElem.value, 10),
  rows: parseInt(numOfRowsElem.value, 10),
  cols: parseInt(numOfColsElem.value, 10),
  x_boundary_condition: xBoundaryConditionElem.checked,
  y_boundary_condition: yBoundaryConditionElem.checked,
  alive_cell_color: colorPickerAliveCell.defaultValue,
  dead_cell_color: colorPickerDeadCell.defaultValue
};

let futureState = Array(currentState.rows).fill([]).map(() =>
  Array(currentState.cols).fill(false)
);

currentState.grid = Array(currentState.rows).fill([]).map(() =>
  Array(currentState.cols).fill(false)
);

const subscribers = {
  initializeGrid: [],
  iterate: [],
  updateGridSize: [],
  updateColor: []
};

const updateColor = ({ alive_cell_color, dead_cell_color }) => {
  currentState.alive_cell_color = alive_cell_color;
  currentState.dead_cell_color = dead_cell_color;
  subscribers.updateColor.forEach(x => x());
};

const updateGridSize = ({ rows, cols }) => {
  clearInterval(currentState.timer);
  currentState.timer = undefined;
  currentState.rows = parseInt(rows, 10);
  currentState.cols = parseInt(cols, 10);

  futureState = Array(currentState.rows).fill([]).map(() =>
    Array(currentState.cols).fill(false)
  );

  currentState.grid.forEach((row, row_idx) =>
    row.forEach((cell, col_idx) => {
      if ((row_idx < futureState.length) && (col_idx < futureState[row_idx].length)) {
        futureState[row_idx][col_idx] = cell
      }
    }
    ));

  currentState.grid = Array(currentState.rows).fill([]).map(() =>
    Array(currentState.cols).fill(false)
  );

  futureState.forEach((row, row_idx) =>
    row.forEach((cell, col_idx) =>
      currentState.grid[row_idx][col_idx] = cell
    ));

  subscribers.updateGridSize.forEach(x => x());
};

const updateSpeed = ({ speed }) => {
  currentState.speed = parseInt(speed, 10);
  clearInterval(currentState.timer);
  currentState.timer = undefined;
  playGame();
};

const updateBoundaryConditions = ({ x_boundary_condition, y_boundary_condition }) => {
  currentState.x_boundary_condition = x_boundary_condition;
  currentState.y_boundary_condition = y_boundary_condition;
};

const initializeGrid = ({ initState }) => {
  clearInterval(currentState.timer);
  currentState.timer = undefined;
  currentState.iterationCount = 0;
  currentState.grid = new Array(currentState.rows).fill([]).map(x => {
    return new Array(currentState.cols).fill(false);
  });

  let choosenState = initialStates[initState];

  if (choosenState === 'random') {
    currentState.grid = currentState.grid.map((row) =>
      row.map(() => Math.random() > 0.2 ? false : true)
    );
  } else {
    for (let i = 0; i < choosenState.length; i++) {
      currentState.grid[choosenState[i].x + parseInt(currentState.rows / 2) - 4][choosenState[i].y + parseInt(currentState.cols / 2) - 2] = true;
    }
  }

  subscribers.initializeGrid.forEach(x => x());
  playGame();
};

const stopGame = () => {
  if (currentState.timer !== undefined) {
    clearInterval(currentState.timer);
    currentState.timer = undefined;
  }
};

const playGame = () => {
  if (currentState.timer === undefined) {
    currentState.timer = setInterval(() => {
      updateState();
      subscribers.iterate.forEach(x => x());
    }, currentState.speed);
  }
};

const updateState = () => {
  currentState.iterationCount++;

  for (let row_idx = 0; row_idx < currentState.rows; row_idx++) {
    for (let col_idx = 0; col_idx < currentState.cols; col_idx++) {
      let countLiveNeighbours = 0;

      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          let x = row_idx + k;
          let y = col_idx + l;

          if (currentState.x_boundary_condition) {
            if (x == -1) x = currentState.rows - 1;
            if (x == currentState.rows) x = 0;
          } else {
            if (x == -1) continue;
            if (x == currentState.rows) continue;
          }
          if (currentState.y_boundary_condition) {
            if (y == -1) y = currentState.cols - 1;
            if (y == currentState.cols) y = 0;
          } else {
            if (y == -1) continue;
            if (y == currentState.cols) continue;
          }
          if (currentState.grid[x][y]) {
            countLiveNeighbours++;
          }
        }
      }

      if (currentState.grid[row_idx][col_idx]) {
        countLiveNeighbours--;
        if (countLiveNeighbours < 2 || countLiveNeighbours > 3) {
          futureState[row_idx][col_idx] = false;
        } else {
          futureState[row_idx][col_idx] = true;
        }
      } else {
        if (countLiveNeighbours === 3) {
          futureState[row_idx][col_idx] = true;
        } else {
          futureState[row_idx][col_idx] = false;
        }
      }
    }
  }

  futureState.forEach((row, row_idx) => {
    row.forEach((cell, col_idx) => {
      currentState.grid[row_idx][col_idx] = cell;
    });
  });
};