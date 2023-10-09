// function that starts the game, initialises the arrays for the position of game objects and populates arrays of classes.
function startGame(floor) {
	// create game character object
	gameChar = new Character(floor);
	// sets up the menu screen
	menu = new MenuScreen();
	// Variable to control the background scrolling.
	scrollPos = 0;
	// initilases the position of collectables
	collectables_pos = [{
		x: 430,
		y: 320
	}, {
		x: 1000,
		y: 96
	}, {
		x: 1875,
		y: 200
	}, {
		x: 2450,
		y: 208
	}, {
		x: 3300,
		y: 208
	}, {
		x: 3900,
		y: 400
	}, {
		x: 4400,
		y: floor
	}, {
		x: 5100,
		y: 250
	}, {
		x: 6450,
		y: 320
	}, ];
	// initializes the position and size of canyons
	canyons_pos = [{
		x: 600,
		width: 150,
	}, {
		x: 1250,
		width: 150,
	}, {
		x: 1750,
		width: 200,
	}, {
		x: 2200,
		width: 500,
	}, {
		x: 3000,
		width: 1300,
	}, {
		x: 4500,
		width: 1300,
	}, {
		x: 6000,
		width: 1000,
	}];
	// initializes the position and size of platforms, and whether they will move or not
	platforms_pos = [{
		x: 320,
		y: 320,
		length: 200,
	}, {
		x: 800,
		y: 320,
		length: 400,
	}, {
		x: 900,
		y: 208,
		length: 200,
	}, {
		x: 950,
		y: 96,
		length: 100,
	}, {
		x: 1750,
		y: 200,
		length: 200,
	}, {
		x: 2400,
		y: 208,
		length: 100,
	}, {
		x: 3000,
		y: 320,
		length: 100,
	}, {
		x: 2800,
		y: 208,
		length: 100,
	}, {
		x: 3000,
		y: 96,
		length: 100,
	}, {
		x: 3250,
		y: 96,
		length: 100,
	}, {
		x: 3250,
		y: 208,
		length: 100,
	}, {
		x: 3500,
		y: 96,
		length: 100,
	}, {
		x: 3750,
		y: 208,
		length: 100,
	}, {
		x: 4000,
		y: 320,
		length: 100,
	}, {
		x: 3850,
		y: 400,
		length: 100,
	}, {
		x: 5000,
		y: 250,
		length: 200,
	}, {
		x: 6000,
		y: 320,
		length: 100,
	}, {
		x: 6100,
		y: 264,
		length: 100,
	}, {
		x: 6200,
		y: 208,
		length: 100,
	}, {
		x: 6300,
		y: 152,
		length: 100,
	}, {
		x: 6400,
		y: 96,
		length: 100,
	}, {
		x: 6400,
		y: 320,
		length: 100,
	}, {
		x: 6600,
		y: 208,
		length: 100,
	}, {
		x: 6800,
		y: 320,
		length: 100,
	}, ];
	movingPlatforms_pos = [{
		x: 1500,
		y: 250,
		length: 100,
		xRange: 0,
		yRange: 100,
		moveUp: true,
		moveDown: false,
		moveRight: false,
		moveLeft: false,
		currentX: 1500,
		currentY: 250
	}, {
		x: 2350,
		y: 320,
		length: 200,
		xRange: 125,
		yRange: 0,
		moveUp: false,
		moveDown: false,
		moveRight: false,
		moveLeft: true,
		currentX: 2350,
		currentY: 320
	}, {
		x: 4650,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: true,
		moveDown: false,
		moveRight: true,
		moveLeft: false,
		currentX: 4500,
		currentY: 220
	}, {
		x: 4650,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: false,
		moveDown: true,
		moveRight: true,
		moveLeft: false,
		currentX: 4650,
		currentY: 70
	}, {
		x: 4650,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: false,
		moveDown: true,
		moveRight: false,
		moveLeft: true,
		currentX: 4800,
		currentY: 220
	}, {
		x: 4650,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: true,
		moveDown: false,
		moveRight: false,
		moveLeft: true,
		currentX: 4650,
		currentY: 370
	}, {
		x: 5450,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: false,
		moveDown: true,
		moveRight: true,
		moveLeft: false,
		currentX: 5300,
		currentY: 220
	}, {
		x: 5450,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: false,
		moveDown: true,
		moveRight: false,
		moveLeft: true,
		currentX: 5450,
		currentY: 70
	}, {
		x: 5450,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: true,
		moveDown: false,
		moveRight: false,
		moveLeft: true,
		currentX: 5600,
		currentY: 220
	}, {
		x: 5450,
		y: 220,
		length: 100,
		xRange: 150,
		yRange: 150,
		moveUp: true,
		moveDown: false,
		moveRight: true,
		moveLeft: false,
		currentX: 5450,
		currentY: 370
	}, ];
	// initilizes the position of spiders
	spiders_pos = [{
		x: 450,
		y: floor,
		range: 100,
	}, {
		x: 1000,
		y: floor,
		range: 200,
	}, {
		x: 1000,
		y: 320,
		range: 175,
	}, {
		x: 1000,
		y: 208,
		range: 70,
	}, {
		x: 1580,
		y: floor,
		range: 100,
	}, {
		x: 1850,
		y: 200,
		range: 80,
	}, {
		x: 2075,
		y: floor,
		range: 100,
	}, {
		x: 3550,
		y: 96,
		range: 30,
	}, {
		x: 5100,
		y: 250,
		range: 80,
	}, {
		x: 6050,
		y: 320,
		range: 30,
	}, {
		x: 6150,
		y: 264,
		range: 30,
	}, {
		x: 6250,
		y: 208,
		range: 30,
	}, {
		x: 6350,
		y: 152,
		range: 30,
	}, {
		x: 6450,
		y: 96,
		range: 30,
	}, {
		x: 6650,
		y: 208,
		range: 30,
	}, {
		x: 6850,
		y: 320,
		range: 30,
	}, ];
	// Initialise arrays of scenery objects.
	trees = [];
	clouds = [];
	mountains = [];
	canyons = [];
	collectables = [];
	platforms = [];
	movingPlatforms = [];
	spiders = [];
	stars = [];
	// populates the star array
	for(let i = 0; i < 2000; i++) {
		let star = new Star(floor);
		stars.push(star);
	}
	// populates the tree array
	for(let i = 0; i < 40; i++) {
		let tree = new Tree(floor);
		trees.push(tree);
	}
	// populates the clouds array
	for(let i = 0; i < 5; i++) {
		let cloud = new Cloud(floor, width);
		clouds.push(cloud);
	}
	// populates the mountain array
	for(let i = 0; i < 20; i++) {
		let mountain = new Mountain(floor);
		mountains.push(mountain);
	}
	//  populates the canyon array
	for(let i = 0; i < canyons_pos.length; i++) {
		let canyon = new Canyon(canyons_pos[i], floor);
		canyons.push(canyon);
	}
	// populates the collectables array
	for(let i = 0; i < collectables_pos.length; i++) {
		let collectable = new Collectable(collectables_pos[i]);
		collectables.push(collectable);
	}
	// populates the platforms array
	for(let i = 0; i < platforms_pos.length; i++) {
		let platform = new Platform(platforms_pos[i]);
		platforms.push(platform);
	}
	// populated the moving platforms array
	for(let i = 0; i < movingPlatforms_pos.length; i++) {
		let movingPlatform = new MovingPlatform(movingPlatforms_pos[i]);
		movingPlatforms.push(movingPlatform);
	}
	// populates the spiders array
	for(let i = 0; i < spiders_pos.length; i++) {
		let spider = new Spider(spiders_pos[i]);
		spiders.push(spider);
	}
	// Sets gameChar.score
	// creates an object signifying the end of level, in the case of my game it's a sword in a stone
	swordInStone = {
		x: 7250,
		isFound: false,
		// function that draws the sword in the stone, either with the sword in it, when it has not yet been found, or without the sword when the character completes the level.
		draw: () => {
			fill(150);
			beginShape();
			vertex(swordInStone.x - 30, floor);
			vertex(swordInStone.x - 20, floor - 20);
			vertex(swordInStone.x + 20, floor - 20);
			vertex(swordInStone.x + 30, floor);
			endShape(CLOSE);
			if(gameChar.isCompleted === false) {
				stroke(100);
				strokeWeight(5);
				line(swordInStone.x, floor - 20, swordInStone.x, floor - 35);
				stroke(153, 76, 0);
				line(swordInStone.x, floor - 45, swordInStone.x, floor - 35);
				stroke(0, 102, 0);
				line(swordInStone.x - 5, floor - 35, swordInStone.x + 5, floor - 35);
			}
		}
	};
}
// This function runs every draw loop, it draws all the background objects
function drawBackgroundObjects() {
	// add some, but not all of the screen movement and draw the mountains and stars to give the affect that they are far away
	translate(scrollPos / 1.25, 0);
	// draw stars, uses a forEach loop to draw each star in the array
	stars.forEach(function(star) {
		// runs the star class method draw
		star.draw();
	});
	// Draw mountains
	mountains.forEach(function(mountain) {
		// runs the mountain class method draw
		mountain.draw();
	});
	// add the rest of the screen movement
	translate(scrollPos / 5, 0);
	// Draw clouds.
	clouds.forEach(function(cloud) {
		// runs the cloud class method draw
		cloud.draw();
		cloud.positionCheck(width, scrollPos);
	});
	// Draw trees.
	trees.forEach(function(tree) {
		// runs the tree class method draw
		tree.draw();
	});
	// Draw canyons
	canyons.forEach(function(canyon) {
		// runs the canyon class method draw
		canyon.draw(width, scrollPos);
		canyon.plummetCheck(gameChar, scrollPos);
	});
	// Draw platforms, to check if the character is on a platform it first sets this varaiable to false, then uses a for loop to check over each platform. It the character is
	// standing on any platform this will be set to true. I did this so that every frame checks this, and I can set the characters y-position appropriatly.  
	gameChar.onPlatform = false;
	platforms.forEach(function(platform) {
		// for each platform checks if the gameChar is on it
		platform.checkContact(gameChar, scrollPos);
		// draws the platform 
		platform.draw();
	});
	movingPlatforms.forEach(function(platform) {
		// for each platform checks if the gameChar is on it
		platform.checkContact(gameChar, scrollPos);
		// draws the platform 
		platform.draw();
		// these two methods are related to platform movement, checking which way the platform should move, and then chaning the location variables appropriatly
		platform.checkDirection();
		platform.move(gameChar);
	});
	// Draw collectable items
	collectables.forEach(function(collectable) {
		// runs the collectable class method draw
		collectable.draw();
		// runs the collectable class function foundCheck to check if the chest has been found. If it's the first time than a point is added to the character's score
		if(collectable.foundCheck(gameChar)) {
			gameChar.score += 1;
		}
	});
	// this ensure that if the game character is not on a platform their y-coordinate will not be constrained to the platforms y-coordinate 
	if(gameChar.onPlatform === false) {
		gameChar.floorHeight = floorPos_y;
	}
	// runs spider methods for spider logic
	spiders.forEach(function(spider) {
		// for each spider object runs it's class method to draw it
		spider.draw();
		// these method relate to moving the spider on the screen
		spider.move();
		spider.checkDirection();
		// checks for contact with the character, and whether the game character or the spider dies.
		spider.checkContact(gameChar);
	});
	// draws the sword in the stone. As there is only one, I made a literal object
	swordInStone.draw();
}
// this function draws the heads up display, which just consists of a score counter in one counter and the number of lives in the other
function drawHUD(char) {
	textSize(30);
	fill(255);
	text("Score: " + char.score, 20, 35);
	drawHearts(char);
}
// depicts the number of lives as hearts shown in the top right corner. Ensures that they are positioned correctly.
function drawHearts(char) {
	for(let i = 0; i < char.lives; i++) {
		fill(255, 0, 0);
		beginShape();
		vertex(970 - i * 30, 20);
		bezierVertex(970 - i * 30, 20, 990 - i * 30, 10, 970 - i * 30, 40);
		bezierVertex(970 - i * 30, 40, 950 - i * 30, 10, 970 - i * 30, 20);
		endShape();
	}
}

