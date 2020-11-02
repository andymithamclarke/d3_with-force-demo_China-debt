// Load in Data

const debtData = d3.csv("china.csv")
                .then(function(res) {
                    
                    // Clean Data Object 
                    const clean = createDataObject(res);

                    // Create nodes
                    const nodes = nodeCreator(clean);
                    
                    // Function to force Simulation

                    
                    var motion = d3.forceSimulation(nodes)
                        .force("charge", d3.forceManyBody().strength(5))
                        .force("x", d3.forceX().x(function(d){
                            return xCenter[d.catagory]
                        }))
                        .force("collision", d3.forceCollide().radius(function(d) {
                            return d.r * 2;
                        }))
                        .on("tick", ticked)
                    

                    // Call function to position labels 
                    labelPosition()
                    
                    // Function to be called on tick

                    function ticked() {
                        var svgElement = d3.select("#svgElement").selectAll("circle").data(nodes);

                        const tooltip = createTooltip();

                        svgElement.enter()
                            .append("circle")
                            .attr("id", function(d, i) {
                                return "data" + i;
                            })
                            .attr("r", function(d) {
                                return d.r * 2;
                            })
                            .style("fill", function(d) {
                                return d.color;
                            })
                            .merge(svgElement)
                            .attr("cx", function(d) {
                                return d.x + 200;
                            })
                            .attr("cy", function(d) {
                                return d.y + 350;
                            })
                            .on("mouseover", function(d, i) {
                                this.style.opacity = 0.7;
                                d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.country + "   " + d.r + "%")
                                             
                            })
                            .on("mousemove", function(d, i) {
                                d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
                            })
                            .on("mouseout", function(d, i) {
                                this.style.opacity = 1;
                                d3.select('#tooltip').style('opacity', 0)
                            })
                            

                        svgElement.exit().remove();
                    }
                });




// Function to create nodes from data 
const nodeCreator = (data) => {

    const numNodes = data.length;
    const myScaleColor = d3.scaleLinear()
                    .domain([0, 5])
                    .range(["#4056A1", "#F13C20"]);
    
    const nodes = data.map(function(d, i) {

        if (data[i].continent === "Asia") {
            return {
                country: data[i].country,
                r: data[i].gdpDebt,
                cx: i * 10,
                cy: data[i].gdpDebt,
                color: myScaleColor(0),
                catagory: 0
            }
        } else if (data[i].continent === "Europe") {
            return {
                country: data[i].country,
                r: data[i].gdpDebt,
                cx: i * 10,
                cy: data[i].gdpDebt,
                color: myScaleColor(1),
                catagory: 1
            }
        } else if (data[i].continent === "Oceania") {
            return {
                country: data[i].country,
                r: data[i].gdpDebt,
                cx: i * 10,
                cy: data[i].gdpDebt,
                color: myScaleColor(2),
                catagory: 2
            }
        } else if (data[i].continent === "Africa") {
            return {
                country: data[i].country,
                r: data[i].gdpDebt,
                cx: i * 10,
                cy: data[i].gdpDebt,
                color: myScaleColor(3),
                catagory: 3
            }
        } else if (data[i].continent === "Middle-East") {
            return {
                country: data[i].country,
                r: data[i].gdpDebt,
                cx: i * 10,
                cy: data[i].gdpDebt,
                color: myScaleColor(4),
                catagory: 4
            }
        }
    })
    return nodes
}

// Function to clean data 
const createDataObject = (data) => {
    
    d = [];
    data.forEach(function(item) {
        if (item.cfr_index_of_debt_to_china.slice(1, 2) === ".") {
            
            d.push({
                country: item.country,
                gdpDebt: parseFloat(item.cfr_index_of_debt_to_china.slice(0, 4)),
                continent: item.continent
            })
        } else if (item.cfr_index_of_debt_to_china.slice(0, 1) === "N") {
            let x = 1;
        } else {
            
            d.push({
                country: item.country,
                gdpDebt: parseFloat(item.cfr_index_of_debt_to_china.slice(0, 5)),
                continent: item.continent
            })
        }
        
    })
    return d
}

// Function to create tooltip 
const createTooltip = function() {
    var tooltip = d3.select(".visualisation")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("opacity", 0)
    return tooltip
}



// Function to return array of dynamic xPositions
const pageWidthScale = function() {

    const pageWidth = document.querySelector('.visualisation').getBoundingClientRect().width;

    const myScaleWidth = d3.scaleLinear()
                    .domain([0, 5])
                    .range([0, pageWidth - (pageWidth / 10)]);

    return [myScaleWidth(0), myScaleWidth(1), myScaleWidth(2), myScaleWidth(3), myScaleWidth(4)];
    
}


// Function to position labels dynamically

const labelPosition = () => {

    const labels = document.querySelectorAll('.label');

    labels.forEach(function(item, index) {

        item.style.left = (xCenter[index] + "px";
        item.style.top = '150px'

    })

}


// Useful vars

var xCenter = pageWidthScale();
