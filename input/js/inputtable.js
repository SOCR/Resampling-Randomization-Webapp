
(function ($) {
  "use strict";
  
    $.fn.inputtable = function (action, options) {
    var i, ilen, args, output = [];
    if (typeof action !== 'string') { //init
      options = action;
      return this.each(function () {
        var $this = $(this);
        if ($this.data("inputtable")) {
          instance = $this.data("inputtable");
          instance.updateSettings(options);
        }
        else {
          var currentSettings = $.extend({}, settings), instance;
          if (options) {
            $.extend(currentSettings, options);
          }
          instance = new inputtable($this, currentSettings);
          $this.data("inputtable", instance);
          instance.init();
        }
      });
    }
    else {
      args = [];
      if (arguments.length > 1) {
        for (i = 1, ilen = arguments.length; i < ilen; i++) {
          args.push(arguments[i]);
        }
      }
      this.each(function () {
        output = $(this).data("inputtable")[action].apply(this, args);
      });
      return output;
    }
  };
  

  function inputtable(container, settings) {
    this.container = container;

    var priv, datamap, grid, selection, keyboard, editproxy, highlight, autofill, interaction, self = this;

    priv = {
      settings: settings,
      isMouseOverTable: false,
      isMouseDown: false,
      isCellEdited: false,
      selStart: null,
      selEnd: null,
      editProxy: false,
      table: null,
      isPopulated: null,
      rowCount: 0,
      colCount: 0,
      scrollable: null,
      hasLegend: null
    };

    var lastChange = '';

    datamap = {
      data: [],

      /**
       * Creates row at the bottom of the data array
       * @param {Object} [coords] Optional. Coords of the cell before which the new row will be inserted
       */
      createRow: function (coords) {
        var row = [];
        for (var c = 0; c < priv.colCount; c++) {
          row.push('');
        }
        if (!coords || coords.row >= priv.rowCount) {
          datamap.data.push(row);
        }
        else {
          datamap.data.splice(coords.row, 0, row);
        }
      },

      /**
       * Creates col at the right of the data array
       * @param {Object} [coords] Optional. Coords of the cell before which the new column will be inserted
       */
      createCol: function (coords) {
        var r = 0;
        if (!coords || coords.col >= priv.colCount) {
          for (; r < priv.rowCount; r++) {
            datamap.data[r].push('');
          }
        }
        else {
          for (; r < priv.rowCount; r++) {
            datamap.data[r].splice(coords.col, 0, '');
          }
        }
      },

      /**
       * Removes row at the bottom of the data array
       * @param {Object} [coords] Optional. Coords of the cell which row will be removed
       * @param {Object} [toCoords] Required if coords is defined. Coords of the cell until which all rows will be removed
       */
      removeRow: function (coords, toCoords) {
        if (!coords || coords.row === priv.rowCount - 1) {
          datamap.data.pop();
        }
        else {
          datamap.data.splice(coords.row, toCoords.row - coords.row + 1);
        }
      },

      /**
       * Removes col at the right of the data array
       * @param {Object} [coords] Optional. Coords of the cell which col will be removed
       * @param {Object} [toCoords] Required if coords is defined. Coords of the cell until which all cols will be removed
       */
      removeCol: function (coords, toCoords) {
        var r = 0;
        if (!coords || coords.col === priv.colCount - 1) {
          for (; r < priv.rowCount; r++) {
            datamap.data[r].pop();
          }
        }
        else {
          var howMany = toCoords.col - coords.col + 1;
          for (; r < priv.rowCount; r++) {
            datamap.data[r].splice(coords.col, howMany);
          }
        }
      },

      /**
       * Returns single value from the data array
       * @param {Number} row
       * @param {Number} col
       */
      get: function (row, col) {
        return datamap.data[row] ? datamap.data[row][col] : void 0; //void 0 produces undefined
      },

      /**
       * Saves single value to the data array
       * @param {Number} row
       * @param {Number} col
       * @param {String} value
       */
      set: function (row, col, value) {
        datamap.data[row][col] = value;
      },

      /**
       * Clears the data array
       */
      clear: function () {
        for (var r = 0; r < priv.rowCount; r++) {
          for (var c = 0; c < priv.colCount; c++) {
            datamap.data[r][c] = '';
          }
        }
      },

      /**
       * Returns the data array
       * @return {Array}
       */
      getAll: function () {
        return datamap.data;
      },

      /**
       * Returns data range as array
       * @param {Object} start Start selection position
       * @param {Object} end End selection position
       * @return {Array}
       */
      getRange: function (start, end) {
        var r, rlen, c, clen, output = [], row;
        rlen = Math.max(start.row, end.row);
        clen = Math.max(start.col, end.col);
        for (r = Math.min(start.row, end.row); r <= rlen; r++) {
          row = [];
          for (c = Math.min(start.col, end.col); c <= clen; c++) {
            row.push(datamap.data[r][c]);
          }
          output.push(row);
        }
        return output;
      },

      /**
       * Return data as text (tab separated columns)
       * @param {Object} start (Optional) Start selection position
       * @param {Object} end (Optional) End selection position
       * @return {String}
       */
      getText: function (start, end) {
        var data = datamap.getRange(start, end), text = '', r, rlen, c, clen;
        for (r = 0, rlen = data.length; r < rlen; r++) {
          for (c = 0, clen = data[r].length; c < clen; c++) {
            if (c > 0) {
              text += "\t";
            }
            text += data[r][c];
          }
          text += "\n";
        }
        return text;
      }
    };

    this.grid = grid = {
      /**
       * Alter grid
       * @param {String} action Possible values: "insert_row", "insert_col", "remove_row", "remove_col"
       * @param {Object} coords
       * @param {Object} [toCoords] Required only for actions "remove_row" and "remove_col"
       */
      alter: function (action, coords, toCoords) {
        var oldData, newData, changes, r, rlen, c, clen;
        oldData = $.extend(true, [], datamap.getAll());

        switch (action) {
          case "insert_row":
            datamap.createRow(coords);
            grid.createRow(coords);
            break;

          case "insert_col":
            datamap.createCol(coords);
            grid.createCol(coords);
            break;

          case "remove_row":
            datamap.removeRow(coords, toCoords);
            grid.removeRow(coords, toCoords);
            grid.keepEmptyRows();
            break;

          case "remove_col":
            datamap.removeCol(coords, toCoords);
            grid.removeCol(coords, toCoords);
            grid.keepEmptyRows();
            break;
        }

        changes = [];
        newData = datamap.getAll();
        for (r = 0, rlen = newData.length; r < rlen; r++) {
          for (c = 0, clen = newData[r].length; c < clen; c++) {
            changes.push([r, c, oldData[r] ? oldData[r][c] : null, newData[r][c]]);
          }
        }
        self.container.triggerHandler("datachange.inputtable", [changes, 'alter']);
      },

      /**
       * Creates row at the bottom of the <table>
       * @param {Object} [coords] Optional. Coords of the cell before which the new row will be inserted
       */
      createRow: function (coords) {
        var tr, c, r;
        tr = document.createElement('tr');
        for (c = 0; c < priv.colCount; c++) {
          tr.appendChild(document.createElement('td'));
        }
        if (!coords || coords.row >= priv.rowCount) {
          priv.tableBody.appendChild(tr);
          r = priv.rowCount;
        }
        else {
          var oldTr = grid.getCellAtCoords(coords).parentNode;
          priv.tableBody.insertBefore(tr, oldTr);
          r = coords.row;
        }
        priv.rowCount++;
        for (c = 0; c < priv.colCount; c++) {
          grid.updateLegend({row: r, col: c});
        }
      },

      /**
       * Creates col at the right of the <table>
       * @param {Object} [coords] Optional. Coords of the cell before which the new column will be inserted
       */
      createCol: function (coords) {
        var trs = priv.tableBody.childNodes, r, c;
        if (!coords || coords.col >= priv.colCount) {
          for (r = 0; r < priv.rowCount; r++) {
            trs[r].appendChild(document.createElement('td'));
          }
          c = priv.colCount;
        }
        else {
          for (r = 0; r < priv.rowCount; r++) {
            trs[r].insertBefore(document.createElement('td'), grid.getCellAtCoords({row: r, col: coords.col}));
          }
          c = coords.col;
        }
        priv.colCount++;
        for (r = 0; r < priv.rowCount; r++) {
          grid.updateLegend({row: r, col: c});
        }
      },

      /**
       * Removes row at the bottom of the <table>
       * @param {Object} [coords] Optional. Coords of the cell which row will be removed
       * @param {Object} [toCoords] Required if coords is defined. Coords of the cell until which all rows will be removed
       */
      removeRow: function (coords, toCoords) {
        if (!coords || coords.row === priv.rowCount - 1) {
          $(priv.tableBody.childNodes[priv.rowCount - 1]).remove();
          priv.rowCount--;
        }
        else {
          for (var i = toCoords.row; i >= coords.row; i--) {
            $(priv.tableBody.childNodes[i]).remove();
            priv.rowCount--;
          }
        }
      },

      /**
       * Removes col at the right of the <table>
       * @param {Object} [coords] Optional. Coords of the cell which col will be removed
       * @param {Object} [toCoords] Required if coords is defined. Coords of the cell until which all cols will be removed
       */
      removeCol: function (coords, toCoords) {
        var trs = priv.tableBody.childNodes;
        var r = 0;
        if (!coords || coords.col === priv.colCount - 1) {
          for (; r < priv.rowCount; r++) {
            $(trs[r].childNodes[priv.colCount - 1]).remove();
          }
          priv.colCount--;
        }
        else {
          for (; r < priv.rowCount; r++) {
            for (var i = toCoords.col; i >= coords.col; i--) {
              $(trs[r].childNodes[i]).remove();
            }
          }
          priv.colCount -= toCoords.col - coords.col + 1;
        }
      },

      /**
       * Makes sure there are empty rows at the bottom of the table
       * @return recreate {Boolean} TRUE if row or col was added or removed
       */
      keepEmptyRows: function () {
        var rows, r, c, clen, emptyRows = 0, emptyCols = 0, rlen, recreateRows = false, recreateCols = false;

        var $tbody = $(priv.tableBody);

        //count currently empty rows
        rows = datamap.getAll();
        rlen = rows.length;
        rows : for (r = rlen - 1; r >= 0; r--) {
          for (c = 0, clen = rows[r].length; c < clen; c++) {
            if (rows[r][c] !== '') {
              break rows;
            }
          }
          emptyRows++;
        }

        //should I add empty rows to meet minSpareRows?
        if (priv.rowCount < priv.settings.rows || emptyRows < priv.settings.minSpareRows) {
          for (; priv.rowCount < priv.settings.rows || emptyRows < priv.settings.minSpareRows; emptyRows++) {
            datamap.createRow();
            grid.createRow();
            recreateRows = true;
          }
        }

        //should I add empty rows to meet minHeight
        //WARNING! jQuery returns 0 as height() for container which is not :visible. this will lead to a infinite loop
        if (priv.settings.minHeight) {
          if ($tbody.height() > 0 && $tbody.height() <= priv.settings.minHeight) {
            while ($tbody.height() <= priv.settings.minHeight) {
              datamap.createRow();
              grid.createRow();
              recreateRows = true;
            }
          }
        }

        //count currently empty cols
        rows = datamap.getAll();
        rlen = rows.length;
        if (rlen > 0) {
          clen = rows[0].length;
          cols : for (c = clen - 1; c >= 0; c--) {
            for (r = 0; r < rlen; r++) {
              if (rows[r][c] !== '') {
                break cols;
              }
            }
            emptyCols++;
          }
        }

        //should I add empty cols to meet minSpareCols?
        if (priv.colCount < priv.settings.cols || emptyCols < priv.settings.minSpareCols) {
          for (; priv.colCount < priv.settings.cols || emptyCols < priv.settings.minSpareCols; emptyCols++) {
            datamap.createCol();
            grid.createCol();
            recreateCols = true;
          }
        }

        //should I add empty rows to meet minWidth
        //WARNING! jQuery returns 0 as width() for container which is not :visible. this will lead to a infinite loop
        if (priv.settings.minWidth) {
          if ($tbody.width() > 0 && $tbody.width() <= priv.settings.minWidth) {
            while ($tbody.width() <= priv.settings.minWidth) {
              datamap.createCol();
              grid.createCol();
              recreateCols = true;
            }
          }
        }

        if (!recreateRows) {
          for (; ((priv.settings.rows && priv.rowCount > priv.settings.rows) && (priv.settings.minSpareRows && emptyRows > priv.settings.minSpareRows) && (!priv.settings.minHeight || $tbody.height() - $tbody.find('tr:last').height() - 4 > priv.settings.minHeight)); emptyRows--) {
            grid.removeRow();
            datamap.removeRow();
            recreateRows = true;
          }
        }

        if (recreateRows && priv.selStart) {
          //if selection is outside, move selection to last row
          if (priv.selStart.row > priv.rowCount - 1) {
            priv.selStart.row = priv.rowCount - 1;
            if (priv.selEnd.row > priv.selStart.row) {
              priv.selEnd.row = priv.selStart.row;
            }
          } else if (priv.selEnd.row > priv.rowCount - 1) {
            priv.selEnd.row = priv.rowCount - 1;
            if (priv.selStart.row > priv.selEnd.row) {
              priv.selStart.row = priv.selEnd.row;
            }
          }
        }

        if (!recreateCols) {
          for (; ((priv.settings.cols && priv.colCount > priv.settings.cols) && (priv.settings.minSpareCols && emptyCols > priv.settings.minSpareCols) && (!priv.settings.minWidth || $tbody.width() - $tbody.find('tr:last').find('td:last').width() - 4 > priv.settings.minWidth)); emptyCols--) {
            datamap.removeCol();
            grid.removeCol();
            recreateCols = true;
          }
        }

        if (recreateCols && priv.selStart) {
          //if selection is outside, move selection to last row
          if (priv.selStart.col > priv.colCount - 1) {
            priv.selStart.col = priv.colCount - 1;
            if (priv.selEnd.col > priv.selStart.col) {
              priv.selEnd.col = priv.selStart.col;
            }
          } else if (priv.selEnd.col > priv.colCount - 1) {
            priv.selEnd.col = priv.colCount - 1;
            if (priv.selStart.col > priv.selEnd.col) {
              priv.selStart.col = priv.selEnd.col;
            }
          }
        }

        if (recreateRows || recreateCols) {
          selection.refreshBorders();
        }

        return (recreateRows || recreateCols);
      },

      /**
       * Update legend
       */
      updateLegend: function (coords) {
        if (priv.settings.legend || priv.hasLegend) {
          var $td = $(grid.getCellAtCoords(coords));
          $td.removeAttr("style").removeAttr("title").removeData("readOnly");
          $td[0].className = '';
        }
        if (priv.settings.legend) {
          for (var j = 0, jlen = priv.settings.legend.length; j < jlen; j++) {
            var legend = priv.settings.legend[j];
            if (legend.match(coords.row, coords.col, self.getData)) {
              priv.hasLegend = true;
              typeof legend.style !== "undefined" && $td.css(legend.style);
              typeof legend.readOnly !== "undefined" && $td.data("readOnly", legend.readOnly);
              typeof legend.title !== "undefined" && $td.attr("title", legend.title);
              typeof legend.className !== "undefined" && $td.addClass(legend.className);
            }
          }
        }
      },

      /**
       * Is cell writeable
       */
      isCellWriteable: function ($td) {
        if (priv.isPopulated && $td.data("readOnly")) {
          return false;
        }
        return true;
      },

      /**
       * Populate cells at position with 2d array
       * @param {Object} start Start selection position
       * @param {Array} input 2d array
       * @param {Object} end End selection position (only for drag-down mode)
       * @return {Object} ending td in pasted area
       */
      populateFromArray: function (start, input, end) {
        var r, rlen, c, clen, td, endTd, changes = [], current = {};
        rlen = input.length;
        if (rlen === 0) {
          return false;
        }
        current.row = start.row;
        current.col = start.col;
        for (r = 0; r < rlen; r++) {
          if (end && current.row > end.row) {
            break;
          }
          current.col = start.col;
          clen = input[r] ? input[r].length : 0;
          for (c = 0; c < clen; c++) {
            if (end && current.col > end.col) {
              break;
            }
            td = grid.getCellAtCoords(current);
            if (grid.isCellWriteable($(td))) {
              changes.push([current.row, current.col, datamap.get(current.row, current.col), input[r][c]]);
            }
            current.col++;
            if (end && c === clen - 1) {
              c = -1;
            }
          }
          current.row++;
          if (end && r === rlen - 1) {
            r = -1;
          }
        }
        if (priv.settings.onBeforeChange && changes.length) {
          var result = priv.settings.onBeforeChange(changes);
          if (result === false) {
            return grid.getCellAtCoords(start);
          }
        }
        for (var i = 0, ilen = changes.length; i < ilen; i++) {
          if (end && (changes[i][0] > end.row || changes[i][1] > end.col)) {
            continue;
          }
          if (changes[i][3] === false) {
            continue;
          }
          endTd = self.setDataAtCell(changes[i][0], changes[i][1], changes[i][3]);
        }
        if (changes.length) {
          self.container.triggerHandler("datachange.inputtable", [changes, 'populateFromArray']);
        }
        setTimeout(function () {
          var result = grid.keepEmptyRows();
          if (!result) {
            selection.refreshBorders();
          }
        }, 100);
        return endTd || grid.getCellAtCoords(start);
      },

      /**
       * Clears all cells in the grid
       */
      clear: function () {
        var tds = grid.getAllCells();
        for (var i = 0, ilen = tds.length; i < ilen; i++) {
          $(tds[i]).empty();
          grid.updateLegend(grid.getCellCoords(tds[i]));
        }
      },

      /**
       * Returns coordinates given td object
       */
      getCellCoords: function (td) {
        return {
          row: td.parentNode.rowIndex,
          col: td.cellIndex
        };
      },

      /**
       * Returns td object given coordinates
       */
      getCellAtCoords: function (coords) {
        if (coords.row < 0 || coords.col < 0) {
          return null;
        }
        var tr = priv.tableBody.childNodes[coords.row];
        if (tr) {
          return tr.childNodes[coords.col];
        }
        else {
          return null;
        }
      },

      /**
       * Returns the top left (TL) and bottom right (BR) selection coordinates
       * @param {Object[]} coordsArr
       * @returns {Object}
       */
      getCornerCoords: function (coordsArr) {
        function mapProp(func, array, prop) {
          function getProp(el) {
            return el[prop];
          }

          if (Array.prototype.map) {
            return func.apply(Math, array.map(getProp));
          }
          return func.apply(Math, $.map(array, getProp));
        }

        return {
          TL: {
            row: mapProp(Math.min, coordsArr, "row"),
            col: mapProp(Math.min, coordsArr, "col")
          },
          BR: {
            row: mapProp(Math.max, coordsArr, "row"),
            col: mapProp(Math.max, coordsArr, "col")
          }
        };
      },

      /**
       * Returns array of td objects given start and end coordinates
       */
      getCellsAtCoords: function (start, end) {
        var corners = grid.getCornerCoords([start, end]);
        var r, c, output = [];
        for (r = corners.TL.row; r <= corners.BR.row; r++) {
          for (c = corners.TL.col; c <= corners.BR.col; c++) {
            output.push(grid.getCellAtCoords({
              row: r,
              col: c
            }));
          }
        }
        return output;
      },

      /**
       * Returns all td objects in grid
       */
      getAllCells: function () {
        var tds = [], trs, r, rlen, c, clen;
        trs = priv.tableBody.childNodes;
        rlen = priv.rowCount;
        if (rlen > 0) {
          clen = priv.colCount;
          for (r = 0; r < rlen; r++) {
            for (c = 0; c < clen; c++) {
              tds.push(trs[r].childNodes[c]);
            }
          }
        }
        return tds;
      }
    };

    selection = {
      /**
       * Starts selection range on given td object
       * @param td element
       */
      setRangeStart: function (td) {
        selection.deselect();
        priv.selStart = grid.getCellCoords(td);
        selection.setRangeEnd(td);
      },

      /**
       * Ends selection range on given td object
       * @param td element
       */
      setRangeEnd: function (td) {
        var coords = grid.getCellCoords(td);
        selection.end(coords);
        if (!priv.settings.multiSelect) {
          priv.selStart = coords;
        }
        selection.refreshBorders();
        highlight.scrollViewport(td);
      },

      /**
       * Redraws borders around cells
       */
      refreshBorders: function () {
        if (!selection.isSelected()) {
          return;
        }
        if (priv.fillHandle) {
          autofill.showHandle();
        }
        priv.currentBorder.appear([priv.selStart]);
        highlight.on();
        editproxy.prepare();
      },

      /**
       * Setter/getter for selection start
       */
      start: function (coords) {
        if (coords) {
          priv.selStart = coords;
        }
        return priv.selStart;
      },

      /**
       * Setter/getter for selection end
       */
      end: function (coords) {
        if (coords) {
          priv.selEnd = coords;
        }
        return priv.selEnd;
      },

      /**
       * Returns information if we have a multiselection
       * @return {Boolean}
       */
      isMultiple: function () {
        return !(priv.selEnd.col === priv.selStart.col && priv.selEnd.row === priv.selStart.row);
      },

      /**
       * Selects cell relative to current cell (if possible)
       */
      transformStart: function (rowDelta, colDelta) {
        var td = grid.getCellAtCoords({
          row: (priv.selStart.row + rowDelta),
          col: priv.selStart.col + colDelta
        });
        if (td) {
          selection.setRangeStart(td);
        }
        else {
          selection.setRangeStart(grid.getCellAtCoords(priv.selStart)); //rerun some routines
        }
      },

      /**
       * Sets selection end cell relative to current selection end cell (if possible)
       */
      transformEnd: function (rowDelta, colDelta) {
        var td = grid.getCellAtCoords({
          row: (priv.selEnd.row + rowDelta),
          col: priv.selEnd.col + colDelta
        });
        if (td) {
          selection.setRangeEnd(td);
        }
      },

      /**
       * Returns true if currently there is a selection on screen, false otherwise
       * @return {Boolean}
       */
      isSelected: function () {
        var selEnd = selection.end();
        if (!selEnd || typeof selEnd.row === "undefined") {
          return false;
        }
        return true;
      },

      /**
       * Returns true if coords is within current selection coords
       * @return {Boolean}
       */
      inInSelection: function (coords) {
        if (!selection.isSelected()) {
          return false;
        }
        var sel = grid.getCornerCoords([priv.selStart, priv.selEnd]);
        return (sel.TL.row <= coords.row && sel.BR.row >= coords.row && sel.TL.col <= coords.col && sel.BR.col >= coords.col);
      },

      /**
       * Deselects all selected cells
       */
      deselect: function () {
        if (!selection.isSelected()) {
          return;
        }
        if (priv.isCellEdited) {
          editproxy.finishEditing();
        }
        highlight.off();
        priv.currentBorder.disappear();
        if (priv.fillHandle) {
          autofill.hideHandle();
        }
        selection.end(false);
      },

      /**
       * Select all cells
       */
      selectAll: function () {
        if (!priv.settings.multiSelect) {
          return;
        }
        var tds = grid.getAllCells();
        if (tds.length) {
          selection.setRangeStart(tds[0]);
          selection.setRangeEnd(tds[tds.length - 1]);
        }
      },

      /**
       * Deletes data from selected cells
       */
      empty: function () {
        if (!selection.isSelected()) {
          return;
        }
        var tds, i, ilen, changes = [], coords, old, $td;
        tds = grid.getCellsAtCoords(priv.selStart, selection.end());
        for (i = 0, ilen = tds.length; i < ilen; i++) {
          coords = grid.getCellCoords(tds[i]);
          old = datamap.get(coords.row, coords.col);
          $td = $(tds[i]);
          if (old !== '' && grid.isCellWriteable($td)) {
            $td.empty();
            datamap.set(coords.row, coords.col, '');
            changes.push([coords.row, coords.col, old, '']);
            grid.updateLegend(coords);
          }
        }
        if (changes.length) {
          self.container.triggerHandler("datachange.inputtable", [changes, 'empty']);
        }
        grid.keepEmptyRows();
        selection.refreshBorders();
      }
    };

    highlight = {
      /**
       * Create highlight border
       */
      init: function () {
        priv.selectionBorder = new Border(container, {
          className: 'selection',
          bg: true
        });
      },

      /**
       * Show border around selected cells
       */
      on: function () {
        if (!selection.isSelected()) {
          return false;
        }
        if (selection.isMultiple()) {
          priv.selectionBorder.appear([priv.selStart, selection.end()]);
        }
        else {
          priv.selectionBorder.disappear();
        }
      },

      /**
       * Hide border around selected cells
       */
      off: function () {
        if (!selection.isSelected()) {
          return false;
        }
        priv.selectionBorder.disappear();
      },

      /**
       * Scroll viewport to selection
       * @param td
       */
      scrollViewport: function (td) {
        if (!selection.isSelected()) {
          return false;
        }

        var $td = $(td);
        var tdOffset = $td.offset();
        var scrollLeft = priv.scrollable.scrollLeft(); //scrollbar position
        var scrollTop = priv.scrollable.scrollTop(); //scrollbar position
        var scrollWidth = priv.scrollable.outerWidth() - 24; //24 = scrollbar
        var scrollHeight = priv.scrollable.outerHeight() - 24; //24 = scrollbar
        var scrollOffset = priv.scrollable.offset();

        var offsetTop = tdOffset.top;
        var offsetLeft = tdOffset.left;
        if (scrollOffset) { //if is not the window
          offsetTop += scrollTop - scrollOffset.top;
          offsetLeft += scrollLeft - scrollOffset.left;
        }

        var height = $td.outerHeight();
        var width = $td.outerWidth();

        if (scrollLeft + scrollWidth <= offsetLeft + width) {
          setTimeout(function () {
            priv.scrollable.scrollLeft(offsetLeft + width - scrollWidth);
          }, 1);
        }
        else if (scrollLeft > offsetLeft) {
          setTimeout(function () {
            priv.scrollable.scrollLeft(offsetLeft - 2);
          }, 1);
        }

        if (scrollTop + scrollHeight <= offsetTop + height) {
          setTimeout(function () {
            priv.scrollable.scrollTop(offsetTop + height - scrollHeight);
          }, 1);
        }
        else if (scrollTop > offsetTop) {
          setTimeout(function () {
            priv.scrollable.scrollTop(offsetTop - 2);
          }, 1);
        }
      }
    };

    autofill = {
      /**
       * Create fill handle and fill border objects
       */
      init: function () {
        priv.fillHandle = new FillHandle(container);
        priv.fillBorder = new Border(container, {
          className: 'htFillBorder'
        });

        $(priv.fillHandle.handle).on('dblclick', autofill.selectAdjacent);
      },

      /**
       * Selects cells down to the last row in the left column, then fills down to that cell
       */
      selectAdjacent: function () {
        var select, data, r, maxR, c;

        if (selection.isMultiple()) {
          select = priv.selectionBorder.corners;
        }
        else {
          select = priv.currentBorder.corners;
        }

        priv.fillBorder.disappear();

        if (select.TL.col > 0) {
          data = datamap.getAll();
          rows : for (r = select.BR.row + 1; r < priv.rowCount; r++) {
            for (c = select.TL.col; c <= select.BR.col; c++) {
              if (data[r][c]) {
                break rows;
              }
            }
            if (!!data[r][select.TL.col - 1]) {
              maxR = r;
            }
          }
          if (maxR) {
            autofill.showBorder(grid.getCellAtCoords({row: maxR, col: select.BR.col}));
            autofill.apply();
          }
        }
      },

      /**
       * Apply fill values to the area in fill border, omitting the selection border
       */
      apply: function () {
        var drag, select, start, end;

        priv.fillHandle.isDragged = 0;

        drag = priv.fillBorder.corners;
        if (!drag) {
          return;
        }

        priv.fillBorder.disappear();

        if (selection.isMultiple()) {
          select = priv.selectionBorder.corners;
        }
        else {
          select = priv.currentBorder.corners;
        }

        if (drag.TL.row === select.TL.row && drag.TL.col < select.TL.col) {
          start = drag.TL;
          end = {
            row: drag.BR.row,
            col: select.TL.col - 1
          };
        }
        else if (drag.TL.row === select.TL.row && drag.BR.col > select.BR.col) {
          start = {
            row: drag.TL.row,
            col: select.BR.col + 1
          };
          end = drag.BR;
        }
        else if (drag.TL.row < select.TL.row && drag.TL.col === select.TL.col) {
          start = drag.TL;
          end = {
            row: select.TL.row - 1,
            col: drag.BR.col
          };
        }
        else if (drag.BR.row > select.BR.row && drag.TL.col === select.TL.col) {
          start = {
            row: select.BR.row + 1,
            col: drag.TL.col
          };
          end = drag.BR;
        }

        if (start) {
          var inputArray = keyboard.parsePasteInput(priv.editProxy.val());
          grid.populateFromArray(start, inputArray, end);

          selection.setRangeStart(grid.getCellAtCoords(drag.TL));
          selection.setRangeEnd(grid.getCellAtCoords(drag.BR));
        }
        else {
          //reset to avoid some range bug
          selection.refreshBorders();
        }
      },

      /**
       * Show fill handle
       */
      showHandle: function () {
        priv.fillHandle.appear([priv.selStart, priv.selEnd]);
      },

      /**
       * Hide fill handle
       */
      hideHandle: function () {
        priv.fillHandle.disappear();
      },

      /**
       * Show fill border
       */
      showBorder: function (td) {
        var coords = grid.getCellCoords(td);
        var corners = grid.getCornerCoords([priv.selStart, priv.selEnd]);
        if (priv.settings.fillHandle !== 'horizontal' && (corners.BR.row < coords.row || corners.TL.row > coords.row)) {
          coords = {row: coords.row, col: corners.BR.col};
        }
        else if (priv.settings.fillHandle !== 'vertical') {
          coords = {row: corners.BR.row, col: coords.col};
        }
        else {
          return; //wrong direction
        }
        priv.fillBorder.appear([priv.selStart, priv.selEnd, coords]);
      }
    };

    keyboard = {
      /**
       * Parse paste input
       * @param {String} input
       * @return {Array} 2d array
       */
      parsePasteInput: function (input) {
        var rows, r, rlen;
        rows = input.split("\n");
        if (rows[rows.length - 1] === '') {
          rows.pop();
        }
        for (r = 0, rlen = rows.length; r < rlen; r++) {
          rows[r] = rows[r].split("\t");
        }

        return rows;
      }
    };

    editproxy = {
      /**
       * Create input field
       */
      init: function () {
        priv.editProxy = $('<textarea class="inputtableInput">');
        priv.editProxyHolder = $('<div class="inputtableInputHolder">');
        priv.editProxyHolder.append(priv.editProxy);

        function onClick(event) {
          event.stopPropagation();
        }

        function onCut() {
          editproxy.finishEditing();
          setTimeout(function () {
            selection.empty();
          }, 100);
        }

        function onPaste() {
          editproxy.finishEditing();
          setTimeout(function () {
            var input = priv.editProxy.val().replace(/^[\r\n]*/g, '').replace(/[\r\n]*$/g, ''), //remove newline from the start and the end of the input
                inputArray = keyboard.parsePasteInput(input),
                coords = grid.getCornerCoords([priv.selStart, priv.selEnd]),
                endTd = grid.populateFromArray(coords.TL, inputArray, {
                  row: Math.max(coords.BR.row, inputArray.length - 1 + coords.TL.row),
                  col: Math.max(coords.BR.col, inputArray[0].length - 1 + coords.TL.col)
                });
            selection.setRangeEnd(endTd);
          }, 100);
        }

        function onKeyDown(event) {
          priv.lastKeyCode = event.keyCode;
          if (selection.isSelected()) {
            var ctrlOnly = (event.ctrlKey || event.metaKey) && !event.altKey; //catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)
            if ((event.keyCode == 32) || //space
                (event.keyCode >= 48 && event.keyCode <= 57) || //0-9
                (event.keyCode >= 96 && event.keyCode <= 111) || //numpad
                (event.keyCode >= 186 && event.keyCode <= 192) || //;=,-./`
                (event.keyCode >= 219 && event.keyCode <= 222) || //[]{}\|"'
                (event.keyCode >= 65 && event.keyCode <= 90)) { //a-z
              /* alphanumeric */
              if (!ctrlOnly) { //disregard CTRL-key shortcuts
                editproxy.beginEditing();
              }
              else if (ctrlOnly && event.keyCode === 65) { //CTRL + A
                selection.selectAll(); //select all cells
              }
              else if (ctrlOnly && (event.keyCode === 89 || (event.shiftKey && event.keyCode === 90))) { //CTRL + Y or CTRL + SHIFT + Z
                if (priv.undoRedo) {
                  priv.undoRedo.redo();
                }
              }
              else if (ctrlOnly && event.keyCode === 90) { //CTRL + Z
                if (priv.undoRedo) {
                  priv.undoRedo.undo();
                }
              }
              return;
            }

            var rangeModifier = event.shiftKey ? selection.setRangeEnd : selection.setRangeStart;

            switch (event.keyCode) {
              case 38: /* arrow up */
                if (isAutoComplete()) {
                  return true;
                }
                if (event.shiftKey) {
                  selection.transformEnd(-1, 0);
                }
                else {
                  editproxy.finishEditing(false, -1, 0);
                }
                event.preventDefault();
                break;

              case 39: /* arrow right */
              case 9: /* tab */
                if (!priv.isCellEdited || event.keyCode === 9) {
                  if (event.shiftKey) {
                    selection.transformEnd(0, 1);
                  }
                  else {
                    if (!isAutoComplete()) {
                      editproxy.finishEditing(false, 0, 1);
                    }
                  }
                  event.preventDefault();
                }
                break;

              case 37: /* arrow left */
                if (!priv.isCellEdited) {
                  if (event.shiftKey) {
                    selection.transformEnd(0, -1);
                  }
                  else {
                    editproxy.finishEditing(false, 0, -1);
                  }
                  event.preventDefault();
                }
                break;

              case 8: /* backspace */
              case 46: /* delete */
                if (!priv.isCellEdited) {
                  selection.empty(event);
                  event.preventDefault();
                }
                break;

              case 27: /* ESC */
              case 113: /* F2 */
              case 13: /* return/enter */
              case 40: /* arrow down */
                if (!priv.isCellEdited) {
                  if (event.keyCode === 113 || event.keyCode === 13) {
                    //begin editing
                    editproxy.beginEditing(true); //show edit field
                    if (!(event.keyCode === 13 && event.shiftKey)) {
                      event.preventDefault(); //don't add newline to field
                    }
                  }
                  else if (event.keyCode === 40) {
                    if (event.shiftKey) {
                      selection.transformEnd(1, 0); //expanding selection down with shift
                    }
                    else {
                      selection.transformStart(1, 0); //move selection down
                    }
                  }
                }
                else {
                  if (event.shiftKey || isAutoComplete() && event.keyCode === 40) { //if shift+enter or browsing through autocomplete
                    return true;
                  }
                  if (event.keyCode === 27 || event.keyCode === 13 || event.keyCode === 40) {
                    if (event.keyCode === 27) {
                      editproxy.finishEditing(true, 0, 0); //hide edit field, restore old value, don't move selection, but refresh routines
                    }
                    else {
                      if (!isAutoComplete()) {
                        editproxy.finishEditing(false, 1, 0);
                      }
                    }
                    event.preventDefault(); //don't add newline to field
                  }
                }
                break;

              case 36: /* home */
                if (!priv.isCellEdited) {
                  if (event.ctrlKey || event.metaKey) {
                    rangeModifier(grid.getCellAtCoords({row: 0, col: priv.selStart.col}));
                  }
                  else {
                    rangeModifier(grid.getCellAtCoords({row: priv.selStart.row, col: 0}));
                  }
                }
                break;

              case 35: /* end */
                if (!priv.isCellEdited) {
                  if (event.ctrlKey || event.metaKey) {
                    rangeModifier(grid.getCellAtCoords({row: priv.rowCount - 1, col: priv.selStart.col}));
                  }
                  else {
                    rangeModifier(grid.getCellAtCoords({row: priv.selStart.row, col: priv.colCount - 1}));
                  }
                }
                break;

              case 33: /* pg up */
                rangeModifier(grid.getCellAtCoords({row: 0, col: priv.selStart.col}));
                break;

              case 34: /* pg dn */
                rangeModifier(grid.getCellAtCoords({row: priv.rowCount - 1, col: priv.selStart.col}));
                break;

              default:
                break;
            }
          }
        }

        function onKeyUp(event) {
          if (priv.stopNextPropagation) {
            event.stopImmediatePropagation();
            priv.stopNextPropagation = false;
          }
        }

        function onChange() {
          if (isAutoComplete()) { //could this change be from autocomplete
            var val = priv.editProxy.val();
            if (val !== lastChange && val === priv.lastAutoComplete) { //is it change from source (don't trigger on partial)
              priv.isCellEdited = true;
              if (priv.lastKeyCode === 9) { //tab
                editproxy.finishEditing(false, 0, 1);
              }
              else { //return/enter
                editproxy.finishEditing(false, 1, 0);
              }
            }
            lastChange = val;
          }
        }

        priv.editProxy.on('click', onClick);
        priv.editProxy.on('cut', onCut);
        priv.editProxy.on('paste', onPaste);
        priv.editProxy.on('keydown', onKeyDown);
        priv.editProxy.on('keyup', onKeyUp);
        priv.editProxy.on('change', onChange);
        container.append(priv.editProxyHolder);
      },

      /**
       * Prepare text input to be displayed at given grid cell
       */
      prepare: function () {
        priv.editProxy.height(priv.editProxy.parent().innerHeight() - 4);
        priv.editProxy.val(datamap.getText(priv.selStart, priv.selEnd));
        setTimeout(editproxy.focus, 1);

        if (priv.settings.autoComplete) {
          var typeahead = priv.editProxy.data('typeahead');
          if (!typeahead) {
            priv.editProxy.typeahead({
              updater: function (item) {
                priv.lastAutoComplete = item;
                return item
              }
            });
            typeahead = priv.editProxy.data('typeahead');
          }
          typeahead.source = [];
          for (var i = 0, ilen = priv.settings.autoComplete.length; i < ilen; i++) {
            if (priv.settings.autoComplete[i].match(priv.selStart.row, priv.selStart.col, self.getData)) {
              typeahead.source = priv.settings.autoComplete[i].source();
              typeahead.highlighter = priv.settings.autoComplete[i].highlighter || defaultAutoCompleteHighlighter;
              break;
            }
          }
        }

        var current = grid.getCellAtCoords(priv.selStart);
        var currentOffset = $(current).offset();
        var containerOffset = container.offset();
        var editTop = currentOffset.top - containerOffset.top + container.scrollTop() - 1;
        var editLeft = currentOffset.left - containerOffset.left + container.scrollLeft() - 1;

        if (!$.browser.mozilla) {
          if ($.browser.msie) {
            if (parseInt(($.browser.version)) < 8) {
              editTop -= 2;
            }
            else if (parseInt(($.browser.version)) === 8) {
              editTop -= 1;
            }
          }
          editTop += 1;
          editLeft += 1;
        }

        priv.editProxyHolder.addClass('htHidden');
        priv.editProxyHolder.css({
          top: editTop,
          left: editLeft,
          overflow: 'hidden',
          zIndex: 1
        });
        priv.editProxy.css({
          width: '1000px',
          height: '1000px'
        });
      },

      /**
       * Sets focus to textarea
       */
      focus: function () {
        priv.editProxy[0].select();
      },

      /**
       * Shows text input in grid cell
       * @param useOriginalValue {Boolean}
       */
      beginEditing: function (useOriginalValue) {
        if (priv.isCellEdited) {
          return;
        }

        if (priv.fillHandle) {
          autofill.hideHandle();
        }

        var td = grid.getCellAtCoords(priv.selStart),
            $td = $(td);

        priv.isCellEdited = true;
        lastChange = '';

        if (selection.isMultiple()) {
          highlight.off();
          priv.selEnd = priv.selStart;
          highlight.on();
        }

        if (!grid.isCellWriteable($td)) {
          return;
        }

        if (useOriginalValue) {
          priv.editProxy.val(datamap.get(priv.selStart.row, priv.selStart.col));
        }
        else {
          priv.editProxy.val('');
        }

        if (priv.editProxy.autoResize) {
          priv.editProxy.autoResize({
            maxHeight: 200,
            minHeight: $td.outerHeight() - 4,
            minWidth: $td.width(),
            maxWidth: Math.max(168, $td.width()),
            animate: false,
            extraSpace: 0
          });
        }
        else {
          priv.editProxy.css({
            width: $td.width() * 1.5,
            height: $td.height()
          });
        }
        priv.editProxyHolder.removeClass('htHidden');
        priv.editProxyHolder.css({
          overflow: 'visible',
          zIndex: 4
        });

        if (priv.settings.autoComplete) {
          priv.editProxy.data('typeahead').lookup();
          priv.stopNextPropagation = true;
        }
      },

      /**
       * Shows text input in grid cell
       * @param {Boolean} [isCancelled] If TRUE, restore old value instead of using current from editproxy
       * @param {Number} [moveRow] Move selection row if edit is not cancelled
       * @param {Number} [moveCol] Move selection column if edit is not cancelled
       */
      finishEditing: function (isCancelled, moveRow, moveCol) {
        if (priv.isCellEdited) {
          priv.isCellEdited = false;
          var td = grid.getCellAtCoords(priv.selStart),
              $td = $(td),
              val = $.trim(priv.editProxy.val());
          var oldVal = datamap.get(priv.selStart.row, priv.selStart.col);
          if (oldVal !== val && grid.isCellWriteable($td)) {
            var result;
            var change = [
              [priv.selStart.row, priv.selStart.col, oldVal, val]
            ];
            if (priv.settings.onBeforeChange) {
              result = priv.settings.onBeforeChange(change);
            }
            if (result !== false && change[0][3] !== false) { //edit is not cancelled
              self.setDataAtCell(change[0][0], change[0][1], change[0][3]);
              self.container.triggerHandler("datachange.inputtable", [change, 'type']);
              grid.keepEmptyRows();
            }
            else {
              isCancelled = true;
            }
          }

          priv.editProxy.css({
            width: '1000px',
            height: '1000px'
          });
          priv.editProxyHolder.addClass('htHidden');
          priv.editProxyHolder.css({
            overflow: 'hidden'
          });
        }
        if (typeof moveRow !== "undefined" && typeof moveCol !== "undefined") {
          if (isCancelled) {
            selection.refreshBorders();
          }
          else {
            selection.transformStart(moveRow, moveCol);
          }
        }
      }
    };

    interaction = {
      onMouseDown: function (event) {
        priv.isMouseDown = true;
        if (event.button === 2 && selection.inInSelection(grid.getCellCoords(this))) { //right mouse button
          //do nothing
        }
        else if (event.shiftKey) {
          selection.setRangeEnd(this);
        }
        else {
          selection.setRangeStart(this);
        }
      },

      onMouseOver: function () {
        if (priv.isMouseDown) {
          selection.setRangeEnd(this);
        }
        else if (priv.fillHandle && priv.fillHandle.isDragged) {
          priv.fillHandle.isDragged++;
          autofill.showBorder(this);
        }
      },

      onDblClick: function () {
        priv.editProxy[0].focus();
        editproxy.beginEditing(true);
      }
    };

    this.init = function () {
      function onMouseEnterTable() {
        priv.isMouseOverTable = true;
      }

      function onMouseLeaveTable() {
        priv.isMouseOverTable = false;
      }

      priv.table = $('<table cellspacing="0" cellpadding="0"><tbody></tbody></table>');
      priv.tableBody = priv.table.find("tbody")[0];
      priv.table.on('mousedown', 'td', interaction.onMouseDown);
      priv.table.on('mouseover', 'td', interaction.onMouseOver);
      priv.table.on('dblclick', 'td', interaction.onDblClick);
      container.append(priv.table);

      priv.colCount = priv.settings.cols;
      grid.keepEmptyRows();

      highlight.init();
      priv.currentBorder = new Border(container, {
        className: 'current',
        bg: true
      });
      if (priv.settings.fillHandle) {
        autofill.init();
      }
      editproxy.init();

      priv.table.on('mouseenter', onMouseEnterTable);
      priv.table.on('mouseleave', onMouseLeaveTable);
      priv.editProxy.on('mouseenter', onMouseEnterTable);
      priv.editProxy.on('mouseleave', onMouseLeaveTable);
      if (priv.fillHandle) {
        $(priv.fillHandle.handle).on('mouseenter', onMouseEnterTable).on('mouseleave', onMouseLeaveTable);
        $(priv.fillBorder.main).on('mouseenter', onMouseEnterTable).on('mouseleave', onMouseLeaveTable);
      }
      $(priv.selectionBorder.main).on('mouseenter', onMouseEnterTable).on('mouseleave', onMouseLeaveTable);
      $(priv.currentBorder.main).on('mouseenter', onMouseEnterTable).on('mouseleave', onMouseLeaveTable).on('dblclick', interaction.onDblClick);

      function onMouseUp() {
        priv.isMouseDown = false;
        if (priv.fillHandle && priv.fillHandle.isDragged) {
          if (priv.fillHandle.isDragged > 1) {
            autofill.apply();
          }
          priv.fillHandle.isDragged = 0;
        }
      }

      function onOutsideClick() {
        setTimeout(function () {//do async so all mouseenter, mouseleave events will fire before
          if (!priv.isMouseOverTable) {
            selection.deselect();
          }
        }, 1);
      }

      $("html").on('mouseup', onMouseUp);
      $("html").on('click', onOutsideClick);

      if (container[0].tagName.toLowerCase() !== "html" && container[0].tagName.toLowerCase() !== "body" && container.css('overflow') === 'scroll') {
        priv.scrollable = container;
      }
      else {
        container.parents().each(function () {
          if (this.tagName.toLowerCase() !== "html" && this.tagName.toLowerCase() !== "body" && $(this).css('overflow') == 'scroll') {
            priv.scrollable = $(this);
            return false;
          }
        });
      }

      if (priv.scrollable) {
        priv.scrollable.scrollTop(0);
        priv.scrollable.scrollLeft(0);
      }
      else {
        priv.scrollable = $(window);
      }

      priv.scrollable.on('scroll', function (e) {
        e.stopPropagation();
      });

      if (priv.settings.contextMenu) {
        var onContextClick = function (key) {
          var coords = grid.getCornerCoords([priv.selStart, priv.selEnd]);

          switch (key) {
            case "row_above":
              grid.alter("insert_row", coords.TL);
              break;

            case "row_below":
              grid.alter("insert_row", {row: coords.BR.row + 1, col: 0});
              break;

            case "col_left":
              grid.alter("insert_col", coords.TL);
              break;

            case "col_right":
              grid.alter("insert_col", {row: 0, col: coords.BR.col + 1});
              break;

            case "remove_row":
            case "remove_col":
              grid.alter(key, coords.TL, coords.BR);
              break;

            case "undo":
              priv.undoRedo.undo();
              break;

            case "redo":
              priv.undoRedo.redo();
              break;
          }
        };

        var isReadOnly = function (key) {
          var coords = grid.getCornerCoords([priv.selStart, priv.selEnd]);

          if (((key === "row_above" || key === "remove_row") && coords.TL.row === 0) || ((key === "col_left" || key === "remove_col") && coords.TL.col === 0)) {
            if ($(grid.getCellAtCoords(coords.TL)).data("readOnly")) {
              return true;
            }
          }
          return false;
        };

        var allItems = {
          "undo": {name: "Undo", disabled: function () {
            return priv.undoRedo ? !priv.undoRedo.isUndoAvailable() : true
          }},
          "redo": {name: "Redo", disabled: function () {
            return priv.undoRedo ? !priv.undoRedo.isRedoAvailable() : true
          }},
          "sep1": "---------",
          "row_above": {name: "Insert row above", disabled: isReadOnly},
          "row_below": {name: "Insert row below"},
          "sep2": "---------",
          "col_left": {name: "Insert column on the left", disabled: isReadOnly},
          "col_right": {name: "Insert column on the right"},
          "sep3": "---------",
          "remove_row": {name: "Remove row", disabled: isReadOnly},
          "remove_col": {name: "Remove column", disabled: isReadOnly}
        };

        if (priv.settings.contextMenu === true) { //contextMenu is true, not an array
          priv.settings.contextMenu = ["row_above", "row_below", "sep2", "col_left", "col_right", "sep3", "remove_row", "remove_col"]; //use default fields array
        }

        var items = {};
        for (var i = 0, ilen = priv.settings.contextMenu.length; i < ilen; i++) {
          items[priv.settings.contextMenu[i]] = allItems[priv.settings.contextMenu[i]];
        }

        $.contextMenu({
          selector: container.attr('id') ? ("#" + container.attr('id')) : "." + container[0].className.replace(/[\s]+/g, ' .'),
          trigger: 'right',
          callback: onContextClick,
          items: items
        });
      }

      self.container.on("datachange.inputtable", function (event, changes) {
        if (priv.settings.onChange) {
          priv.settings.onChange(changes);
        }
      });
    };

    /**
     * Set data at given cell
     * @public
     * @param row {Number}
     * @param col {Number}
     * @param value {String}
     */
    this.setDataAtCell = function (row, col, value) {
      if (priv.settings.minSpareRows) {
        while (row > priv.rowCount - 1) {
          datamap.createRow();
          grid.createRow();
        }
      }
      if (priv.settings.minSpareCols) {
        while (col > priv.colCount - 1) {
          datamap.createCol();
          grid.createCol();
        }
      }
      var td = grid.getCellAtCoords({row: row, col: col});
      switch (typeof value) {
        case 'string':
          break;

        case 'number':
          value += '';
          break;

        default:
          value = '';
      }
      td.innerHTML = value.replace(/\n/g, '<br/>').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); //escape html special chars
      datamap.set(row, col, value);
      grid.updateLegend({row: row, col: col});
      return td;
    };

    /**
     * Load data from array
     * @public
     * @param {Array} data
     */
    this.loadData = function (data) {
      priv.isPopulated = false;
      datamap.clear();
      grid.clear();
      grid.populateFromArray({
        row: 0,
        col: 0
      }, data);
      priv.isPopulated = true;
    };

    /**
     * Return data as array
     * @public
     * @return {Array}
     */
    this.getData = function () {
      return datamap.getAll();
    };

    /**
     * Update settings
     * @public
     */
    this.updateSettings = function (settings) {
      for (var i in settings) {
        if (settings.hasOwnProperty(i)) {
          priv.settings[i] = settings[i];
        }
      }
      var recreated = grid.keepEmptyRows();
      if (!recreated) {
        selection.refreshBorders();
      }
    };

    /**
     * Clears grid
     * @public
     */
    this.clear = function () {
      selection.selectAll();
      selection.empty();
    };

    /**
     * Alters the grid
     * @param {String} action See grid.alter for possible values
     * @param {Number} from
     * @param {Number} [to] Optional. Used only for actions "remove_row" and "remove_col"
     * @public
     */
    this.alter = function (action, from, to) {
      if (typeof to === "undefined") {
        to = from;
      }
      switch (action) {
        case "insert_row":
        case "remove_row":
          grid.alter(action, {row: from, col: 0}, {row: to, col: 0});
          break;

        case "insert_col":
        case "remove_col":
          grid.alter(action, {row: 0, col: from}, {row: 0, col: to});
          break;
      }
    };


    /**
     * Returns <td> element corresponding to params row, col
     * @param {Number} row
     * @param {Number} col
     * @public
     * @return {Element}
     */
    this.getCell = function (row, col) {
      return grid.getCellAtCoords({row: row, col: col});
    };

    /**
     * Create DOM elements for selection border lines (top, right, bottom, left) and optionally background
     * @constructor
     * @param {jQuery} $container jQuery DOM element of inputtable container
     * @param {Object} options Configurable options
     * @param {Boolean} [options.bg] Should include a background
     * @param {String} [options.className] CSS class for border elements
     */
    function Border($container, options) {
      this.$container = $container;
      var container = this.$container[0];

      if (options.bg) {
        this.bg = document.createElement("div");
        this.bg.className = 'htBorderBg ' + options.className;
        container.insertBefore(this.bg, container.getElementsByTagName('table')[0]);
      }

      this.main = document.createElement("div");
      this.main.style.position = 'absolute';
      this.main.style.top = 0;
      this.main.style.left = 0;
      this.main.innerHTML = (new Array(5)).join('<div class="htBorder ' + options.className + '"></div>');
      this.disappear();
      container.appendChild(this.main);

      var nodes = this.main.childNodes;
      this.top = nodes[0];
      this.left = nodes[1];
      this.bottom = nodes[2];
      this.right = nodes[3];

      this.borderWidth = $(this.left).width();
    }

    Border.prototype = {
      /**
       * Show border around one or many cells
       * @param {Object[]} coordsArr
       */
      appear: function (coordsArr) {
        var $from, $to, fromOffset, toOffset, containerOffset, top, minTop, left, minLeft, height, width;

        this.corners = grid.getCornerCoords(coordsArr);

        $from = $(grid.getCellAtCoords(this.corners.TL));
        $to = (coordsArr.length > 1) ? $(grid.getCellAtCoords(this.corners.BR)) : $from;
        fromOffset = $from.offset();
        toOffset = (coordsArr.length > 1) ? $to.offset() : fromOffset;
        containerOffset = this.$container.offset();

        minTop = fromOffset.top;
        height = toOffset.top + $to.outerHeight() - minTop;
        minLeft = fromOffset.left;
        width = toOffset.left + $to.outerWidth() - minLeft;

        top = minTop - containerOffset.top + this.$container.scrollTop() - 1;
        left = minLeft - containerOffset.left + this.$container.scrollLeft() - 1;

        if (!$.browser.mozilla) {
          if ($.browser.msie) {
            if (parseInt(($.browser.version)) < 9) {
              top -= 1;
            }
          }
          top += 1;
          left += 1;
        }

        if (top < 0) {
          top = 0;
        }
        if (left < 0) {
          left = 0;
        }

        if (this.bg) {
          this.bg.style.top = top + 'px';
          this.bg.style.left = left + 'px';
          this.bg.style.width = width + 'px';
          this.bg.style.height = height + 'px';
          this.bg.style.display = 'block';
        }

        this.top.style.top = top + 'px';
        this.top.style.left = left + 'px';
        this.top.style.width = width + 'px';

        this.left.style.top = top + 'px';
        this.left.style.left = left + 'px';
        this.left.style.height = height + 'px';

        var delta = Math.floor(this.borderWidth / 2);

        this.bottom.style.top = top + height - delta + 'px';
        this.bottom.style.left = left + 'px';
        this.bottom.style.width = width + 'px';

        this.right.style.top = top + 'px';
        this.right.style.left = left + width - delta + 'px';
        this.right.style.height = height + 1 + 'px';

        this.main.style.display = 'block';
      },

      /**
       * Hide border
       */
      disappear: function () {
        this.main.style.display = 'none';
        if (this.bg) {
          this.bg.style.display = 'none';
        }
        this.corners = null;
      }
    };

    /**
     * Create DOM element for drag-down handle
     * @constructor
     * @param {jQuery} $container jQuery DOM element of inputtable container
     */
    function FillHandle($container) {
      this.$container = $container;
      var container = this.$container[0];

      this.handle = document.createElement("div");
      this.handle.className = "htFillHandle";
      this.disappear();
      container.appendChild(this.handle);

      var that = this;
      $(this.handle).mousedown(function () {
        that.isDragged = 1;
      });
    }

    FillHandle.prototype = {
      /**
       * Show handle in cell corner
       * @param {Object[]} coordsArr
       */
      appear: function (coordsArr) {
        var $td, tdOffset, containerOffset, top, left, height, width;

        var corners = grid.getCornerCoords(coordsArr);

        $td = $(grid.getCellAtCoords(corners.BR));
        tdOffset = $td.offset();
        containerOffset = this.$container.offset();

        top = tdOffset.top - containerOffset.top + this.$container.scrollTop() - 1;
        left = tdOffset.left - containerOffset.left + this.$container.scrollLeft() - 1;
        height = $td.outerHeight();
        width = $td.outerWidth();

        this.handle.style.top = top + height - 3 + 'px';
        this.handle.style.left = left + width - 3 + 'px';
        this.handle.style.display = 'block';
      },

      /**
       * Hide handle
       */
      disappear: function () {
        this.handle.style.display = 'none';
      }
    };
  }

  var settings = {
    'rows': 5,
    'cols': 5,
    'minSpareRows': 0,
    'minSpareCols': 0,
    'minHeight': 0,
    'minWidth': 0,
    'multiSelect': true,
    'fillHandle': true,
    'undo': true
  };


})(jQuery);

var inputtable = {}; //plugin namespace