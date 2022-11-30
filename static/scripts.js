const down = document.querySelector("#down_icon");
const aboutMe = document.querySelector("#about_me_title");
down.addEventListener("click", () => {
    aboutMe.scrollIntoView({ behavior: 'smooth'});
})