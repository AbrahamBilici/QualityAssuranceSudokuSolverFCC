'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  function parseCoordinate(coordinate) {
    const column = parseInt(coordinate.charCodeAt(0)) - 65;
    const row = parseInt(coordinate.substring(1)) - 1;
    return { row, column };
  }

  function isValidValue(value) {
    return /^[1-9]$/.test(value);
  }

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      const { row, column } = parseCoordinate(coordinate);

      if (isNaN(row) || isNaN(column) || row < 0 || row > 8 || column < 0 || column > 8) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!isValidValue(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const conflicts = [];

      const isRowValid = solver.checkRowPlacement(puzzle, row, column, value);
      if (!isRowValid) conflicts.push('row');

      const isColValid = solver.checkColPlacement(puzzle, row, column, value);
      if (!isColValid) conflicts.push('column');

      const isRegionValid = solver.checkRegionPlacement(puzzle, row, column, value);
      if (!isRegionValid) conflicts.push('region');



      if (puzzle[row * 9 + column] === value) {
        return res.json({ valid: true });
      }

      if (isRowValid && isColValid && isRegionValid) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflicts });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      const solution = solver.solve(puzzle);

      if (solution.error) {
        return res.json(solution);
      }

      return res.json({ solution });
    });
};
