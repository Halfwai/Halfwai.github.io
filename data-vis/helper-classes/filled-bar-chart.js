class FilledBarChart {
    // constructor function, collects chart position, and takes and stores an array of the different segments that will be shown on the chart
    constructor(x, y, width, segments){
        this.x = x;
        this.y = y;
        this.width = width;
        this.segments = segments;
    }

    // method to fill the segments array with the data that needs to be filled into the chart
    fillSegments(data, dataPoints){
        // sets the total value of the countries energy balance. This will be used to scale the bar chart properly, and also work out percentages.
        // this method of stripping commas from a string was taken from "https://stackoverflow.com/questions/12559208/how-to-remove-comma-from-number-which-comes-dynamically-in-tpl-file"
        // It works by splitting the string into an array separated by commas, then joining it back together again.
        this.total = float((data.getString("Total").split(',').join('')));
        // Checks what checkboxes have been activated, and then assigns values to each segment based on this
        for (let i = 0; i < dataPoints.length; i++){
            for(let j = 0; j < this.segments.length; j++){
                if (dataPoints[i].value() === this.segments[j].name){
                    if (dataPoints[i].checked()){
                        // if the box is checked, sets their maxlength to a mapped value based on the value's percentage, otherwise sets the value of the segment to 0
                        let value = data.getString(dataPoints[i].value());
                        value = float(value.split(',').join(''));
                        this.segments[j].value = value;
                        this.segments[j].maxLength = map(value, 0, this.total, 0, this.width);
                    } else {
                        this.segments[j].value = 0;
                        this.segments[j].maxLength = 0;
                    }
                }
            }
        }
    }

    // draw method to draw the filled bar chart
    draw() {
        noFill();
        // draws the initial empty bar
        rect(this.x, this.y, this.width, 100);

        // sets the startpoint for the data values to the start of the bar
        let startPoint = this.x;

        // creates an array to be filled with popup data if needed
        const dataPopup = [];

        // draws the segments. Segments sizes are animated, so they will grow and shrink as different countries are picked and different values are checked or unchecked
        for (let i = 0; i < this.segments.length; i++){
            if (this.segments[i].maxLength > this.segments[i].currentLength){
                this.segments[i].currentLength += 2;
                this.segments[i].currentLength = min(this.segments[i].currentLength, this.segments[i].maxLength);
            }
            if (this.segments[i].maxLength < this.segments[i].currentLength){
                this.segments[i].currentLength -= 2;
                this.segments[i].currentLength = max(this.segments[i].currentLength, this.segments[i].maxLength);
            }
            fill(this.segments[i].colour);
            rect(startPoint, 200, this.segments[i].currentLength, 100);
            // checks to see if the mouse pointer is hovering over a segment. If so the datapopup variable has data assigned to it to be shown
            if (mouseX > startPoint &&
                mouseX < startPoint + this.segments[i].currentLength &&
                mouseY > 200 && mouseY < 300){
                    dataPopup.push({
                        label: this.segments[i].name,
                        data: `${this.segments[i].value} KTOE`,
                        colour: this.segments[i].colour,
                        extraData: `${((this.segments[i].value/this.total) * 100).toFixed(2)}%`
                    });
                }
            startPoint += this.segments[i].currentLength;
        }

        // runs draw popup function on dataPopup array to draw popups if array has been filled at all.
        drawPopups(dataPopup);
    }
}