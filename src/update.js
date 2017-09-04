/*
 *Plugin to update the app according to the user clicks
 *
 */

(function($){
    $.update=function(callerSettings){
        var setting=$.extend({
            from:'simulationDriven',
            to:'dataDriven'
            },callerSettings || {});
    
    /*
     *if from=''homepage' or 'dd'
     *reset the view
     *load SD controller
     *load default experiment
     *reset MVC objects
     */
        if(setting.to == 'dataDriven'){
            socr.controller.setCurrentMode(x);
            console.log("dataDriven tab has been clicked!");
            socr.controller.loadController('dataDriven');
            console.log('DataSet: '+socr.model.getDataset());
            PubSub.publish("Datadriven controller loaded");
        }
        //never used . Need to remove
    	if(setting.to == 'simulationDriven'){	
    		console.log("Update.js : simulationDriven tab has been clicked!");
    	    $("#input").inputtable('clear'); 		//clear the input sheet 
    	    socr.view.reset();
    		console.log("view cleared");
    	    socr.model.reset();
    		console.log("model reset");
    		socr.controller.loadController('simulationDriven');
    	}
    };
})(jQuery);