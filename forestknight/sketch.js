/*

Coursework 2.2 Game Project

Forest Knight

*/
// declare variables
var gameChar;
var floorPos_y;
var scrollPos;
var clouds;
var mountains;
var trees;
var stars;
var canyons_pos;
var canyons;
var collectables_pos;
var collectables;
var platforms_pos;
var platforms;
var movingPlatforms_pos;
var movingPlatforms;
var spiders_pos;
var spiders;
var swordInStone;
var font;
var menu;
var sounds;

function preload() {
	// Font, name Arsenic, taken from https://www.1001freefonts.com/
	font = loadFont('fonts/Arsenic.otf');
	// preloads all sounds and game music. All music written by me and created using https://onlinesequencer.net/ all sound effects created by me apart from the spider noise that
	// was downloaded roalty free from https://pixabay.com/
	sounds = {
		startup: loadSound('sounds/startup.wav'),
		gameplay: loadSound('sounds/gameplay.wav'),
		finish: loadSound('sounds/victory.wav'),
		die: loadSound('sounds/die.wav'),
		jump: loadSound('sounds/jump.wav'),
		land: loadSound('sounds/land.wav'),
		chest: loadSound('sounds/chest.wav'),
		spider: loadSound('sounds/spider.wav'),
		gameover: loadSound('sounds/gameover.wav'),
		emerge: loadSound('sounds/emerge.wav')
	};
}

function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	// runs the startGame function that sets the whole game up
	startGame(floorPos_y);
}

function draw() {
	background(57, 59, 133); // fill the sky blue
	noStroke();
	fill(0, 100, 20);
	rect(0, floorPos_y, width, height / 4); // draw some green ground
	// push to save current state
	push();
	// function that draws everything in the background
	drawBackgroundObjects();
	// restore state
	pop();
	// draws the head up display
	drawHUD(gameChar);
	// check to see if the menu needs to be faded in or out
	menu.fadeMenu(gameChar);
	// checks if the player has completed the level, or run out of lives
	gameChar.finishCheck(menu);
	// Once the menu screen has finished fading out the game can start, so the function that calls all the gameChar method that need looping over will run
	if(gameChar.inPlay) {
		gameChar.play(canyons);
	}
	// While the menu is onscreen controls are disabled
	else {
		gameChar.isLeft = false;
		gameChar.isRight = false;
	}
	// draws the character
	gameChar.drawChar();
	// This will draw a green box over the character at the start of the game to make it appear that he is emerging from the ground	
	if(menu.fadeOut) {
		fill(0, 100, 20);
		noStroke();
		rect(150, floorPos_y + 5, 100, 100);
	}
	// shows the menu when needed
	menu.showMenu(gameChar);
}