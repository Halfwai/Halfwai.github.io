class CreatePieChart {
    constructor () {
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Create a Pie Chart';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'create-pie-chart';

        // create a new PieChart class
        this.pie = new PieChart(width - width * 0.4, height / 2, width * 0.4);

        // Create arrays of different pie chart properties
        this.labels = [];
        this.data = [];
        this.colours = [];

        this.loaded = true;
    }

    setup () {
        textSize(12);
        // create input for user generated pie chart title
        this.title = createInput('').attribute('maxlength', 38);
        this.title.position(415,30);

        // create a button for users to add more values to pie chart
        this.addValue = createButton("Add Value");

        // create a button for the user to download the pie chart
        this.savePieChart = createButton("Download Pie Chart");

        // array of basic CSS colours taken from here - https://www.w3.org/wiki/CSS/Properties/color/keywords
        const colours = [
            "black",
            "silver",
            "gray",
            "white",
            "maroon",
            "red",
            "purple",
            "fuchsia",
            "green",
            "lime",
            "olive",
            "yellow",
            "navy",
            "blue",
            "teal",
            "aqua",
        ];

        // sets self to have value of this class
        const self = this;

        // adds 2 sets of values as the minimum needed to make a pie chart
        for (let i = 0; i < 2; i++){
            self.addValueInputs(self, colours);
        }

        // function to run the addvalueimputs class method. Used by a mouse pressed function
        function runAddValueInput(){
            self.addValueInputs(self, colours);
        }

        // runs a function to run the addValueInputs method when the add value button is pressed
        this.addValue.mousePressed(runAddValueInput);

        // Runs a method to download the pie chart when the button is pressed
        this.savePieChart.mousePressed(this.downloadPieChart);
    }

    draw() {
        // Draw titles
        textSize(12);
        strokeWeight(0);
        textAlign(RIGHT, CENTER);
        text("Title of Pie Chart:", 100, 34);
        text("Label", 40, 80);
        text("Value", 140, 80);
        text("Colour", 245, 80);

        // calculates the totals from all the datapoints
        let dataSum = 0;
        for (let i = 0; i < this.data.length; i++){
            const dataNum = this.#checkZero(this.data[i].value());
            dataSum += float(dataNum);
        }

        // creates an array of all the currently entered data
        const data = [];
        // calculates the percentage of each datapoint and adds it to the array
        for (let i = 0; i < this.data.length; i++){
            const dataNum = this.#checkZero(this.data[i].value());
            data.push(float(dataNum/dataSum) * 100);
        }
        // creates an array of each of the labels
        const labels = [];
        for (let i = 0; i < this.labels.length; i++){
            labels.push(this.labels[i].value());
        }
        // creates an array each of the colours
        const colours = [];
        for (let i = 0; i < this.colours.length; i++){
            colours.push(this.colours[i].value());
        }

        // draws the pie chart based on the data entered by the user
        this.pie.draw(data, labels, colours, this.title.value());
    }

    // method that adds additional inputs for more datapoints for the user
    addValueInputs(self, colours){
        // checks if number of values has reached the maximum and returns if so
        if (self.labels.length >= 14){
            alert("Maximum number of values reached")
            return
        }
        // Otherwise creates Dom items for a new value to be shown on the pie chart
        const valueName = createInput('').attribute('maxlength', 18);
        valueName.size(80);
        const valuePercentage = createInput('100').attribute('maxlength', 10);
        valuePercentage.size(80);
        const colourSelect = createSelect();
        let valueY = 100 + (30 * self.data.length);
        valueName.position(320, valueY);
        valuePercentage.position(420, valueY);
        colourSelect.position(520, valueY);
        for(let i = 0; i < colours.length; i++){
            colourSelect.option(colours[i]);
        }
        colourSelect.value(colours[self.data.length]);
        self.addValue.position(320, valueY + 30);
        self.savePieChart.position(420, valueY + 30);
        self.labels.push(valueName);
        self.data.push(valuePercentage);
        self.colours.push(colourSelect);
    }

    // removes all DOM elements when the extension is changed
    destroy(){
        for (let i = 0; i < this.data.length; i++){
            this.data[i].remove();
        }
        this.data = [];
        for (let i = 0; i < this.labels.length; i++){
            this.labels[i].remove();
        }
        this.labels = [];
        for (let i = 0; i < this.colours.length; i++){
            this.colours[i].remove();
        }
        this.colours = [];

        this.title.remove();

        this.addValue.remove();

        this.savePieChart.remove();
    }

    // method that saves and downloads the pie chart
    downloadPieChart(){
        // saved the section of the canvas that the pie chart is located in. Code taken from here - https://editor.p5js.org/2sman/sketches/CBO7jc-gg
        let savedImg = c.get(350,0,width-350,height);
        savedImg.save('my-pieChart', 'jpg');
    }

    #checkZero(x){
        if (x === ""){
            return 0;
        }
        return x;
    }
}