function keyPressed() {
	// press left
	if(key === 'A' || keyCode === 37) {
		gameChar.isLeft = true;
	}
	// press right
	if(key === 'D' || keyCode === 39) {
		gameChar.isRight = true;
	}
	// press spacebar. This will do different things depending on the game state
	if(keyCode === 32) {
		// restarts the game and plays the intro music. The intro music doesn't play on startup because p5.js requires user interaction for sounds to play, 
		// so it will play on subsequent playthroughs
		if(menu.gameOver === true || menu.levelComplete === true) {
			sounds.startup.loop();
			startGame(floorPos_y);
		}
		// starts the game from intro screen
		else if(menu.fadeOut === false && menu.gameStart === false) {
			menu.fadeOut = true;
			menu.gameStart = true;
			sounds.startup.stop();
			sounds.emerge.loop();
			// play rumble
		}
		// plays the jump sound
		else if(gameChar.inPlay === true && gameChar.jumpPower === 15) {
			sounds.jump.play();
		}
	}
}

function keyReleased() {
	// stops the character after movement keys are released, and resets movement speed
	if(key === 'A' || keyCode === 37) {
		gameChar.isLeft = false;
		gameChar.speed = 1;
	}
	if(key === 'D' || keyCode === 39) {
		gameChar.isRight = false;
		gameChar.speed = 1;
	}
	// stops the jump on key released. Note I have the jump functionality as a class method using the keyIsDown() function, this way the user can control the power
	// of the jump
	if(keyCode === 32) {
		gameChar.stopJump();
		gameChar.canJump = true;
	}
}