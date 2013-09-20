var leapFrame;
var delayReset = 5; // increase to reduce leap motion "frame"
var delay = delayReset;
var atEndOfSlide = false; // flag to show rest of text/ info about data
var counter = 0;
var slideVal; 
var lastSlideVal = 0;

var textRevealed = 'The data you are seeing is the number of people recognised by their local authority as homeless per 1000 of county population';

var textHidden = 'Slide To The End For An Explanation Of This Data';

//var poem = 'When resources are tight, and \n
// Green is not to be found \n
// More of us squeeze into, \n
// The same piece of ground. \n

// The essentials for some, are \n
// Green ponds out of town. \n
// For others, our homes are, \n
// Built upon dollars and pounds. \n';

var margin = {top: 0, right: 40, bottom: 200, left: 80},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date(2010, 12, 1), new Date(2013, 6, 1)])
    .range([0, width]);

// Problem here, just hard code no of entries in quarters2 array...
//var dataLength = (chart.quarters2.length -1); // 
var dataLength = 7;

var xData = d3.scale.linear() //scale for mapping slider position to homelessness data
    .domain([0, width])
    .range([0, dataLength])
    .clamp(true);

var brush = d3.svg.brush()
    .x(x)
    .extent([new Date(2010, 12, 1), new Date(2011, 2, 1)])
    .on("brushend", brushended);

var svg = d3.select(".slider-wrap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
    .attr("class", "grid-background")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.month, 3)
        .tickSize(-height)
        .tickFormat(""))
  .selectAll(".tick")
    .classed("minor", function(d) { return d.getHours(); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.month, 3)
      .tickPadding(0))
  .selectAll("text")
    .attr("x", 6)
    .style("text-anchor", null);

d3.select('.explanation').text(textHidden);

var gBrush = svg.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.event);

gBrush.selectAll("rect")
    .attr("height", height);

function brushended() {
  if (delay-- < 0) { // need to reduce leap motion "frame rate"
        delay = delayReset;
        //chart.drawHomelessData(counter++);
        // if (counter > (chart.quarters2.length -1)) { // hardcoded length of homeless data: 8 here
        //     counter = 0;
        // }
    }
  if (!d3.event.sourceEvent) return; // only transition after input
  var extent0 = brush.extent(),
      extent1 = extent0.map(d3.time.month.round);

  // if empty when rounded, use floor & ceil instead
  if (extent1[0] >= extent1[1]) {
    extent1[0] = d3.time.month.floor(extent0[0]);
    extent1[1] = d3.time.month.ceil(extent0[1]);
  }

  d3.select(this).transition()
      .call(brush.extent(extent1))
      .call(brush.event);
}

function updateSlider(leapPoint) {
   if (delay-- < 0) { // need to reduce leap motion "frame rate"
        delay = delayReset;

    var curSlideL = x(brush.extent()[0]);
    var curSlideR = x(brush.extent()[1]);
    var slideVal = Math.floor(xData(curSlideR)); 

    //sanity check: getting bugs here, 
    if(dataLength < 0){
      dataLength = (chart.quarters2.length -1); // 
      if(dataLength < 0) // all else fails - give it something: // total hack - fix this...
        dataLength = 7;
    }

    if(slideVal==dataLength){
      //console.log("show data");
      atEndOfSlide = true;
      d3.select('.explanation').text(textRevealed);
    }
    else{
      atEndOfSlide = false;
      d3.select('.explanation').text(textHidden);
    }

    if(lastSlideVal != slideVal){
      lastSlideVal = slideVal;
      chart.drawHomelessData(slideVal);
      console.log(slideVal);
   }

    // if its -ve - move backwards if its +ve - move fwds:
    if (leapPoint > 0) {
        if (curSlideR > width) { // at end of slide.
            return;
        } else {
            curSlideL = curSlideL + 5;
            curSlideR = curSlideR + 5;
        }
    } else {
        if (curSlideL < 0) { // at beginning of slide
            return;
        } else {
            curSlideL = curSlideL - 5;
            curSlideR = curSlideR - 5;
        }
    }
    gBrush.call(brush.extent([x.invert(curSlideL), x.invert(curSlideR)]))
        .call(brush.event);
      }
      
}

// function updateSlider(leapPoint) {

//     var curSlideL = x(brush.extent()[0]);
//     var curSlideR = x(brush.extent()[1]);

//     // if its -ve - move backwards if its +ve - move fwds:
//     if (leapPoint > 0) {
//         if (curSlideR > width) { // at end of slide.
//             return;
//         } else {
//             curSlideL = curSlideL + 5;
//             curSlideR = curSlideR + 5;
//         }
//     } else {
//         if (curSlideL < 0) { // at beginning of slide
//             return;
//         } else {
//             curSlideL = curSlideL - 5;
//             curSlideR = curSlideR - 5;
//         }
//     }
//     gBrush.call(brush.extent([x.invert(curSlideL), x.invert(curSlideR)]))
//         .call(brush.event);
// }

Leap.loop(function (frame) {
    //leapFrame = frame;
    if (frame) { // not a programmatic event
        if (frame.pointables[0]) {

          updateSlider(frame.pointables[0].tipPosition[0]);

        }
    }
});