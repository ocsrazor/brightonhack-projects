
var leapFrame;

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    dimensions = {width: 450, height: 100},
    width = dimensions.width - margin.left - margin.right,
    height = dimensions.height - margin.bottom - margin.top;

var x = d3.scale.linear()
    .domain([10, 180])
    .range([0, width])
    .clamp(true);

var brush = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed);

var svg = d3.select(".slider-wrap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d + "°"; })
      .tickSize(0)
      .tickPadding(12))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("r", 9);

slider
    .call(brush.event)
  .transition() // gratuitous intro!
    .duration(750)
    .call(brush.extent([70, 70]))
    .call(brush.event);

function brushed() {
  var value = brush.extent()[0];

  //if (d3.event.sourceEvent) { // not a programmatic event
  //  value = x.invert(d3.mouse(this)[0]);
  //  brush.extent([value, value]);
  //}
  if (leapFrame) { // not a programmatic event
    if(leapFrame.pointables[0]){
    	value = leapFrame.pointables[0].tipPosition[0];
    	brush.extent([value, value]);
    }
  }

  handle.attr("cx", x(value));
  d3.select("body").style("background-color", d3.hsl(value, .8, .8));
}
Leap.loop(function(frame){
	leapFrame=frame;
	if (leapFrame) { // not a programmatic event
    	if(leapFrame.pointables[0]){
    		slider
    		.call(brush.event)
    		.call(brush.extent(frame.pointables[0].tipPosition[0]))
    		.call(brush.event);
    	}
    }

});