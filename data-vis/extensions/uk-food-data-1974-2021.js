class FoodData{
    constructor(){
        // Name for the visualisation to appear in the menu bar.
        this.name = "UK Household Purchases 1974 - 2021";

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = "food-gap-bubbles";

        // array to hold each bubble
        this.bubbles = [];

        // array to hold each years data
        this.years = [];
    }

    preload(){
        this.data = loadTable(
        './data/uk-household-purchases/Food-data-1974-2021.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true;
        });
    }

    setup() {
        // create a select box that will show all the years that have data available
        this.select = createSelect();
        for(let i = 5; i < this.data.getColumnCount(); i++){
            let year = this.data.columns[i];
            this.years.push(year);
            this.select.option(year);
        }
        this.select.value(this.data.columns[5]);
        this.select.position(400, 10);

        // runs through the data and gets the data for all datatypes in the L1 column that have L1 defined in the data
        for(let i = 0; i < this.data.getRowCount(); i++){
            const name = this.data.getRow(i).getString("L1");
            if (name != ""){
                let d = [];
                for (let j = 0; j < this.years.length; j++){
                    let v = Number(this.data.getRow(i).get(this.years[j]));
                    d.push(v);
                }
                let unit = this.data.getRow(i).get("Units");
                let b = new Bubble(name, d, unit);
                b.setYear(1);
                this.bubbles.push(b);
            }
        }
    }

    // method that draws this data viz
    draw(){
        // sets the data to be shown as the year from the select box
        let yearIndex = this.years.indexOf(this.select.value());
        // sets each bubbles data accordingly
        for(let i = 0; i < this.bubbles.length; i++){
            this.bubbles[i].setYear(yearIndex);
        }

        // draws each of the bubbles, and adds popup information if the mouse is over the bubble
        push();
        textAlign(CENTER);
        translate(width/2, height/2);

        // creates an array to be filled with popup data if needed
        const dataPopup = [];
        for (let i = 0; i < this.bubbles.length; i++){
            this.bubbles[i].updateDirection(this.bubbles);
            const popup = this.bubbles[i].draw();
            if (popup != undefined){
                dataPopup.push(popup);
            }
        }
        pop();
        // write viz title
        textSize(16);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.name, width/2, 20);

        // runs draw popup function on dataPopup array to draw popups if array has been filled at all.
        drawPopups(dataPopup);
    }

    // clears out the bubbles array and removes DOM elements
    destroy(){
        this.bubbles = [];
        this.select.remove();
    }
}