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
