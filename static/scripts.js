const down = document.querySelector("#down_icon");
const aboutMe = document.querySelector("#about_me");
down.addEventListener("click", () => {
    aboutMe.scrollIntoView({ behavior: 'smooth'});
})

icons = document.querySelectorAll(".icon");
icons.forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        icon.classList.remove("fa-4x");
        icon.classList.add("fa-5x")
    })
    icon.addEventListener("mouseleave", () => {
        icon.classList.remove("fa-5x");
        icon.classList.add("fa-4x")
    })
});

skillIcons = document.querySelectorAll(".skill-icon")
initialOffsets = [];
for(let i = 0; i < skillIcons.length; i++){
    initialOffsets.push(skillIcons[i].offsetLeft);
}
let iconOffset = 0;
const testWidth = window.innerWidth/19;
setInterval(moveIcons);
function moveIcons(){
    iconOffset -= 1
    for(let i = 0; i < skillIcons.length; i++){
        skillIcons[i].style.left = `${iconOffset}px`;
        let provisionalOffset = iconOffset;
        while(skillIcons[i].getBoundingClientRect().x < -testWidth){
            provisionalOffset += window.innerWidth + testWidth;
            skillIcons[i].style.left = `${provisionalOffset}px`;
        }
    }
}

