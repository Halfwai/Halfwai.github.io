class BoxOffice {
    // setup private variables
    constructor(){
        // Name for the visualisation to appear in the menu bar.
        this.name = 'USA box office daily revenues 2022';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'us-box-office';

        // array to hold each line in the graph. One line represents one day
        this.lines = [];
    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    preload() {
        this.data = loadTable(
        './data/box-office-revenue/2022-box-office-revenue.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true;
        });
    }

    setup() {
        // check if data has loaded properly
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        const marginSize = 35;
        // Layout object to store all common plot layout parameters and
        // methods.
        this.layout = {
            marginSize: marginSize,

            // Margin positions around the plot. Left and bottom have double
            // margin size to make space for axis and tick labels on the canvas.
            leftMargin: marginSize * 2,
            rightMargin: width - marginSize,
            topMargin: marginSize,
            bottomMargin: height - marginSize * 2,
            pad: 5,

            plotWidth: function() {
                return this.rightMargin - this.leftMargin;
            },

            plotHeight: function() {
                return this.bottomMargin - this.topMargin;
            },

            // Boolean to enable/disable background grid.
            grid: false,

            // Number of axis tick labels to draw so that they are not drawn on
            // top of one another.
            numXTickLabels: 8,
            numYTickLabels: 8,
        };

        this.layout.xAxisLabel = `Time`;
        this.layout.yAxisLabel = 'Revenue($)';

        // gets the total number of entries in the data
        this.databaseLength = this.data.getRows().length;

        let line = [];
        let date = this.data.getRow(0).get("date");

        // iterates through the data and adds each movie to a line array. When the date changes, the line array is added to 
        // the lines array, then cleared for the next days data.
        for(let i = 0; i < this.databaseLength; i++){
            // creates movie object
            let movie = {
                name: this.data.getRow(i).get("title"),
                date: this.data.getRow(i).get("date"),
                revenue: this.data.getRow(i).get("revenue"),
                index: i,
                colour: color(random(0, 255), random(0, 255), random(0, 255))
            };
            // checks if the movie is in a new week. if so pushes full weeks data to this.lines updates the date and resets the line array
            if (movie.date != date){
                this.lines.push(new Line(line));
                date = movie.date;
                line = [];
            }
            // updates the line data if movie in previous week
            if (this.lines.length >= 1){
                let previousWeek = this.lines[this.lines.length - 1].lineBlocks;
                for(let j = 0; j < previousWeek.length; j++){
                    if (movie.name === previousWeek[j].name){
                        movie.index = previousWeek[j].index;
                        movie.colour = previousWeek[j].colour;
                    }
                }
            }
            // pushes movie to the line array
            line.push(movie);
        }
        // pushes the last weeks data to this.lines
        this.lines.push(new Line(line));

        // calculates the biggest weeks revenue so we can map each line to this size
        this.maxLine = 0;
        for(let i = 0; i < this.lines.length; i++){
            const lineSize = this.lines[i].calculateTotalSize();
            if (lineSize > this.maxLine){
                this.maxLine = lineSize;
            }
        }

        // sorts the lines using their index number, and then maps the size of each line
        for(let i = 0; i < this.lines.length; i++){
            this.lines[i].sort();
            this.lines[i].calculateValues(this.maxLine, this.layout);
        }

        // Create sliders to control start and end years. Default to
        // visualise full range.

        this.startSlider = createSlider(1,
                    this.lines.length - 1,
                    1,
                    1);
        this.startSlider.position(400, 10);

        this.endSlider = createSlider(2,
                this.lines.length - 1,
                this.lines.length - 1,
                1);
        this.endSlider.position(600, 10);

        // array of months used as x axis labels
        this.months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
    }

    // remove all DOM elements and clears out the lines array
    destroy() {
        this.lines = [];
        this.startSlider.remove();
        this.endSlider.remove();
    }


    // draw the data visualization
    draw() {
        // draw labels for date sliders
        fill(0);
        noStroke();
        strokeWeight(1);
        textSize(12);
        text("Start Day:", 60, 12);
        text("End Day:", 260, 12);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.name, 600, 12);
        // draws the axis
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.layout.xAxisLabel,
            this.layout.yAxisLabel,
            this.layout);

        textSize(8);
        drawYAxisTickLabels(0,
            this.maxLine,
            this.layout,
            this.#mapRevenueToHeight.bind(this),
            0);

        // makes sure that the date sliders cannot overlap each other
        if (this.endSlider.value() <= this.startSlider.value()){
            this.startSlider.value(this.endSlider.value()  - 1);
        }

        // sets data to be displayed to the current values of the sliders
        let startDay = this.startSlider.value();
        let endDay = this.endSlider.value();

        // calculates how wide each line should be based on the number of day's data to be shown
        const lineWidth = this.layout.plotWidth()/(endDay-startDay);

        // create an array for the popups
        const popups = [];
        // draws each line
        for(let i = startDay; i < endDay; i++){
            // sets a boolean value based on if this line is the last one in the graph
            const lastDayDrawn = i === endDay - 1;
            // creates a small array with the data from the previous week and the next week, this will be used in the line class method to accurately draw each line
            const otherWeeks = [];
            otherWeeks.push(this.lines[i-1]);
            otherWeeks.push(this.lines[i+1]);
            // sets the start point of the line
            const startPoint = (this.layout.leftMargin - lineWidth*startDay) + (i * lineWidth);
            // draws the line, and sets the variable popup as the return value. A value is returned if the mouse is hovering over this line
            const popup = (this.lines[i].draw(startPoint, otherWeeks, lineWidth, lastDayDrawn));
            // if the mouse is over this line and a popup is defined, it's added to the popups array to be displayed
            if (popup != undefined){
                popups.push(popup);
            }
        }

        // Draws month labels along the x axis
        for(let i = 0; i < this.months.length; i ++){
            textSize(12);
            drawXAxisTickLabel(this.months[i], this.layout,
                this.#mapMonthToWidth.bind(this));
        }

        drawPopups(popups);

    }

    // maps the month to the x axis, note that these are averaged over the whole year, rather than having February being slightly smaller etc.
    #mapMonthToWidth(value) {
        for(let i = 0; i < this.months.length; i++){
            if(value === this.months[i]){
                let endValue = this.endSlider.value() / 30.416;
                let startValue =  this.startSlider.value() / 30.416;
                return map(i + 0.5,
                    startValue,
                    endValue,
                    this.layout.leftMargin,   // Draw left-to-right from margin.
                    this.layout.rightMargin);
            }
        }
    }

    // maps the revenue values to the y axis
    #mapRevenueToHeight(value) {
        return map(value,
        0,
        this.maxLine,
        this.layout.bottomMargin,
        this.layout.topMargin);
    }
}