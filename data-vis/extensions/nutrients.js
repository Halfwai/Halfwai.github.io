class Nutrients {
    constructor() {
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Nutrients: 1974-2020';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'Nutrients-timeseries';

        // Title to display above the plot.
        this.title = 'Average intake as a percentage of weighted reference nutrient intakes.';

        // Names for each axis.
        this.xAxisLabel = 'year';
        this.yAxisLabel = '%';

        const marginSize = 35;

        // Array of colours
        this.colours = [];

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
            grid: true,

            // Number of axis tick labels to draw so that they are not drawn on
            // top of one another.
            numXTickLabels: 10,
            numYTickLabels: 8,
        };

        // Property to represent whether data has been loaded.
        this.loaded = false;

    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    preload() {
        this.data = loadTable(
        './data/food/nutrient.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true;
        });
    }

    setup() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        // Font defaults.
        textSize(16);

        // Set min and max years: assumes data is sorted by date.
        this.startYear = Number(this.data.columns[1]);
        this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

        for (let i = 0; i < this.data.getRowCount(); i ++){
            this.colours.push(color(random(0, 255), random(0, 255), random(0, 255)));
        }

        // Find min and max pay gap for mapping to canvas height.
        this.minPercentage = 80;        // Pay equality (zero pay gap).
        this.MaxPercentage = 400;
        // max(this.data.getColumn('pay_gap'));
    }

    destroy() {
    }

    draw() {
        textSize(10);

        // popup data array
        let dataPopup = [];

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minPercentage,
                            this.MaxPercentage,
                            this.layout,
                            this.mapPayGapToHeight.bind(this),
                            0);

        // Draw x and y axis.
        drawAxis(this.layout);


        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
                    this.yAxisLabel,
                    this.layout);

        // Plot all pay gaps between startYear and endYear using the width
        // of the canvas minus margins.
        const numYears = this.endYear - this.startYear;

        const labelLocation = {
            x: this.layout.rightMargin * 0.8,
            y: this.layout.topMargin * 1.2,
        };

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (let i = 0; i < this.data.getRowCount(); i++) {
            let previous = null;
            let row = this.data.getRow(i);

            // setup highlighted toggle. When the mouse is over any part of the line this will change to True and allow me to keep track of this to highlight the line
            let highlighted = false;

            let current;

            let label = row.getString(0);

            for(let j = 1; j < numYears; j++){
                // Create an object to store data for the current year.
                current = {
                    // Convert strings to numbers.
                    'year': this.startYear + j - 1,
                    'percentage': row.getNum(j),
                };
                // checks if the mouse is over the line, and if so marks it as highlighted, and adds popup object to an array
                if(dist(mouseX, mouseY, this.mapYearToWidth(current.year), this.mapPayGapToHeight(current.percentage)) < 10){
                    highlighted = true;
                    dataPopup.push({
                        label: label,
                        data: `${current.year}: ${current.percentage}%`,
                        colour: this.colours[i]
                    });
                }
            }
            for(let j = 1; j < numYears; j++){
                current = {
                    // Convert strings to numbers.
                    'year': this.startYear + j - 1,
                    'percentage': row.getNum(j),
                };

                if (previous != null) {
                    // The number of x-axis labels to skip so that only
                    // numXTickLabels are drawn.
                    const xLabelSkip = ceil(numYears / this.layout.numXTickLabels);
                    // Draw the tick label marking the start of the previous year.
                    if (j % xLabelSkip == 0) {
                        drawXAxisTickLabel(previous.year, this.layout,
                                            this.mapYearToWidth.bind(this));
                        }

                    // Draw line segment connecting previous year to current
                    // year pay gap.
                    if(highlighted === true){
                        strokeWeight(3);
                    }
                    stroke(this.colours[i]);
                    line(this.mapYearToWidth(previous.year), this.mapPayGapToHeight(previous.percentage),this.mapYearToWidth(current.year), this.mapPayGapToHeight(current.percentage));
                } else {
                    stroke(this.colours[i]);
                    text(label, labelLocation.x, labelLocation.y + (i * 20));
                }
                strokeWeight(1);
                // Assign current year to previous year so that it is available
                // during the next iteration of this loop to give us the start
                // position of the next line segment.
                previous = current;
            }
        }

        // runs a function from helper-functions to draw the popup box
        drawPopups(dataPopup);
    }

    drawTitle() {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    }

    mapYearToWidth(value) {
        return map(value,
            this.startYear,
            this.endYear,
            this.layout.leftMargin,   // Draw left-to-right from margin.
            this.layout.rightMargin);
    }

    mapPayGapToHeight(value) {
        return map(value,
            this.minPercentage,       // Pay equality (zero pay gap).
            this.MaxPercentage,
            this.layout.bottomMargin,   // Draw left-to-right from margin.
            this.layout.topMargin);
    }
}
