// javascript for the main image carosell
// creates space at the top of the browser for the image carousel as it's position is set to absolute. Runs function to make vertical space on loading, and whenever the 
// window gets resized
const carousel = document.querySelectorAll(".carouselimage");
window.onload = () => {
    slideshowHeightBuffer();
    const body = document.querySelector("body");
    body.classList.remove("preload");
};
window.onresize = slideshowHeightBuffer;


// I adapted the code for the carousel from https://blog.logrocket.com/build-image-carousel-from-scratch-vanilla-javascript/ but I changed some things to personalise it. 
// sets up the starting position of each carousel image
carousel.forEach((slide, position) => {
    slide.style.transform = `translateX(${position * 100}%)`;
});

// sets the starting image randomly
let current = Math.floor(Math.random() * carousel.length);
carousel.forEach((slide, position) => {
    slide.style.transform = `translateX(${100 * (position - current)}%)`;
    });

// select next and previous slide button and runs functions on click
const next = document.querySelector("#btnnext");
next.addEventListener("click", nextSlide);
const previous = document.querySelector("#btnprev");
previous.addEventListener("click", prevSlide);

// Rotates to the next slide every 5 seconds
window.setInterval(nextSlide, 5000);

// This is the function that checks the height of the slideshowpicture and makes space at the top of the screen for it
function slideshowHeightBuffer(){
    const carouselContainer = document.querySelector("#imagecarousel");
    const buttons = document.querySelectorAll(".carouselbtn");
    buttons.forEach((button) => {
        button.style.height = `${carousel[current].height}px`;
    });
    carouselContainer.style.height = `${carousel[current].height}px`;
}

// Slideshow function to move to next slide 
function nextSlide(){
    if (current === carousel.length - 1) {
        current = 0;
    } else {
        current++;
    } 
    carousel.forEach((slide, position) => {
    slide.style.transform = `translateX(${100 * (position - current)}%)`;
    });
}

// Slideshow function to move to previous slide 
function prevSlide(){
    if (current === 0) {
        current = carousel.length - 1;
    } else {
        current--;
    }    
    carousel.forEach((slide, position) => {
    slide.style.transform = `translateX(${100 * (position - current)}%)`;
    });
}
