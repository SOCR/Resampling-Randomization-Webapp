var table = function () {

	//Private Methods
	var populateFromArray, getCellContent, alterMatrix;

	//Private  Definitions
	var input = $(document.createElement('input'))
					.attr('type','text').val(''),
		matrix = [],
		lastEdit ='',
		parent = '#status';
		controls = '.input-controls' 

	var request = function ( uri,parent ){
		
		if( uri.substr(0,7) !== 'http://'){
			uri = 'http://' + uri;
		}
		//ToDo :  Check for valid urls
	 	$.get(uri, function(d){
	//	 		console.log('Fetching Successful');

	 		var tableCount = $(d).is('table') ? $(d).length : $(d).find('table').length,
	 			tables = $(d).is('table') ? $(d) : $(d).find('table'),
	 		 	table = filterTables( tables ),
	 		 	titles = parseHeadings ( table );

	 		 	matrix = htmlToArray( table );	
	 		 	$('#input').inputtable('loadData',matrix);
	 		 	/*

	 		 	insertData(arrayToHTML(matrix)
	 				.addClass('default-table')
	 				.prepend(titlesToHTML(titles))
	 				);

				*/

	 			

	 	});
		
		
	}

	var insertData = function( html ){
			//Remove all obligatory posts from before
			console.log($(parent))
	 			$(parent).html( html );
	 			var control = '<div class="input-controls"> Range : <input type="text" name="start" class="input-mini" placeholder="start"> - <input type="text" name="end" class="input-mini" placeholder="end">  <div> <input type="button" class="btn" value="Generate submatrix" id="submatrix"> <input type="button" value="Use entire matrix" class="btn" id="generateMatrix"></div></div>';
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

		var sizes = [];
		$(arrayOfTables).each(function(i){
			sizes.push([ $(this).find('tr:last').index() , i] )
		})
		var maxIndex = 0;
		for(k=0; k < sizes.length - 2 ; k++){
			if(sizes[k][0] < sizes [k+1][0])
				maxIndex = sizes[k+1][1];
		}
		return arrayOfTables[maxIndex];
	}

	var getMatrixsize = function(){
		return matrix.length;
	}

	var htmlToArray = function( html ){

		var matrix = [];
		$stats = $(html);
     	$stats.find('tr').each(function(){
	        var row = [];
	        $(this).find('td').each(function(){
	          row.push( $(this).text() );
	        })
	        matrix.push(row);
    	 });

     	/*
			Check if the table has th elements instead
			@Todo
     	*/
     	 if(matrix[0][0] === ''){
     	 	var row = [];
     	 	$stats.find('tr').filter(':eq(0)').find('th').each(function(i,v){
     	 	  matrix[0][i -1] = $(this).text();
     	 	});
     	 	console.log('Matrix first row was empty')
     	 }
     	 
     	 matrix[0][0] = 'Matrix mode testing';
     	 matrix.splice(0,1);
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

		lastEdit = cell.attr('data-coords');
		input.val(cell.text())

		$('table').append( input );

		return input;
	}

	var replaceCellContent = function (){

		var lastCell = $('table').find('td').filter(function(){
			return $(this).attr('data-coords') === lastEdit;
		});
		if( lastCell.text() !== input.val() )
		 lastCell.text( input.val() );

		var split = lastCell.attr('data-coords').split("-");
			matrix[split[0]][split[1]] = input.val();
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
			//$(parent).html('Loading ...')
		},
		loadURL :  function ( url ){	
			//$(parent).html('');
			var requestHost = document.createElement("a");
   				requestHost.href = url;

   				if(window.location.hostname !== requestHost.hostname){
   					$(controls).html('');
   					$(parent).html('<div class="alert alert-danger">Data Sets should be on same server due to security reasons</div>');
   					return;

   				}
   			console.log('Request Initialised');

   			$('#status').html('<div class="alert alert-success">Dataset request initialised..</div>');
   			setTimeout(function(){
   				$('#status').slideToggle().html('');
   			}, 2000)
			request( url, parent );

			
		},
		selectData :  function ( coords ){

		},
		startEdit : function ( cell ){
			if( cell.attr('data-coords') != lastEdit && lastEdit !== ''){
				replaceCellContent();
			}
			insertText( cell );

			setTimeout(function(){
				$(input).focus();

			},100);
			
			
		},
		getMatrix : function(){
			return matrix;
		},
		generateSub : function( start, end ){
			var sub = [],
				subrow = [],
				startArray = start.split(','),
				endArray = end.split(',');

				console.log(startArray)
			for( i = startArray[0] ; i <= endArray[0]  ; i++ ){
				for( j =  startArray[1] ; j <= endArray[1] ; j++ ){
					subrow.push(matrix[i][j])
					console.log( 'MAtrix Element' + i + ' ' + j)
				}
				sub.push(subrow);
			}
			
			console.log(sub)
		},
		extractData :  function ( coords ){

		},
		endEdit : function(){
			replaceCellContent.apply(this);
		}

	}

}();