// class to store each line in the steamgraph
class Line{
    constructor(lineData){
        // each line is made up of several blocks that represent the different movie data for that particular day
        // this is stored in the lineBlocks array
        this.lineBlocks = [];

        for(let i = 0; i < lineData.length; i++){
            this.lineBlocks.push(lineData[i]);
        }
    }

    // This calculates the total size of the revenue for that day, this is then used to map each movies individual block size
    calculateTotalSize(){
        let total = 0;
        for(let i = 0; i < this.lineBlocks.length; i++){
            total += int(this.lineBlocks[i].revenue);
        }
        this.totalSize = total;
        return total;
    }

    // each line is sorted by it's index number which is assigned when the data is first read. I used a simple bubble sort algorithm here
    // as it's only something that needs to happen once for each line.
    sort(){
        let sorted = false;
        while(sorted === false){
            sorted = true;
            for(let i = 1; i < this.lineBlocks.length; i++){
                if(this.lineBlocks[i].index < this.lineBlocks[i - 1].index){
                    let temp = this.lineBlocks[i];
                    this.lineBlocks[i] = this.lineBlocks[i - 1];
                    this.lineBlocks[i - 1] = temp;
                    sorted = false;
                }
            }
        }
    }

    // This method calculates the hight and position of each block in the line
    calculateValues(maxLine, layout){
        let barHeight = map(this.totalSize, 0, maxLine, 0, layout.plotHeight());
        let startY = (height - layout.topMargin)/2 - barHeight/2;
        for(let i = 0; i < this.lineBlocks.length; i++){
            this.lineBlocks[i].y = startY;
            this.lineBlocks[i].height = map(this.lineBlocks[i].revenue, 0, maxLine, 0, layout.plotHeight());
            startY += this.lineBlocks[i].height;
        }
    }

    // draws the line
    draw(x, otherWeeks, width, lastDayDrawn){
        // it uses the previous days data, and the next days data to shape the line so that it flows between days rather than steps
        const prev = otherWeeks[0].lineBlocks;
        const next = otherWeeks[1].lineBlocks;

        // initializes popup variable
        let popup;

        // sets degree mode to degrees for the popup calculation
        angleMode(DEGREES);

        // loops through each of the blocks in this line
        for(let i = 0; i < this.lineBlocks.length; i ++){
            // sets the startY of the block as the y value of the previous line so that new movies will appear at the bottom of the streamgraph
            let startY = prev[prev.length -1].y + prev[prev.length -1].height;
            let endY = this.lineBlocks[i].y;
            let startHeight = 0;
            let endHeight = this.lineBlocks[i].height;
            // tries to find the movie in the previous days data, and starts it's block from that position
            for (let j = 0; j < prev.length; j++){
                if (this.lineBlocks[i].index === prev[j].index){
                    startY = prev[j].y;
                    startHeight = prev[j].height;
                }
            }
            // this variable sets the movie final day to true, then checks if it is the case. If it is the final day, it needs to close up it's position
            // in the next days line
            let finalDay = true;
            let previousIndex = next.length - 1;
            for (let j = 0; j < next.length; j++){
                if (this.lineBlocks[i].index === next[j].index){
                    finalDay = false;
                    break;
                }
                if (this.lineBlocks[i].index > next[j].index){
                    previousIndex = j;
                }
            }

            stroke(this.lineBlocks[i].colour);
            fill(this.lineBlocks[i].colour);
            // if the movie has no data in the next day, then we draw a triangle here to close up the data
            if (finalDay === true && lastDayDrawn != true){
                const topLeft= {
                    x: x + width,
                    y: endY
                };
                const bottomLeft = {
                    x: x + width,
                    y: endY+endHeight
                };
                const right = {
                    x: x + (width * 2),
                    y: (next[previousIndex].y + next[previousIndex].height),
                };
                triangle(topLeft.x, topLeft.y, bottomLeft.x, bottomLeft.y, right.x, right.y);
                // runs checkMouseOver method on the triangle, and defines popup if true
                if(this.#checkMouseOver(topLeft, bottomLeft, right, right, width)){
                    popup = {
                        label: this.lineBlocks[i].name,
                        data: `Daily Revenue: $0`,
                        extraData: next[previousIndex].date,
                        colour: this.lineBlocks[i].colour,
                    };
                }
            }

            // sets the points in the parallelogram
            const topLeft = {
                x: x,
                y: startY,
            };
            const topRight = {
                x: x + width,
                y: endY
            };
            const bottomRight = {
                x: x + width,
                y: endY + endHeight,
            };
            const bottomLeft = {
                x: x,
                y: startY + startHeight
            };
            // draws the parallelogram
            beginShape();
            vertex(topLeft.x, topLeft.y);
            vertex(topRight.x, topRight.y);
            vertex(bottomRight.x, bottomRight.y);
            vertex(bottomLeft.x, bottomLeft.y);
            endShape(CLOSE);

            // checks if mouse is over the parallelogram and defines popup if true
            if (this.#checkMouseOver(topLeft, bottomLeft, topRight, bottomRight, width)){
                popup = {
                    label: this.lineBlocks[i].name,
                    data: `Daily Revenue: $${numberWithCommas(this.lineBlocks[i].revenue)}`,
                    extraData: this.lineBlocks[i].date,
                    colour: this.lineBlocks[i].colour,
                };
            }
        }
        return popup;
    }

    // This method checks if the mouse over a particular block. It uses the arctan of the block corners and the mouse to
    // calculate this, and returns a boolean on if the mouse is over the block or not
    #checkMouseOver(topLeft, bottomLeft, topRight, bottomRight, width){
        let topAngle = atan2(topRight.y - topLeft.y, width);
        let topMouseArc = atan2(mouseY - topLeft.y, mouseX - topLeft.x);
        let insideTopAngle = topMouseArc > topAngle;
        let inLineLeft = Math.abs(topMouseArc) < 90;

        let bottomAngle = atan2(bottomLeft.y - bottomRight.y, - width);
        let bottomMouseArc = atan2(mouseY - bottomRight.y, mouseX - bottomRight.x);
        const inLineRight = Math.abs(bottomMouseArc) > 90;

        if (bottomAngle < 0){
            bottomAngle += 360;
        }
        if (bottomMouseArc < 0){
            bottomMouseArc+= 360;
        }
        let insideBottomAngle = bottomMouseArc > bottomAngle;

        return inLineLeft && inLineRight && insideTopAngle && insideBottomAngle;
    }
}