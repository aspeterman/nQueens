// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

var populateCheckers = function(n, majorDiags, minorDiags, rowChecker, colChecker) {
  for (var i = (-n + 1); i < n; i++) {
    majorDiags[i] = false;
  }
  for (var j = 0; j <= (n - 1) * 2; j++) {
    minorDiags[j] = false;
  }
  for (var k = 0; k < n; k++) {
    rowChecker.push(false);
    colChecker.push(false);
  }
};



window.findNRooksSolution = function(n) {
  var result = undefined; //fixme
  var board = new Board({'n': n});

  var repeat = function(board, j) {

    if (j >= n) {
      return true;
    }

    for (var i = 0; i < n; i++) {

      board.togglePiece(i, j);

      if (!board.hasRowConflictAt(i)) {
        if (repeat(board, j + 1) === true) {
          if (result === undefined) {
            result = board;
            done = true;
          }
          return true;
        }

      }
      board.togglePiece(i, j);
    }


    return false;
  };

  repeat(board, 0);
  result = result.rows();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(result));
  return result;
};


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var result = new Board({'n': n});
  var solutionCount = 0;

  var validRows = Array(n);
  var validCols = Array(n);
  validRows.fill(true);
  validCols.fill(true);

  var builder = function(tally) {
    var row = tally;

    if (tally === n) {
      solutionCount++;
      return;
    }

    for (var col = 0; col < n; col++) {
      if (validRows[row] && validCols[col]) {
        result.togglePiece(row, col);
        tally++;

        validRows[row] = false;
        validCols[col] = false;

        //if (!solution.hasAnyRooksConflictsOn(row, col)) {
        if (!result.hasColConflictAt(col) && !result.hasRowConflictAt(row)) {
          builder(tally);
        }

        validRows[row] = true;
        validCols[col] = true;

        result.togglePiece(row, col);
        tally--;
      }
    }
  };

  builder(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


window.findNQueensSolution = function(n) {
  var result = new Board({'n': n});

  var addPiece = function(tally) {
    var row = tally;

    if (tally === n) {
      return true;
    }

    for (var col = 0; col < n; col++) {
      result.togglePiece(row, col);
      tally++;

      if (!result.hasAnyQueenConflictsOn(row, col)) {
        if (addPiece(tally)) {
          return true;
        }
      }
      result.togglePiece(row, col);
      tally--;
    }
  };

  addPiece(0);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(result.rows()));
  return result.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var result = new Board({'n': n});
  var solutionCount = 0;

  var validRows = Array(n);
  var validCols = Array(n);
  validRows.fill(true);
  validCols.fill(true);

  var builder = function(tally) {
    var row = tally;

    if (tally === n) {
      solutionCount++;
      return;
    }

    for (var col = 0; col < n; col++) {
      if (validRows[row] && validCols[col]) {
        result.togglePiece(row, col);
        tally++;

        validRows[row] = false;
        validCols[col] = false;


        if (!result.hasAnyQueenConflictsOn(row, col)) {

          builder(tally);
        }
        validRows[row] = true;
        validCols[col] = true;
        result.togglePiece(row, col);
        tally--;
      }
    }
  };

  builder(0);

  console.log('Number of solutions for ' + n + ' :', solutionCount);
  return solutionCount;
};



