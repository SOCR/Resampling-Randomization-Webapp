socr.tutorial=(function(){
	var _status = "on";
	var _steps = {
		"intro":[".controller-handle",
				"#showListSlider",
				".dataset-header"],
		"selectType":["#datadriven-splash",
				".menu-datadriven",
				".menu-simulationdriven"],
		"simulationSelected":["#simulationdriven-details",
				".controller-handle"],
		//"spreadsheetSelected":["datadriven-import"],
		"stage":["datadriven-stage"],
		"generatingRSamples":["#controller-content .tool",
				"#buttonPanel",
				".inference-variable"],
		"RSamplesGenerated":[".inference-variable","#showListSlider"],
		"generatingDotplot":[".inference-variable"]
	};
	var _data ;
	$.getJSON("js/tutorial-data.json").success(
		function(data){
			socr.tutorial.setData(data)
		}
	);
	function _getIds(step){
		if(step != undefined && (Object.keys(_steps).indexOf(step) != -1)){
			console.log("it works");
			return _steps[step];
		}
		else
			return false
	}
	return{
		getStatus:function(){
            return _status;
        },
        setStatus:function(status){
            if(typeof status === "string"){
                _status = (status === "on")?"on":"off";
                return true
            }
            else
                return false

        },
        setData:function(data){
			_data = data;
			return this;
		},
		start:function(step){
			if(step){
				ids=_getIds(step);
				//break the ids
				//ids=ids.split("/");
				for(var i=0;i<=ids.length-1;i++){
					//infuse the data
					try{
						console.log(ids[i]);
						$(ids[i]).addClass("tutorial").attr("data-intro",_data[ids[i]]["data-intro"]);
						$(ids[i]).attr("data-position",_data[ids[i]]["data-position"]);
						
					}catch(e){
						console.log(e.message);
					}
				}
				$("body").chardinJs("start");
				$("body").on("chardinJs:stop",function(){
					console.log("removing...");
					$(".tutorial").removeAttr("data-intro data-position");
			});
			}
			return this;
		}
	}
})();

