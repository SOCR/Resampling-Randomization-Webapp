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
        {
            //view.clearAll();
	    //reset the data
	    //model.reset();
            controller.loadController('dataDriven');    
        
	}
	if(setting.to == 'simulationDriven')
        {
	    view.clearAll();
	    //model.reset();
            controller.loadController('simulationDriven');
	    
	}
		
    };
})(jQuery);