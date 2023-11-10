// this class should be totally modular, so that as long as the appropriate numbers are shared a radar chart should be drawn
class RadarChart{
    constructor(maxValues, labels){
        // maxValues and labels should have the same length, as their values should be related
        this.maxValues = maxValues;
        this.labels = labels;

        // this calculates the number of sides the radar chart will have based on the number of values
        this.sides = maxValues.length;

        // array of vectors used to make up the borders
        this.borderVectors = [];

        // array of the outlines being displayed on the radar chart
        this.outlines = [];

        // size of the radar chart
        this.size = 200;

        // switches to degree mode, I prefer to work with degrees where possible
        angleMode(DEGREES);

        // calculate the angle between each data point in the chart
        this.angle = 360/this.sides;

        // adds vectors for the border. Note I subtract 90 from the angle as I want the chart to start from the top to make it look even
        for (let i = 0; i < this.sides; i++){
            let borderVector = createVector(cos(this.angle * i - 90), sin(this.angle * i - 90));
            borderVector.mult(this.size);
            this.borderVectors.push(borderVector);
        }
    }

    // adds a radar outline class to the radar chart when called, returns the colour that I use as an identifying marker. There are P(255, 3) different colours
    // possible, which is a lot. I also added a method to check that the colour doesn't already exist, and on the very small change that it does, to change the colour until it
    // doesn't
    addOutline(data){
        const outline = new RadarOutline(data.data, this.maxValues, this.angle, this.size);
        while(this.colourCheck(outline.colour)){
            outline.color = color(random(0, 255), random(0, 255), random(0, 255), 100);
        }
        this.outlines.push(outline);
        return outline.colour;
    }

    // draws the border of the chart, and then each outline
    draw(){
        // translates the center to display the chart in an appropriate part of the screen. When working with vectors this is the easiest way to do it
        push();
        translate(width * 0.7, height/2);

        noFill();
        strokeWeight(1);
        stroke(0);
        for(let i = 0.2; i <= 1; i += 0.2){
            this.drawBorders(i);
        }

        textSize(12);
        textAlign(CENTER, TOP);
        fill(0);
        // Draw the lines on the chart and the labels for each vector
        for (let i = 0; i < this.borderVectors.length; i++){
            line(0, 0, this.borderVectors[i].x, this.borderVectors[i].y);
            text(this.labels[i], (this.borderVectors[i].x * 1.2) - 40, this.borderVectors[i].y * 1.2, 80);
        }

        // loops through and draws the outlines. Note I do this twice, once to draw most of the outlines, and then once to draw the
        // highlighted vector on top
        for (let i = 0; i < this.outlines.length; i++){
            if (this.outlines[i].highlighted === false){
                this.outlines[i].draw();
            }
        }
        for (let i = 0; i < this.outlines.length; i++){
            if (this.outlines[i].highlighted === true){
                this.outlines[i].draw();
            }
        }
        pop();

    }

    // draws the borders and lines on the chart
    drawBorders(step){
        beginShape();
        for (let i = 0; i < this.borderVectors.length; i++){
            vertex((this.borderVectors[i].x) * step, (this.borderVectors[i].y) * step);
        }
        endShape(CLOSE);
    }

    // removes an outline using the colour as it's id
    removeOutline(colour){
        for(let i = this.outlines.length - 1; i >= 0; i--){
            if (colour === this.outlines[i].colour){
                this.outlines.splice(i, 1);
            }
        }
    }

    // highlights an individual outline by changing it's alpha value and setting it's highlighted property to true
    highlight(car){
        for(let i = this.outlines.length - 1; i >= 0; i--){
            if (car.colour === this.outlines[i].colour){
                const colour = this.outlines[i].colour.levels;
                this.outlines[i].colour = color(colour[0], colour[1] , colour[2], 255);
                car.colour = this.outlines[i].colour;
                this.outlines[i].highlighted = true;
            }
        }
    }

    // returns an outline to it's default alpha value of 100 and sets it's highlighted property to false
    normalize(car){
        for(let i = this.outlines.length - 1; i >= 0; i--){
            if (car.colour === this.outlines[i].colour){
                const colour = this.outlines[i].colour.levels;
                this.outlines[i].colour = color(colour[0], colour[1] , colour[2], 100);
                car.colour = this.outlines[i].colour;
                this.outlines[i].highlighted = false;
            }
        }
    }

    // method to check that the outline has a unique colour value
    colourCheck(colour){
        for (let i = 0; i < this.outlines.length; i++){
            if (colour === this.outlines[i].colour){
                return true;
            }
        }
        return false;
    }
}