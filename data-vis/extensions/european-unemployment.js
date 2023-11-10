class EuropeanUnemployment {
    constructor(){
        // set name and id
        this.name = "European Unemployment";
        this.id = "european_unemployment";

        // setup title
        this.title = "European Union Unemployment Rates from October 2018 through to October 2022";

        // set variable that will contain popup text
        this.popupText = null;

    }

    preload(){
        // load data
        const self = this;
        this.data = loadTable(
        './data/european-unemployment/european-unemployment-data-2018.10-2022.10.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
            self.loaded = true;
        });
    }

    setup(){
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // creates new map using mapbox library. See map.js for more details
        this.map = new Map();

        // uses base code from here - https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
        // I have edited the code and added my own functionality to add some popups and create a map that fits the data that I want to show

        // sets up a variable that will contain details of the country the mouse hovers over
        this.hoveredCountry = null;

        // sets up a variable that will contain the popup div
        this.popup = null;

        // this.map.mapData will be referred to a lot, so creates a simpler variable
        const mapData = this.map.mapData;

        const self = this;

        // runs once the map data loads
        mapData.on('load', () => {
            // takes a geojson of mapdata for european countries, geojson taken from here - https://github.com/leakyMirror/map-of-europe
            mapData.addSource('countries', {
                'type': 'geojson',
                'data': './data/map-layers/europe.geojson',
                // generate an id parameter for the datasource, taken from here - https://stackoverflow.com/questions/71198235/mapbox-feature-id-parameter-missing 
                'generateId': true
            });
            // adds the european country layer to the map and fills in european countries
            mapData.addLayer({
                'id': 'country-fills',
                'type': 'fill',
                'source': 'countries',
                'layout': {},
                'paint': {
                    'fill-color': 'blue',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.5
                    ]
                }
            });

            // Sets the festyre-state to true or false based on whether the mouse is hovering over a country. Also fill out popup and hovered country variables
            mapData.on('mousemove', 'country-fills', (e) => {
                if (e.features.length > 0) {
                    if (self.hoveredCountry !== null) {
                        mapData.setFeatureState(
                            { source: 'countries', id: self.hoveredCountry.id },
                            { hover: false }
                        );
                    }
                if (self.popup === null){
                    self.popup = createDiv();
                    self.popup.id("popupBox");
                }
                self.popup.position(mouseX + 330, mouseY);

                self.hoveredCountry = {
                    "name": e.features[0].properties.NAME,
                    "id": e.features[0].id,
                };
                mapData.setFeatureState(
                    { source: 'countries', id: self.hoveredCountry.id },
                    { hover: true }
                    );
                }
            });

            // resets data when the mouse leaves a country
            mapData.on('mouseleave', 'country-fills', () => {
                if (self.hoveredCountry !== null) {
                    mapData.setFeatureState(
                        { source: 'countries', id: self.hoveredCountry.id },
                        { hover: false }
                    );
                }
                self.hoveredCountry = null;
                self.popup.remove();
                self.popup = null;
            });
        });

        // creates a slider so that the user can switch between data from different months
        this.dateSlider = createSlider(1, this.data.getColumnCount()-1, 1, 1);
        this.dateSlider.position(450, 10);
    }

    draw(){
        // finds the current date the user has selected
        const date = this.data.columns[this.dateSlider.value()];

        fill(0);
        noStroke();
        // Writes map title, and the date the user has selected
        textAlign(CENTER, CENTER);
        textSize(16);
        text("Select Date:", 80, 13);
        text(`${date}`, 310, 13);
        text(`${this.title}`, 650, 13);

        // if the user has the mouse point hovered over a country run the show data method that will display data in a popup
        if(this.hoveredCountry !== null){
            this.showData(this.hoveredCountry.name, date);
        }
    }

    destroy(){
        // remove DOM elements
        this.map.mapBox.remove();
        this.dateSlider.remove();
    }

    showData(country, date){
        // initiate variables
        let popup = null;
        let chartData = null;
        // try catch that will attempt to find the country that the mouse is hovering over in the data provided
        try {
            chartData = this.data.findRow(country, "TIME").obj[date];
        } catch {
            // country does not exist in EU unemployment data
        }
        // if the country is not included in EU data, or if data is not included after a certain date (the UK after 2020/09) will inform the user that the data
        // does not exist. Otherwise will display unemployment data in a popup box.
        if (chartData === null || chartData === ":"){
            popup = {
                label: country,
                data: `No data for ${date}`,
            };
        } else {
            popup = {
                label: country,
                data: `Unemployment rate on ${date}: ${chartData}%`,
            };
        }
        // removes past popupText div
        if (this.popupText !== null){
            this.popupText.remove();
        }
        // sets up popup and relevant data
        this.popupText = createDiv();
        this.popupText.id("popupData");
        const popupLabel = createDiv(`${popup.label}`);
        const popupData = createDiv(`${popup.data}`);
        this.popupText.parent("popupBox");
        popupLabel.parent(this.popupText);
        popupData.parent(this.popupText);
    }
}