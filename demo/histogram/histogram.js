function vis(config){

 //Some default variables
 var rangeDefault = d3.extent( config.data );
       rangeDefault[0] = 0;

  /**
  * Making all the histograms start from the zero number, not sure if it's the right way
  **/

    var defaults = {
      'range' : rangeDefault,
      'height' : $(config.parent).height(),
      'width' : $(config.parent).innerWidth(),
      'bins' : 20
    };

  /*
  * Initalized with an empty object, so that the contents of default are not replaced
  */
  
    var settings = $.extend({}, defaults, config);

    //removing the padding from the parent
    $(config.parent).css('padding','0px');

  function chart(){

   // A formatter for counts.
   // var formatCount = d3.format(",.0f");

    var margin = {top: 50, right: 30, bottom: 30, left: 50};
    /*
        h = config.height ? config.height :  $(config.parent).height(),
        w = config.width ? config.width : $(config.parent).width() ;
    */

    /*
    var width = settings.width - margin.left - margin.right,
        height = settings.height - margin.top - margin.bottom;
    */
    var width = settings.width,
        height = settings.height;

    var data = d3.layout.histogram()
              //  .bins(d3.scale.linear().ticks(20))
                .bins(d3.scale.linear().ticks(settings.bins))
                (settings.data);    

    var x = d3.scale.ordinal()
            .domain(data.map(function(d) { return d.x; }))
            .rangeRoundBands([0, width - margin.left - margin.right], .1);
    
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
          .range([height - margin.top - margin.bottom, 0]);

    xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0);
    yAxis = d3.svg.axis().scale(y).orient("left");
    
    // Select the svg element, if it exists.
    var svg = d3.select(settings.parent).selectAll("svg").data([data]);

    // Otherwise, create the skeletal chart.
    var gEnter = svg.enter().append("svg").append("g");
    gEnter.append("g").attr("class", "bars");
    gEnter.append("g").attr("class", "x axis");
    gEnter.append("g").attr("class","y axis");

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
        .attr("height", function(d) { return y.range()[0] - y(d.y); })
        ;

        console.log(settings.datum)

        
    if(settings.datum){
        
        var meanbar = g.append('rect')
        .attr('x',function(){ return x(settings.datum) })
        .attr('y',function(){ return 0;})
        .attr('width', function(){ return 10;})
        .attr('height',function(){ return height - margin.top - margin.bottom ;})
        .attr('class','meanBar')
        .on('mouseover', function(d){ 
          d3.select(this).classed('hover', true) 
          var left = $(this).position().left,
              top = $(this).position().top;
    
          var content = '<h3> '+ settings.variable +' : ' + settings.datum + '</h3>';
    
          viswrap.tooltip.show([left, top], content, 's');
        })
        .on('mouseout', function(){ 
            d3.select(this).classed('hover', false) 
            viswrap.tooltip.cleanup();
       });   
    }
    
    // Update the x-axis.
    g.select(".x.axis")
        .attr("transform", "translate(0," + y.range()[0] + ")")
        .call(xAxis);
    //Update the y-axis
    g.select(".y.axis")
        .call(yAxis);



/*
    var svg = d3.select(settings.parent).append("svg");
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    
  
  */
    /*
        
    var x = d3.scale.linear()
        .domain( [0,settings.range[1]] )
        .range([0, width]);


    */

   

   /*
    var data = d3.layout.histogram()
          .bins(x.ticks(20))
          .range( settings.range )
        (settings.data);

    */
  
    

/*
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        //.tickSize(6,3,0);

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(x)
        .ticks(4);
*/
    

    

  
     
   
   }
  //Default methods
  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
    };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  return chart;
}  