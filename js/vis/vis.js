/*
* The SOCR visualizations module, supports d3 based histogram generation, warning : remove everything else
*/
socr.vis = (function(){
	//private properties and methods
	/*
		Todo : 
		@Check for input data,
		@Check for parent class,
		add 'setter-getter' method for the SVG element for reusability
	*/
	var priv = {};

	var histogram = function(config){
		config = config[0];

		if(typeof config.parent == 'undefined' && config.parent == null){
			displayError('Parent Selector not specified');
			return;
		}
		if(typeof config.data == 'undefined' && config.data == null){
			displayError('Dataset for histogram not entered');
			return;
		}
	try{
		config.parent;
		var rangeDefault = d3.extent( config.data );
		console.log(rangeDefault)
       		//rangeDefault[0] = 0; No longer required
		} catch(err){
		console.log(err);
		return;
	}

	
		  /**
		  * Making all the histograms start from the origin, not sure if it's the right way
		  **/
		 
		    var defaults = {
		      'range' : rangeDefault,
		      'height' : $(config.parent).height(),
		      'width' : $(config.parent).innerWidth(),
		      'bins' : 20,
		      'binSize' : 10
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
		    
       
     //    	var bins = [];
		  	// for(var ii = settings.range[0], jj = 0; ii <= settings.range[1] + 1; ii++, jj++)
			  //     bins[jj] = ii;
			  console.log(settings);
			if(settings.nature == 'continuous'){  
			  	var data = d3.layout.histogram()
			  				 .bins(d3.scale.linear().ticks(settings.bins))
	                		(settings.data);
             } else {
             	var bins = [];
		  		for(var ii = settings.range[0], jj = 0; ii <= settings.range[1] + 1; ii++, jj++)
			      bins[jj] = ii;
             	var data = d3.layout.histogram()
             				.bins(bins)(settings.data);
             }
			           //  .bins(bins)(settings.data);
		    // var data = d3.layout.histogram()
		    // 			.bins(settings.range[1])
		    //           //  .bins(d3.scale.linear().ticks(20))
		    //             //.bins(d3.scale.linear().ticks(100))
		    //             (settings.data);

		                // console.log(settings.data)
		    // var x = d3.scale.ordinal()
		    //         .domain(data.map(function(d) { return d.x; }))
		    //         .rangeRoundBands([0, width - margin.left - margin.right], .1);

		    var x = d3.scale.ordinal()
            .domain(data.map(function(d) { return d.x; }))
            .rangeRoundBands([0, width - margin.left - margin.right], .1);
		   
		    var y = d3.scale.linear()
		       	    .domain([0, d3.max(data, function(d) { return d.y; })])
		            .range([height - margin.top - margin.bottom, 0]);;

		    xAxis = d3.svg.axis()
		    		.scale(x)
		    		.orient("bottom")
		    		//.tickFormat(d3.format(",.0f"))
		    		.tickSize([5]).tickSubdivide(true); 

		    yAxis = d3.svg.axis()
		    		.scale(y)
		    		.orient("left")
		    		// .tickSubdivide(true)
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
		    bar.exit().remove();
		    bar .attr("width", x.rangeBand())
		        .attr("x", function(d) { return x(d.x); })
		        .attr("y", height - margin.top - margin.bottom) 
		        .order()
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

		    /* Broken in case of repeated invokation */    
		    //Reusable components:
		    // g,x,height,margin

		    priv.GElement = g;
		    priv.xScale = x;
		    priv.height = height;
		    priv.margin = margin;

		     if(settings.datum){
        		
				   //  var meanbar = g.append('rect')
				   //  .attr('x',function(){ return x(settings.datum) })
				   //  .attr('y',function(){ return 0;})
				   //  .attr('width', function(){ return 10;})
				   //  .attr('height',function(){ return height - margin.top - margin.bottom ;})
				   //  .attr('class','meanBar')
				   //  .on('mouseover', function(d){ 
				   //    d3.select(this).classed('hover', true) 
				   //    var left = $(this).position().left,
				   //        top = $(this).position().top;

				   //    var content = '<h3> '+ settings.variable +' : ' + settings.datum + '</h3>';

				   //    if(typeof viswrap != 'undefined')
				   //   	 viswrap.tooltip.show([left, top], content, 's');
				   //  })
				   //  .on('mouseout', function(){ 
				   //      d3.select(this).classed('hover', false);
				   //      if(typeof viswrap != 'undefined') 
				   //      	viswrap.tooltip.cleanup();
				   // });



    			}
    
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
		console.log(obj)
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
		console.log(m);
	}

	return {
		generate : function(args){
			histogram.call(this,arguments);
			return priv;		
		},
		addBar : function(args){
			addBar.call(this, arguments);
			//return priv;
		},
		set : function(el, prop){

		}
	}
}())