// Each bar on the animated bar chard has it's own class defined here
class Bar{
    // set up private variables
    #colour;
    #currentY;
    #x;
    #y;
    #currentWidth;
    #width;
    #populationGap;
    // create class
    constructor(x, country, population){
        this.country = country;
        this.population = population;
        this.populationShown = population;
        this.#colour = color(random(0, 255), random(0, 255), random(0, 255));
        this.#x = x;
        this.#currentY = 0;
        this.#y;
        this.#currentWidth = 0;
        this.#width;
        this.#populationGap = 0;
    }

    // sets up bar size
    setup(y, width){
        this.#currentY = y;
        this.#y = y;
        this.#currentWidth = width;
        this.#width = width;
    }

    // updates the bar size
    update(y, width){
        this.#y = y;
        this.#width = width;
        // if data has changed, uses ternary operators to animate the bar when it resizes
        if(this.#currentY != this.#y){
            const yCheck = this.#currentY < this.#y;
            yCheck ? this.#currentY = min(this.#currentY + 2, this.#y):this.#currentY = max(this.#currentY - 2, this.#y);
        }
        if(this.#currentWidth != this.#width){
            const widthCheck = this.#currentWidth < this.#width;
            widthCheck ? this.#currentWidth = min(this.#currentWidth + 2, this.#width) : this.#currentWidth = max(this.#currentWidth - 2, this.#width);
        }

        if(this.populationShown != this.population){
            this.populationShown = Math.trunc(Math.min(parseInt(this.populationShown) + this.#populationGap, this.population));
        }


    }

    // This method is passed a new value to set as population, and updates it's variable. It also calculate a new value for
    // #popupation gap, this is used to animate the numbers so it looks like the numbers are ticking up rather than just 
    // changing year to year
    updatePopulation(population){
        this.population = population;
        this.#populationGap = (this.population - this.populationShown) / 10;
    }

    // draws the bar
    draw(){
        fill(this.#colour);
        rect(this.#x, this.#currentY, this.#currentWidth, 18);
        textAlign(LEFT, TOP);
        textSize(20);
        text(`${this.country}: ${numberWithCommas(this.populationShown)}`, 71 + this.#currentWidth, this.#currentY);
    }
}