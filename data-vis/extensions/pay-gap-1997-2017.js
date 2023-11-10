class PayGapTimeSeries {
    constructor() {
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Pay gap: 1997-2017';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'pay-gap-timeseries';

        // Title to display above the plot.
        this.title = 'Gender Pay Gap: Average difference between male and female pay.';

            // Names for each axis.
        this.xAxisLabel = 'year';
        this.yAxisLabel = '%';

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
        './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv', 'csv', 'header',
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
        this.startYear = this.data.getNum(0, 'year');
        this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

        // Find min and max pay gap for mapping to canvas height.
        this.minPayGap = 0;         // Pay equality (zero pay gap).
        this.maxPayGap = max(this.data.getColumn('pay_gap'));
    }

    destroy() {
    }

    draw() {
        fill(0)
        stroke(0)
        strokeWeight(1)

        textSize(16);
        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minPayGap,
                            this.maxPayGap,
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
        let previous;
        const numYears = this.endYear - this.startYear;

        // create array to store popup data
        const popupData = [];

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (let i = 0; i < this.data.getRowCount(); i++) {
            // Create an object to store data for the current year.
            const current = {
                // Convert strings to numbers.
                'year': this.data.getNum(i, 0),
                'payGap': this.data.getNum(i, 3)
            };

            if (previous != null) {
                // Draw line segment connecting previous year to current
                // year pay gap.
                stroke(0);
                line(this.mapYearToWidth(previous.year), this.mapPayGapToHeight(previous.payGap),this.mapYearToWidth(current.year), this.mapPayGapToHeight(current.payGap));

                // The number of x-axis labels to skip so that only
                // numXTickLabels are drawn.
                const xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) {
                drawXAxisTickLabel(previous.year, this.layout,
                                    this.mapYearToWidth.bind(this));
                }
                // if mouse is close to certain points in the graph, adds the relevant data to the popup array
                if (dist(mouseX, mouseY, this.mapYearToWidth(previous.year), this.mapPayGapToHeight(previous.payGap)) < 20){
                    stroke(255,0,0);
                    strokeWeight(10);
                    point(this.mapYearToWidth(previous.year), this.mapPayGapToHeight(previous.payGap));
                    strokeWeight(1);
                    popupData.push({
                        label: previous.year,
                        data: `${previous.payGap.toFixed(2)}%`,
                        colour: "black"
                    });
                }
            }
            // Assign current year to previous year so that it is available
            // during the next iteration of this loop to give us the start
            // position of the next line segment.
            previous = current;
        }
        // calls helper function to draw the popups
        drawPopups(popupData);
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
        this.minPayGap,
        this.maxPayGap,
        this.layout.bottomMargin,   // Draw left-to-right from margin.
        this.layout.topMargin);
    }
}