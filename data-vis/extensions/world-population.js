class WorldPopulation {
    // setup private variables
    #isPlaying
    constructor(){
        // Name for the visualisation to appear in the menu bar.
        this.name = 'The 20 most populous countries 1960-2021';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'world-population';

        // Property to represent whether data has been loaded.
        this.loaded = false;

        // Set up new bar chart class
        this.barChart = new BarChart();
    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    preload() {
        this.data = loadTable(
        './data/world-population/world-population-1960-2021.csv', 'csv', 'header',
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

        // Sets isPlaying to false so that the animation is not running
        this.#isPlaying = false;

        // Creates data slider and fills it with the values from the data, positions it at the top of the screen
        this.dateSlider = createSlider(4, this.data.getColumnCount()-1, 1, 1);
        this.dateSlider.position(450, 10);

        // Creates play buttons using fontawesome icons
        this.button = createElement("i");
        this.button.class("fa-solid fa-circle-play fa-2xl");
        this.button.position(400, 20);
        // runs a function with the play button is pressed. I use an arrow function because I want to pass this into it without making a new variable 
        this.button.mouseClicked(() => {
            this.play();
        })

        // runs the setup method in the barChart class
        this.barChart.setup(this.data, this.dateSlider.value());

    }

    // remove all DOM elements and clears out the barchart array
    destroy() {
        this.dateSlider.remove();
        this.button.remove();
        this.barChart.bars = [];
    }


    draw() {
        // runs two methos in the barChart, one to update the values based on the slider position, and one to draw the barchart
        this.barChart.update(this.data, this.dateSlider.value());
        this.barChart.draw();

        // Write the title and current date
        textSize(20);
        fill(0);
        textAlign(CENTER, CENTER);
        text(this.data.columns[this.dateSlider.value()], 300, 15);
        text(this.name, 600, 15);

        // Check if the animation is playing, and if so changes the value of the slider every 10 frames
        if (this.#isPlaying === true){
            if (frameCount % 10 === 0){
                const currentValue = this.dateSlider.value();
                this.dateSlider.value(currentValue + 1);
            }
            // Stops the animation when the slider reaches it's last value
            if (this.dateSlider.value() == 65){
                this.play();
            }
        }
    }

    // method to stop and pause the animation
    play(){
        // ternary operator to change the button between play and pause
        this.#isPlaying ? this.button.class("fa-solid fa-circle-play fa-2xl") : this.button.class("fa-solid fa-circle-pause fa-2xl");

        this.#isPlaying = !this.#isPlaying;
    }
}