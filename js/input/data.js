(function () {
  
  $dataTable = $('#input');
  $controls = $('section.controls');
  $parent = $('div.spreadsheet');
  $response = $('#status');


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
      rows: 10,
      cols: 4,
      minSpareCols: 1,
      minSpareRows: 1,
      fillHandle: true  
    });
  },

  validate : function(dataset){
    console.log(dataset.length);
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

  parseAll : function(){


    $("#dataDriven-tab").trigger('click');
    var dataset = $dataTable.inputtable('getNonEmptyData');
    if(spreadSheet.validate(dataset)){
        model.setDataset({
          data: dataset,
          range: 1,
          type: 'getData',
          processed: false,
        });
     
      view.displayResponse(' Entire dataset is selected ', 'success');
      $(".controller-handle").trigger('click');
       select.selectAll();
    }
     select.selectAll();
  },

  parseSelected :  function(){

     $("#dataDriven-tab").trigger('click');
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

          if(spreadSheet.validate(dataset)){
           model.setDataset({

            data: dataset ,
          //range:selected,
            type: 'getSelected',
            processed: false
          
            });
          
          view.displayResponse('Data loaded successfully', 'success');
          $(".controller-handle").trigger('click');
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
      $('#drop').slideToggle();
  })
  
  spreadSheet.init();
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
    $("#dataDriven-tab").trigger('click');
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
        select.selectCells(selectedCoords);
        view.displayResponse('Data loaded successfully', 'success');
        $(".controller-handle").trigger('click');
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