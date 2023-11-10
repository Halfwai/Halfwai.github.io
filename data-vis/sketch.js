// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
let gallery;
let c;
// global variable to show the loading screen
let loadingScreen;

function setup() {
    // Create a canvas to fill the content div from index.html.
    c = createCanvas(1024, 576);
    c.parent('app');

    // Create a new gallery object.
    gallery = new Gallery();

    // Add the visualisation objects here.
    gallery.addVisual(new TechDiversityRace());
    gallery.addVisual(new TechDiversityGender());
    gallery.addVisual(new PayGapByJob2017());
    gallery.addVisual(new PayGapTimeSeries());
    gallery.addVisual(new ClimateChange());
    gallery.addVisual(new UKPoverty());
    gallery.addVisual(new Nutrients());
    gallery.addVisual(new Energy());
    gallery.addVisual(new CreatePieChart());
    gallery.addVisual(new EuropeanUnemployment());
    gallery.addVisual(new PokemonType());
    gallery.addVisual(new FoodData());
    gallery.addVisual(new WorldPopulation());
    gallery.addVisual(new BoxOffice());
    gallery.addVisual(new CarData());

    // adds loading screen class
    loadingScreen = new LoadingScreen();
}

function draw() {

    // checks if the loading screen needs to be drawn
    loadingScreen.check(gallery);

    // if the menu has been shown via the loading screen will run the selected visuals
    if (loadingScreen.menuOnShow === true){
        background(255);
        if (gallery.selectedVisual != null) {
            gallery.selectedVisual.draw();
        }
    }
}
