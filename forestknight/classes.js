// main character class, contains methods that deal with all the character movement and logic
class Character {
	constructor(floor) {
			// basic position variables
			this.x = 200;
			this.y = floor;
			// basic movement variables
			this.isLeft = false;
			this.isRight = false;
			this.isFalling = false;
			this.isPlummeting = false;
			// Various state variables
			this.isCompleted = false;
			this.onPlatform = false;
			this.canJump = true;
			this.enemyContact = false;
			this.isDead = false;
			this.enemyBounce = false;
			this.inPlay = false;
			this.inCanyon = false;
			this.invincible = false;
			this.invincibleTimer = 120;
			// movement speed variables
			this.speed = 1;
			this.jumpPower = 15;
			this.fallSpeed = 0;
			// floorheight variable used for when character is on platforms
			this.floorHeight = floor;
			// HUD variables
			this.lives = 3;
			this.score = 0;
			// variable to track walk cycle
			this.moveState = 0;
		}
		// This method cycles through the logic for what the character is doing, and as such which sprite to draw
	drawChar() {
			if(this.invincible === false) {
				if(this.isCompleted === true) {
					this.drawCompleted();
				} else if(this.isDead === true) {
					this.drawAirStraight();
				} else if(this.isLeft && (this.isFalling || this.isPlummeting)) {
					this.drawAirLeft();
				} else if(this.isRight && (this.isFalling || this.isPlummeting)) {
					this.drawAirRight();
				} else if(this.isLeft) {
					this.drawLeft();
				} else if(this.isRight) {
					this.drawRight();
				} else if(this.isFalling || this.isPlummeting) {
					this.drawAirStraight();
				} else {
					this.drawStand();
				}
			}
			// After the character dies he will be invincible for a short period of time, to reflect this, the sprite will flash
			else {
				this.invincibleTimer -= 1;
				if(this.invincibleTimer % 30 > 15) {
					if(this.isCompleted === true) {
						this.drawCompleted();
					} else if(this.isDead === true) {
						this.drawAirStraight();
					} else if(this.isLeft && (this.isFalling || this.isPlummeting)) {
						this.drawAirLeft();
					} else if(this.isRight && (this.isFalling || this.isPlummeting)) {
						this.drawAirRight();
					} else if(this.isLeft) {
						this.drawLeft();
					} else if(this.isRight) {
						this.drawRight();
					} else if(this.isFalling || this.isPlummeting) {
						this.drawAirStraight();
					} else {
						this.drawStand();
					}
				}
			}
		}
		// method that changes the character's x coordinate as the user moves him around the screen. I have added some functionality that keeps the character 
		// within the bounds of the level area
	moveCharX() {
			// keeps the character speed within certain limits
			this.speed = constrain(this.speed, 1, 5);
			// cycles through the character move state to create the walking cycle
			this.moveState += this.speed;
			// move left logic
			if(this.isLeft && this.isDead === false && !(this.isRight)) {
				this.moveLeft(this.speed);
				this.speed *= 1.04;
			}
			// move right logic
			if(this.isRight && this.isDead === false && !(this.isLeft)) {
				this.moveRight(this.speed);
				this.speed *= 1.04;
			}
		}
		// method that moves the character left and takes an input for how fast they should move
	moveLeft(speed) {
			if(this.x > width * 0.3 || scrollPos >= 0 && gameChar.x > 10) {
				this.x -= speed;
			} else if(scrollPos < 0) {
				scrollPos += speed;
			}
		}
		// method that moves the character right and takes an input for how fast they should move
	moveRight(speed) {
			if(this.x < width * 0.7 || scrollPos <= -6500 && gameChar.x < width - 10) {
				this.x += speed;
			} else if(scrollPos > -6500) {
				scrollPos -= speed; // negative for moving against the background
			}
		}
		// This method runs through all the logic about how the character falls
	fallLogic() {
			// if the character walks off a platform this triggers him falling
			if(this.onPlatform != true && this.isJumping != true && this.y < this.floorHeight) {
				this.isFalling = true;
			}
			// plays the sound for when the character lands
			if(this.y >= this.floorHeight && this.isFalling === true && this.isDead === false) {
				sounds.land.play();
			}
			// logic to make the game character stop falling when he hits the ground
			if(this.y >= this.floorHeight && this.isPlummeting === false && this.isJumping === false && this.isDead === false) {
				this.enemyBounce = false;
				this.isFalling = false;
				this.jumpPower = 15;
				this.fallSpeed = 0;
				this.y = this.floorHeight;
			}
			// Logic that makes the character's y co-ordinates go up when the character is falling or plumeting. uses class fallSpeed variable to create incremantal falling speed
			// for a more realistic falling effect
			if(this.isFalling || this.isPlummeting) {
				this.y += this.fallSpeed;
				this.fallSpeed += 0.2;
			}
		}
		// Jump method, decreases the characters y-coordinates by it's jump power and reduces the jump power incrementally. Once the jump power reduces to zero the stop jump method will run
		// It will also run when the character dies, so he will jump and then fall off the bottom of the screen, and also when the character jumps on a spider and kills it he will 
		// bounce off
	jump() {
			if((keyIsDown(32) && gameChar.canJump === true || this.isDead === true || this.enemyBounce === true)) {
				if(this.jumpPower > 0) {
					this.isJumping = true;
					this.y -= this.jumpPower;
					this.jumpPower -= 1;
				} else {
					// the canJump variable stops the character from bouncing when the jump button is held down, this will be reset when the jump button is released 
					if(keyIsDown(32)) {
						this.canJump = false;
					}
					// runs the stop jump method once the jump power has run out   
					this.stopJump();
				}
			}
		}
		// stops the jump, this is triggered either by the characters jump power running out, or by releasing the space bar. 
	stopJump() {
			this.isJumping = false;
			this.jumpPower = 0;
			// this if statement stops the fall animation from occuring if the jump button is released while the character is on the ground
			if(this.y < this.floorHeight) {
				this.isFalling = true;
			}
		}
		// Method to check if the character has died. If he falls down a canyon or runs into an enemy he will jump up in the air and fall of the bottom of the screen,
		// like in Mario. Then the reset method will be called
	checkDeath() {
			if((this.y > 676 || this.enemyContact === true) && this.isDead === false) {
				this.isDead = true;
				this.fallSpeed = 0;
				this.jumpPower = 15;
			} else if(this.y > 876) {
				this.reset();
			}
		}
		// Checks to see if the character has reached the end of the level, and then plays the game complete sound
	checkComplete() {
			// logic to end the game level
			if(dist(this.x, this.y, swordInStone.x + scrollPos, floorPos_y) < 20 && this.isCompleted === false) {
				sounds.finish.play();
				this.isCompleted = true;
			}
		}
		// This method resets the game character if he dies. I decided against resetting the whole level as I wanted to give the player a sense of progress
	reset() {
			// decreases the characters lives
			this.lives -= 1;
			if(this.lives != 0) {
				// This code will run as long as the character still has lives remaining, it moves the game character's x co-ordinated back 100px, then checks if he is in 
				// a canyon. If this is the case he gets movec back again repeatedly, until he is able to spawn on safe ground				
				do {
					this.inCanyon = false;
					this.moveLeft(100);
					canyons.forEach(function(canyon) {
						canyon.restartCheck();
					});
				}
				while (this.inCanyon === true);
				// this keeps the spawning location within the bounds of the level
				this.x = constrain(this.x, 10, 3000);
				// reset various class variables
				this.y = floorPos_y;
				this.isPlummeting = false;
				this.isFalling = false;
				this.isDead = false;
				this.enemyContact = false;
				// the character will be invincible for a period of time
				this.invincible = true;
			} else {
				// if the character has no more lives left the game over music is triggerec
				sounds.gameover.play();
			}
		}
		// Checks to see if the character's invincibility has run out.
	invincibleCheck() {
			if(this.invincibleTimer === 0) {
				this.invincible = false;
				this.invincibleTimer = 150;
			}
		}
		// method to check if the game has been finished, either through completion, or through game over. Stops the playing music, and sets the game menu to fade in.
	finishCheck(menu) {
			if(this.lives <= 0) {
				sounds.gameplay.stop();
				this.inPlay = false;
				menu.fadeIn = true;
				menu.gameOver = true;
				menu.gameStart = false;
			} else if(this.isCompleted) {
				sounds.gameplay.stop();
				this.y = floorPos_y;
				this.inPlay = false;
				menu.fadeIn = true;
				menu.levelComplete = true;
				menu.gameStart = false;
			}
		}
		// method that calls all the gameChar methods that need to be looped over every frame
	play() {
			this.moveCharX();
			this.fallLogic();
			this.checkComplete();
			this.checkDeath();
			this.jump();
			this.invincibleCheck();
			this.drawChar();
		}
		// The following 7 method are to draw the game charater in various states through the game
	drawAirLeft() {
		// add your jumping-left code
		stroke(0);
		strokeWeight(1);
		fill(150);
		//legs
		quad(this.x - 3, this.y - 28, this.x + 15, this.y - 13, this.x + 17, this.y - 18, this.x, this.y - 33);
		quad(this.x + 3, this.y - 28, this.x - 13, this.y - 15, this.x - 17, this.y - 18, this.x, this.y - 33);
		//back arm
		quad(this.x - 3, this.y - 48, this.x + 10, this.y - 35, this.x + 12, this.y - 40, this.x, this.y - 53);
		//body
		rect(this.x - 5, this.y - 55, 10, 30);
		// front arm
		quad(this.x + 3, this.y - 48, this.x - 10, this.y - 35, this.x - 12, this.y - 40, this.x, this.y - 53);
		//shoulders
		ellipse(this.x, this.y - 50, 12, 10);
		//head
		triangle(this.x - 8, this.y - 60, this.x - 3, this.y - 40, this.x + 7, this.y - 60);
		triangle(this.x - 8, this.y - 60, this.x - 1, this.y - 70, this.x + 7, this.y - 60);
		//hands
		fill(0);
		ellipse(this.x + 12, this.y - 37, 7, 5);
		ellipse(this.x - 12, this.y - 37, 7, 5);
		//feet
		quad(this.x + 8, this.y - 19, this.x + 13, this.y - 10, this.x + 18, this.y - 18, this.x + 11, this.y - 23);
		quad(this.x - 8, this.y - 19, this.x - 14, this.y - 13, this.x - 19, this.y - 19, this.x - 11, this.y - 23);
	}
	drawAirRight() {
		// add your jumping-right code
		stroke(0);
		strokeWeight(1);
		fill(150);
		//legs
		quad(this.x - 3, this.y - 28, this.x + 15, this.y - 13, this.x + 17, this.y - 18, this.x, this.y - 33);
		quad(this.x + 3, this.y - 28, this.x - 15, this.y - 13, this.x - 17, this.y - 18, this.x, this.y - 33);
		//back arm
		quad(this.x + 3, this.y - 48, this.x - 10, this.y - 35, this.x - 12, this.y - 40, this.x, this.y - 53);
		//body
		rect(this.x - 5, this.y - 55, 10, 30);
		// front arm
		quad(this.x - 3, this.y - 48, this.x + 10, this.y - 35, this.x + 12, this.y - 40, this.x, this.y - 53);
		//shoulders
		ellipse(this.x, this.y - 50, 12, 10);
		//head
		triangle(this.x + 8, this.y - 60, this.x + 3, this.y - 40, this.x - 7, this.y - 60);
		triangle(this.x + 8, this.y - 60, this.x + 1, this.y - 70, this.x - 7, this.y - 60);
		//hands
		fill(0);
		ellipse(this.x + 12, this.y - 37, 7, 5);
		ellipse(this.x - 12, this.y - 37, 7, 5);
		//feet
		quad(this.x + 8, this.y - 19, this.x + 15, this.y - 13, this.x + 19, this.y - 19, this.x + 11, this.y - 23);
		quad(this.x - 8, this.y - 19, this.x - 14, this.y - 11, this.x - 18, this.y - 18, this.x - 11, this.y - 23);
	}
	drawLeft() {
			// uses movestate variable to animate the character's walk
		if(this.moveState % 160 < 40) {
			stroke(0);
			strokeWeight(1);
			fill(150);
			//legs
			rect(this.x - 3, this.y - 20, 6, 20);
			beginShape();
			vertex(this.x + 3, this.y - 20);
			vertex(this.x + 6, this.y - 11);
			vertex(this.x + 15, this.y - 10);
			vertex(this.x + 15, this.y - 5);
			vertex(this.x + 3, this.y - 6);
			vertex(this.x - 3, this.y - 20);
			endShape(close);
			//body
			rect(this.x - 5, this.y - 50, 10, 30);
			//arms
			rect(this.x - 3, this.y - 46, 5, 20);
			//shoulders
			ellipse(this.x, this.y - 45, 12, 10);
			//head
			triangle(this.x - 8, this.y - 55, this.x - 3, this.y - 35, this.x + 7, this.y - 55);
			triangle(this.x - 8, this.y - 55, this.x - 1, this.y - 65, this.x + 7, this.y - 55);
			//hands
			fill(0);
			ellipse(this.x, this.y - 25, 7, 5);
			//feet
			quad(this.x + 4, this.y - 5, this.x + 4, this.y + 3, this.x - 4, this.y + 3, this.x - 3, this.y - 5);
			quad(this.x + 15, this.y - 11, this.x + 15, this.y - 4, this.x + 7, this.y - 6, this.x + 7, this.y - 11);
		} else if(this.moveState % 160 < 80) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			//legs
			quad(this.x - 3, this.y - 18, this.x + 15, this.y - 3, this.x + 17, this.y - 8, this.x, this.y - 23);
			//back arm
			quad(this.x + 3, this.y - 38, this.x - 10, this.y - 25, this.x - 12, this.y - 30, this.x, this.y - 43);
			//body
			rect(this.x - 5, this.y - 45, 10, 30);
			quad(this.x + 3, this.y - 18, this.x - 15, this.y - 3, this.x - 17, this.y - 8, this.x, this.y - 23);
			// front arm
			quad(this.x - 3, this.y - 38, this.x + 10, this.y - 25, this.x + 12, this.y - 30, this.x, this.y - 43);
			//shoulders
			ellipse(this.x, this.y - 40, 12, 10);
			//head
			triangle(this.x - 8, this.y - 50, this.x - 3, this.y - 30, this.x + 7, this.y - 50);
			triangle(this.x - 8, this.y - 50, this.x - 1, this.y - 60, this.x + 7, this.y - 50);
			//hands
			fill(0);
			ellipse(this.x - 12, this.y - 27, 7, 5);
			ellipse(this.x + 12, this.y - 27, 7, 5);
			//feet
			quad(this.x - 8, this.y - 9, this.x - 15, this.y - 3, this.x - 19, this.y - 9, this.x - 11, this.y - 13);
			quad(this.x + 8, this.y - 9, this.x + 14, this.y - 1, this.x + 18, this.y - 8, this.x + 11, this.y - 13);
		} else if(this.moveState % 160 < 120) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			//legs
			beginShape();
			vertex(this.x + 3, this.y - 20);
			vertex(this.x + 6, this.y - 11);
			vertex(this.x + 15, this.y - 10);
			vertex(this.x + 15, this.y - 5);
			vertex(this.x + 3, this.y - 6);
			vertex(this.x - 3, this.y - 20);
			endShape(close);
			rect(this.x - 3, this.y - 20, 6, 20);
			//body
			rect(this.x - 5, this.y - 50, 10, 30);
			//arms
			rect(this.x - 3, this.y - 46, 5, 20);
			//shoulders
			ellipse(this.x, this.y - 45, 12, 10);
			//head
			triangle(this.x - 8, this.y - 55, this.x - 3, this.y - 35, this.x + 7, this.y - 55);
			triangle(this.x - 8, this.y - 55, this.x - 1, this.y - 65, this.x + 7, this.y - 55);
			//hands
			fill(0);
			ellipse(this.x, this.y - 25, 7, 5);
			//feet
			quad(this.x + 4, this.y - 5, this.x + 4, this.y + 3, this.x - 4, this.y + 3, this.x - 3, this.y - 5);
			quad(this.x + 15, this.y - 11, this.x + 15, this.y - 4, this.x + 7, this.y - 6, this.x + 7, this.y - 11);
		} else if(this.moveState % 160 < 160) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			//legs
			quad(this.x + 3, this.y - 18, this.x - 15, this.y - 3, this.x - 17, this.y - 8, this.x, this.y - 23);
			//back arm
			quad(this.x - 3, this.y - 38, this.x + 10, this.y - 25, this.x + 12, this.y - 30, this.x, this.y - 43);
			//body
			rect(this.x - 5, this.y - 45, 10, 30);
			quad(this.x - 3, this.y - 18, this.x + 15, this.y - 3, this.x + 17, this.y - 8, this.x, this.y - 23);
			// front arm
			quad(this.x + 3, this.y - 38, this.x - 10, this.y - 25, this.x - 12, this.y - 30, this.x, this.y - 43);
			//shoulders
			ellipse(this.x, this.y - 40, 12, 10);
			//head
			triangle(this.x - 8, this.y - 50, this.x - 3, this.y - 30, this.x + 7, this.y - 50);
			triangle(this.x - 8, this.y - 50, this.x - 1, this.y - 60, this.x + 7, this.y - 50);
			//hands
			fill(0);
			ellipse(this.x - 12, this.y - 27, 7, 5);
			ellipse(this.x + 12, this.y - 27, 7, 5);
			//feet
			quad(this.x - 8, this.y - 9, this.x - 15, this.y - 3, this.x - 19, this.y - 9, this.x - 11, this.y - 13);
			quad(this.x + 8, this.y - 9, this.x + 14, this.y - 1, this.x + 18, this.y - 8, this.x + 11, this.y - 13);
		}
	}
	drawRight() {
			// uses movestate variable to animate the character's walk
		if(this.moveState % 160 < 40) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			//legs
			rect(this.x - 3, this.y - 20, 6, 20);
			beginShape();
			vertex(this.x - 3, this.y - 20);
			vertex(this.x - 6, this.y - 11);
			vertex(this.x - 15, this.y - 10);
			vertex(this.x - 15, this.y - 5);
			vertex(this.x - 3, this.y - 6);
			vertex(this.x + 3, this.y - 20);
			endShape(close);
			//body
			rect(this.x - 5, this.y - 50, 10, 30);
			//arms
			rect(this.x - 3, this.y - 46, 5, 20);
			//shoulders
			ellipse(this.x, this.y - 45, 12, 10);
			//head
			triangle(this.x + 8, this.y - 55, this.x + 3, this.y - 35, this.x - 7, this.y - 55);
			triangle(this.x + 8, this.y - 55, this.x + 1, this.y - 65, this.x - 7, this.y - 55);
			//hands
			fill(0);
			ellipse(this.x, this.y - 25, 7, 5);
			//feet
			quad(this.x - 3, this.y - 5, this.x - 3, this.y + 3, this.x + 5, this.y + 3, this.x + 4, this.y - 5);
			quad(this.x - 15, this.y - 11, this.x - 15, this.y - 4, this.x - 7, this.y - 6, this.x - 7, this.y - 11);
		} else if(this.moveState % 160 < 80) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			//back leg	
			quad(this.x + 3, this.y - 18, this.x - 15, this.y - 3, this.x - 17, this.y - 8, this.x, this.y - 23);
			//back arm
			quad(this.x - 3, this.y - 38, this.x + 10, this.y - 25, this.x + 12, this.y - 30, this.x, this.y - 43);
			//body
			rect(this.x - 5, this.y - 45, 10, 30);
			// front leg
			quad(this.x - 3, this.y - 18, this.x + 15, this.y - 3, this.x + 17, this.y - 8, this.x, this.y - 23);
			// front arm
			quad(this.x + 3, this.y - 38, this.x - 10, this.y - 25, this.x - 12, this.y - 30, this.x, this.y - 43);
			//shoulders
			ellipse(this.x, this.y - 40, 12, 10);
			//head
			triangle(this.x + 8, this.y - 50, this.x + 3, this.y - 30, this.x - 7, this.y - 50);
			triangle(this.x + 8, this.y - 50, this.x + 1, this.y - 60, this.x - 7, this.y - 50);
			//hands
			fill(0);
			ellipse(this.x + 12, this.y - 27, 7, 5);
			ellipse(this.x - 12, this.y - 27, 7, 5);
			//feet
			quad(this.x + 8, this.y - 9, this.x + 15, this.y - 3, this.x + 19, this.y - 9, this.x + 11, this.y - 13);
			quad(this.x - 8, this.y - 9, this.x - 14, this.y - 1, this.x - 18, this.y - 8, this.x - 11, this.y - 13);
		} else if(this.moveState % 160 < 120) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			//legs
			beginShape();
			vertex(this.x - 3, this.y - 20);
			vertex(this.x - 6, this.y - 11);
			vertex(this.x - 15, this.y - 10);
			vertex(this.x - 15, this.y - 5);
			vertex(this.x - 3, this.y - 6);
			vertex(this.x + 3, this.y - 20);
			endShape(close);
			rect(this.x - 3, this.y - 20, 6, 20);
			//body
			rect(this.x - 5, this.y - 50, 10, 30);
			//arms
			rect(this.x - 3, this.y - 46, 5, 20);
			//shoulders
			ellipse(this.x, this.y - 45, 12, 10);
			//head
			triangle(this.x + 8, this.y - 55, this.x + 3, this.y - 35, this.x - 7, this.y - 55);
			triangle(this.x + 8, this.y - 55, this.x + 1, this.y - 65, this.x - 7, this.y - 55);
			//hands
			fill(0);
			ellipse(this.x, this.y - 25, 7, 5);
			//feet
			quad(this.x - 15, this.y - 11, this.x - 15, this.y - 4, this.x - 7, this.y - 6, this.x - 7, this.y - 11);
			quad(this.x - 3, this.y - 5, this.x - 3, this.y + 3, this.x + 5, this.y + 3, this.x + 4, this.y - 5);
		} else if(this.moveState % 160 < 160) {
			//Add your code here ...
			stroke(0);
			strokeWeight(1);
			fill(150);
			// back leg
			quad(this.x - 3, this.y - 18, this.x + 15, this.y - 3, this.x + 17, this.y - 8, this.x, this.y - 23);
			//back arm
			quad(this.x + 3, this.y - 38, this.x - 10, this.y - 25, this.x - 12, this.y - 30, this.x, this.y - 43);
			//body
			rect(this.x - 5, this.y - 45, 10, 30);
			// front leg
			quad(this.x + 3, this.y - 18, this.x - 15, this.y - 3, this.x - 17, this.y - 8, this.x, this.y - 23);
			// front arm
			quad(this.x - 3, this.y - 38, this.x + 10, this.y - 25, this.x + 12, this.y - 30, this.x, this.y - 43);
			//shoulders
			ellipse(this.x, this.y - 40, 12, 10);
			//head
			triangle(this.x + 8, this.y - 50, this.x + 3, this.y - 30, this.x - 7, this.y - 50);
			triangle(this.x + 8, this.y - 50, this.x + 1, this.y - 60, this.x - 7, this.y - 50);
			//hands
			fill(0);
			ellipse(this.x + 12, this.y - 27, 7, 5);
			ellipse(this.x - 12, this.y - 27, 7, 5);
			//feet
			quad(this.x + 8, this.y - 9, this.x + 15, this.y - 3, this.x + 19, this.y - 9, this.x + 11, this.y - 13);
			quad(this.x - 8, this.y - 9, this.x - 14, this.y - 1, this.x - 18, this.y - 8, this.x - 11, this.y - 13);
		}
	}
	drawAirStraight() {
		// add your jumping facing forwards code
		stroke(0);
		strokeWeight(1);
		fill(150);
		//legs;
		rect(this.x - 8, this.y - 35, 6, 20);
		rect(this.x + 2, this.y - 35, 6, 20);
		//body
		rect(this.x - 10, this.y - 55, 20, 30);
		//arms
		rect(this.x - 15, this.y - 46, 5, -20);
		rect(this.x + 10, this.y - 46, 5, -20);
		//shoulders
		ellipse(this.x - 8, this.y - 45, 12, 10);
		ellipse(this.x + 8, this.y - 45, 12, 10);
		//head
		triangle(this.x - 10, this.y - 55, this.x, this.y - 35, this.x + 10, this.y - 55);
		triangle(this.x - 10, this.y - 55, this.x, this.y - 65, this.x + 10, this.y - 55);
		//hands
		fill(0);
		ellipse(this.x - 12, this.y - 65, 7, 5);
		ellipse(this.x + 13, this.y - 65, 7, 5);
		//feet
		quad(this.x - 8, this.y - 15, this.x - 10, this.y - 7, this.x - 1, this.y - 7, this.x - 1, this.y - 15);
		quad(this.x + 2, this.y - 15, this.x + 2, this.y - 7, this.x + 11, this.y - 7, this.x + 9, this.y - 15);
	}
	drawStand() {
		// add your standing front facing code
		stroke(0);
		strokeWeight(1);
		fill(150);
		//legs
		rect(this.x - 8, this.y - 20, 6, 20);
		rect(this.x + 2, this.y - 20, 6, 20);
		//body
		rect(this.x - 10, this.y - 50, 20, 30);
		//arms
		rect(this.x - 15, this.y - 46, 5, 20);
		rect(this.x + 10, this.y - 46, 5, 20);
		//shoulders
		ellipse(this.x - 8, this.y - 45, 12, 10);
		ellipse(this.x + 8, this.y - 45, 12, 10);
		//head
		triangle(this.x - 10, this.y - 55, this.x, this.y - 35, this.x + 10, this.y - 55);
		triangle(this.x - 10, this.y - 55, this.x, this.y - 65, this.x + 10, this.y - 55);
		//hands
		fill(0);
		ellipse(this.x - 12, this.y - 25, 7, 5);
		ellipse(this.x + 13, this.y - 25, 7, 5);
		//feet
		quad(this.x - 8, this.y - 5, this.x - 10, this.y + 3, this.x - 1, this.y + 3, this.x - 1, this.y - 5);
		quad(this.x + 2, this.y - 5, this.x + 2, this.y + 3, this.x + 11, this.y + 3, this.x + 9, this.y - 5);
	}
	drawCompleted() {
		stroke(0);
		strokeWeight(1);
		fill(150);
		//legs
		rect(this.x - 8, this.y - 20, 6, 20);
		rect(this.x + 2, this.y - 20, 6, 20);
		//body
		rect(this.x - 10, this.y - 50, 20, 30);
		//arms
		rect(this.x - 15, this.y - 66, 5, 20);
		rect(this.x + 10, this.y - 46, 5, 20);
		//shoulders
		ellipse(this.x - 8, this.y - 45, 12, 10);
		ellipse(this.x + 8, this.y - 45, 12, 10);
		//head
		triangle(this.x - 10, this.y - 55, this.x, this.y - 35, this.x + 10, this.y - 55);
		triangle(this.x - 10, this.y - 55, this.x, this.y - 65, this.x + 10, this.y - 55);
		// sword
		stroke(100);
		strokeWeight(5);
		line(this.x - 12, this.y - 66, this.x + 4, this.y - 90);
		stroke(153, 76, 0);
		line(this.x - 12, this.y - 66, this.x - 16, this.y - 60);
		stroke(0, 102, 0);
		line(this.x - 15, this.y - 70, this.x - 7, this.y - 65);
		stroke(0);
		strokeWeight(1);
		//hands
		fill(0);
		ellipse(this.x - 12, this.y - 66, 7, 5);
		ellipse(this.x + 13, this.y - 25, 7, 5);
		//feet
		quad(this.x - 8, this.y - 5, this.x - 10, this.y + 3, this.x - 1, this.y + 3, this.x - 1, this.y - 5);
		quad(this.x + 2, this.y - 5, this.x + 2, this.y + 3, this.x + 11, this.y + 3, this.x + 9, this.y - 5);
	}
}
// tree class, creates a tree of random size in random locations across the level
class Tree {
	// set up tree constructor
	constructor(floor) {
			this.x = random(0, 7500);
			this.y = floor;
			this.size = random(0.5, 3);
		}
		// method to draw the tree
	draw() {
		noStroke();
		fill(102, 51, 0);
		// tree trunk
		rect(this.x - 10 * this.size, floorPos_y - 80 * this.size, 20 * this.size, 80 * this.size);
		// tree base left
		triangle(this.x - 9 * this.size, floorPos_y, this.x - 9 * this.size, floorPos_y - 22 * this.size, this.x - 19 * this.size, floorPos_y);
		// treetrunk shadow
		fill(90, 35, 0);
		rect(this.x - 10 * this.size + 5 * this.size, floorPos_y - 80 * this.size, 10 * this.size, 80 * this.size);
		fill(80, 25, 0);
		rect(this.x - 10 * this.size + 15 * this.size, floorPos_y - 80 * this.size, 5 * this.size, 80 * this.size);
		// tree base right
		triangle(this.x + 9 * this.size, floorPos_y, this.x + 9 * this.size, floorPos_y - 22 * this.size, this.x + 19 * this.size, floorPos_y);
		// tree leaves
		fill(76, 155, 0);
		noStroke();
		// left side leaves
		ellipse(this.x - 20 * this.size, floorPos_y - 90 * this.size, 40 * this.size, 40 * this.size);
		fill(66, 145, 0);
		ellipse(this.x - 10 * this.size, floorPos_y - 97 * this.size, 40 * this.size, 40 * this.size);
		ellipse(this.x - 10 * this.size, floorPos_y - 82 * this.size, 40 * this.size, 40 * this.size);
		// right side leaves
		fill(56, 135, 0);
		ellipse(this.x + 10 * this.size, floorPos_y - 97 * this.size, 40 * this.size, 40 * this.size);
		ellipse(this.x + 10 * this.size, floorPos_y - 82 * this.size, 40 * this.size, 40 * this.size);
		fill(46, 125, 0);
		ellipse(this.x + 20 * this.size, floorPos_y - 90 * this.size, 40 * this.size, 40 * this.size);
	}
}
// cloud class. Creates a cloud in a random location, takes in a variable for the width of the screen, and the position of the floor to make sure that it appears in the sky
class Cloud {
	// set up cloud constructor
	constructor(floor, screenWidth) {
			this.x = random(0, screenWidth);
			this.y = random(50, floor - 150);
			this.size = random(0.5, 1.5);
			this.speed = random(1, 3);
		}
		// method to draw the cloud
	draw() {
			fill(200, 200, 200);
			ellipse(this.x, this.y, 90 * this.size, 90 * this.size);
			ellipse(this.x - 30 * this.size, this.y - 15 * this.size, 50 * this.size, 50 * this.size);
			ellipse(this.x - 50 * this.size, this.y - 1 * this.size, 50 * this.size, 50 * this.size);
			ellipse(this.x - 30 * this.size, this.y + 15 * this.size, 50 * this.size, 50 * this.size);
			ellipse(this.x + 30 * this.size, this.y - 15 * this.size, 50 * this.size, 50 * this.size);
			ellipse(this.x + 50 * this.size, this.y - 1 * this.size, 50 * this.size, 50 * this.size);
			ellipse(this.x + 30 * this.size, this.y + 15 * this.size, 50 * this.size, 50 * this.size);
			// make the cloud move to the right
			this.x += this.speed;
		}
		// method to send the cloud to the left hand side once it goes off the right of the screen. Also resets the cloud variables to change it's size, speed and height
	positionCheck(screenWidth, scrollPos) {
		if(this.x > screenWidth + 100 * this.size - scrollPos) {
			this.y = random(50, floorPos_y - 150);
			this.speed = random(1, 3);
			this.size = random(0.5, 1.5);
			this.x = 0 - 100 * this.size - scrollPos;
		}
	}
}
// Mountain class, creates a mountain of random size in random locations across the level
class Mountain {
	// set up mountain constructor
	constructor(floor) {
			this.x = random(0, 7500);
			this.y = floor;
			this.height = random(100, 300);
		}
		// method to draw the mountain
	draw() {
		// main body of mountain
		fill(112, 128, 144);
		triangle(this.x - this.height / 2, this.y, this.x, this.y - this.height, this.x + this.height / 2, this.y);
		// snowy peak of mountain
		fill(255, 255, 255);
		triangle(this.x - this.height / 6, this.y - this.height / 1.5, this.x, this.y - this.height, this.x + this.height / 6, this.y - this.height / 1.5);
	}
}
// Star class, creates a star, uses the floor position to make sure that it appears in the sky 
class Star {
	constructor(floor) {
			this.x = random(0, 6200);
			this.y = random(0, floor);
		}
		//  method to draw the star
	draw() {
		stroke(255);
		strokeWeight(1);
		point(this.x, this.y);
		noStroke();
	}
}
// Canyon class, creates a canyon 
class Canyon {
	// set up canyon constructor, uses the canyon_pos array to place and size the canyons to allow for level design
	constructor(canyon, floor) {
			this.x = canyon.x;
			this.y = floor;
			this.width = canyon.width;
			this.centerPoint = this.x + (this.width / 2);
			this.depth = 0;
		}
		// method to draw the canyon
	draw(screenWidth, scrollPos) {
			//canyon gap
			fill(205, 133, 63);
			rect(this.x, this.y, this.width, screenWidth - this.y);
			// set this.depth to help draw the canyon sides based upon screen position to create the illusion of depth
			this.depth = map(dist(screenWidth / 2 - scrollPos, this.y, this.centerPoint, this.y), 0, screenWidth / 2, 0, 40);
			// check if the canyon is on the left or right hand side of the screen 
			if(this.centerPoint < screenWidth / 2 - scrollPos) {
				//left cliff face
				fill(139, 69, 19);
				rect(this.x - this.depth, this.y + 60, this.depth, screenWidth - this.y);
				triangle(this.x - this.depth, this.y + 60, this.x, this.y, this.x, this.y + 60);
				//right grass fill
				fill(0, 100, 20);
				rect(this.x + this.width - this.depth, this.y + 61, 60 + this.depth, screenWidth - this.y);
				triangle(this.x + this.width - this.depth, this.y + 61, this.x + this.width + 1, this.y, this.x + this.width + 1, this.y + 61);
			} else if(this.centerPoint > screenWidth / 2 - scrollPos) {
				// right cliff face
				fill(139, 69, 19);
				rect(this.x + this.width - 1, this.y + 60, this.depth, screenWidth - this.y);
				triangle(this.x + this.width + this.depth, this.y + 60, this.x + this.width - 1, this.y, this.x + this.width - 1, this.y + 60);
				// left grass fill
				fill(0, 100, 20);
				rect(this.x, this.y + 60, this.depth, screenWidth - this.y);
				triangle(this.x + this.depth, this.y + 60, this.x, this.y, this.x, this.y + 60);
			}
		}
		// this method checks to see if the game character will plummet down the canyon
	plummetCheck(char, scrollPos) {
			// checks the game character position, sets the character to plummeting if he is goes into the canyon
			if(char.x > this.x + scrollPos + 10 && char.x < this.x + this.width - 5 + scrollPos && char.y >= floorPos_y && char.isDead === false) {
				char.jumpPower = 0;
				char.isPlummeting = true;
				char.isDead = true;
				sounds.die.play();
			}
			// if the game character is not plumeting it keeps his y position bottom value constrained either on the floor, or on a platform if he is standing on one
			else if(char.isPlummeting === false && char.isDead === false && char.inPlay === true) {
				char.y = constrain(char.y, -100, char.floorHeight);
			}
			// if the game character is plummeting it constrains his x position inside the canyon so that he falls down it, not around it
			if(char.isPlummeting === true && char.x + 10 > this.x + scrollPos && char.x < this.x + this.width - 5 + scrollPos) {
				char.x = constrain(char.x, this.x + scrollPos + this.depth + 25, this.x + this.width - 20 + scrollPos - this.depth * 1.1);
			}
		}
		// short method that changes a variable to true if the character's x position is in the middle of a canyon. Used when respawning the character in gameChar.reset
	restartCheck() {
		if(gameChar.x > this.x + scrollPos + 10 && gameChar.x < this.x + this.width - 5 + scrollPos) {
			gameChar.inCanyon = true;
		}
	}
}
// Collectable class, in my game I used chests, creates a chest or random size when given an x coordinate
class Collectable {
	// set up collectable constructor
	constructor(collectable) {
			this.x = collectable.x;
			this.y = collectable.y;
			this.size = random(0.8, 1.2);
			this.isFound = false;
		}
		// method to draw the collectable. When it is not found it is drawn as a closed chest, once the chracter has found it it is drawn as an open chest
	draw() {
			noStroke();
			fill(139, 69, 19);
			//chest box
			rect(this.x - 20 * this.size, this.y - 21 * this.size, 40 * this.size, 22 * this.size);
			fill(150, 100, 19);
			//chest wood lines
			rect(this.x - 20 * this.size, this.y - 19 * this.size, 40 * this.size, 2 * this.size);
			rect(this.x - 20 * this.size, this.y - 15 * this.size, 40 * this.size, 2 * this.size);
			rect(this.x - 20 * this.size, this.y - 7 * this.size, 40 * this.size, 2 * this.size);
			rect(this.x - 20 * this.size, this.y - 3 * this.size, 40 * this.size, 2 * this.size);
			//chest gold trim
			fill(255, 215, 0);
			rect(this.x - 21 * this.size, this.y - 11 * this.size, 40 * this.size, 2 * this.size);
			rect(this.x - 21 * this.size, this.y + 1 * this.size, 42 * this.size, 2 * this.size);
			if(this.isFound === false) {
				rect(this.x - 21 * this.size, this.y - 21 * this.size, 2 * this.size, 23 * this.size);
				rect(this.x + 19 * this.size, this.y - 21 * this.size, 2 * this.size, 23 * this.size);
				rect(this.x - 2 * this.size, this.y - 11 * this.size, 5 * this.size, 4 * this.size);
			} else {
				rect(this.x - 21 * this.size, this.y - 30 * this.size, 2 * this.size, 32 * this.size);
				rect(this.x + 19 * this.size, this.y - 30 * this.size, 2 * this.size, 32 * this.size);
				rect(this.x - 21 * this.size, this.y - 32 * this.size, 42 * this.size, 2 * this.size);
				//box interior
				fill(0);
				rect(this.x - 19 * this.size, this.y - 18 * this.size, 40 * this.size - 2, 7 * this.size);
				fill(40);
				rect(this.x - 19 * this.size, this.y - 30 * this.size, 40 * this.size - 2, 12 * this.size);
			}
		}
		// method to check if the character has found the chest
	foundCheck(char) {
		// if the character gets close enough collectable.isFound is set to true and a true value is returned. 
		var addScore = false;
		if(dist(char.x - scrollPos, char.y, this.x, this.y) < 30 && char.isDead === false) {
			if(this.isFound === false) {
				addScore = true;
				sounds.chest.play();
			}
			this.isFound = true;
		}
		return addScore;
	}
}
// Platform class, creates a platform when fed a platform object. 
class Platform {
	constructor(platform) {
			// positional variables
			this.currentX = platform.x;
			this.currentY = platform.y;
			this.length = platform.length;
		}
		// method to draw the platform
	draw() {
			fill(0, 100, 20);
			rect(this.currentX, this.currentY, this.length, 10);
			fill(100, 100, 20);
			rect(this.currentX, this.currentY + 10, this.length, 5);
		}
		// this method checks whether the character is just over a platform, and then allows him to land on said platform. It also removes him from the platform when he moves off it.
	checkContact(char, scrollPos) {
		if(char.x > this.currentX + scrollPos && char.x < this.currentX + this.length + scrollPos && char.y <= this.currentY && char.y > this.currentY - 50) {
			char.onPlatform = true;
			this.charOnPlatform = true;
			char.floorHeight = this.currentY;
		} else {
			this.charOnPlatform = false;
		}
	}
}
class MovingPlatform extends Platform {
	constructor(platform) {
			super(platform);
			this.x = platform.x;
			this.y = platform.y;
			this.length = platform.length;
			// variables for moving the platform horizontially
			this.xRange = platform.xRange;
			this.currentX = platform.currentX;
			// variable for moving the platform vertically
			this.yRange = platform.yRange;
			this.currentY = platform.currentY;
			this.charOnPlatform = false;
			// variable to indicate the platforms starting direction
			this.moveUp = platform.moveUp;
			this.moveDown = platform.moveDown;
			this.moveRight = platform.moveRight;
			this.moveLeft = platform.moveLeft;
		}
		// This method checks whether the platform is set to move, and if so whether it has reached the limits of it's range. If it has, it reverses direction
	checkDirection() {
			if(this.currentX < this.x - this.xRange) {
				this.moveRight = true;
				this.moveLeft = false;
			} else if(this.currentX > this.x + this.xRange) {
				this.moveRight = false;
				this.moveLeft = true;
			}
			if(this.currentY < this.y - this.yRange) {
				this.moveDown = true;
				this.moveUp = false;
			} else if(this.currentY > this.y + this.yRange) {
				this.moveDown = false;
				this.moveUp = true;
			}
		}
		// this method moves the platform if I have designed it to be a movable platform. It also moves the character if they are standing on the platform by calling gameChar methods
	move(char) {
		if(this.moveRight === true) {
			this.currentX += 1;
			if(this.charOnPlatform === true) {
				char.moveRight(1);
			}
		} else if(this.moveLeft === true) {
			if(this.charOnPlatform === true) {
				char.moveLeft(1);
			}
			this.currentX -= 1;
		}
		if(this.moveUp === true) {
			this.currentY -= 1;
			if(this.charOnPlatform === true) {
				char.floorHeight = this.currentY;
			}
		} else if(this.moveDown === true) {
			if(this.charOnPlatform === true) {
				char.y += 1;
			}
			this.currentY += 1;
		}
	}
}
// spider class, creates a spider when given an object containng x and y co-ordinates
class Spider {
	constructor(spider) {
			// location variables   
			this.x = spider.x;
			this.y = spider.y;
			// the character can kill spiders by jumping on them, this variable keeps track of this
			this.dead = false;
			// currentX keeps track of movement and starts the spider in a random location along it's x range
			this.currentX = spider.x + floor(random(-50, 50));
			this.range = spider.range;
			// sets the spider off in a random direction
			let direction = round(random(0, 1));
			if(direction === 0) {
				this.moveRight = true;
				this.moveLeft = false;
			} else {
				this.moveRight = false;
				this.moveLeft = true;
			}
			// this variable is used to animate the spider
			this.state = 0;
		}
		// Method to draw the spider, if it's been killed then it's drawn as an upside down spider, otherwise this.state is used to animate the spider walking
	draw() {
			if(this.dead === true) {
				noStroke();
				fill(0);
				// spider body
				ellipse(this.currentX, this.y - 5, 25, 15);
				stroke(0);
				// spider left legs
				line(this.currentX, this.y - 5, this.currentX - 22, this.y);
				line(this.currentX - 22, this.y, this.currentX - 24, this.y - 14);
				line(this.currentX, this.y - 5, this.currentX - 20, this.y - 4);
				line(this.currentX - 20, this.y - 4, this.currentX - 22, this.y - 14);
				line(this.currentX, this.y - 5, this.currentX - 18, this.y - 6);
				line(this.currentX - 18, this.y - 6, this.currentX - 20, this.y - 14);
				line(this.currentX, this.y - 5, this.currentX - 16, this.y - 8);
				line(this.currentX - 16, this.y - 8, this.currentX - 18, this.y - 14);
				// spider right legs
				line(this.currentX, this.y - 5, this.currentX + 22, this.y);
				line(this.currentX + 22, this.y, this.currentX + 24, this.y - 14);
				line(this.currentX, this.y - 5, this.currentX + 20, this.y - 4);
				line(this.currentX + 20, this.y - 4, this.currentX + 22, this.y - 14);
				line(this.currentX, this.y - 5, this.currentX + 18, this.y - 6);
				line(this.currentX + 18, this.y - 6, this.currentX + 20, this.y - 14);
				line(this.currentX, this.y - 5, this.currentX + 16, this.y - 8);
				line(this.currentX + 16, this.y - 8, this.currentX + 18, this.y - 14);
				// spider eyes
				noStroke();
				fill(255);
				ellipse(this.currentX - 5, this.y - 2, 6, 6);
				ellipse(this.currentX + 5, this.y - 2, 6, 6);
				fill(0);
				ellipse(this.currentX - 4, this.y - 2, 1, 1);
				ellipse(this.currentX + 6, this.y - 2, 1, 1);
			} else if(this.state % 20 > 10) {
				noStroke();
				fill(0);
				// spider body
				ellipse(this.currentX, this.y - 5, 25, 15);
				stroke(0);
				// spider left legs
				line(this.currentX, this.y - 5, this.currentX - 22, this.y - 14);
				line(this.currentX - 22, this.y - 14, this.currentX - 24, this.y);
				line(this.currentX, this.y - 5, this.currentX - 20, this.y - 10);
				line(this.currentX - 20, this.y - 10, this.currentX - 22, this.y);
				line(this.currentX, this.y - 5, this.currentX - 18, this.y - 6);
				line(this.currentX - 18, this.y - 6, this.currentX - 20, this.y);
				line(this.currentX, this.y - 5, this.currentX - 16, this.y - 2);
				line(this.currentX - 16, this.y - 2, this.currentX - 18, this.y);
				// spider right legs
				line(this.currentX, this.y - 5, this.currentX + 22, this.y - 14);
				line(this.currentX + 22, this.y - 14, this.currentX + 22, this.y);
				line(this.currentX, this.y - 5, this.currentX + 20, this.y - 10);
				line(this.currentX + 20, this.y - 10, this.currentX + 20, this.y);
				line(this.currentX, this.y - 5, this.currentX + 18, this.y - 6);
				line(this.currentX + 18, this.y - 6, this.currentX + 18, this.y);
				line(this.currentX, this.y - 5, this.currentX + 16, this.y - 2);
				line(this.currentX + 16, this.y - 2, this.currentX + 16, this.y);
				// spider eyes
				noStroke();
				fill(255);
				ellipse(this.currentX - 5, this.y - 8, 6, 6);
				ellipse(this.currentX + 5, this.y - 8, 6, 6);
				fill(0);
				ellipse(this.currentX - 6, this.y - 8, 1, 1);
				ellipse(this.currentX + 4, this.y - 8, 1, 1);
			} else {
				noStroke();
				fill(0);
				// spider body
				ellipse(this.currentX, this.y - 5, 25, 15);
				stroke(0);
				// spider left legs
				line(this.currentX, this.y - 5, this.currentX - 22, this.y - 14);
				line(this.currentX - 22, this.y - 14, this.currentX - 22, this.y);
				line(this.currentX, this.y - 5, this.currentX - 20, this.y - 10);
				line(this.currentX - 20, this.y - 10, this.currentX - 20, this.y);
				line(this.currentX, this.y - 5, this.currentX - 18, this.y - 6);
				line(this.currentX - 18, this.y - 6, this.currentX - 18, this.y);
				line(this.currentX, this.y - 5, this.currentX - 16, this.y - 2);
				line(this.currentX - 16, this.y - 2, this.currentX - 16, this.y);
				// spider right legs
				line(this.currentX, this.y - 5, this.currentX + 22, this.y - 14);
				line(this.currentX + 22, this.y - 14, this.currentX + 24, this.y);
				line(this.currentX, this.y - 5, this.currentX + 20, this.y - 10);
				line(this.currentX + 20, this.y - 10, this.currentX + 22, this.y);
				line(this.currentX, this.y - 5, this.currentX + 18, this.y - 6);
				line(this.currentX + 18, this.y - 6, this.currentX + 20, this.y);
				line(this.currentX, this.y - 5, this.currentX + 16, this.y - 2);
				line(this.currentX + 16, this.y - 2, this.currentX + 18, this.y);
				// spider eyes
				noStroke();
				fill(255);
				ellipse(this.currentX - 5, this.y - 8, 6, 6);
				ellipse(this.currentX + 5, this.y - 8, 6, 6);
				fill(0);
				ellipse(this.currentX - 4, this.y - 8, 1, 1);
				ellipse(this.currentX + 6, this.y - 8, 1, 1);
			}
			this.state += 1;
		}
		// method to move the spider along it's range while not dead
	move() {
			if(this.moveRight === true && this.dead === false) {
				this.currentX += 0.5;
			} else if(this.moveLeft === true && this.dead === false) {
				this.currentX -= 0.5;
			}
		}
		// checks when the spider has reached the end of it's range, then reverses direction
	checkDirection() {
			if(this.currentX > this.x + this.range) {
				this.moveLeft = true;
				this.moveRight = false;
			} else if(this.currentX < this.x - this.range) {
				this.moveLeft = false;
				this.moveRight = true;
			}
		}
		// checks whether the character has touched the spider. If coming from over the spider he will kill it, otherwise the spider will take a life from the character
	checkContact(char) {
		// checks whether the character has just died and is in it's period of invincibility. Character cannot interact with the spider during this period
		if(char.invincible === false) {
			if(dist(this.currentX + scrollPos, this.y, char.x, char.y) < 35 && char.isDead === false && this.dead === false) {
				if(char.y < this.y) {
					sounds.spider.play();
					char.enemyBounce = true;
					char.jumpPower = 15;
					char.fallSpeed = 0;
					char.score += 1;
					this.dead = true;
				} else if(char.isDead === false && char.inPlay === true) {
					sounds.die.play();
					char.enemyContact = true;
				}
			}
		}
	}
}
// menuscreen class, holds all the menu options and will fade in and out when appripriate
class MenuScreen {
	constructor() {
			// sets how transparant the menu is, initially set to no transparancy for the game start menu
			this.transparancy = 255;
			// menu text position for scrolling opening text
			this.text_y = 650;
			// timer is used to map the transparancy 
			this.timer = 1000;
			// boolean variable for various game and menu states
			this.gameStart = false;
			this.gameOver = false;
			this.levelComplete = false;
			this.fadeOut = false;
			this.fadeIn = false;
		}
		// method to decide what menu based on game circumstances
	showMenu(char) {
			// makes black background that can fade in and out
			fill(0, 0, 0, this.transparancy);
			rect(0, 0, 1024, 576);
			// setup font settings
			textFont(font);
			textSize(98);
			fill(34, 139, 34, this.transparancy);
			stroke(0, 0, 0, this.transparancy);
			strokeWeight(5);
			// gamestart menu
			if(this.gameStart === false && this.gameOver === false && this.levelComplete === false) {
				text("Forest Knight", 330, this.text_y);
				text("Awaken And Find Your Sword", 135, this.text_y + 150);
				text("Press Space To Start", 230, this.text_y + 300);
				if(this.text_y >= 150) {
					this.text_y -= 1;
				}
				// gameover menu
			} else if(this.gameOver === true) {
				text("Game Over", 380, 200);
				text("Press Space To Restart Game", 120, 300);
				// level complete menu
			} else if(this.levelComplete === true) {
				text("Level Complete", 290, 200);
				text(`Score: ${char.score}`, 390, 300);
				text("Press Space To Restart Game", 115, 400);
			}
		}
		// method to fade the menu screen in and out
	fadeMenu(char) {
		this.transparancy = map(this.timer, 0, 1000, 0, 255);
		if(this.fadeOut === true) {
			if(char.inPlay === false) {
				char.y = map(this.timer, 0, 1000, floorPos_y - 1, 500);
				scrollPos = random(-2, 2);
			}
			if(this.timer < 0 && char.inPlay === false) {
				char.inPlay = true;
				this.gameStart = true;
				this.fadeOut = false;
				sounds.emerge.stop();
				sounds.gameplay.loop();
			}
			this.timer -= 5;
		} else if(this.fadeIn === true) {
			if(this.timer > 1000) {
				this.timer = 1000;
			}
			this.timer += 5;
		}
	}
}