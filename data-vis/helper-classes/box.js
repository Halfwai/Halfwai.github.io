// Class for each box on the waffle chart
class Box{
    #x;
    #y;
    #width;
    #height;
    constructor(x, y, width, height, category, game) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.category = category;
        this.game = game;
    }

    // method to check if the mouse is hovering over the box, and then draws the popup if needed
    mouseOver(mouseX, mouseY){
        // create array to store popup data
        const popupData = [];
        if(mouseX > this.#x && mouseX < this.#x + this.#width && mouseY > this.#y && mouseY < this.#y + this.#height && this.category != undefined){
            popupData.push({
                label: this.game,
                data: `Type: ${this.category.name}`,
                colour: "black"
            });
        }
        drawPopups(popupData);
    }

    // draws the box
    draw(){
        fill(this.category.colour);
        rect(this.#x, this.#y, this.#width, this.#height);
    }
}