$(document).ready(function(){
	(function($){
	
	
			$("#input-table").inputtable({
			    rows: 5,
			    cols: 3,
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
					return (row === 0); //if it is first row
				  },
				  style: {
					color: 'green', //make the text green and bold
					fontWeight: 'bold'
				  },
				  title: 'Heading', //make some tooltip
				  readOnly: true //make it read-only
				},

			  /**
			   * Legend 2
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
			
			$('#input-table').after("<br/><br/><input class='btn' type='button' value='Done'><input class='btn' type='button' value='Reset'>");
			$("input[value='Done']").on('click',function(){
			//console.log($("#input-table").inputtable('getData'));
			//$('#input-table').after('Please check your console for the array');
			var isEmpty=model.setDataset($("#input-table").inputtable('getData'));
			if(isEmpty==true)
				$('#status').html('<br>No input given <i class="icon-info-sign"></i>');
			else
				{
					$('#status').html('<br>Data loaded successfully! <i class="icon-ok"></i>');
					view.createDatasetPlot();
				}

				return false;
			});
			$("input[value='Reset']").on('click',function(){
				$("#input-table").inputtable('clear');
				$('#status').html('');
				return false;
			});
		
	})(jQuery);
})