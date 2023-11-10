class PayGapByJob2017 {
    constructor() {
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Pay gap by job: 2017';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'pay-gap-by-job-2017';

        // Property to represent whether data has been loaded.
        this.loaded = false;

        // Graph properties.
        this.width = 20;
        this.height = 20;
        this.dotSizeMin = 15;
        this.dotSizeMax = 40;
    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    preload () {
        this.data = loadTable(
        './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true;
        });
    }

    setup () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
    }

    destroy() {
    }

    draw() {
        // Draw the axes.
        this.addAxes();

        // Get data from the table object and Convert numerical data from strings to numbers.
        const jobs = this.data.getColumn('job_subtype');
        const propFemale = stringsToNumbers(this.data.getColumn('proportion_female'));
        const payGap = stringsToNumbers(this.data.getColumn('pay_gap'));
        const numJobs = stringsToNumbers(this.data.getColumn('num_jobs'));

        // Set ranges for axes.
        //
        // Use full 100% for x-axis (proportion of women in roles).
        const propFemaleMin = 0;
        const propFemaleMax = 100;

        // For y-axis (pay gap) use a symmetrical axis equal to the
        // largest gap direction so that equal pay (0% pay gap) is in the
        // centre of the canvas. Above the line means men are paid
        // more. Below the line means women are paid more.
        const payGapMin = -20;
        const payGapMax = 20;

        // Find smallest and largest numbers of people across all
        // categories to scale the size of the dots.
        const numJobsMin = min(numJobs);
        const numJobsMax = max(numJobs);

        fill(255);
        stroke(0);
        strokeWeight(1);

        const dataPopups = [];
        for (let i = 0; i < this.data.getRowCount(); i++) {
            // Draw an ellipse for each point.
            const x = map(propFemale[i], propFemaleMin, propFemaleMax, this.width, width - this.width);
            const y = map(payGap[i], payGapMin, payGapMax, height - this.height, this.height);
            const size = map(numJobs[i], numJobsMin, numJobsMax, 10, 40);
            if (dist(mouseX, mouseY, x, y) < size/2){
                fill(255, 0, 0);
                ellipse(x, y, size);
                fill(0);
                dataPopups.push({
                    label: jobs[i],
                    data: `Percentage of female employees: ${propFemale[i].toFixed(2)}%`,
                    extraData: `Paygap: ${payGap[i].toFixed(2)}%`,
                    colour: "black"
                });
            } else {
                fill(255);
                ellipse(x, y, size);
            }
        }
        drawPopups(dataPopups);
    }

    addAxes() {
        stroke(200);

        // Add vertical line.
        line(width / 2,
            0 + this.height,
            width / 2,
            height - this.height);

        // Add horizontal line.
        line(0 + this.width,
            height / 2,
            width - this.width,
            height / 2);
    }
}