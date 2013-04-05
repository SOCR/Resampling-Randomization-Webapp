socr.dataTable= function () {
  
    $dataTable = $('#input');
    var $controls = $('section.controls');
    $parent = $('div.spreadsheet');
    var $response = $('#status');

  // Drag and Drop site
    $drop = $('#drop');
    $boxsection = $('#fetchURL');
    $urlbox = $boxsection.find('input[name="urlbox"]');
    $urlsubmit = $boxsection.find('input[name="submit"]');
    method = 'sync';

    var splashScreen = $('section#datadriven-splash');
    var excelScreen = $('section#datadriven-import');
    var importScreen = $('section#fetchURL');
    var backSplash = $('a.splash-datadriven');
    var worldbankContainer = $('section#worldbank');
    var simulationDetails = $('section#simulationdriven-details');
    var datastage = $('section#datadriven-stage');
    var resetStage = $('.reset-stage');
    var stageList = $('table.stage-list tbody');

    splashScreen.find('ul li a').on('click',function(){
    
      switch( $(this).attr('data-rel') ){
        case 'spreadsheet' : 
          view.toggleScreens({ visible: excelScreen})
          break;
        case 'fetch' :
          view.toggleScreens({ visible: [excelScreen,importScreen] })
            $urlbox.focus();
          break;
        case 'worldbank' : 
          view.toggleScreens({ visible:  worldbankContainer })
          break;
         default : 
          simulationDriven.init($(this).attr('data-rel'));
      }
    });

   

   var simulationDriven = {
      init : function(arg){
        var expId = arg.substr(4);
        console.log(expId);
        console.log(simulationDriven.expLoaded);
        if($.inArray( expId, simulationDriven.expLoaded))
          simulationDriven.loadData(expId);
        else
          simulationDriven.loadScript(expId);
      },
      expLoaded : [],
      loadScript: function(id){
        $.getScript( 'js/exp/'+id, function(){
          simulationDriven.loadData(id)
        } )
      },
      loadData : function(id){
        console.log('loadData called '+id)
        $.getJSON('js/exp/experiments.json', function(res){
          console.log(res.experiments);
          for(i in res.experiments){
            
            if(id == res.experiments[i].id){
              simulationDriven.displayText({
                title: res.experiments[i].name,
                description: res.experiments[i].description
              });
              break;
            }
          }
         simulationDriven.adjustModel(id) 
        })
      },
      adjustModel : function(id){
          socr.exp.current=socr.exp[id];
          socr.exp.current.createControllerView();
          socr.exp.current.initialize();
          simulationDriven.expLoaded.push(id);
         if(socr.exp.controllerSliderState==0)
          $(".controller-handle").trigger("click");
      },
      displayText : function(details){
          console.log(details);
          splashScreen.hide();
          excelScreen.hide();
          importScreen.hide();
          worldbankContainer.hide();
          simulationDetails.show().find('h3').text(details.title).parent().parent().find('.exp-dscp').html(details.description);
        // simulationDriven.
      },
      resetScreen : function(){
        view.toggleScreens({ visible: splashScreen });
      }

   } ;
    //Settings


  var dragdrop = {
      init : function(){

       // $drop.on('dragover', dragdrop.cancel);
        $drop.on('dragenter', dragdrop.enter);
        $drop.on('drop', dragdrop.drop);
        $urlsubmit.on('click',dragdrop.urlboxsubmit);
        $boxsection.submit(dragdrop.urlboxsubmit);
        tableparse.switchMode();
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

          var inputMethod = tableparse.mode() === 'sync' ? 'loadDataSwift' : 'loadData';
          console.log(inputMethod);
          $dataTable.inputtable(inputMethod,matrix);
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
      },
      /*
      Setter-Getter for mode toggling
      */
      mode : function(option){
        if(arguments.length){
          method = option;
        }
        return method;
      },

      switchMode : function(){
        $('#fetchinstant').click(function(){
          tableparse.mode('sync');
        })
        $('#fetchasync').click(function(){
          tableparse.mode('async');
          console.log('Fetch Async option')
        })
      }


  };
/*
  Ideally should serve as one-stop object for all visual element changes involving datasets
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
          $alertbox.addClass('alert-success')
                    .prepend(' <i class="icon-ok"></i> ');
          break;

        case "error":
          $alertbox.addClass('alert-error')
                  .prepend(' <i class="icon-warning-sign"></i> ');
          break;
      }
    },
    editTitles : function(){
    
      var content = '<form class="form form-horizontal" id="input-titles"><fieldset><legend>Add titles to Spreadsheet</legend><div class="control-group"><label class="control-label">Title</label><div class="controls"><input type="text" placeholder="Input field1"></div></div><div class="control-group"><label class="control-label">Title</label>\
      <div class="controls"><input type="text" placeholder="Input Title"></div></div><div class="control-group"><label class="control-label">Title</label>\
      <div class="controls"><input type="text" placeholder="Input Title"></div></div>\
      <div class="control-group"><label class="control-label">Title</label><div class="controls"><input type="text" placeholder="Input Title"></div></div>\
      <div class="pagination-centered"><input type="submit" class="btn btn-large btn-block"></div></form>';
      $('#input-modal .modal-body').html(content);
    },
    parseTitles : function(e){
      e.preventDefault();
      console.log('Call for parse Titles');
      var titles = [];
      $('#input-titles').find('input[type="text"]').each(function(){
        if($(this).val() !== '')
        titles.push($(this).val());
      })
      spreadSheet.addColHeaders(titles);
      $('#input-modal').modal('toggle');
      view.displayResponse('Titles altered successfully','success');
    },

    toggleScreens : function(options){
      var dataScreens = [splashScreen, excelScreen, importScreen, worldbankContainer, simulationDetails, datastage];
      $.each(dataScreens, function(k,v){
        v.hide();
      });
      $.each(options.visible, function(k,v){
        console.log(v);
        $(v).show();
      });
      
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
      if(dataset.length > 0){

        if(dataset[0][0] === '' && dataset[1][0] === '' && dataset[2][0] === ''){

          view.displayResponse('Dataset appears to be empty','error');
          return false;

        }

        return true;

      } else {

        view.displayResponse('Empty Dataset, Please fill in from the first column ','error');
        return;
      }

      
    },

     addColHeaders : function(arr){
        $dataTable.inputtable({colHeaders : arr});
      },

    addTitles : function(){

      $('<div></div>').appendTo('body')
        .addClass('modal hide fade')
        .html('<div class="modal-header"><div>')
        

    },

    parseAll : function(){
      var dataset = $dataTable.inputtable('getNonEmptyData');
          socr.model.reset();

      $("#accordion").accordion( "activate" , 0);
      try{
          $(this).update({to:'dataDriven'});
      }
      catch(e){
          console.log(e)
      }
      finally{
          $.update({to:'dataDriven'});
      }
      
      if(spreadSheet.validate(dataset)){
        // model.setDataset({
        //   data: dataset,
        //   range: 1,
        //   type: 'getData',
        //   processed: false,
        // });

        console.log('Dataset is valid')
        view.displayResponse(' Entire dataset is selected ', 'success');

      if(socr.exp.controllerSliderState==0)
            $(".controller-handle").trigger("click");
        //select.selectAll();
       } else{
        console.log("Dataset isn't valid")
       // view.displayResponse(' There is some error in the dataset ', 'error');  
      }      
      
      // console.log(dataset);
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
            try{
            $(this).update({to:'dataDriven'});
            }
            catch(e){
                console.log(e.message)
            }
           if(socr.exp.controllerSliderState!=0)
            $(".controller-handle").trigger("click");
            if(spreadSheet.validate(dataset)){
            //  model.setDataset({

            //   data: dataset ,
            // //range:selected,
            //   type: 'getSelected',
            //   processed: false
            
            //   });
            
            var title = '';
            if($dataTable.find('th')){
              title = $dataTable.find('th.active').text();
            }
            stage.addRow(dataset, title)
            console.log(title)
            view.displayResponse('Data added to staging, continue adding more data or select <strong>Proceed</strong>', 'success');
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
           // $dataTable.inputtable({'colHeaders' : false});

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

  };

  var stage = {
    content : [],
    index : 1,
    init : function(){
      view.toggleScreens({ visible: datastage });
      stage.showContent();
    },
    showExcel : function(){
      view.toggleScreens({ visible: excelScreen });
    },
    showContent : function(){
      if(stage.content.length > 0){
        stageList.html('');
        for(i in stage.content){
        
          var elem = stage.content[i].cells.length;
          var name = stage.content[i].name;
          var index = stage.content[i].id;
          var content ='<tr><td>' + name + '</td><td> ' + elem + '</td><td>' + index + '</td></tr>';
          stageList.append(content);

        }
      } else {
        stageList.html('');
        stageList.append('<tr:q:q><td>No Content Selected Yet</td><td></td><td></td></tr>')
      }
    },
    addRow : function(content, name){
      var obj = {};
      obj.name = (name != '') ? name : content[0][0] ;
      obj.cells = content;
      obj.id = parseInt(stage.index);
      stage.content.push(obj);
      stage.index++;
      console.log(stage.content);
    },
    export : function(){
      console.log('Export the following datasets');
      console.log(stage.content);
      var result=socr.model.setDataset({
        type:"spreadsheet",
        values:stage.content,
        range:stage.content.length,
        processed:false
      });
      if(result == true){
          $.update({to:'dataDriven'});
      }
    },
    reset : function(){
      stage.index = 1;
      stage.content = [];
      stage.showContent();
    }   
  }
  //General Pattern
  // stage.content = {

    // id
   //   name : '',
  //   cells : []
  // }
  // stage.content.cell[0] = []

  resetStage.on('click',function(e){
    e.preventDefault();
    stage.reset();
  })

  $controls.find('input[value="Use Entire Dataset"]').on('click', spreadSheet.parseAll );
  $controls.find('.reset-spreadsheet').on('click', spreadSheet.reset );
  $controls.find('input[value="Proceed"]').on('click', stage.init );
  datastage.find('input[value="Spreadsheet"]').on('click', stage.showExcel );
  datastage.find('input[value="Done"]').on('click', stage.export );
  $controls.find('#submatrix_spreadsheet').on('click',spreadSheet.parseSelected );
   backSplash.on('click', simulationDriven.resetScreen);

  $dataTable.parent().on('mouseup', select.checkSelected );
    $('a.dragdrop').on('click', function(){
      $('#fetchURL').slideToggle();
  })

  $controls.find('.edittitles').on('click',view.editTitles);  
  $('#input-modal').on('submit', '#input-titles',view.parseTitles);
  
  spreadSheet.init();
  dragdrop.init();

  return {
    simulationDriven : simulationDriven,
    spreadSheet: spreadSheet,
    view: view
  }
}();
