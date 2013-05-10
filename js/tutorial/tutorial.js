socr.tutorial=(function(){
	var _status = "off";
	var _steps = {
		"Introduction to help":[".controller-handle",
				"#showListSlider",
				".dataset-header","#footer"],
		"selectType":["#datadriven-splash",
				".menu-datadriven",
				".menu-simulationdriven"],
		"Experiment loaded":["#simulationdriven-details",
				"#controller-content","#footer"],
		//"spreadsheetSelected":["datadriven-import"],
		"stage":["datadriven-stage"],
        "Initial dataset generated":[".dataset-header","#grsbutton"],
		"Datadriven controller loaded":["#controller-content"],
		"Random samples generated":[".inference-variable","#showListSlider"],
		"generatingDotplot":[".inference-variable"],
        "Sample List generated":["#sampleList"],
        "Dotplot generated":["#dotplot"]
	};
	var _data ;
	$.getJSON("js/tutorial/tutorial-data.json").success(
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

    function _callbacks(opt){
     switch(opt){
         case "register":
             PubSub.subscribe("Introduction to help",socr.tutorial.start);
             //PubSub.publish("Introduction to help",{help:"intro"}) this will trigger it.
             PubSub.subscribe("Experiment loaded",socr.tutorial.start);
             PubSub.subscribe("Initial dataset generated",socr.tutorial.start);
             PubSub.subscribe("Random samples generated",socr.tutorial.start);
             PubSub.subscribe("Datadriven controller loaded",socr.tutorial.start);
             PubSub.subscribe("Dotplot generated",socr.tutorial.start);
             PubSub.subscribe("Sample List generated",socr.tutorial.start);
             console.log("registered");
             break;
         case "unregister":
             console.log("unregistered");
             PubSub.unsubscribe(socr.tutorial.start);
             break;
     }
    }

	return{
		getStatus:function(){
            return _status;
        },
        setStatus:function(status){
            console.log("new state:"+status);
            if(typeof status === "string"){
                if(status === "on"){
                    _status="on";
                    _callbacks("register");
                }
                else{
                    _status = "off";
                    _callbacks("unregister");
                }
                return true
            }
            else
                return false

        },
        toggleStatus:function(){
            console.log("current state:"+this.getStatus());
            try{
                if(_status === "on"){
                    this.setStatus("off");
                }
                else{
                    this.setStatus("on");
                }
            }
            catch(e){
                console.log(e.message);
            }
        },
        setData:function(data){
			_data = data;
			return this;
		},
		start:function(msg,data){
            if(typeof msg === "string"){
                var step = msg;
                console.log(step);
				var ids=_getIds(step);
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

