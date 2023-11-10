class CarData{
    constructor(){
        this.name = "Data on car emissions and MPG for cars released from 1984";

        this.id = "car-mpg-data";

        // array that hold the data of all cars taken from the csv file
        this.cars = [];

        // array to hold the data on the cars currently being displayed on screen
        this.carsDisplayed = [];

        // boolean that I'm using to check that the mouse button gets released as there is no inbuilt property in p5.js, only methods that
        // don't really suit the OOP class based structure of my app
        this.mouseCheck = true;
    }

    preload() {
        this.data = loadTable(
        './data/car-data/vehicles.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true
        });
    }

    setup(){
        // check if data has loaded properly
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // store the value of the length of the data
        this.databaseLength = this.data.getRows().length;

        // Store the maximum values of each property I am displaying on my radar graph, this will be used th map individual car data
        let maxCylinders = 0;
        let maxDispl = 0;
        let maxUCity = 0;
        let maxUHighway = 0;
        let maxCo2 = 0;

        // runs through my data, extracts the data I want to display and updates the maximum data if needed
        for (let i = 0; i < this.databaseLength; i++){
            const dataPoints = [];
            const cylinders = parseInt(this.data.getRow(i).get("cylinders"));
            if (cylinders > maxCylinders){
                maxCylinders = cylinders;
            }
            dataPoints.push(cylinders);
            const displ = parseFloat(this.data.getRow(i).get("displ"));
            if (displ > maxDispl){
                maxDispl = displ;
            }
            dataPoints.push(displ);
            const uCity = parseInt(this.data.getRow(i).get("UCity"));
            if (uCity > maxUCity){
                maxUCity = uCity;
            }
            dataPoints.push(uCity);
            const uHighway = parseInt(this.data.getRow(i).get("UHighway"));
            if (uHighway > maxUHighway){
                maxUHighway = uHighway;
            }
            dataPoints.push(uHighway);
            const co2 = parseInt(this.data.getRow(i).get("co2TailpipeGpm"));
            if (co2 > maxCo2){
                maxCo2 = co2;
            }
            dataPoints.push(co2);
            // stores this data in an object
            const car = {
                make: this.data.getRow(i).get("make"),
                model: this.data.getRow(i).get("model"),
                year: this.data.getRow(i).get("year"),
                data: dataPoints
            };
            // pushed this object to the cars array
            this.cars.push(car);
        }

        // Creates a couple of arrays for the max values and labels. Note that each have a length of 5, they should map to the same values so that I can use a 
        // single for loop. I decided against storing them together as an object as I want to keep the radar chart modular and not have to call specific properties,
        // arrays are easier for this. 
        const maxValues = [
            maxCylinders,
            maxDispl,
            maxUCity,
            maxUHighway,
            maxCo2,
        ];

        const labels = [
            "Cylinders",
            "Engine Displacement",
            "City MPG",
            "Highway MPG",
            "Co2 Emission (Grams Per Mile)"
        ];

        // create new radar chart class
        this.chart = new RadarChart(maxValues, labels);

        // Load some DOM content, specifically, 3 select boxes to allow the user to cycle through the different cars
        this.makesSelect = this.#createSelectBox(460, 100, 250);
        let makes = [];
        for(let i = 0; i < this.cars.length; i++){
            makes.push(this.cars[i].make);
        }
        // removes duplicates by first making a set from the makes array, and then turning it back into an array.
        // Uses some code from - https://www.geeksforgeeks.org/how-to-convert-set-to-array-in-javascript/
        makes = Array.from(new Set(makes)).sort();
        this.makesSelect.changed(() => {
            this.fillModelSelect();
        });

        this.modelSelect = this.#createSelectBox(460, 150, 250);
        this.modelSelect.changed(() => {
            this.fillYearSelect();
        });

        this.yearSelect = this.#createSelectBox(460, 200, 250);

        this.select = createButton("Add Car Data to Chart");
        this.select.position(460, 250);

        // calls addOutline method on pressed
        this.select.mousePressed(() => {
            this.addOutline();
        });

        // fills the select box on initial initialization
        this.fillMakesSelect(makes);
        this.fillModelSelect();
        this.fillYearSelect();
    }

    draw() {
        // checks if the mouse button has been released and stores this in mouseChecked
        if(mouseIsPressed === false){
            this.mouseCheck = true;
        }

        // Write text and labels
        stroke(0);
        fill(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(this.name, width/4, 20);
        textAlign(RIGHT);
        text("Car Make:", 130, 102);
        text("Car Model:", 130, 152);
        text("Year Released:", 130, 202);
        textAlign(LEFT, CENTER);
        textSize(12);

        // initialize popups array
        const dataPopups = [];

        // loops through the carsDisplayed array and displays cars that the user has added
        for(let i = this.carsDisplayed.length - 1; i >= 0; i--){
            fill(this.carsDisplayed[i].colour);
            rect(50, 300 + i * 50, 350, 50);
            fill(0);
            const car = this.carsDisplayed[i].car;
            text(`${car.make} ${car.model}`, 60, (300 + i * 50) + 25);
            let buttonColour = 200;
            // initialize a variable to decide whether the car should be removed if the "remove" button is pressed. Initially I used a DOM button 
            // but it interfered with the popup, so I decided instead draw it on the canvas. I have also ordered it this way because I wanted the button
            // to change colour when the mouse was over it, but if I also had the delete code in this if statement it would interfere with future code.
            // Note also how I am using the mouseCheck variable, without this, if the uses holds the mouse button too long it will remove more than one
            // car, this way it takes 1 clear click of the mouse to remove each car from the array.
            let remove = false;
            if(mouseX > 320 && mouseX < 390 && mouseY > 315 + i * 50 && mouseY < 335 + i * 50){
                buttonColour = 150;
                if (mouseIsPressed === true && this.mouseCheck === true){
                    remove = true;
                    this.mouseCheck = false;
                }
            }
            fill(buttonColour);
            rect(320, 315 + i * 50, 70, 20);
            fill(0);
            text("Remove", 333, 325 + i * 50);

            // Check if the mouse is over the car information, and if so highlights the car on the chart, and also shows a popup with detailed information
            if(mouseX > 50 && mouseX < 400 && mouseY > 300 + i * 50 && mouseY < 350 + i * 50){
                this.chart.highlight(this.carsDisplayed[i]);
                dataPopups.push({
                    label: `${car.make} ${car.model}`,
                    data: `Cylinders: ${car.data[0]}, Displacement: ${car.data[1]} L`,
                    colour: this.carsDisplayed[i].colour,
                    extraData: `City: ${car.data[2]} MPG, Highway: ${car.data[3]} MPG, Co2: ${(car.data[4])} GPM`
                });
            // makes the car colour normal if the mouse is not over it
            } else {
                this.chart.normalize(this.carsDisplayed[i]);
            }

            // removes the car from the chart if the player clicked on the remove button from line 185
            if (remove === true){
                this.chart.removeOutline(this.carsDisplayed[i].colour);
                this.carsDisplayed.splice(i, 1);
            }
        }
        // draws the chart
        this.chart.draw();

        // draws the popups
        drawPopups(dataPopups);

        // There is an issue with p5.js where the mouseIsPressed variable is not reset when an alert box is clicked. This is a quick fix to sort this out
        // taken from this thread - https://github.com/processing/p5.js/issues/5524
        mouseIsPressed = false;
    }

    // removes DOM elements and clears arrays when the uses moves to a different extension
    destroy() {
        this.cars = [];
        this.carsDisplayed = [];
        this.makesSelect.remove();
        this.modelSelect.remove();
        this.yearSelect.remove();
        this.select.remove();
    }

    // method to add an outline to the chart
    addOutline(){
        // gets values from DOM elements
        const make = this.makesSelect.value();
        const model = this.modelSelect.value();
        const year = this.yearSelect.value();

        // Alert to let the user know that the maximum number of cars that can be displayed is 5. Technically the chart can display much more, but
        // for usability, and also space I decided that 5 was the maximum number of cars that can be compared to each other on one chart
        if (this.carsDisplayed.length >= 5){
            alert("Limit reached, please remove one or more cars to display new car data");
            return;
        }
        // adds car to cars displayed, and uses data to call chart method. There are a few duplicate cars in the data as is is a very big data source.
        // To prevent duplicates being shown on the chart I break out of this loop once a car has been added
        for (let i = 0; i < this.cars.length; i++){
            if(this.cars[i].make === make && this.cars[i].model === model && this.cars[i].year === year){
                let colour = this.chart.addOutline(this.cars[i]);
                const car = {
                    car: this.cars[i],
                    colour: colour,
                    index: this.carsDisplayed.length
                };
                this.carsDisplayed.push(car);
                break;
            }
        }
    }

    // The following methods fill the select boxes this fresh values as the uses changes the other select boxes
    fillMakesSelect(makes){
        for(let i = 0; i < makes.length; i++){
            this.makesSelect.option(makes[i]);
        }
    }

    fillModelSelect(){
        this.modelSelect.html("");
        const make = this.makesSelect.value();
        let models = [];
        for(let i = 0; i < this.cars.length; i++){
            if(this.data.getRow(i).get("make") == make){
                models.push(this.data.getRow(i).get("model"));
            }
        }

        models = Array.from(new Set(models)).sort();

        for(let i = 0; i < models.length; i++){
            this.modelSelect.option(models[i]);
        }
        this.fillYearSelect();
    }

    fillYearSelect(){
        this.yearSelect.html("");
        const model = this.modelSelect.value();
        const make = this.makesSelect.value();
        let years = [];
        for(let i = 0; i < this.cars.length; i++){
            if(this.data.getRow(i).get("model") === model && this.data.getRow(i).get("make") === make){
                years.push(this.data.getRow(i).get("year"));
            }
        }

        years = Array.from(new Set(years)).sort();

        for(let i = 0; i < years.length; i++){
            this.yearSelect.option(years[i]);
        }
    }

    #createSelectBox(x, y, size){
        let select = createSelect();
        select.position(x, y);
        select.size(size);
        return select;
    }
}