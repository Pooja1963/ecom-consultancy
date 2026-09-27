/* =========================================================
   GOOGLE APPS SCRIPT CONNECTION
========================================================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyMXxIzDaMR-yCFq3FJUyUYgjWnXy-PKU_ZnsOu4GOyCNMdHVapobi4sMt-Y6oiFpS6Ow/exec";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("queryForm");

    const successMessage =
        document.getElementById("successMessage");

    const menuButton =
        document.getElementById("menuButton");


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function () {

                alert(
                    "Please use the navigation links or scroll through the page."
                );

            }
        );

    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ---------------------------------------------
               GET FORM VALUES
            --------------------------------------------- */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();

            const service =
                document
                    .getElementById("service")
                    .value;

            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (
                !name ||
                !email ||
                !phone ||
                !service ||
                !message
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;
            }


            /* ---------------------------------------------
               PHONE VALIDATION
            --------------------------------------------- */

            if (!/^[0-9]{10}$/.test(phone)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;
            }


            /* ---------------------------------------------
               EMAIL VALIDATION
            --------------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /* ---------------------------------------------
               BUTTON
            --------------------------------------------- */

            const submitButton =
                form.querySelector(
                    ".submit-button"
                );

            const originalButtonText =
                submitButton.innerHTML;


            submitButton.disabled = true;

            submitButton.innerHTML =
                "Submitting...";


            /* ---------------------------------------------
               DATA FOR GOOGLE SHEET
            --------------------------------------------- */

            const leadData = {

                name: name,

                phone: phone,

                email: email,

                service: service,

                message: message

            };


            /* ---------------------------------------------
               SEND TO GOOGLE APPS SCRIPT
            --------------------------------------------- */

            try {

                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method: "POST",

                        mode: "no-cors",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(
                                leadData
                            )
                    }
                );


                /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

                form.reset();


                successMessage.innerText =
                    "Thank you! Your requirement has been submitted successfully. We will contact you shortly.";


                successMessage.style.display =
                    "block";


                submitButton.innerHTML =
                    "Query Submitted ✓";


                /* -----------------------------------------
                   AUTO RESET
                ----------------------------------------- */

                setTimeout(
                    function () {

                        successMessage.style.display =
                            "none";

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalButtonText;

                    },
                    6000
                );


            } catch (error) {

                console.error(
                    "Submission Error:",
                    error
                );


                alert(
                    "Something went wrong. Please try again or contact us directly."
                );


                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    originalButtonText;

            }

        }
    );

});
