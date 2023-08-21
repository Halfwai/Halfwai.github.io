// Data for handlebars.js header and footer templates
const data = {
    logo: {
        href: "index.html",
        src: "images/PangolinLogo.png",
        alt: "Logo for Pangolin",
    },
    links: [
        {name: "Home",
        href: "index.html"},
        {name: "News",
        href: "news.html"},
        {name: "About Pangolin",
        href: "about.html"},
        {name: "Contact the Band",
        href: "contact.html"},
        {name: "Media",
        href: "media.html"},
    ],
    languages: [
        "English",
        "中文",
    ],
    legalLinks: [
        {name: "Privacy Policy",
        href: "#"},
        {name: "Terms and Conditions",
        href: "#"},
    ],
    socialMediaIcons: [
        {href: "#",
        icon: "fa fa-facebook",
        label: "facebook link"},
        {href: "#",
        icon: "fa fa-twitter",
        label: "twitter link"},
        {href: "#",
        icon: "fa fa-youtube",
        label: "youtube link"},
        {href: "#",
        icon: "fa fa-instagram",
        label: "instagram link"},                 
    ],
};

// fill out the header template
const headerTemplate = Handlebars.compile(document.querySelector('#headertemplate').innerHTML);
const filledHeader = headerTemplate(data);
document.querySelector('#headeroutput').innerHTML = filledHeader;

// fill out the footer template
const footerTemplate = Handlebars.compile(document.querySelector('#footertemplate').innerHTML);
const filledFooter = footerTemplate(data);
document.querySelector('#footeroutput').innerHTML = filledFooter;


// hamburgermenu for tablets and phones
const menuButton = document.querySelector("#hamburgericon");
const closeButton = document.querySelector("#closeicon");
const dropdown = document.querySelector("#hamburgermenu");
// opens menu when hamburger icon clicked and replaces hamburger icon with close menu icon 
menuButton.addEventListener('click', () => {
    dropdown.style.display = "flex";
    menuButton.style.display = "none";
    closeButton.style.display = "block";
});
// closes menu when close menu icon clicked and replaces with hamburger icon
closeButton.addEventListener('click', () => {
    dropdown.style.display = "none";
    menuButton.style.display = "block";
    closeButton.style.display = "none";
});

// closes all hamburger menus when window is expanded above 780px, and displays hamburger menu icon when window is shrunk below this.
window.addEventListener("resize", () => {
    if(window.innerWidth > 780){
        dropdown.style.display = "none";
        menuButton.style.display = "none";
        closeButton.style.display = "none";
    } else {
        menuButton.style.display = "block";
    }
});

// Adds code to toggle font size for all text
const fontToggle = document.querySelector("#togglebox");
let textSizeIncreased = false;
fontToggle.addEventListener("click", () => {
    const h2 = document.querySelectorAll("h2");
    const h3 = document.querySelectorAll("h3");
    const h4 = document.querySelectorAll("h4");
    const h5 = document.querySelectorAll("h5");
    const p = document.querySelectorAll("p");
    const headerlinks = document.querySelectorAll(".menuitem");
    const footerlinks = document.querySelectorAll(".footer-link");
    // Checks to see if textsize has already been toggled, if not incerases size of text, otherwise restores the size
    if (!textSizeIncreased){
        h2.forEach((text) => {
            text.style.fontSize = "40px";
        });    
        h3.forEach((text) => {
            text.style.fontSize = "22px";
        });    
        h4.forEach((text) => {
            text.style.fontSize = "20px";
        });    
        h5.forEach((text) => {
            text.style.fontSize = "16px";
        });   
        p.forEach((text) => {
            text.style.fontSize = "20px";
        });
        headerlinks.forEach((text) => {
            text.style.fontSize = "28px";
        });
        footerlinks.forEach((text) => {
            text.style.fontSize = "20px";
        });
    } else {
        h2.forEach((text) => {
            text.style.fontSize = "30px";
        }); 
        h3.forEach((text) => {
            text.style.fontSize = "18px";
        });
        h4.forEach((text) => {
            text.style.fontSize = "16px";
        });  
        h5.forEach((text) => {
            text.style.fontSize = "12px";
        });
        p.forEach((text) => {
            text.style.fontSize = "16px";
        });
        headerlinks.forEach((text) => {
            text.style.fontSize = "20px";
        });
        footerlinks.forEach((text) => {
            text.style.fontSize = "16px";
        });
    }
    textSizeIncreased = !textSizeIncreased;
});

// Adds an event where when the logo is clicked the page redirects home. I decided not to use a tags within the logo because it means that for users 
// navigating with just a keyboard, it's an extra thing to tab through, but users that use a mouse are used to thinking that clicking on the logo will take
// you back to the home page. This solution caters to both types of user
const logo = document.querySelector("#logobox");
logo.addEventListener("click", () => {
    location.href = "index.html";
});