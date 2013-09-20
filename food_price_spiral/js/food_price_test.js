(function($){

var toRadiant = function toRadiant(degree){
    return Math.PI/180 * degree;
}

$().ready(function(){


    console.log(indexes_by_year[0]);

    console.log(indexes_by_year[0].Year);

    //var allDocs = JSON.parse(indexes_by_year);

    var basket = new FoodPriceEntity('basket');

    basket.setData(indexes_by_year);

    console.log(basket);




    var start, end, baskets, width = height = 600;

    baskets = {};

    var svg = d3.select("#main-wrapper").append("svg")
            .attr("width", 600)
            .attr("height", 600)
            .append("g")
            .attr("id", "spiral_inner")
            .attr("transform", "translate(" + width/2 + "," + (height/2+8) +")");

    var initBaskets = function initBaskets(){

        var index_counter = indexes_by_year.length;

        for(var i = 1; i < index_counter; ++i){
            //console.log(indexes_by_year[i]);
            var year = indexes_by_year[i].Year;
            var name = "basket_" + year;
            var scale = indexes_by_year[i].Index;
            baskets[name] = new FoodPriceEntity(name, year, scale, 'image/basket.svg');
        }

    };

    initBaskets();

    var drawBasket = function drawBasket(svg, basket, x, y){

        //Find center x and y of path
        svg.select("#spiral_inner");

        var imgs = svg.selectAll("img").data([0]);
        imgs.enter()
            .append("svg:image")
            .attr("id", "img_basket_" + basket.year)
            .attr("xlink:href", basket.sprite)
            .attr("x", x)
            .attr("y", y)
            .attr("width", basket.scale)
            .attr("height", basket.scale);

    }

    drawBasket(svg, baskets['basket_2003'], "0", "100");

    drawBasket(svg, baskets['basket_2004'],  "0", "-100");





    var buildSpiral = function buildSpiral(start, end, color,year){

        var pieces = d3.range(start, end+0.001, (end-start)/1000);

        var calcSpiralData =  function(piece){
            var d = {};
            radiant = toRadiant(piece);
            var radius = 100*Math.log(radiant);
            d.x = Math.cos(radiant) * radius;
            d.y = -Math.sin(radiant) * radius;
            return d;
        }
        var point;
        var lineFunction = d3.svg.line()
                        .x(function(d, i) {   point = calcSpiralData(d); return point.x; })
                        .y(function(d) {  point = calcSpiralData(d); return point.y; })
                        .interpolate("linear");

        var spiral_inner = d3.select("#spiral_inner")
                            .data(pieces);

        spiral_inner
            .append("path")
            .attr("id","p"+i)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 20)
            .attr("d", function(d, i){  return lineFunction(pieces); });

        spiral_inner
            .attr("stroke-dasharray", 1000 + " " + 1000)
            .attr("stroke-dashoffset", 1000)
            .transition()
            .duration(5000)
            .ease("linear")
            .attr("stroke-dashoffset", 0);





        spiral_inner
        .append("svg:text")
        .attr("id", "text_"+year)
        .attr("x", function(){return point.x * (i>3?(1 + 1/(i+1)):1.3+0.1*(i+1))})
        .attr("y", function(){return point.y * (i>3?(1 + 1/(i+1)):1.3+0.1*(i+1))})
        .attr("dx", ".10em")
        .attr("dy", ".10em")
        .attr("color", color)
        .text(year);

        var segment = d3.select("#p"+i);
        segment.on("click", function(){
            d3.select(this).attr("stroke-width", 10)
        });
    }

    var color = ['OliveDrab','Olive','Orange','OrangeRed','Red'];
    var s = 90;
    var i=0;

    for (var i =0;i<10;i++)
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
    }

    /* var animate = function animate()
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
        i++;
    }
    animate();
    window.setInterval(function(){if(i<10) animate()},1000); */








});

})(jQuery);