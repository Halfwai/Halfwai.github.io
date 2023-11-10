// class for an individual outline on a radar graph
class RadarOutline{
    constructor(data, maxValues, angle, size){
        this.vectors = [];

        // takes maxValues and uses it to map the magnitude of each vector
        for(let i = 0; i < maxValues.length; i++){
            let vector = createVector(cos(angle * i - 90), sin(angle * i - 90));
            const magnitude = map(data[i], 0, maxValues[i], 0, size);
            vector.mult(magnitude);
            this.vectors.push(vector);
        }

        // sets color randomly
        this.colour = color(random(0, 255), random(0, 255), random(0, 255), 100);

        // boolean value to show whether this outline has been highlighted by the user
        this.highlighted = false;
    }

    // draws the outline
    draw(){
        fill(this.colour);
        stroke(0);
        beginShape();
        for (let i = 0; i < this.vectors.length; i++){
            vertex(this.vectors[i].x, this.vectors[i].y);
        }
        endShape(CLOSE);
    }
}