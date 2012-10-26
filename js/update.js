/*
 *Plugin to update the app according to the user clicks
 *
 */

(function($){
    $.fn.update=function(callerSettings){
        var setting=$.extend({
            from:'homepage',
            to:'simulationDriven'
            },callerSettings || {});
    
    /*
     *if from=''homepage' or 'dd'
     *reset the view
     *load SD controller
     *load default experiment
     *reset MVC objects
     */
	 
    if(setting.to == 'dataDriven')
        {console.log("dataDriven tab has been clicked!");
       //view.clearAll();
	   //reset the data
	   //model.reset();
       //controller.fire('updateMode','dataDriven');
       controller.loadController('dataDriven');
	   console.log('DataSet: '+model.getDataset());
        
	}
	if(setting.to == 'simulationDriven')
        {	
		console.log("Update.js : simulationDriven tab has been clicked!");
	    $("#input").inputtable('clear'); 		//clear the input sheet 
	    view.reset();
		console.log("view cleared");
	    model.reset();
		console.log("model reset");
		controller.loadController('simulationDriven');
	    }
		
    };
})(jQuery);