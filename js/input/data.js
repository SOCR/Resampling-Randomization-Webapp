(function () {
  /*
		data.js for binding 
	*/
  $dataTable = $('#input');
  $controls = $('section.controls');
  $parent = $('div.spreadsheet');
  $response = $('#status');
  /*
    	
    	binding all events for easing controls

    */
  $controls.find('input[value="Done"]').on('click', processSpreadsheet);
  $controls.find('input[value="Reset"]').on('click', resetSpreadsheet);
  $controls.find('#submatrix_spreadsheet').on('click', function () {
    if(isSelected()) {
      var response = isSelected();
      $dataTable.inputtable('selectCell', response[1], response[0], response[3], response[2]);
       displayResponse(' Submatrix loaded <i class="icon-ok"></i>', 'success');
    } else {
      var start = $controls.find('input[name="start"]').val(),
        end = $controls.find('input[name="end"]').val();
      var startArray = start.split(','),
        stopArray = end.split(',');
      $dataTable.inputtable('selectCell', startArray[0], startArray[1], stopArray[0], stopArray[1]);
      console.log(startArray + '  ' + stopArray);
      console.log($dataTable.inputtable('getDataFromCoords', start, end))
    }
  })
  /*
	
		Spreadsheet generation code, pretty much self explanatory

 	*/
  $dataTable.inputtable({
    rows: 15,
    cols: 4,
    minSpareCols: 1,
    minSpareRows: 1,
    fillHandle: true,
    rowHeaders: true,
  });
  var displayResponse = function (text, type) {
    /*
			Todo : DRY the reponse code
		*/
    $response.html('').slideUp(300);;
    $response.append(
    $('<div></div>')
      .addClass('alert')
      .html(text)).slideDown(300);
  }
  var processSpreadsheet = function (e) {
    /*
		
			Process spreadsheet function, takes into consideration two cases
			1. Data is selected, getSelectedData
			2. Entire Dataset
		
		*/
    console.log($(this).parent().parent().hasClass('copy'))
    $("#dataDriven-tab").trigger('click');
    if(isSelected()) {
      console.log('Coordinates are selected ' + isSelected())
      var selectedCoords = isSelected();
    }
    if(selectedCoords) {
      /* 
					Data is selected, go ahead with extracting submatrix
					@Todo : highlight the selected Data

				*/
      model.setDataset({
        data: $dataTable.inputtable('getSelectedData'),
        //range:selected,
        type: 'getSelected',
        processed: false
      });
      displayResponse(' Data loaded successfully <i class="icon-ok"></i>', 'success');
      $(".controller-handle").trigger('click');
    } else {
      console.log('No coordinates are selected')
      /*
					Case of no selection, entire matrix is passed
				*/
      model.setDataset({
        data: $dataTable.inputtable('getNonEmptyData'),
        range: 1,
        type: 'getData',
        processed: false,
      });
      displayResponse('Data loaded successfully <i class="icon-ok"></i>', 'success');
      $(".controller-handle").trigger('click');
    }
  }
  /*
		
			Commented out the earlier verison of the code,
			@ Todo 
			1. Check for empty dataset


				var temp = $dataTable.inputtable('getData');
				
				console.log(selected);

				if(temp.clean(',').length==0)
					{
					$('#status').html('<div class="alert alert-error">No input given <i class="icon-info-sign"></i><a class="close" data-dismiss="alert" href="#">x</a></div>');
					}
				else if(selected)
					{
					console.log("getSelected");

					model.setDataset({
						data:$dataTable.inputtable('getData'),
						range:selected,
						type:'getSelected',
						processed:false,
						});

				$('section .response').html('Data loaded successfully<i class="icon-ok"></i>').show();
					}
				else 
					{
					console.log("getSelectedData : " + $dataTable.inputtable('getSelectedData'));

					model.setDataset({
						data:$dataTable.inputtable('getSelectedData'),
						range:1,
						type:'getData',
						processed:false,
					});
					$('section .response').html('Data loaded<i class="icon-ok"></i>').show();
					}
			}

			 */
  var resetSpreadsheet = function () {
 
    $('<div></div>').appendTo('body')
      .html('<div><h6>Are you sure you want to reset the data?</h6></div>')
      .dialog({
      modal: true,
      title: 'Reset Data?',
      zIndex: 10000,
      autoOpen: true,
      width: 'auto',
      resizable: false,
      buttons: {
        Yes: function () {
          //clear the input sheet 
          $dataTable.inputtable('clear');
          $('#status').html('<div class="alert"><a class="close" data-dismiss="alert" href="#">x</a>Clear! Enter some value to get started!</div>'); //display the message in the status div below the done and reset buttons
          $(this).dialog("close"); //close the confirmation window
        },
        No: function () {
          $(this).dialog("close");
        }
      },
      close: function (event, ui) {
        $(this).remove();
      }
    });
  }
  /*
		Private method to check whether the grid is selected or not, if it is return the extremities

	*/
  var isSelected = function () {
    var coords = $dataTable.inputtable('getSelected');
    if(coords) {
      /*
				Simple check for deselected members as the getSelected method returns the coordinates of last cell worked on

			*/
      if(coords[0] === coords[2] && coords[1] === coords[3]) {
        return false;
      } else {
        return coords;
      }
    }
    return false;
  }
  $controls.find('input[value="Done"]').on('click', processSpreadsheet);
  $controls.find('input[value="Reset"]').on('click', resetSpreadsheet);
  /*
  $controls.find('#submatrix_spreadsheet').on('click', function () {
    if(isSelected()) {
      console.log(isSelected())
    } else {
      var start = $controls.find('input[name="start"]').val(),
        end = $controls.find('input[name="end"]').val();
      console.log(start + ' ' + end)
      console.log($dataTable.inputtable('getDataFromCoords', start, end))
    }
  })
*/
  Array.prototype.clean = function (deleteValue) {
    for(var i = 0; i < this.length; i++) {
      if(this[i] == deleteValue) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };
})();