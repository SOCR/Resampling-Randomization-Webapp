/*** 
	The SOCR visualizations module
	Current Support 
		- histogram  - 4 methods of caluclating number of classes/bins
		- Line Chart
***/
socr.vis = (function(){
	//private properties and methods
	/*
		@Improve on setter - getter
	*/

	/**
		Priv is the private objects storing settings for the given instance
	**/
	var priv = {};


	var generateLine = function(){

		config = priv;
		
		if(typeof config.parent == 'undefined' && config.parent == null){
			displayError('Parent Selector not specified');
			return;
		}
		if(typeof config.data == 'undefined' && config.data == null){
			displayError('Dataset not specified');
			return;
		}
		if(typeof config.data[0] != 'number'){
			displayError('Only numeric entries accepted');
			return;
		}

	    var defaults = {
	      'range' : d3.extent(config.data),
	      'height' : $(config.parent).height(),
	      'width' : $(config.parent).innerWidth(), // inner width of parent div
	      'type' : 'histogram' ,//Keeping histogram as the default rendering mode
	      'barWidth' : 10
	    };


	  /**
	  * Initalized with an empty object, so that the contents of default are not replaced
	  **/
	  
		 var settings = $.extend({}, defaults, config);
		 console.log(settings);

	   /**
	   * Removing any unnecessary padding from the parent
	   **/	
	    $(config.parent).css('padding','0px');

	    var margin = {top: 50, right: 30, bottom: 30, left: 50};

	    var width = settings.width,
			height = settings.height;

		var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 7];

		var y = d3.scale.linear().domain([0, d3.max(data)]).range([0, height - margin.top - margin.bottom]);

		var x = d3.scale.linear().domain([0,data.length]).range([0, width - margin.left - margin.right]);

		//console.log(x(4))
	    xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.tickFormat(d3.format(',.2f'));

	    yAxis = d3.svg.axis()
	    		.scale(y)
	    		.orient("left")
	    		.tickPadding(5)
	    		.ticks(10)
	    		.tickSize(-(width - margin.right - margin.left), 2, 8);

	     // Select the svg element, if it exists.
	    var svg = d3.select(settings.parent).selectAll("svg").data([data]);

	     // Update the outer dimensions.
	    svg .attr("width", width)
	        .attr("height", height);


	    // Otherwise, create the skeletal chart.
	    //This sequence is important
	    var gEnter = svg.enter().append("svg").append("g");
		    gEnter.append("g").attr("class","y axis")
		    gEnter.append("g").attr("class", "x axis");

	   
	    // Update the inner dimensions.
	    var g = svg.select("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var line = d3.svg.line()
				    .x(function(d,i) { return x(i); })
				    .y(function(d) { return -1 * y(d); })

		gEnter.append("svg:path").attr("d", line(data));
		console.log(data)

	}

	var generateHistogram = function(){

		config = priv;

		if(typeof config.parent == 'undefined' && config.parent == null){
			displayError('Parent Selector not specified');
			return;
		}
		if(typeof config.data == 'undefined' && config.data == null){
			displayError('Dataset for histogram not entered');
			return;
		}
		if(typeof config.data[0] != 'number'){
			displayError('Only numeric entries accepted');
			return;
		}

	    var defaults = {
	      'range' : d3.extent(config.data),
	      'height' : $(config.parent).height(),
	      'width' : $(config.parent).innerWidth(),
	      'bins' : 20,
	      'binSize' : 10,
	      'type' : 'histogram' //Keeping histogram as the default rendering mode
	    };


	  /**
	  * Initalized with an empty object, so that the contents of default are not replaced
	  **/
	  
		 var settings = $.extend({}, defaults, config);

	   /**
	   * Removing any unnecessary padding from the parent
	   **/	
	    $(config.parent).css('padding','0px');

	    var margin = {top: 50, right: 30, bottom: 30, left: 50};

	    var width = settings.width,
			height = settings.height;

      /* This does all the good work of the construction of bins, most likely to break the execution of code */
		
      switch(settings.method){

      	case 'decimal' : 
      			var data = d3.layout.histogram().bins(d3.scale.linear().ticks(settings.bins))	
	                (settings.data);
	          break;

	      case 'discrete' : 
	      		var bins = [];
		  		  for(var ii = settings.range[0], jj = 0; ii <= settings.range[1] + 1; ii++, jj++)
			      bins[jj] = ii;         
            var data = d3.layout.histogram().bins(bins)(settings.data);
            break;

        case 'thumbRule' : 
        		var data = d3.layout.histogram().bins(Math.floor(Math.sqrt(settings.data.length)))(settings.data);
            break;

        default : 
        		//Uses Sturges Formula as a default
        		var data = d3.layout.histogram()(settings.data);

      }

			          
		var classes = data.map(function(d) { return d.x; });	          
	  	var x = d3.scale.ordinal()
        	 .domain(data.map(function(d) { return d.x; }))
        	 //.domain([0, d3.max(settings.data)])
        	.rangeRoundBands([0, width - margin.left - margin.right], 0);
	   // console.log('Scale Initialization : ' + x(settings.datum) );

	    var y = d3.scale.linear()
	       	    .domain([0, d3.max(data, function(d) { return d.y; })])
	            .range([height - margin.top - margin.bottom, 0]);;

	    xAxis = d3.svg.axis()
	    		.scale(x)
	    		.orient("bottom")
	    		.tickFormat(d3.format(',.2f'));

	    yAxis = d3.svg.axis()
	    		.scale(y)
	    		.orient("left")
	    		.tickPadding(5)
	    		.ticks(10)
	    		.tickSize(-(width - margin.right - margin.left), 2, 8);

	    // Select the svg element, if it exists.
	    var svg = d3.select(settings.parent).selectAll("svg").data([data]);

	    // Otherwise, create the skeletal chart.
	    //This sequence is important
	    var gEnter = svg.enter().append("svg").append("g");
		    gEnter.append("g").attr("class","y axis");
		    gEnter.append("g").attr("class", "bars")
		    gEnter.append("g").attr("class", "x axis");

	    // Update the outer dimensions.
	    svg .attr("width", width)
	        .attr("height", height);

	    // Update the inner dimensions.
	    var g = svg.select("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    // Update the bars.
	    var bar = svg.select(".bars").selectAll(".bar").data(data);
	    bar.enter().append("rect");
	    // bar.exit().remove();
	  

	  	 if(settings.datum){

	  	 	var meanClass = function(datum){

	  	 		for(i in classes){
	  	 			if(classes[i] > datum){
	  	 				return [classes[i-1],classes[i]];
	  	 				break;
	  	 			}
	  	 		}
	  	 	}

	  	 	var interval = meanClass(settings.datum);

	  	 	var interpolateWidth =((settings.datum - interval[0])/ (interval[1] - interval[0]))*x.rangeBand();
	  	 	
    			 
			    var meanbar = g.append('rect')		    
			    .attr('y',function(){ return 0;})
			    .attr('width', function(){ return 10;})
			    .attr('height',function(){ return height - margin.top - margin.bottom ;})
			    .attr('class','meanBar')
			    .on('mouseover', function(d){ 
			      d3.select(this).classed('hover', true) 
			      var left = $(this).position().left,
			          top = $(this).position().top;

			      var content = '<h3> '+ settings.variable +' : ' + settings.datum + '</h3>';

			      if(typeof viswrap != 'undefined')
			     	 viswrap.tooltip.show([left, top], content, 's');
			    })
			    .on('mouseout', function(){ 
			        d3.select(this).classed('hover', false);
			        if(typeof viswrap != 'undefined') 
			        	viswrap.tooltip.cleanup();
			   });

			    if(settings.method == 'decimal'){
			    	meanbar.attr('x',function(){ return (x.rangeBand()/2)+x(settings.datum) - (10/2)})
			    } else{
			    	meanbar.attr('x',function(){ return x(interval[0]) + interpolateWidth - 5; });
			    }

			}
				
	    bar.attr("width", x.rangeBand() )
	        .attr("x", function(d) { return x(d.x); })
	        .attr("y", height - margin.top - margin.bottom) 
	        // .order()
	        .on('mouseover', function(d){ 
	          d3.select(this).classed('hover', true) 
	        })
	        .on('mouseout', function(){ 
	          d3.select(this).classed('hover', false) 
	        })
	        .transition()
	         .delay( function(d,i){ return i*50; } )
	        .attr("y", function(d) { return y(d.y); })
	        .attr("height", function(d) { return y.range()[0] - y(d.y); });

	    //Reusable components:
	    // g,x,height,margin

	    // priv.GElement = g;
	    // priv.xScale = x;
	    // priv.height = height;
	    // priv.margin = margin;

	    

	    // Update the x-axis.
	    g.select(".x.axis")
	        .attr("transform", "translate(0," + y.range()[0] + ")")
	        .call(xAxis);
	    //Update the y-axis
	    g.select(".y.axis")
	        .call(yAxis);

	    SVGElement = g;

	}

	var addBar = function(obj){
		if(typeof obj[0].elem.GElement=='undefined')
			return;
		var g = obj[0].elem.GElement,
			x = obj[0].elem.xScale,
			height = obj[0].elem.height,
			margin = obj[0].elem.margin;
			barWidth = obj[0].barWidth | 10;

	    var meanbar = g.append('rect')
		    .attr('x',function(){ return (x.rangeBand()/2)+x(obj[0].datum) - (barWidth/2)})
		    .attr('y',function(){ return 0;})
		    .attr('width', function(){ return barWidth;})
		    .attr('height',function(){ return height - margin.top - margin.bottom ;})
		    .attr('class','meanBar')
		    .on('mouseover', function(d){ 
		      d3.select(this).classed('hover', true) 
		      var left = $(this).position().left,
		          top = $(this).position().top;

		      var content = '<h3> '+ obj[0].variable +' : ' + obj[0].datum + '</h3>';

		      if(typeof viswrap != 'undefined')
		     	 viswrap.tooltip.show([left, top], content, 's');
		    })
		    .on('mouseout', function(){ 
		        d3.select(this).classed('hover', false);
		        if(typeof viswrap != 'undefined') 
		        	viswrap.tooltip.cleanup();
		   });
	}

	var displayError = function(m){
		console.log(priv)
		$(priv.parent).html(m)
	}

	return {
		generate : function(){

			 priv = arguments[0];
			 // console.log(priv);
			// if(priv.type == 'line')
			// 	generateLine();
			// else
				generateHistogram();
			
			return 'blank';		
		},
		addBar : function(args){
			addBar.call(this, arguments);
			//return priv;
		},
		set : function(el, prop){

		}
	}
}())