(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIdx) {
        return this.get(rowIdx);
      }, this);
    },

    togglePiece: function(rowIdx, colIdx) {
      this.get(rowIdx)[colIdx] = + !this.get(rowIdx)[colIdx];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIdx, colIdx) {
      return colIdx - rowIdx;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIdx, colIdx) {
      return colIdx + rowIdx;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIdx, colIdx) {
      return (
        this.hasRowConflictAt(rowIdx) ||
        this.hasColConflictAt(colIdx) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIdx, colIdx)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIdx, colIdx))
      );
    },
    // hasAnyRookConflictsOn: function(rowIdx, colIdx) {
    //   return (
    //     this.hasRowConflictAt(rowIdx) ||
    //     this.hasColConflictAt(colIdx) ||
    //     this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIdx, colIdx)) ||
    //     this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIdx, colIdx))
    //   );
    // },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIdx, colIdx) {
      return (
        0 <= rowIdx && rowIdx < this.get('n') &&
        0 <= colIdx && colIdx < this.get('n')
      );
    },



    hasRowConflictAt: function(rowIdx) {
      var rowCurrent = this.rows()[rowIdx];
      var results = [];
      for (var i = 0; i < rowCurrent.length; i++) {
        if (rowCurrent[i] === 1) {
          results.push(rowCurrent[i]);
        }
      }
      if (results.length > 1) {
        return true; // fixme
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var length = this.rows().length;
      for (var i = 0; i < length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },


    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIdx) {
      var length = this.rows().length;
      var results = [];
      for (var i = 0; i < length; i++) {
        var colSquare = this.rows()[i][colIdx];
        if (colSquare === 1) {
          results.push(colSquare);
        }
      }

      if (results.length > 1) {
        return true; // fixme
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var length = this.rows().length;
      for (var i = 0; i < length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var length = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = majorDiagonalColumnIndexAtFirstRow;

      for ( ; rowIdx < length && colIdx < length; rowIdx++, colIdx++ ) {
        if ( colIdx >= 0 ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;
    },


    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var length = this.get('n');

      for ( var i = 1 - length; i < length; i++ ) {
        if ( this.hasMajorDiagonalConflictAt(i) ) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var length = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = minorDiagonalColumnIndexAtFirstRow;

      for ( ; rowIdx < length && colIdx >= 0; rowIdx++, colIdx-- ) {
        if ( colIdx < length ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var length = this.get('n');

      for ( var i = (length * 2) - 1; i >= 0; i-- ) {
        if ( this.hasMinorDiagonalConflictAt(i) ) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
