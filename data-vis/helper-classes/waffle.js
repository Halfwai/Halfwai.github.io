// class used to define an individual waffle
class Waffle{
    // define private variables in a class, method taken from here - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    #x;
    #y;
    #height;
    #width;
    #boxes_down;
    #boxes_across;
    #values;
    possibleValues;
    #categories;
    #boxes;
    #title;

    // constructor method
    constructor(x, y, width, height, boxes_across, boxes_down, values, possibleValues, title){
        // positional variables
        this.#x = x;
        this.#y = y;
        this.#height = height;
        this.#width = width;
        this.#boxes_down = boxes_down;
        this.#boxes_across = boxes_across;

        // other variables
        this.#values = values;

        this.possibleValues = possibleValues;

        this.#categories = [];
        this.#boxes = [];

        this.#title = title;
    }

    // method to count the number of categories
    categoryLocation(category){
        for(let i = 0; i < this.#categories.length; i++){
            if (category.arr[2] == this.#categories[i].name){
                return i;
            }
        }
        return -1;
    }

    // method that adds categories to the categories array
    addCategories(possibleValues) {
        for(let i = 0; i < possibleValues.length; i++){
            this.#categories.push({
                "name": possibleValues[i],
                "count": 0,
                "colour": color(random(0, 255), random(0, 255), random(0, 255))
            });
        }
        for(let i = 0; i < this.#values.length; i++){
            let catLocation = this.categoryLocation(this.#values[i]);

            if (catLocation != -1){
                    this.#categories[catLocation].count ++;
            }
        }

        // rounds the number off on how many boxes each waffle gets
        for(let i = 0; i < this.#categories.length; i++){
            this.#categories[i].boxes = round((this.#categories[i].count / this.#values.length) * (this.#boxes_down * this.#boxes_across));
        }

    }

    // adds boxes to the waffle
    addBoxes(){
        let currentCategory = 0;
        let currentCategoryBox = 0;

        let boxWidth = this.#width / this.#boxes_across;
        let boxHeight = this.#height / this.#boxes_down;
        for(let i = 0; i < this.#boxes_down; i++){
            this.#boxes.push([]);
            for(let j = 0; j < this.#boxes_across; j++){
                while (this.#categories[currentCategory] != undefined && currentCategoryBox == this.#categories[currentCategory].boxes){
                    currentCategoryBox = 0;
                    currentCategory++;
                }
                this.#boxes[i].push(new Box(this.#x + (j * boxWidth)+50, this.#y + (i * boxHeight), boxWidth, boxHeight, this.#categories[currentCategory], this.#title))
                currentCategoryBox ++;
            }
        }
    }

    // draws the waffle chart
    draw(){
        textSize(16);
        stroke(0);
        fill(0);
        textAlign(CENTER, CENTER);
        text(this.#title, this.#x + (this.#width/2)+50, this.#y - 20);
        for(let i = 0; i < this.#boxes.length; i++){
            for(let j = 0; j < this.#boxes[i].length; j++){
                if(this.#boxes[i][j].category != undefined){
                    this.#boxes[i][j].draw();
                }
            }
        }
    }

    // checks if the mouse if over each box in the waffle chart
    checkMouse(mouseX, mouseY){
        for(let i = 0; i < this.#boxes.length; i++){
            for(let j = 0; j < this.#boxes[i].length; j++){
                this.#boxes[i][j].mouseOver(mouseX, mouseY);
            }
        }
    }
}
