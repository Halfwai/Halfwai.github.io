class PieChart {
    constructor(x, y, diameter){
        this.x = x;
        this.y = y;
        this.baseDiameter = diameter;
        this.diameters = [];
        this.labelSpace = 30;
    }

    get_radians(data) {
        const total = sum(data);
        const radians = [];
        for (let i = 0; i < data.length; i++) {
          radians.push((data[i] / total) * TWO_PI);
        }
        return radians;
    }

    draw(data, labels, colours, title){
        angleMode(RADIANS)
        // Test that data is not empty and that each input array is the
        // same length.
        if (data.length == 0) {
            alert('Data has length zero!');
        } else if (![labels, colours].every((array) => {
            return array.length == data.length;
        })) {
            alert(`Data (length: ${data.length})
            Labels (length: ${labels.length})
            Colours (length: ${colours.length})
            Arrays must be the same length!`);
        }

        // checks to see if the number of values in this.diameters matches the length of data, and adds values if this is not the case
        if (this.diameters.length != data.length){
            for (let i = 0; i < data.length; i++){
                const diameter = this.baseDiameter;
                this.diameters.push(diameter);
            }
        }

        // https://p5js.org/examples/form-pie-chart.html
        const angles = this.get_radians(data);

        // calculates the mouse angle compared to the center of the pi chart
        let mouseArc = atan2(mouseY - this.y, mouseX - this.x);
        if (mouseArc < 0){
            mouseArc += 2 * PI;
        }

        // popup array initialised
        const popups = [];

        let lastAngle = 0;
        let colour;
        for (var i = 0; i < data.length; i++) {
            if (colours) {
                colour = colours[i];
            } else {
                colour = map(i, 0, data.length, 0, 255);
            }
            // if the mouse angle is between the last angle and the last angle added to this segment angle, and the distance from mouse to the center of the pi chart 
            // is smaller than the radius, than the mouse is over this segment of the pi chart, and the segment will have an animated growth. This segments details 
            // will also be added to an array for a popup
            if (mouseArc > lastAngle && mouseArc < lastAngle + angles[i] &&
                dist(mouseX, mouseY, this.x, this.y) < this.diameters[i]/2){
                popups.push({
                    label: labels[i],
                    data: `${data[i].toFixed(2)}%`,
                    colour: colour
                });
                this.diameters[i] += 1;
                this.diameters[i] = min(this.diameters[i], this.baseDiameter + 20);
            } else {
                this.diameters[i] -= 1;
                this.diameters[i] = max(this.diameters[i], this.baseDiameter);
            }
            fill(colour);
            stroke(0);
            strokeWeight(1);
            // Hack for 0!
            let zeroCheck = 0.001;
            // This interferes with the create a pie chart when there are only two values and one is zero, this if statement checks for this.
            if (data.length === 2){
                zeroCheck = 0
            }
            arc(this.x, this.y,
                this.diameters[i], this.diameters[i],
                lastAngle, lastAngle + angles[i] + zeroCheck);

            if (labels) {
                this.makeLegendItem(labels[i], i, colour);
            }
            lastAngle += angles[i];
        }
        if (title) {
            noStroke();
            textAlign('center', 'center');
            textSize(24);
            text(title, this.x, this.y - this.baseDiameter * 0.6);
        }

        // runs a function from helper-functions to draw the popup box
        drawPopups(popups);
    }

    makeLegendItem(label, i, colour){
        const x = this.x + 50 + this.baseDiameter / 2;
        const y = this.y + (this.labelSpace * i) - this.baseDiameter / 3;
        const boxWidth = this.labelSpace / 2;
        const boxHeight = this.labelSpace / 2;

        fill(colour);
        rect(x, y, boxWidth, boxHeight);

        fill('black');
        noStroke();
        textAlign('left', 'center');
        textSize(12);
        text(label, x + boxWidth + 10, y + boxWidth / 2);
    }
}