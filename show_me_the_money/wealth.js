var wealth = {
  width: 400,
  height: 580,
  rich: {
    start: 40,
    crash_start: 90,
    qe_start: 78,
    end: 100,
    h2wratio: 490/842,
    perk: false
  },
  poor: {
    start: 10,
    crash_start: 15,
    qe_start: 16,
    end: 20,
    h2wratio: 333/842
  }
};

var poorman_image;
var richman_image;
var wealth_gap = {};

//wealth gap men

function setupWealthGap() {

  // d3.csv('wealth_gap.csv', function(rows) {
  //   for(i=0; i<=rows.length; i++) {
  //     if (rows[i]) {
  //       if (rows[i].date) {
  //         wealth_gap[rows[i].date] = { rich: rows[i].rich, poor: rows[i].poor };
  //       }
  //     }
  //   }
  // });

  wealth.rich['scale1']=d3.time.scale()
    .domain([time_span.from, time_span.crash_start])
    .rangeRound([wealth.rich.start, wealth.rich.crash_start]);

  wealth.rich['scale2']=d3.time.scale()
    .domain([time_span.crash_start, time_span.qe_start])
    .rangeRound([wealth.rich.crash_start, wealth.rich.qe_start]);

  wealth.rich['scale3']=d3.time.scale()
    .domain([time_span.qe_start, time_span.to])
    .rangeRound([wealth.rich.qe_start, wealth.rich.end]);

  wealth.poor['scale1']=d3.time.scale()
    .domain([time_span.from, time_span.crash_start])
    .rangeRound([wealth.poor.start, wealth.poor.crash_start]);

  wealth.poor['scale2']=d3.time.scale()
    .domain([time_span.from, time_span.crash_start])
    .rangeRound([wealth.poor.crash_start, wealth.poor.qe_start]);

  wealth.poor['scale3']=d3.time.scale()
    .domain([time_span.qe_start, time_span.to])
    .rangeRound([wealth.poor.qe_start, wealth.poor.end]);

  var h = wealth.poor.start / 100 * wealth.height;
  poorman_image = d3.select("#poormandiv").append("image")
    .attr("xlink:href", "poor.svg")
    .attr("height", h)
    .attr('width', h * wealth.poor.h2wratio)
    .attr("transform", "translate(0," + (wealth.height - h) + ")");

  h = wealth.rich.start / 100 * wealth.height;
  richman_image = d3.select("#richmandiv").append("image")
    .attr("xlink:href", "rich-no-perks.svg")
    .attr("height", h)
    .attr('width', h * wealth.rich.h2wratio)
    .attr("transform", "translate (0," + (wealth.height - h) + ")");

}

function setWealthGap(date) {

  if (date < time_span.crash_start) {
    // get percentage from scale 1
    var richwealth = wealth.rich['scale1'](date);
    var poorwealth = wealth.poor['scale1'](date);

    setRichman(richwealth);
    setPoorman(poorwealth);

  } else if (date < time_span.qe_start) {
    // scale2
    var richwealthTwo = wealth.rich['scale2'](date);
    var poorwealthTwo = wealth.poor['scale2'](date);

    setRichman(richwealthTwo);
    setPoorman(poorwealthTwo);
  } else {
    //scale 3
    var richwealthThree = wealth.rich['scale3'](date);
    var poorwealthThree = wealth.poor['scale3'](date);

    setRichman(richwealthThree);
    setPoorman(poorwealthThree);
  }

}

function setRichman(percentage) {
  var height = percentage / 100 * wealth.height;
  var width = height * wealth.rich.h2wratio;
  var y_offset = wealth.height - height;

  richman_image
    .transition()
    .duration(800)
    .attr('height', height)
    .attr('width', width)
    .attr('transform', "translate(0," + y_offset + ")");

  if (percentage > 98 && !wealth.rich.perk) {
    wealth.rich.perk = true;
    richman_image.attr('xlink:href', 'rich.svg');
  }

  if (percentage <= 98 && wealth.rich.perk) {
    wealth.rich.perk = false;
    richman_image.attr('xlink:href', 'rich-no-perks.svg');
  }

}

function setPoorman(percentage) {
  var height = percentage / 100 * wealth.height;
  var width = height * wealth.poor.h2wratio;
  var y_offset = wealth.height - height;

  poorman_image
    .transition()
    .duration(800)
    .attr('height', height)
    .attr('width', width)
    .attr('transform', "translate(0," + y_offset + ")");
}

