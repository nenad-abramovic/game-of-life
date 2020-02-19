const initialStateElements = document.querySelector('.initial-patterns').children;
const numOfRowsElem = document.querySelector('#x-dimension');
const numOfColsElem = document.querySelector('#y-dimension');
const colorPickerAliveCell = document.getElementById('alive');
const colorPickerDeadCell = document.getElementById('dead');
const xBoundaryConditionElem = document.querySelector('#x-boundary-conditions');
const yBoundaryConditionElem = document.querySelector('#y-boundary-conditions');
const speedChangeElem = document.querySelector('#speed');


colorPickerAliveCell.addEventListener('change', (e) => {
  updateColor({
    alive_cell_color: e.target.value,
    dead_cell_color: colorPickerDeadCell.value
  });
});

colorPickerDeadCell.addEventListener('change', (e) => {
  updateColor({
    alive_cell_color: colorPickerAliveCell.value,
    dead_cell_color: e.target.value
  });
});

numOfRowsElem.addEventListener('change', (e) => {
  updateGridSize({
    rows: e.target.value,
    cols: numOfColsElem.value
  });
});

numOfColsElem.addEventListener('change', (e) => {
  updateGridSize({
    rows: numOfRowsElem.value,
    cols: e.target.value
  });
});

speedChangeElem.addEventListener('change', (e) => {
  updateSpeed({
    speed: e.target.value
  });
});

xBoundaryConditionElem.addEventListener('change', (e) => {
  updateBoundaryConditions({
    x_boundary_condition: e.target.checked,
    y_boundary_condition: yBoundaryConditionElem.checked
  });
});

yBoundaryConditionElem.addEventListener('change', (e) => {
  updateBoundaryConditions({
    x_boundary_condition: xBoundaryConditionElem.checked,
    y_boundary_condition: e.target.checked
  });
});


Array.prototype.forEach.call(initialStateElements, (state, index) => {
  state.style.background = `url(./images/${index + 1}.png) center no-repeat`;

  state.addEventListener('click', () => {
    initializeGrid({
      initState: index
    });
  });
});