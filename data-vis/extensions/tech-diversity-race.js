class TechDiversityRace {
    constructor() {
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Tech Diversity: Race';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'tech-diversity-race';

        // Property to represent whether data has been loaded.
        this.loaded = false;

        // Create a new pie chart object.
        this.pie = new PieChart(width / 2, height / 2, width * 0.4);
    }

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
    preload() {
        this.data = loadTable(
        './data/tech-diversity/race-2018.csv', 'csv', 'header',
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
        this.select.position(width/2,100);

        // Fill the options with all company names.
        for(let i = 0; i < this.data.columns.length; i++){
            this.select.option(this.data.columns[i]);
        }
        this.select.selected("Facebook");
    }

    destroy() {
        this.select.remove();
    }

    draw() {
        // Get the value of the company we're interested in from the
        // select item.
        // Use a temporary hard-code example for now.

        let companyName = this.select.value();

        // Get the column of raw data for companyName and covert to numbers
        const col = stringsToNumbers(this.data.getColumn(companyName));

        // Copy the row labels from the table (the first item of each row).
        const labels = this.data.getColumn(0);

        // Colour to use for each category.
        const colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

        // Make a title.
        const title = 'Employee diversity at ' + companyName;

        // Draw the pie chart!
        this.pie.draw(col, labels, colours, title);
    }
}