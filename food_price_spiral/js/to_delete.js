(function($){

var toRadiant = function toRadiant(degree){
    return Math.PI/180 * degree;
};

$().ready(function(){

	var start, end, baskets, width = 800, height = 600;
    baskets = {};

    /**
     * Initializes basket data.
     **/
    var loadBaskets = function loadBaskets(){
        var index_counter = indexes_by_year.length;
        for(var i = 1; i < index_counter; ++i){
            var year = indexes_by_year[i].Year;
            var name = "basket_" + year;
            var scale = indexes_by_year[i].Index;
            baskets[name] = new FoodPriceEntity(name, year, scale, 'image/basket.svg');
        }
    };

    loadBaskets();

    var svg = d3.select("#main-wrapper").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("align","center")
            .style("background",'#333')
            .append("g")
            .attr("id", "spiral_inner")
            .attr("transform", "translate(" + width/2 + "," + (height/2+8) +")");

    var drawBasket = function drawBasket(svg, basket){

        svg.append("image")
            .attr("id", "basket_img")
            .attr("xlink:href", basket.sprite)
            .attr("x", -50)
            .attr("y", -50)
            .attr("width", 100)
            .attr("height", 100);

        /*var imgs = svg.selectAll("img").data([0]);
        imgs.enter()
            .append("svg:image")
            .attr("id", "img_basket_" + basket.year)
            .attr("xlink:href", basket.sprite)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", basket.scale)
            .attr("height", basket.scale);*/

    };

    drawBasket(svg, baskets["basket_2003"]);

    var buildSpiral = function buildSpiral(start, end, color,year){

        var pieces = d3.range(start, end+0.001, (end-start)/1000);
		var points=[];

		var calcSpiralData =  function(piece){
            var d = {};
            radiant = toRadiant(piece);
			var radius = 100*Math.log(radiant);
            d.x = Math.cos(radiant) * radius;
            d.y = -Math.sin(radiant) * radius-20;
            return d;
        }

        var lineFunction = d3.svg.line()
                        .x(function(d, i) {   var point = calcSpiralData(d); points.push(point); return point.x; })
                        .y(function(d) {  var point = calcSpiralData(d); return point.y; })
                        .interpolate("linear");

        var spiral_inner = d3.select("#spiral_inner")
                            .data(pieces);

        spiral_inner
            .append("path")
			.attr("id","p"+i)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 10)
            .attr("d", function(d, i){  return lineFunction(pieces); });

		var segCenter = points[Math.floor(points.length*0.5)];

		var dir = {"x":segCenter.x/Math.sqrt(segCenter.x*segCenter.x+segCenter.y*segCenter.y),"y":segCenter.y/Math.sqrt(segCenter.x*segCenter.x+segCenter.y*segCenter.y)};

		var angle = toRadiant((end-start)/500)

		console.log(dir);

		spiral_inner
		.append("svg:text")
		.attr("x", function(){return segCenter.x+50*dir.x})
		.attr("y", function(){return segCenter.y+30*dir.y})
		.attr("dx", ".12em")
		.attr("dy", ".12em")
		.attr("fill", color)
		.attr("font-weight","bold")
		.attr("font-size",16)
		.attr("text-anchor","middle")
		.text(year);

		var pathEl = d3.select("#p"+i);
		console.log(pathEl);

		pathEl.attr("stroke-dasharray", 1000 + " " + 1000)
			.attr("stroke-dashoffset", 1000)
			.transition()
			.duration(5000)
			.ease("linear")
			.attr("stroke-dashoffset", 0);

		pathEl.on("click", function(){
            d3.select(this).attr("stroke-width", 5);
        });

		pathEl.on("mouseover", function(){
			d3.select(this).attr("stroke-width", 15)
		});

		pathEl.on("mouseout", function(){
			d3.select(this).attr("stroke-width", 10)
		});
    }

	var color = ['OliveDrab','Olive','Orange','OrangeRed','Red'];
	var s = 90;
	var i=0;

	/*for (var i =0;i<10;i++)
	{
		start = i*36+s;
		end = (i+1)*36+s;
		var j;
		if(i>=5)
		{
			j=10-i-1;
			console.log(j);
		}else
		{
			j=i;
		}
		buildSpiral(start, end,color[j],2003+i);
	}*/

	var animate = function animate(){
		start = i*36+s;
		end = (i+1)*36+s;
		var j;
		if(i>=5)
		{
			j=10-i-1;
			console.log(j);
		}else
		{
			j=i;
		}
		buildSpiral(start, end,color[j],2003+i);
		i++;
	}
	animate();
	window.setInterval(function(){if(i<10) animate()},1000);
});


})(jQuery);