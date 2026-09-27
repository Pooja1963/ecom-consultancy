const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyMXxIzDaMR-yCFq3FJUyUYgjWnXy-PKU_ZnsOu4GOyCNMdHVapobi4sMt-Y6oiFpS6Ow/exec";


document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("queryForm");
    const successMessage =
        document.getElementById("successMessage");


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const service =
            document.getElementById("service").value;

        const message =
            document.getElementById("message").value.trim();


        /* ================= VALIDATION ================= */

        if (!name || !email || !phone || !service || !message) {

            alert("Please fill all required fields.");

            return;
        }


        if (!/^[0-9]{10}$/.test(phone)) {

            alert("Please enter a valid 10-digit mobile number.");

            return;
        }


        /* ================= BUTTON ================= */

        const submitButton =
            form.querySelector(".submit-button");


        const originalButtonText =
            submitButton.innerText;


        submitButton.disabled = true;

        submitButton.innerText =
            "Submitting...";


        /* ================= DATA ================= */

        const leadData = {

            name: name,

            phone: phone,

            email: email,

            service: service,

            message: message

        };


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

                    body: JSON.stringify(leadData)
                }
            );


            /* ================= SUCCESS ================= */

            form.reset();

            successMessage.innerText =
                "Thank you! Your query has been submitted successfully. We will contact you shortly.";

            successMessage.style.display =
                "block";


            submitButton.innerText =
                "Query Submitted";


            setTimeout(function () {

                successMessage.style.display =
                    "none";

                submitButton.disabled =
                    false;

                submitButton.innerText =
                    originalButtonText;

            }, 6000);


        } catch (error) {

            console.error(error);


            alert(
                "Something went wrong. Please try again or contact us directly."
            );


            submitButton.disabled =
                false;

            submitButton.innerText =
                originalButtonText;

        }

    });

});