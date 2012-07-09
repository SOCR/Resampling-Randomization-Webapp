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
			
<<<<<<< HEAD
			$('#input-table').after("<br/><br/><input class='btn' type='button' value='Done'><input class='btn' type='button' value='Reset'><input class='btn' type='button' value='Show/Hide'>");
			$("input[value='Done']").on('click',function(){

=======
			$('#input-table').after("<br/><br/><input class='btn' type='button' value='Done'><input class='btn' type='button' value='Reset'><input class='btn' type='button' value='Show'>");
			$("input[value='Done']").on('click',function(){
>>>>>>> 5fcb119c77c2ac2368a781d5b3f89e5834406c6d
			console.log($("#input-table").inputtable('getData'));
				$('#input-table').after('Please check your console for the array');
				return false;
			});
			$("input[value='Reset']").on('click',function(){
				$("#input-table").inputtable('clear');
				return false;
			});
<<<<<<< HEAD
			$("input[value='Show/Hide']").on('click',function(){
				alert('working on it');
				
				return false;
			});

=======
			$("input[value='Show']").on('click',function(){
				alert('ads');
				
				return false;
			});
>>>>>>> 5fcb119c77c2ac2368a781d5b3f89e5834406c6d
			
		
		
	})(jQuery);
})