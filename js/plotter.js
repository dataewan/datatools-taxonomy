
colourscale = function(category){
    if (category === "Presentation"){
        return "#29A8BB";
    }
    if (category === "Storage"){
        return "#b91162";
    }
    if (category === "Analysis"){
        return "#a9b500";
    }

}


d3.json("ratings.json", function(data){
	var categories = ["Good results quickly",
						"Training requirements",
						"Flexible",
						"Automatable",
						"Powerful",
						"Good for easy tasks",
						"Good for complex tasks",
            "Good with big data",
            "Fun"]

	var xselect = d3.select('#xselect');
	var yselect = d3.select('#yselect');

    var xcategorylabel = d3.select('#xcategorylabel');
    var ycategorylabel = d3.select('#ycategorylabel');

	// init the selected values of the x and y axis to the first and second items in the lists
	var xlab = categories[0];
	var ylab = categories[1];

	// setup the x axis selector
	xselect
		.selectAll("li")
		.data(categories)
		.enter()
		.append("li")
		.html(function(d) { return d; })
		.classed("selected", function(d){
			return d === xlab;
		})
		.on('click', function(d){
			xlab = d;
			updateChart();
			updateMenus();
		})

	// setup the y axis selector
	yselect
		.selectAll("li")
		.data(categories)
		.enter()
		.append("li")
		.html(function(d) { return d; })
		.classed("selected", function(d){
			return d === ylab;
		})
		.on('click', function(d){
			ylab = d;
			updateChart();
			updateMenus();
		})

	// variables that control the size of the plot
	var height = 600;
	var width  = 600;
	var padding= 100;

	// this holds the data for the selected point
	var selectedpoint;

	// create the plot objects
	var svg = d3.select('#taxplot')
		.append("svg")
		.attr("width", width + 2*padding)
		.attr("height", height + 2*padding);

	var plot = svg
		.append("g")
		.attr("transform", "translate("+ padding +","+ padding +")");

	// setup the xscale
	var xscale = d3.scale.linear()
		.domain([-5, 5])
		.range([0, width]);

	// draw the xaxis
	var xaxis = d3.svg.axis()
		.scale(xscale)
	plot.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, "+ height/2 +")")
		.call(xaxis);

	// setup the yscale
	var yscale = d3.scale.linear()
		.domain([-5, 5])
		.range([height, 0]);
	// draw the yaxis
	var yaxis = d3.svg.axis()
		.scale(yscale)
		.orient("left")
	plot.append("g")
		.attr("class", "y axis")
    .attr("transform", "translate("+ width/2 +", 0)")
		.call(yaxis);

	// there are some labels that provide additional information. select these for use later
	var toollabel = d3.select('#toollabel');
	var xinfo     = d3.select('#xinfo');
	var yinfo     = d3.select('#yinfo');

	// plot the points
	plot.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
			.attr("cx", function(d) { return xscale(d['Ratings'][xlab]['rating'] + jitter(0.5) ); })
			.attr("cy", function(d) { return yscale(d['Ratings'][ylab]['rating'] + jitter(0.5) ); })
			.attr("r", 10)
			.attr("fill", function(d) { return colourscale(d['Type']) ;} )
			.style("opacity", 0.5)
			.on('mouseover', function(d){
				plot.selectAll('circle')
					.style('opacity', 0.5)
					.attr('r', 10);

				d3.select(this)
					.transition()
					.duration(200)
					.style("opacity", 1)
					.attr('r', 15);

				selectedpoint = d;

				toollabel.html(d.Tool);
				// These take additional information from the json and add it
				xinfo.html(d['Ratings'][xlab]['comment']);
				yinfo.html(d['Ratings'][ylab]['comment']);
                xcategorylabel.html(xlab);
                ycategorylabel.html(ylab);

			})
			.on('mouseout', function(d, i){
				// d3.select(this)
				// 	.transition()
				// 	.duration(100)
				// 	.style("opacity", 0.5);
			});

	// on update of the axis selectors, make sure that the axis options have the correct values.
	function updateMenus(){
		xselect.selectAll("li")
			.classed("selected", function(d){
				return d === xlab;
			});
		yselect.selectAll("li")
			.classed("selected", function(d){
				return d === ylab;
			});
		// TODO, want to make the category labels update.

	};

	function updateChart(){
			plot.selectAll('circle')
				.transition()
				.duration(500)
				.attr("cx", function(d) { return xscale(d['Ratings'][xlab]['rating'] + jitter(0.5) ); })
				.attr("cy", function(d) { return yscale(d['Ratings'][ylab]['rating'] + jitter(0.5) ); })

			if (typeof selectedpoint === "undefined"){
				// if the selected point is underfined, clear the info panels
				xinfo.html("");
				yinfo.html("");
			} else {
				// extract the data from the selected point to update the additional information stuff
				xinfo.html(selectedpoint['Ratings'][xlab]['comment']);
				yinfo.html(selectedpoint['Ratings'][ylab]['comment']);
                xcategorylabel.html(xlab);
                ycategorylabel.html(ylab);

			}

		}

	function jitter(level){
		// returns a random number, to prevent overplotting
		return (Math.random() - 0.5) * level;
	}
});
