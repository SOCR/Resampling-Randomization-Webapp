$(document).ready(function(){
	(function($){
		//Making the input-table div into a excel sheet
		$("#input-table").inputtable({
			    rows: 5,
			    cols: 1,
				minSpareCols : 1,
				minSpareRows : 1,
				fillHandle : true,
				rowHeaders : true,
				colHeaders : true,
				legend: [
			  /**
			   * Legend 1
			   */
				{
				  match: function (row, col, data) {
					return !(data()[row][col]); //if the cell is empty
				  },
				  style: {
					background: '#f5f5f5' //make the background yellow
				  }
				}
				]
			});
		
		/*
		
		//Placing 2 buttons Done and Reset just after the input-table	
		$('#input-table').after("<br/><br/><input class='btn' type='button' value='Done'><input class='btn' type='button' value='Reset'>");
		//Binding function to the Button clicks
		$("input[value='Done']").on('click',function(){
		//alert($("#input-table").inputtable('getSelected'));
		//alert($("#input-table").inputtable('getData'));
			//console.log($("#input-table").inputtable('getData'));
			var isEmpty=model.setDataset({
					data:$("#input-table").inputtable('getData'),
					processed:false
					});

			if(isEmpty==true)
				$('#status').html('<br><div class="alert alert-error">No input given <i class="icon-info-sign"></i></div>');
			else {
					$('#status').html('<br><div class="alert alert-success">Data loaded successfully! <i class="icon-ok"></i></div>');
					//view.createDatasetPlot();
					//make a call to the controller for generating the dataset plot
				}
				return false;
			});// Done click 
			
			$("input[value='Reset']").on('click',function(){
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
							$("#input-table").inputtable('clear'); 		//clear the input sheet 
							$('#status').html('<br/><div class="alert">Clear! Enter some value to get started!');  //display the message in the status div below the done and reset buttons
                            $(this).dialog("close");					//close the confirmation window
                            },
                            No: function () {
                                $(this).dialog("close");
                            }
                        },
                        close: function (event, ui) {
                            $(this).remove();
                        }
                    });
			
			}); //Reset click
	*/	
	})(jQuery);
})