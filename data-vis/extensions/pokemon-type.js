class PokemonType{
    constructor(){
        // Name for the visualisation to appear in the menu bar.
        this.name = 'Pokemon Type By Game Introduced';

        // Each visualisation must have a unique ID with no special
        // characters.
        this.id = 'pokemon-type-by-game';

        this.waffles = [];
    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    preload() {
        this.data = loadTable(
        './data/pokemon/pokemon_database.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        () => {
            this.loaded = true;
        });
    }

    // sets up visualization
    setup() {
        // initializes two arrays, one to hold the different pokemon games, and one to hold the different types of pokemon. These arrays will be used
        // to create the waffle chart
        const games = [];
        const types = [];
    
        // goes through the data and adds all the different pokemon games to the games array
        for(let i = 0; i < this.data.rows.length; i++){
            let gameInList = false;
            for (let j = 0; j < games.length; j++){
                if (games[j] === this.data.getColumn("Game of Origin")[i]){
                    gameInList = true;
                }
            }
            if(gameInList === false){
                games.push(this.data.getColumn("Game of Origin")[i]);
            }
        }

        // goes through the data and adds all the different pokemon types to the types array
        for(let i = 0; i < this.data.rows.length; i++){
            let typeInList = false;
            for (let j = 0; j < types.length; j++){
                if (types[j] === this.data.getColumn("Type 1")[i]){
                    typeInList = true;
                }
            }
            if(typeInList === false){
                types.push(this.data.getColumn("Type 1")[i]);
            }
        }

        // goes through the data and assigns each pokemon to it's origin game
        const pokemonOriginGame = [];
        for(let i = 0; i < games.length; i++){
            const originGame = [];
            for(let j = 0; j < this.data.rows.length; j++){
                if (this.data.getColumn("Game of Origin")[j] == games[i]){
                    originGame.push(this.data.getRow(j));
                }
            }
            pokemonOriginGame.push(originGame);
        }

        // sets the size of each wafflebox
        const waffleBox = width/4;

        // runs through each pokemon game, and creates a waffle 
        for(let i = 0; i < pokemonOriginGame.length; i++){
            let waffleX = 0 + i * waffleBox;
            let waffleY = 100;
            if (waffleX >= width){
                waffleX -= width;
                waffleY += waffleBox;
            }
            this.waffles.push(new Waffle(waffleX, waffleY, waffleBox * 0.8, waffleBox * 0.8, 10, 10, pokemonOriginGame[i], types, games[i]));
        }

        // populates the waffle with it's boxes
        for(let i = 0; i < this.waffles.length; i++){
            this.waffles[i].addCategories(this.waffles[i].possibleValues);
            this.waffles[i].addBoxes();
        }
    }

    // method to draw the data visualization
    draw(){
        push();
        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(this.name, width/2 + 25, 20);
        // draws the waffles
        for(let i = 0; i < this.waffles.length; i++){
            this.waffles[i].draw();
        }
        // calls the checkMouse method on each waffle that checks if the mouse is hovering over it and draws popups if needed
        for(let i = 0; i < this.waffles.length; i++){
            this.waffles[i].checkMouse(mouseX, mouseY);
        }
        pop();
    }

    // empties out the waffles array when moving to a different data viz
    destroy(){
        this.waffles = [];
    }
}