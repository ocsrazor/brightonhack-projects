(function($) {

    /**
     * Utility function: degrees to radiants.
     * @param {Number} degree
     * @returns {Number|@exp;Math@pro;PI}
     */
    var toRadiant = function toRadiant(degree){
        return Math.PI / 180 * degree;
    };

    $().ready(function() {

        var start, end, baskets, spiralSvg, width = 800, height = 600;
        baskets = {};
        var prevThickness = 50;
        //Used to resize segments
        var index = [1.02, 1.04, 1.05, 0.98, 0.98, 0.96, 0.95, 0.97, 0.95, 0.97];
        //Number of shoppings per year
        var nShoppings = [173, 180, 189, 185, 181, 174, 165, 160, 152, 147];
        var s = 90;
        var i = 0;

        /**
         * Initializes basket data.
         **/
        var loadBaskets = function loadBaskets() {
            var index_counter = indexes_by_year.length;
            for (var i = 1; i < index_counter; ++i) {
                var year = indexes_by_year[i].Year;
                var name = "basket_" + year;
                var scale = nShoppings[i-1];//indexes_by_year[i].Index;
                baskets[name] = new FoodPriceEntity(name, year, scale, 'image/basketFull.svg');
            }
        }();

        console.log(baskets);
    /**
     * Adds a product image to an svg
     * @param {object} svg
     * @param {String} name
     * @param {String} img
     * @param {Number} position
     * @param {Number} size
     * @returns {undefined}
     */
     var loadProductImg = function loadProductImg(svg, name, img, position, size){
            svg.append("image")
                    .attr("id", name)
                    .attr("xlink:href", img)
                    .attr("x", position.x)
                    .attr("y", position.y)
                    .attr("width", size)
                    .attr("height", size);
     }
     /**
      * Initializes spiral svg and return s a ref. to it.
      * @returns {unresolved}
      **/
     var initSpiralSvg = function initSpiralSvg(){

          var svg = d3.select("#main-wrapper").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("align", "center")
                .style("background", '#333')
                .append("g")
                .attr("id", "spiral_inner")
                .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 8) + ")");
        return svg;

     };

     spiralSvg = initSpiralSvg();

    /**
     *
     * @param {object} svg
     * @param {FoodPrice Entity} basket
     * @returns {undefined}
     */
     var drawBasket = function drawBasket(svg, basket) {
            svg.append("image")
                    .attr("id", "img_basket")
                    .attr("xlink:href", basket.sprite)
                    .attr("x", -30)
                    .attr("y", -50)
                    .attr("width", 130)
                    .attr("height", 130)
                    .transition()
                    //.delay(function(d,i) { return i * 10; })
                    .duration(1250)
                    .style('opacity', 1);

        };

        drawBasket(spiralSvg, baskets["basket_2003"]);

    var updateBasketSprite = function updateBasketSprite(year){

            var basket_key = "basket_" + year;
            var basket = baskets[basket_key];

            if(basket.scale >= 185){
               basket.setSprite('image/basketFull.svg');
            }else if(basket.scale>=170 && basket.scale <185){
               basket.setSprite('image/basketSixItems.svg');
            }else if(basket.scale>=160 && basket.scale <170){
               basket.setSprite('image/basketFiveItems.svg');
            }else if(basket.scale>=150 && basket.scale <160){
               basket.setSprite('image/basketFourItems.svg');
            }else if(basket.scale <150){
               basket.setSprite('image/basketTwoItems.svg');
            }
            else{
                //Default
               basket.setSprite('image/basketSixItems.svg');
            }

            //spiralSvg.select("img_basket").attr("xlink:href", basket.sprite);
            //spiralSvg.select("img_basket").remove();
            var el = document.getElementById('img_basket');
			el.parentNode.removeChild(el);
            drawBasket(spiralSvg, basket);

    }

    var updateColor = function updateColor(year){

            var color = ['OliveDrab', 'Olive', 'Orange', 'OrangeRed', 'Red'];

            var basket_key = "basket_" + year;
            var basket = baskets[basket_key];

            if(basket.scale >= 185 ){
                return 'OliveDrab';
            }else if(basket.scale>=170 && basket.scale <185){
                return 'Olive';
            }else if(basket.scale>=160 && basket.scale <170){
                return 'Orange';

            }else if(basket.scale>=150 && basket.scale <160){
                return 'OrangeRed';

            }else if(basket.scale<150){
                return 'Red';

            }
            else{
                //Default
               return 'OliveDrab';
            }

            //spiralSvg.select("img_basket").attr("xlink:href", basket.sprite);
            //spiralSvg.select("img_basket").remove();
            var el = document.getElementById('img_basket');
            el.parentNode.removeChild(el);
            drawBasket(spiralSvg, basket);

    }

    var filter = spiralSvg.append("defs")
        .append("filter")
        .attr("id", "blur")
        .append("feGaussianBlur")
        .attr("stdDeviation", 1);


        var buildSpiral = function buildSpiral(start, end, year, index, nShoppings) {

            var pieces = d3.range(start, end + 0.001, (end - start) / 1000);
            var points = [];

            var calcSpiralData = function(piece) {
                var d = {};
                radiant = toRadiant(piece);
                var radius = 102 * Math.log(radiant);
                d.x = Math.cos(radiant) * radius;
                d.y = -Math.sin(radiant) * radius - 20;
                return d;
            }

            var lineFunction = d3.svg.line()
                    .x(function(d, i) {
                var point = calcSpiralData(d);
                points.push(point);
                return point.x;
            })
                    .y(function(d) {
                var point = calcSpiralData(d);
                return point.y;
            })
                    .interpolate("linear");

            var spiral_inner = d3.select("#spiral_inner")
                    .data(pieces);
            var thickness = 10;
            prevThickness = prevThickness * index;
            var color = updateColor(year);
            spiral_inner.append("path")
                    .attr("id", "p" + i)
                    .attr("fill", "none")
                    .attr("stroke", color)
                    .attr("stroke-width", prevThickness)
                    .attr("d", function(d, i) {
                return lineFunction(pieces);
            });

            var segCenter = points[Math.floor(points.length * 0.5)];

            var dir = {"x": segCenter.x / Math.sqrt(segCenter.x * segCenter.x + segCenter.y * segCenter.y), "y": segCenter.y / Math.sqrt(segCenter.x * segCenter.x + segCenter.y * segCenter.y)};

            var angle = toRadiant((end - start) / 500)

            spiral_inner.append("svg:a")
                        .attr("xlink:href", function(){return "javascript:showPopOver('pop1', " + year + ")"})
                        .append("svg:text")
                        .attr("id", "t"+year)
                        .attr("class", "spiral-year")
                        .attr("title", "Click to view "+year+" food price trend")
                        .attr("x", function() {return segCenter.x + 60 * dir.x})
                        .attr("y", function() {return segCenter.y + 50 * dir.y})
                        .attr("dx", ".12em")
                        .attr("dy", ".12em")
                        .attr("fill", color)
                        .attr("font-weight", "bold")
                        .attr("font-size", 16)
                        .attr("text-anchor", "middle")
                        .text(year);

            spiral_inner.append("svg:text")
                    .attr("id", "shopping_txt_" + nShoppings)
                    .attr("x", function() {return segCenter.x})
                    .attr("y", function() {return segCenter.y})
                    .attr("dx", ".12em")
                    .attr("dy", ".12em")
                    .attr("fill", color)
                    .attr("font-weight", "bold")
                    .attr("font-size", 12)
                    .attr("text-anchor", "middle")
                    .attr("stroke", 'black')
                    .attr("stroke-width", 1)
                    .text(nShoppings);

            var pathEl = d3.select("#p" + i);
            /*d3.select("shopping_txt_" + nShoppings).tooltip(function(d, i) {
                var r, svg;
                r = +d3.select(this).attr('r');
                svg = d3.select(document.createElement("svg")).attr("height", 50);
                g = svg.append("g");
                g.append("rect").attr("width", r * 10).attr("height", 10);
                g.append("text").text("10 times the radius of the cirlce").attr("dy", "25");
                return {
                  type: "popover",
                  title: "It's a me, Rectangle",
                  content: svg,
                  detection: "shape",
                  placement: "fixed",
                  gravity: "right",
                  position: [d.x, d.y],
                  displacement: [r + 2, -72],
                  mousemove: false
                };
                });*/
            pathEl.attr("stroke-dasharray", 1000 + " " + 1000)
                    .attr("stroke-dashoffset", 1000)
                    .transition()
                    .duration(5000)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);
			updateBasketSprite(year);

            pathEl.on("mouseover", function(e) {updateBasketSprite(year);
                d3.select("t"+year).attr("font-size", 16);});

            //$('#p1').on("mouseover", function(e){ console.log(e); });
            //pathEl.on("mouseout", function() {d3.select("t"+year).attr("font-size", 12)});
        }


        var animate = function animate()
        {
            start = i * 36 + s;
            end = (i + 1) * 36 + s;
            var j;
            if (i >= 5)
            {
                j = 10 - i - 1;
            } else
            {
                j = i;
            }

            buildSpiral(start, end, 2003 + i, index[i], nShoppings[i]);

            updateBasketSprite(2003 + i);
            i++;
        }

        animate();
        window.setInterval(function() {
            if (i < 10)
                animate()
        }, 1000);
    });


})(jQuery);