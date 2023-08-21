// form submission validation
const form = document.querySelector('#contactform');
form.onsubmit = () => {
    const email = document.querySelector('#email').value;
    const phoneNumber = document.querySelector('#phonenumber').value;
    const comment = document.querySelector('#commentbox').value;
    const name = document.querySelector('#name').value;
    // regular expression for email validation taken from https://www.w3resource.com/javascript/form/email-validation.php
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        alert("You have entered an invalid email address, please check and try again!");
        return false;
    }
    // regular expressions for phone number validation taken from https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s03.html for
    // international numbers with country codes, and https://www.w3resource.com/javascript/form/phone-no-validation.php for standard phone numbers
    if (!(/^\+(?:[0-9]●?){6,14}[0-9]$/.test(phoneNumber)) && !(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneNumber))){
        alert("You have entered an invalid phone number, please check and try again!");
        return false;
    }
    // Checks to see if a comment has been left or not
    if (comment === ""){
        alert("You not entered a comment, please check and try again!");
        return false;
    }

    // Checks to see if a name has been left
    if (name === ""){
        alert("You not entered a name, please check and try again!");
        return false;
    }

    // If form is filled out correctly returns a personalized alert
    alert(`Thanks for your comments ${name}, we'll get back to you as soon as possible!`);
};