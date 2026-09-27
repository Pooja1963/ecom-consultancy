/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {
    googleScriptUrl:
        "https://script.google.com/macros/s/AKfycbyMXxIzDaMR-yCFq3FJUyUYgjWnXy-PKU_ZnsOu4GOyCNMdHVapobi4sMt-Y6oiFpS6Ow/exec",

    successMessage:
        "Thank you! Your requirement has been submitted successfully. We will contact you shortly.",

    errorMessage:
        "Something went wrong. Please try again or contact us directly.",

    successDisplayTime: 6000
};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const elements = {
    form: document.getElementById("queryForm"),
    successMessage: document.getElementById("successMessage"),
    menuButton: document.getElementById("menuButton")
};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", initialize);


function initialize() {

    setupFormSubmission();
    setupMobileMenu();

}


/* =========================================================
   FORM SUBMISSION
========================================================= */

function setupFormSubmission() {

    if (!elements.form) {
        return;
    }

    elements.form.addEventListener(
        "submit",
        handleFormSubmit
    );

}


/* =========================================================
   HANDLE FORM SUBMIT
========================================================= */

async function handleFormSubmit(event) {

    event.preventDefault();

    const formData = getFormData();

    const validation = validateForm(formData);

    if (!validation.valid) {

        showValidationError(validation.message);

        return;
    }

    const submitButton =
        elements.form.querySelector(".submit-button");

    const originalButtonText =
        submitButton.innerHTML;

    setButtonState(
        submitButton,
        true,
        "Submitting..."
    );

    try {

        await submitLead(formData);

        handleSubmissionSuccess(
            submitButton,
            originalButtonText
        );

    } catch (error) {

        handleSubmissionError(
            submitButton,
            originalButtonText,
            error
        );

    }

}


/* =========================================================
   GET FORM DATA
========================================================= */

function getFormData() {

    return {
        name: getValue("name"),
        phone: getValue("phone"),
        email: getValue("email"),
        service: getValue("service"),
        message: getValue("message")
    };

}


/* =========================================================
   GET FIELD VALUE
========================================================= */

function getValue(fieldId) {

    const field =
        document.getElementById(fieldId);

    return field
        ? field.value.trim()
        : "";

}


/* =========================================================
   VALIDATION
========================================================= */

function validateForm(data) {

    const requiredFields = [
        {
            value: data.name,
            message: "Please enter your full name."
        },
        {
            value: data.phone,
            message: "Please enter your mobile number."
        },
        {
            value: data.email,
            message: "Please enter your email address."
        },
        {
            value: data.service,
            message: "Please select a service."
        },
        {
            value: data.message,
            message: "Please describe your requirement."
        }
    ];


    /* ---------------------------------------------
       REQUIRED FIELD CHECK
    --------------------------------------------- */

    for (const field of requiredFields) {

        if (!field.value) {

            return {
                valid: false,
                message: field.message
            };

        }

    }


    /* ---------------------------------------------
       PHONE VALIDATION
    --------------------------------------------- */

    if (!isValidPhone(data.phone)) {

        return {
            valid: false,
            message:
                "Please enter a valid 10-digit mobile number."
        };

    }


    /* ---------------------------------------------
       EMAIL VALIDATION
    --------------------------------------------- */

    if (!isValidEmail(data.email)) {

        return {
            valid: false,
            message:
                "Please enter a valid email address."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   PHONE VALIDATION
========================================================= */

function isValidPhone(phone) {

    return /^[0-9]{10}$/.test(phone);

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================================================
   SUBMIT LEAD TO GOOGLE APPS SCRIPT
========================================================= */

async function submitLead(data) {

    const response = await fetch(
        CONFIG.googleScriptUrl,
        {
            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)
        }
    );


    /*
       With no-cors, the browser does not expose the
       response body/status to JavaScript.

       If fetch completes without throwing an error,
       we treat the request as submitted.
    */

    return response;

}


/* =========================================================
   SUCCESS HANDLER
========================================================= */

function handleSubmissionSuccess(
    submitButton,
    originalButtonText
) {

    elements.form.reset();

    showSuccessMessage(
        CONFIG.successMessage
    );

    setButtonState(
        submitButton,
        true,
        "Query Submitted ✓"
    );


    setTimeout(
        function () {

            hideSuccessMessage();

            setButtonState(
                submitButton,
                false,
                originalButtonText
            );

        },
        CONFIG.successDisplayTime
    );

}


/* =========================================================
   ERROR HANDLER
========================================================= */

function handleSubmissionError(
    submitButton,
    originalButtonText,
    error
) {

    console.error(
        "Lead submission error:",
        error
    );

    hideSuccessMessage();

    alert(CONFIG.errorMessage);

    setButtonState(
        submitButton,
        false,
        originalButtonText
    );

}


/* =========================================================
   BUTTON STATE
========================================================= */

function setButtonState(
    button,
    disabled,
    text
) {

    if (!button) {
        return;
    }

    button.disabled = disabled;
    button.innerHTML = text;

}


/* =========================================================
   SUCCESS MESSAGE
========================================================= */

function showSuccessMessage(message) {

    if (!elements.successMessage) {
        return;
    }

    elements.successMessage.textContent =
        message;

    elements.successMessage.style.display =
        "block";

}


/* =========================================================
   HIDE SUCCESS MESSAGE
========================================================= */

function hideSuccessMessage() {

    if (!elements.successMessage) {
        return;
    }

    elements.successMessage.style.display =
        "none";

}


/* =========================================================
   VALIDATION ERROR
========================================================= */

function showValidationError(message) {

    hideSuccessMessage();

    alert(message);

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    if (!elements.menuButton) {
        return;
    }

    elements.menuButton.addEventListener(
        "click",
        function () {

            /*
               Mobile navigation can be upgraded here later.
               Keeping this separate prevents menu logic from
               interfering with form submission.
            */

            alert(
                "Please use the navigation links or scroll through the page."
            );

        }
    );

}
