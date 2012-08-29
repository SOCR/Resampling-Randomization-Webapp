(function(){
	$dataTable = $('#input');

	$('#input').inputtable({
			    rows: 8,
			    cols: 2,
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
     	
			
			//$('#input').before("<br/><input class='btn' type='button' value='Done'><input class='btn' type='button' value='Reset'>");
			//Binding function to the Button clicks
			$("input[value='Done']").on('click',function(){
				var temp=$("#input").inputtable('getData');
				var selected=$("#input").inputtable('getSelected');

				if(temp.clean(',').length==0)
					{
					$('#status').html('<div class="alert alert-error">No input given <i class="icon-info-sign"></i><a class="close" data-dismiss="alert" href="#">x</a></div>');
					}
				else if(selected)
					{
					console.log("getSelected");
					model.setDataset({
						data:$("#input").inputtable('getData'),
						range:selected,
						type:'getSelected',
						processed:false,
						});
				$('section .response').html('Data loaded successfully<i class="icon-ok"></i>').show();
					}
				else 
					{
					console.log("getSelectedData : " + $("#input").inputtable('getSelectedData'));
					model.setDataset({
						data:$("#input").inputtable('getSelectedData'),
						range:1,
						type:'getData',
						processed:false,
					});
					$('section .response').html('Data loaded successfully<i class="icon-ok"></i>').show();
					}
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
							$("#input").inputtable('clear'); 		//clear the input sheet 
							$('#status').html('<div class="alert"><a class="close" data-dismiss="alert" href="#">x</a>Clear! Enter some value to get started!</div>');  //display the message in the status div below the done and reset buttons
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
			
			$('section.controls #submatrix_spreadsheet').on('click',function(){
					var start = $('section.controls').find('input[name="start"]').val(),
			 			end =   $('section.controls').find('input[name="end"]').val();
			 			console.log($('#input').inputtable('getDataFromCoords',start,end))
			 		})
		
		/*
			Commenting out the prototype as it was interfering with drag and drop table, will look into it later
			
			Array.prototype.clean = function(deleteValue) {
			  for (var i = 0; i < this.length; i++) {
				if (this[i] == deleteValue) {         
				  this.splice(i, 1);
				  i--;
				}
			  }
			  return this;
			};
		*/
})();