// Class that shows the loading screen when data not fully loaded
class LoadingScreen{
    constructor(){
        // counter used to rotate through the loading dots to make the loading screen animated
        this.loadFill = 0;

        // boolean values to store where on the loading screen the user should be
        this.menuOnShow = false;
        this.revealMenu = false;

        // magnitude of the vectors for the loading dots
        this.dotMagnitude = 200;

        // size of the ready button, initially 0 as data is not ready
        this.readyButtonSize = 0;
    }

    // method to check if the data has loaded, and then run the appropriate other method
    check(gallery){
        // initial check to see if the menu is already displayed
        if (this.menuOnShow === false){
            background(255);

            // variable to store the number of extensions that have loaded data
            this.loadCheck = 0;

            // total number of extensions
            this.galleryLength = gallery.visuals.length;

            // checks how many extensions have loaded the data
            for(let i = 0; i < this.galleryLength; i++){
                if (gallery.visuals[i].loaded === true){
                    this.loadCheck ++;
                }
            }

            // pushes then sets the center of the screen as 0, 0, this makes working with vectors much easier
            push();
            translate(width/2, height/2);

            // runs different method based on some of the classes boolean variables
            if (this.loadCheck != this.galleryLength){
                this.drawLoadScreen(this.galleryLength);
            } else if (this.revealMenu === false){
                this.readyMenu();
            } else {
                this.showMenu();
            }
            pop();
        }
    }

    // method that draws the screen when the data is loading
    drawLoadScreen(){
        fill(0);
        strokeWeight(1);
        stroke(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text("loading", 0, 0);
        // switches to degree mode, I prefer to work with degrees where possible
        angleMode(DEGREES);

        // runs method to draw the loading dots
        this.drawLoadingDots(this.dotMagnitude);

        // increases the loadFill variable every 5 frames, this variable is used to animate the loading screen
        if(frameCount % 5 === 0){
            this.loadFill += 1;
        }
        if (this.loadFill > this.galleryLength){
            this.loadFill = 0;
        }
    }

    // method to draw the readyMenu that should run once the data has all successfully loaded
    readyMenu(){
        // animates the loading dots to pull into the center of the screen
        if(this.dotMagnitude != 0){
            this.dotMagnitude -= 5;
            this.drawLoadingDots(this.dotMagnitude);
        // animates the readyButton to expand once the dots have reached the center of the screen
        } else {
            fill(0);
            ellipse(0, 0, this.readyButtonSize);
            if (this.readyButtonSize != 200){
                this.readyButtonSize += 5;
            } else{
                textAlign(CENTER, CENTER);
                fill(255);
                textSize(16);
                text("Click To Show Menu", 0, 0);
                // checks when the show menu button is pressed and then reveals the menu
                if(dist(mouseX - (width/2), mouseY - (height/2), 0, 0) < 100){
                    if(mouseIsPressed === true){
                        this.revealMenu = true;
                    }
                }
            }
        }
    }

    // method to draw the loading dots
    drawLoadingDots(){
        // calculate the angle between each dot
        const angle = 360/this.galleryLength;
        // cycles through the dots creating vectors for each of them. For each piece of data loaded one dot will be filled. Also to create the animated effect
        // the loadFill variable is used, each time i matches this variable, this dot is also filled. 
        for (let i = 0; i < this.galleryLength; i++){
            let vector = createVector(cos(angle * i - 90), sin(angle * i - 90));
            vector.mult(this.dotMagnitude);
            noFill();
            if (this.loadCheck > 0 || i === this.loadFill){
                fill(0);
            }
            ellipse(vector.x, vector.y, 20);
            this.loadCheck--;
        }
    }

    // method to show the app menu once everything has loaded and the user has clicked the button.
    // The canvas and menu start off with a CSS right value of 310. This means that the menu starts off the side of the screen. Once the data has loaded and the
    // user clicks the show menu button, I will decrease this value to make the menu slide in from the left hand side of the screen
    showMenu(){
        // in order to check the value of the elements right value I need to strip the "px" from the number. This code was taken from the
        // user "csj" here - https://stackoverflow.com/questions/1862130/strip-all-non-numeric-characters-from-string-in-javascript
        let canvasRight = c.style('right').replace(/\D/g,'');

        // moves menu and canvas right on the screen, once in place sets menuOnShow variable to true which will stop the loading screen from running using a ternary operator
        const CanvasCheck = canvasRight != 0
        CanvasCheck ? c.style('right', `${canvasRight - 5}px`) : this.menuOnShow = true;

        const visMenu = select('#visuals-menu');
        let menuRight = visMenu.style('right').replace(/\D/g,'');
        if (menuRight != 0){
            visMenu.style('right', `${menuRight - 5}px`);
        }
        menuRight = visMenu.style('right');
    }
}