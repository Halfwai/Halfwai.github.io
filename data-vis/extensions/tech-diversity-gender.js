class TechDiversityGender {
    constructor() {
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Tech Diversity: Gender';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'tech-diversity-gender';

        // Layout object to store all common plot layout parameters and
        // methods.
        this.layout = {
            // Margin positions around the plot. Left and bottom margins are
            // bigger so there is space for axis and tick labels on the canvas.
            leftMargin: 130,
            rightMargin: width,
            topMargin: 30,
            bottomMargin: height - 20,
            pad: 5,

            plotWidth: function() {
            return this.rightMargin - this.leftMargin;
            },

            // Boolean to enable/disable background grid.
            grid: true,

            // Number of axis tick labels to draw so that they are not drawn on
            // top of one another.
            numXTickLabels: 10,
            numYTickLabels: 8,
        };

        // Middle of the plot: for 50% line.
        this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

        // Default visualisation colours.
        this.femaleColour = color(255, 0 ,0);
        this.maleColour = color(0, 255, 0);

        // Property to represent whether data has been loaded.
        this.loaded = false;
    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    preload() {
        this.data = loadTable(
        './data/tech-diversity/gender-2018.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true;
        });
    };

    setup() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        // Font defaults.
        textSize(16);
    };

    destroy() {
    };

    draw() {
        textSize(16)

        // Draw Female/Male labels at the top of the plot.
        this.drawCategoryLabels();

        const lineHeight = (height - 20 - this.layout.topMargin) /
            this.data.getRowCount();

        const popupData = []

        // Loop over every row in the data.
        for (let i = 0; i < this.data.getRowCount(); i++) {
            // Calculate the y position for each company.
            const lineY = (lineHeight * i) + this.layout.topMargin;

            // Create an object that stores data from the current row.
            const company = {
                // Convert strings to numbers.
                'name': this.data.getString(i, 0),
                'female': this.data.getNum(i, 1),
                'male': this.data.getNum(i, 2),
            };

            // Draw the company name in the left margin.
            fill(0);
            noStroke();
            textAlign('right', 'top');
            text(company.name,
                this.layout.leftMargin - this.layout.pad,
                lineY);

            // Draw female employees rectangle.
            fill(this.femaleColour);
            rect(this.layout.leftMargin,
                lineY,
                this.mapPercentToWidth(company.female),
                lineHeight - this.layout.pad);

            // Draw male employees rectangle.
            fill(this.maleColour);
            rect(this.layout.leftMargin + this.mapPercentToWidth(company.female),
                lineY,
                this.mapPercentToWidth(company.male),
                lineHeight - this.layout.pad);
            if(mouseX > this.layout.leftMargin &&
                mouseX < this.layout.rightMargin &&
                mouseY > lineY &&
                mouseY < lineY + lineHeight - this.layout.pad)
                popupData.push({
                    label: company.name,
                    data: `Female: ${company.female}%, Male:${company.male}%`,
                    colour: "black"
                })
        }
        // Draw 50% line
        stroke(150);
        strokeWeight(1);
        line(this.midX,
            this.layout.topMargin,
            this.midX,
            this.layout.bottomMargin);
        
        drawPopups(popupData)
    };

    drawCategoryLabels() {
        fill(0);
        noStroke();
        textAlign('left', 'top');
        text('Female',
            this.layout.leftMargin,
            this.layout.pad);
        textAlign('center', 'top');
        text('50%',
            this.midX,
            this.layout.pad);
        textAlign('right', 'top');
        text('Male',
            this.layout.rightMargin,
            this.layout.pad);
    };

    mapPercentToWidth(percent) {
        return map(percent,
            0,
            100,
            0,
            this.layout.plotWidth());
    };
}