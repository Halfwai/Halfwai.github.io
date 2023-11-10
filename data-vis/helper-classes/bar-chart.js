class BarChart{
    constructor(){
        this.bars = [];
    }

    // sets up the bar chart and takes an initial year's data to show
    setup(data, year){
        // makes margin size
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

        };

        // gets the total number of countries in the data
        this.numberOfCountries = data.getRows().length;

        // iterates through the data and adds each country as a bar class to this.bars array
        for(let i = 0; i < this.numberOfCountries; i++){
            const country = data.getRow(i).get("Country Name");
            const population = data.getRow(i).get(year);
            const bar = new Bar(this.layout.leftMargin, country, population);
            this.bars.push(bar);
        }

        // runs a sorting method that sorts the data based on population attribute
        this.#sort();

        // sets the max value currently being displayed, by taking the population of the first country in the array
        // after it has been sorted. Note that value 0 in the array is the total global population
        this.maxValue = this.bars[1].population * 1.4;

        // iterates over the bars and sets their initial sizes based on the data
        for(let i = 1; i < this.bars.length; i++){
            const countryWidth = this.#mapCountryWidth(this.bars[i].population);
            this.bars[i].setup(25 + i * 23, countryWidth);
        }

        // update layout labels
        this.layout.xAxisLabel = `Global Population: ${numberWithCommas(this.bars[0].population)}`;
        this.layout.yAxisLabel = 'Country';

        this.globalPopulation = this.bars[0].population;
        this.globalPopulationShown = this.bars[0].population;
    }

    // This method will update the values of each of the bars
    update(data, year){
        // Because the bars are sorted by population each time we need to do a linear search to update each countries population values
        for(let i = 0; i < this.numberOfCountries; i++){
            for(let j = 0; j < this.bars.length; j++){
                if (this.bars[j].country == data.getRow(i).get("Country Name")){
                    if(this.bars[j].population != data.getRow(i).get(year)){
                        this.bars[j].updatePopulation(data.getRow(i).get(year));
                    }
                }
            }
        }

        // Runs a sorting method that uses merge sort
        this.#sort();

        // updates the maxValue var based on the country with the largest population
        this.maxValue = this.bars[1].population * 1.4;

        // updates the width of each countries bar
        for(let i = 1; i < this.bars.length; i++){
            const countryWidth = this.#mapCountryWidth(this.bars[i].population);
            this.bars[i].update(25 + i * 23, countryWidth);
        }

        this.globalPopulation = this.bars[0].population;
        this.globalPopulationShown = Math.trunc(Math.min(parseInt(this.globalPopulationShown) * 1.002, this.globalPopulation));

    }

    // method that sorts the bars in the graph based on population size. Uses merge sort as taught in ADS1.
    #sort(){
        // Runs the merge sort
        this.bars = mergeSort(this.bars);

        // spilts and runs itself recursively until the arrays are of length 1, then sorts and merges each half
        function mergeSort(array){
            if (array.length === 1){
                return array;
            } else {
                const midpoint = Math.floor(array.length/2);
                return merge(mergeSort(array.slice(0, midpoint)), mergeSort(array.slice(midpoint)));
            }
        }

        function merge(left, right){
            let leftIndex = 0;
            let rightIndex = 0;
            let sorted = [];
            while (leftIndex < left.length && rightIndex < right.length){
                if (int(left[leftIndex].population) < int(right[rightIndex].population)){
                    sorted.push(right[rightIndex]);
                    rightIndex ++;
                } else {
                    sorted.push(left[leftIndex]);
                    leftIndex ++;
                }
            }
            while (leftIndex < left.length){
                sorted.push(left[leftIndex]);
                leftIndex ++;
            }
            while (rightIndex < right.length){
                sorted.push(right[rightIndex]);
                rightIndex ++;
            }
            return sorted;
        }
    }

    draw(){
        // runs the draw method for each bar
        for (let i = 1; i < 25; i++){
            this.bars[i].draw(i);
        }

        // draws a white box at the bottom of the screen that covers some off screen bars. This creates the effect of new bars
        // sliding into view as their population pulls them into the top 20
        fill(255);
        rect(0, 507, width, 300);

        // draws the axis
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.layout.xAxisLabel,
            this.layout.yAxisLabel,
            this.layout);

        // Draws tick labels along the x axis every 100 million people.
        for(let i = 0; i < this.bars[1].population * 1.4; i += 100000000){
            textSize(12);
            drawXAxisTickLabel(i, this.layout,
                this.#mapPopulationToWidth.bind(this));
        }

        this.layout.xAxisLabel = `Global Population: ${numberWithCommas(this.globalPopulationShown)}`;
    }

    // maps the population numbers to width for the x axis labels
    #mapPopulationToWidth(value) {
        return map(value,
                0,
                this.maxValue,
                this.layout.leftMargin,   // Draw left-to-right from margin.
                this.layout.rightMargin);
    }

    // maps the width of each bar to the maximum width
    #mapCountryWidth(value){
        return map(value, 0, this.maxValue, 0, this.layout.plotWidth());
    }
}