var table = function () {

	//Private Methods
	var populateFromArray, getCellContent, alterMatrix;

	//Private  Definitions
	var input = $(document.createElement('input'))
					.attr('type','text'),
		//matrix = [],
		recentEdit,
		parent = '.dataTable';
		controls = '.input-controls' // By default need to work on them later

	var request = function ( uri,parent ){

		//ToDo :  Check for valid urls
	 	$.get( uri, function(d){

	 		console.log('Fetching Successful');

	 		var tableCount = $(d).find('table').length,
	 			tables = $(d).find('table'),
	 		 	table = filterTables( tables ),
	 		 	titles = parseHeadings ( table );

	 		 	matrix = htmlToArray( table );

	 		 	insertData(arrayToHTML(matrix)
	 				.addClass('default-table')
	 				.prepend(titlesToHTML(titles))


	 			);

	 	});
		
		
	}

	var insertData = function( html ){
			//Remove all obligatory posts from before

	 			$(controls).html( html );
	 			var control = '<div class="input-controls"> Range : <input type="text" name="start"> - <input type="text" name="end"></div><input type="button" value="Done Editing" class="btn">';
	 			$(controls).prepend(control);
	}
	var parseHeadings = function( html ){

		var title =[];

		$stats = $(html);
		$stats.find('tr').filter(':first').find('th').each(function(){
			title.push( $(this).text() );
		});

		return title;
	}

	var titlesToHTML = function( csv ){
		var row ;
		for( i in csv ){
			row += '<th>' + csv[i] + '</th>';
		}
		return '<tr>' + row + '</tr>';
	}
	var filterTables = function ( arrayOfTables ){

		/*
		var maxIndex = 0;
		for( i in arrayOfTables ){
			//console.log( arrayOfTables[0])
			if ( $(arrayOfTables[i]).find('tr').length > $(arrayOfTables[maxIndex]).find('tr').length  )
				maxIndex = i;
		}
		console.log( arrayOfTables[maxIndex] );
		return maxIndex;\
		*/
		return arrayOfTables[1];
	}

	var getMatrixsize = function(){
		return matrix.length;
	}

	var htmlToArray = function( html ){

		var matrix = [];
		$stats = $(html);
     	$stats.find('tr').each(function(){
	        var row = [];
	        $(this).find('td').not('eq(0)').each(function(){
	          row.push( $(this).text() );
	        })
	        matrix.push(row);
    	 });
     	 
     	 return matrix;
	}

	var arrayToHTML = function ( matrix ){

		// i - rows
		// j - cols
		var table ='';
	    for(i in matrix){
	      var row = '';
	      for(j in matrix[i]){

	        row += '<td data-coords="' + i + '-'+ (parseInt(j)+1) +'">' + matrix[i][j] +'</td>';
	      }
	      table += '<tr>' + row + '</tr>';
	    }

	     return $('<table>'+ table + '</table>');
	}

	var insertText = function ( cell ){
		
		input.css({

			position : 'absolute',
			height : (cell.height() - 5) + 'px',
			width : (cell.width() + 10) + 'px',
			top: cell.position().top + 'px',
			left: cell.position().left + 'px',
			lineHeight: cell.height() + 'px'
		
		}).show();

		recentEdit = cell.attr('data-coords');

		$('table').append( input );

		return input;
	}

	var replaceCellContent = function (){

		var lastCell = $('table').find('td').filter(function(){
			return $(this).attr('data-coords') === recentEdit;
		});

		lastCell.text( input.val() );
		input.val('');		
	}

	var cellEdited =function( td ){
		var currentEdit = cell;
	}
	//Public Methods
	return {
		init : function(config){
			// A basic config intializor
			var parent = config.parent;
			$(parent).html('Loading ...')
		},
		loadURL :  function ( url ){	
			request( url, parent );
			$(parent).find('input:eq(1)').val( getMatrixsize )
		},
		selectData :  function ( coords ){

		},
		startEdit : function ( cell ){
			if( cell.attr('data-coords') != recentEdit){
				replaceCellContent();
			}
			insertText( cell );
			console.log( input )
			setTimeout(function(){
				$(input).focus();

			},100);
			
			
		},
		extractData :  function ( coords ){

		},
		endEdit : function(){
			replaceCellContent.apply(this);
		}

	}

}();