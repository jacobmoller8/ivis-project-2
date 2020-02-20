window.inputValue = "happiness";
window.inputPeriod = "2010-2014";

prepMap()

function inputValueChange(value) {
    inputValue = value;
    console.log(inputValue)
    d3.select("svg").remove();
    prepMap()

}
function inputPeriodChange(value) {
    inputPeriod = value;
    console.log(inputPeriod)
    d3.select("svg").remove();
    prepMap()
}

function prepMap() {
    // Set tooltips
    window.format = d3.format(",");
    window.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return (
                "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" +
                "<strong>Population: </strong><span class='details'>" + format(d.population) + "<br></span>" +
                "<strong>" + inputValue.charAt(0).toUpperCase() + inputValue.slice(1) + ": " + "</strong><span class='details'>" + d[inputValue] + "%" + "<br></span>");
        })

    window.margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    window.color = d3.scaleThreshold()
        .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

    window.color = d3.scaleThreshold()
        .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 95])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

    window.path = d3.geoPath();

    window.svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('class', 'map');

    window.projection = d3.geoMercator()
        .scale(120)
        .translate([width / 2, height / 1.4]);

    window.path = d3.geoPath().projection(projection);

    svg.call(tip);

    queue()
        .defer(d3.json, "./data/world_countries.json")
        .defer(d3.tsv, "./data/data-" + inputPeriod + ".tsv")
        .await(ready);

}

function ready(error, data, population) {
    var populationById = {};
    var objectById = {};

    population.forEach(function (d) { objectById[d.id] = +Math.round(parseInt(d[inputValue])); });
    data.features.forEach(function (d) { d[inputValue] = objectById[d.id] });

    population.forEach(function (d) { populationById[d.id] = +d.population; });
    data.features.forEach(function (d) { d.population = populationById[d.id] });

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function (d) { return color(objectById[d.id]); })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        // tooltips
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', function (d) {
            tip.show(d);

            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
        })
        .on('mouseout', function (d) {
            tip.hide(d);

            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        });

    svg.append("path")
        .datum(topojson.mesh(data.features, function (a, b) { return a.id !== b.id; }))
        // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);
}