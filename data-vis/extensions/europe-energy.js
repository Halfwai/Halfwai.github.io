class Energy {
    constructor() {
        // create name for this data visualisation
        this.name = "European Energy Data: 2021"; 

        this.id = "europe-energy";

        // Property to represent whether data has been loaded.
        this.loaded = false;

        // title to display at top of visualisation
        this.title = "European Union Simplified Energy Balances";
    }

    preload() {
        // load data
        this.data = loadTable(
        './data/energy/european-energy-data-2021.csv', 'csv', 'header',
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
        // Create a select DOM element.
        this.select = createSelect();

        // Set select position.
        this.select.position(width/1.68,105);

        // Fill the options with all countries in the EU with available data.
        for(let i = 0; i < this.data.rows.length; i++){
            this.select.option(this.data.getColumn("SIEC (Labels) Thousand tonnes of oil equivalent")[i]);
        }
        // sets select box to first value
        this.select.selected(this.data.rows[1]);

        // setup array of checkboxes
        this.checkBoxes = [];

        // setup array of segments
        const segments = [];

        // create and display checkboxes for each of the potential datapoints in the bar chart
        for(let i = 2; i < this.data.columns.length; i++){
            const checkbox = createCheckbox(this.data.columns[i], false);
            let verticalPosition = 260 + i * 50;
            let horizontalPosition = width/2.5;
            if(verticalPosition > height){
                verticalPosition -= 250;
                horizontalPosition += 500;
            }
            checkbox.position(horizontalPosition, verticalPosition);
            this.checkBoxes.push(checkbox);
            // creates a segment object that will store data to be displayed
            let segment = {
                name: this.data.columns[i],
                value: 0,
                maxLength: 0,
                currentLength: 0,
                colour: color(random(0, 255), random(0, 255), random(0, 255))
            };
            segments.push(segment);
        }

        this.filledBarChart = new FilledBarChart(100, 200, width-200, segments);
    }

    draw() {
        // checks the selectbox for the country that we want to display the data for
        const chartData = this.data.findRow(this.select.value(), "SIEC (Labels) Thousand tonnes of oil equivalent");

        // write chart title
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(30);
        text(`${this.title}`, width/2, 80);
        textSize(12);
        text(`Total Energy Output: ${this.filledBarChart.total} Thousand Tonnes Of Oil Equivalent`, width/2, 130);

        stroke(0);

        // runs both filled bar chard methods, first to fill the data into the chart, then to draw the chart
        this.filledBarChart.fillSegments(chartData, this.checkBoxes);
        this.filledBarChart.draw();
    }

    // removes everything from this data vis if another is picked.
    destroy() {
        this.select.remove();
        for (let i = 0; i < this.checkBoxes.length; i++){
            this.checkBoxes[i].remove();
        }
    }
}