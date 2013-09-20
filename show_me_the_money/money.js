var easing_by_date = {};

var moneyometer_dimensions = {
  margin_top: 10,
  margin_bottom: 0,
  margin_left: 10,
  width: 80,
  height: 580,
  max_money: 350
};

var money;
var moneyometer;
var money_scale;

function setupMoneyOmeter() {

  d3.csv('quantitive_easing.csv', function(rows) {
    for(i=0; i<=rows.length; i++) {
      if (rows[i]) {
        if (rows[i].date) easing_by_date[rows[i].date]=+rows[i].total;
      }
    }
  });

  money_scale = d3.scale.linear()
       .domain([moneyometer_dimensions.max_money, 0])
       .range([0, moneyometer_dimensions.height]);

  moneyometer = d3.select('#moneyandpump').append('svg')
      .attr('width', moneyometer_dimensions.width)
      .attr('height', moneyometer_dimensions.height)
      .attr('class', 'moneyometer')
      .call(d3.svg.axis()
        .scale(money_scale)
        .orient("right")
        .tickFormat(function(d) { return (d > 0) ? "£" + d + "B" : ""; })
        .tickSize(10)
        .tickPadding(12));

  money = moneyometer.append('rect')
    .attr('class', 'money')
    .attr('width', moneyometer_dimensions.width)
    .attr('height', 0)
    .attr('transform', "translate(0," + moneyometer_dimensions.height + ")");

}

function setMoney(amount) {
  if (amount > moneyometer_dimensions.max_money) amount = moneyometer_dimensions.max_money;
  var h = money_scale(moneyometer_dimensions.max_money - amount);
  var y_offset = moneyometer_dimensions.height - h;
  money
    .transition()
    .duration(400)
    .attr('height', h)
    .attr('transform', "translate(0," + y_offset + ")");

}
