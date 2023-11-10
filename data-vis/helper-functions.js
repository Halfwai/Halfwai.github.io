// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
    let total = 0;

    // Ensure that data contains numbers and not strings.
    data = stringsToNumbers(data);

    for (let i = 0; i < data.length; i++) {
        total = total + data[i];
    }

    return total;
}

function mean(data) {
    const total = sum(data);

    return total / data.length;
}

function sliceRowNumbers (row, start=0, end) {
    const rowData = [];

    if (!end) {
        // Parse all values until the end of the row.
        end = row.arr.length;
    }

    for (let i = start; i < end; i++) {
        rowData.push(row.getNum(i));
    }

    return rowData;
}

function stringsToNumbers (array) {
    return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
    stroke(color(colour));

    // x-axis
    line(layout.leftMargin,
        layout.bottomMargin,
        layout.rightMargin,
        layout.bottomMargin);

    // y-axis
    line(layout.leftMargin,
        layout.topMargin,
        layout.leftMargin,
        layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    // Draw x-axis label.
    text(xLabel,
        (layout.plotWidth() / 2) + layout.leftMargin,
        layout.bottomMargin + (layout.marginSize * 1.5));

    // Draw y-axis label.
    push();
    translate(layout.leftMargin - (layout.marginSize * 1.5),
                layout.bottomMargin / 2);
    angleMode(RADIANS)
    rotate(- PI / 2);
    text(yLabel, 0, 0);
    pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
                             decimalPlaces) {
    // Map function must be passed with .bind(this).
    const range = max - min;
    const yTickStep = range / layout.numYTickLabels;

    fill(0);
    noStroke();
    textAlign('right', 'center');


    // Draw all axis tick labels and grid lines.
    for (let i = 0; i <= layout.numYTickLabels; i++) {
        const value = min + (i * yTickStep);
        const y = mapFunction(value);

        // Add tick label.
        text(numberWithCommas(value.toFixed(decimalPlaces)),
            layout.leftMargin - layout.pad,
            y);

        if (layout.grid) {
        // Add grid line.
        stroke(200);
        line(layout.leftMargin, y, layout.rightMargin, y);
        }
    }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
    // Map function must be passed with .bind(this).
    let x = mapFunction(value);

    fill(0);
    noStroke();
    textAlign('center', 'center');

    if(x > layout.leftMargin && x < layout.rightMargin){
        // add tick line
        rect(x, layout.bottomMargin, 1, 5)


        if (value >= 1000000000){
            value = `${value/1000000000}B`
        } else if (value >= 1000000){
            value = `${value/1000000}M`
        }

        // Add tick label.
        text(value,
            x,
            layout.bottomMargin + layout.marginSize / 2);
    }


    if (layout.grid) {
        // Add grid line.
        stroke(220);
        line(x,
            layout.topMargin,
            x,
            layout.bottomMargin);
    }
}

// function that draws data popups based on whether the mouse is over certain data points
function drawPopups(popupData) {
    // checks whether and popups need to be drawn
    if (popupData.length != 0){
        strokeWeight(1);
        textSize(12);
        textAlign(CENTER, CENTER);
        // set the startpoint for the popup so that the mouse does not cover the data
        let startPoint = 10;
        // sets the height of the datapopup
        const boxHeight = Object.getOwnPropertyNames(popupData[0]).length * 15;
        // cycles through each of the datapopups, multiple popups can be drawn at once

        // checks the total width of the popups being drawn, and if they are would run off the right of the screen, draws them to the left of the mouse pointer instead
        // of to the right
        let totalWidth = 0;
        for (let i = 0; i < popupData.length; i++){
            totalWidth += max(textWidth(popupData[i].label), textWidth(popupData[i].data), textWidth(popupData[i].extraData)) + 10;
        }

        if ((mouseX + totalWidth + 20) > width){
            startPoint -= totalWidth + 30;
        }

        for (let i = 0; i < popupData.length; i++){
            push();
            // sets width of popup box, code based on this - https://editor.p5js.org/remarkability/sketches/anDyL1Xaq
            const boxWidth = totalWidth;
            // sets the startpoint for the box
            startPoint += boxWidth/2 + 5;
            fill(255);
            stroke(0);
            // draw the box that the data points will be inside
            rect((mouseX + startPoint) - boxWidth/2, mouseY - 22, boxWidth, boxHeight);
            // the title will be set to the colour of the data point, the other information will be in black to improve readability 
            fill(popupData[i].colour);
            stroke(popupData[i].colour);
            text(popupData[i].label, mouseX + startPoint, mouseY - 10);
            fill(0);
            stroke(0);
            text(popupData[i].data, mouseX + startPoint, mouseY + 10);
            // some extensions send a little bit more data. This check if this is the case, and writes the data if needed.
            if(popupData[i].extraData != undefined){
                text(popupData[i].extraData, mouseX + startPoint, mouseY + 30);
            }
            // sets the startpoint for the next box if multiple popups are being drawn.
            startPoint += boxWidth/2;
            pop();
        }
    }
}

// function that creates a random ID number
function getRandomId(){
    const alpha = "abcdefghijklmnopqrstuvwxyz1234567890";
    let s = "";
    for(let i = 0; i < 10; i++){
        s += alpha[floor(random(0, alpha.length))];
    }
    return s;
}

// I took this function from the user AryanTYB, here on stack overflow - https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}