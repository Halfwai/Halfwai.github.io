// class for each bubble in the bubble chart
class Bubble{
    // constructs the bubble
    constructor(name, data, unit){
        this.name = name;
        this.id = getRandomId();
        this.pos = createVector(0, 0);
        this.colour = color(random(0, 255),random(0, 255),random(0, 255));
        this.size = 20;
        this.dir = createVector(0, 0);
        this.data = data;
        this.targetSize = this.size;
        this.currentValueIndex = 0;
        this.unit = unit;
    }

    // draws the bubble
    draw(){
        textSize(12);
        strokeWeight(1);
        fill(this.colour);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.size);
        fill(0);
        stroke(0);
        text(this.name, this.pos.x, this.pos.y);
        let popup;
        // checks if the mouse is hovering over the bubble, and defines the popup variable if so
        if(dist(mouseX - (width/2), mouseY - (height/2), this.pos.x, this.pos.y) < this.size/2){
            popup = {
                label: this.name,
                data: `${this.data[this.currentValueIndex]}${this.unit}`,
                colour: this.colour,
            };
        }

        // moves the bubble
        this.pos.add(this.dir);

        // resizes the bubble if needed
        if (this.size < this.targetSize){
            this.size += 1;
        }
        if (this.size > this.targetSize){
            this.size -= 1;
        }

        // if the popup is defined, this returns it to the bubble chart to be drawn
        if(popup != undefined){
            return popup;
        }
    }

    // sets the bubbke data for the year
    setYear(year_index){
        let v = this.data[year_index];
        this.currentValueIndex = year_index;
        this.targetSize = map(v, 0, 3600, 5, 200);
    }

    // Collision detection for the bubbles
    updateDirection(bubbles){
        // Checks to see if the bubble is colliding with the edge of the screen and bounces it off the sides if so
        if (this.pos.x + (this.size/2) > width/2){
            let v = createVector(-1, 0);
            this.dir.add(v);
        }
        if (this.pos.x - (this.size/2) < 0 - (width/2)){
            let v = createVector(1, 0);
            this.dir.add(v);
        }
        if (this.pos.y + (this.size/2) > height/2){
            let v = createVector(0, -1);
            this.dir.add(v);
        }
        if (this.pos.y - (this.size/2) < 0 - (height/2)){
            let v = createVector(0, 1);
            this.dir.add(v);
        }

        // Checks to see if the bubble is colliding with another bubble, and assigns it a random direction if so.
        for (let i = 0; i < bubbles.length; i++){
            if (bubbles[i].id != this.id){
                let v = p5.Vector.sub(this.pos, bubbles[i].pos);
                let d = v.mag();
                if (d < (this.size/2) + (bubbles[i].size/2)){
                    if (d == 0){
                        this.dir.add(p5.Vector.random2D());
                    } else {
                        this.dir.add(v);
                    }
                }
            }
        }
        this.dir.normalize();
    }
}