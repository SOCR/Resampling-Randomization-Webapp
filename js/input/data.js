(function () {
  
  $dataTable = $('#input');
  $controls = $('section.controls');
  $parent = $('div.spreadsheet');
  $response = $('#status');

// Drag and Drop site
  $drop = $('#drop');
  $boxsection = $('#fetchURL');
  $urlbox = $boxsection.find('input[name="urlbox"]');
  $urlsubmit = $boxsection.find('input[name="submit"]');

var dragdrop = {
    init : function(){
     // $drop.on('dragover', dragdrop.cancel);
      $drop.on('dragenter', dragdrop.enter);
      $drop.on('drop', dragdrop.drop);
      $urlsubmit.on('click',dragdrop.urlboxsubmit);
      $boxsection.submit(dragdrop.urlboxsubmit);
    },
    enter : function(e){
      $(drop).addClass('active');
    },
    drop : function(e){
      console.log(e);
       if (e.preventDefault) e.preventDefault(); // stops the browser from redirecting off to the text.  
          drop.innerHTML = e.dataTransfer.getData('Text') ;
       var a =e.dataTransfer.getData('Text');
          tableparse.init(a);   
    },
    cancel : function(e){
       if (e.preventDefault) e.preventDefault(); // required by FF + Safari
      e.dataTransfer.dropEffect = 'copy'; // tells the browser what drop effect is allowed here
      return false; // required by IE
    },
    urlboxsubmit : function(e){
      e.preventDefault();
      tableparse.init( $urlbox.val() );
    }
};

var tableparse = {
    init : function(url){
       if( url.substr(0,7) !== 'http://'){
         url = 'http://' + url;
      }
      if( tableparse.checkRefer(url) === true)  {
         tableparse.notify();
         tableparse.request(url)
         return true;
      }
       return false;
    },
    notify : function(){
      view.displayResponse('Dataset Request Initialized','success');
      setTimeout(function(){
        $response.slideToggle().html('');
      }, 2000);
    },
    checkRefer : function(url){
      var requestHost = document.createElement("a");
          requestHost.href = url;

          if(window.location.hostname !== requestHost.hostname){
            view.displayResponse('Datasets should be on the same server with the same URL hostname','error');
            return false;
          } else{
            console.log('Dataset Server test passed')
            return true;
          }
    },
    request : function(uri){
      // Fix for FF 
     
      $.get(uri, function(d){

      var tableCount = $(d).is('table') ? $(d).length : $(d).find('table').length,
        tables = $(d).is('table') ? $(d) : $(d).find('table'),
        table = tableparse.filterBySize(tables),
        titles = tableparse.parseHeadings (table);
        matrix = tableparse.htmlToArray(table);  
        $dataTable.inputtable({
          cols : 2,
          minSpareCols: 0
        })
        $dataTable.inputtable('loadData',matrix);
      });
    },

    filterBySize : function(arrayOfTables){
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
    },

    parseHeadings : function(html){
      var title = [];
      $stats = $(html);
      var firstrow = $stats.find('tr').filter(':first');
      
      var element = firstrow.find('th').length > 0 ?'th':'td';

      firstrow.find(element).each(function(){
        title.push( $(this).text() );
      });
      spreadSheet.addColHeaders(title);
      console.log(title + ' '+ element);
      return title;
    },

    htmlToArray : function(html){
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
       }   
       //Removed the first row by default
       matrix.splice(0,1);
       return matrix;
    }


};
/*
  Ideally should serve as one-stop object for all visual element changes
*/
var view = {
  displayResponse : function(content, type){
    $response.html('').slideUp(300);
    $response.append(
    $('<div></div>')
      .addClass('alert')
      .html(content)
      ).slideDown(300);

    var $alertbox = $response.children('div');
    switch(type) {
      
      case "success":
        $alertbox.addClass('alert-success');
        $alertbox.append(' <i class="icon-ok"></i> ');
        break;

      case "error":
        $alertbox.addClass('alert-error');
        break;
    }
  }
}
/*
  Hookups for spreadsheet opterations
*/
var spreadSheet = {

  init : function() {
    /*
    Spreadsheet generation code, pretty much self explanatory
    */ 
    $dataTable.inputtable({
      cols : 8,
      rows : 8,
      minSpareCols: 1,
      minSpareRows: 1,
      fillHandle: true
    });

  },

  validate : function(dataset){
    console.log(dataset);
    if(dataset.length != 0){
      if(dataset[0][0] === '' && dataset[1][0] === '' && dataset[2][0] === ''){
        view.displayResponse('Dataset appears to be empty','error');
        return false;
      }
      return true;
    } else {
      view.displayResponse('Empty Dataset, Please fill in from the first column ','error');
      return false;
    }

    
  },

   addColHeaders : function(arr){
      $dataTable.inputtable({colHeaders : arr});
    },

  parseAll : function(){
    var dataset = $dataTable.inputtable('getNonEmptyData');
    model.reset();
     $("#accordion").accordion( "activate" , 0);
      $(this).update({to:'dataDriven'});    
      if(controllerSliderState!=0)
          $(".controller-handle").trigger("click");
    if(spreadSheet.validate(dataset)){
        model.setDataset({
          data: dataset,
          range: 1,
          type: 'getData',
          processed: false,
        });
     
      view.displayResponse(' Entire dataset is selected ', 'success');
      select.selectAll();
    }
     select.selectAll();
  },

  parseSelected :  function(){
     
     if(select.isSelected()) {
        var selectedCoords = select.isSelected();
        /*
          Selected Cells:
         [ startrow , startCol, endRow, endCol ]
        */
      }
      if(selectedCoords) {

          console.log(' Select Data request with  '+ selectedCoords )  
          var dataset = $dataTable.inputtable('getSelectedData');
          $("#accordion").accordion( "activate" , 0);
          $(this).update({to:'dataDriven'});    
         if(controllerSliderState!=0)
          $(".controller-handle").trigger("click");
          if(spreadSheet.validate(dataset)){
           model.setDataset({

            data: dataset ,
          //range:selected,
            type: 'getSelected',
            processed: false
          
            });
          
          view.displayResponse('Data loaded successfully', 'success');
         // if(controllerSliderState!=0)
         // $(".controller-handle").trigger("click");
           select.selectCells(selectedCoords);
          

         }

     } 
      else {

       view.displayResponse(' No coordinates are selected ', 'error');
      }

  },

  reset : function(){
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
          $response.html('<div class="alert"><a class="close" data-dismiss="alert" href="#">x</a>Clear! Enter some value to get started!</div>'); //display the message in the status div below the done and reset buttons
          $(this).dialog("close"); //close the confirmation window
          $dataTable.inputtable({'colHeaders' : false});

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

}

/*
  All member functions that involve selecting / highlighting
*/   
var select = {

  selectCells : function(coords){
      $dataTable.inputtable('selectCell', coords[0], coords[1], coords[2], coords[3]);
  },
  isSelected : function(){
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
  },
  checkSelected : function() {
     if( select.isSelected() ){
      $('#submatrix_spreadsheet').removeAttr('disabled');
    }
  },
  selectAll : function(){
    console.log('SelectAll member function');
    $dataTable.inputtable('selectEntiregrid');
  }

}

  $controls.find('input[value="Done"]').on('click', spreadSheet.parseAll );
  $controls.find('input[value="Reset"]').on('click', spreadSheet.reset );
  $controls.find('#submatrix_spreadsheet').on('click',spreadSheet.parseSelected );

  $dataTable.parent().on('mouseup', select.checkSelected );
    $('a.dragdrop').on('click', function(){
      $('#fetchURL').slideToggle();
  })
  
  spreadSheet.init();
  dragdrop.init();
  
  Array.prototype.clean = function (deleteValue) {
    for(var i = 0; i < this.length; i++) {
      if(this[i] == deleteValue) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

 var processSpreadsheet = function (e) {
    /*
    
      Process spreadsheet function, takes into consideration two cases
      1. Data is selected, getSelectedData
      2. Entire Dataset
    
    */
    //$("#dataDriven-tab").trigger('click');
    if(select.isSelected()) {
      console.log('Coordinates are selected ' + select.isSelected())
      var selectedCoords = select.isSelected();
      /*
        Selected Cells:
       [ startrow , startCol, endRow, endCol ]
      */
    }
    if(selectedCoords) {
      /* 
          Data is selected, go ahead with extracting submatrix
      */
          model.setDataset({
          data: $dataTable.inputtable('getSelectedData'),
        //range:selected,
          type: 'getSelected',
          processed: false
          });
        console.log('Selected Data is now loaded with '+ selectedCoords)  
      /*
        Uses selectCell property to highlight cells
      */
        setTimeout(function(){
          select.selectCells(selectedCoords);
        },500);
        view.displayResponse('Data loaded successfully', 'success');
      } 
      else {
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
      view.displayResponse('Data loaded successfully', 'success');
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

})();