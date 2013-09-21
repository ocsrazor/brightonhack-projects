/**
 * Displays line chart popup
 * @param {String} divID
 * @param {Number} year
 * @returns {undefined}
 */
function showPopOver(divID, year) {
    var popUpDiv, w, h, left, top;
    popUpDiv = document.getElementById(divID);

    popUpDiv.style.width = 800 + 'px';
    popUpDiv.style.height = 500 + 'px';
    var left = (window.innerWidth / 2) - 400 + "px"
    var top = (window.innerHeight / 2) - 250 + "px";
    popUpDiv.style.left = left;
    popUpDiv.style.top = top;
    popUpDiv.innerHTML = '<h1>' + year + '</h1><div id="chartZoom"><a href="#" id="zoomIn">Zoom In</a> <a href="#" id="zoomOut">Zoom Out</a><a href="javascript:closePopOver(\'pop1\');" title="Close window">Close me</a></div><div id="chart1" class="with-transitions"><svg></svg></div>';

    drawLineChart(year);
    // SHOW THE DIV
    popUpDiv.style.display = "block";
}
/**
 * Closes line chart popup
 * @param {String} divID
 * @returns {undefined}
 */
function closePopOver(divID) {
    // HIDE THE DIV
    document.getElementById(divID).style.display = "none";
}