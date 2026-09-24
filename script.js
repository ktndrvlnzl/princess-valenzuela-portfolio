document.addEventListener("DOMContentLoaded", () => {

    /*
    =========================================
    SELECT ELEMENTS
    =========================================
    */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navMenu =
        document.querySelector(".nav-menu");

    const navLinks =
        document.querySelectorAll(".nav-menu a");

    const additionalButton =
        document.querySelector(".expand-button");

    const additionalList =
        document.querySelector("#additional-list");

    const form =
        document.querySelector("#contact-form");

    const year =
        document.querySelector("#year");


    /*
    =========================================
    FOOTER YEAR
    =========================================
    */

    year.textContent =
        new Date().getFullYear();


    /*
    =========================================
    MOBILE NAVIGATION
    =========================================
    */

    function closeMenu() {

        navMenu.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    }


    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        }
    );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    /*
    =========================================
    ADDITIONAL EXPERIENCE
    =========================================
    */

    additionalButton.addEventListener(
        "click",
        () => {

            const expanded =
                additionalButton.getAttribute(
                    "aria-expanded"
                ) === "true";


            additionalButton.setAttribute(
                "aria-expanded",
                String(!expanded)
            );


            additionalList.hidden =
                expanded;

        }
    );


    /*
    =========================================
    SCROLL REVEAL
    =========================================
    */

    const revealItems =
        document.querySelectorAll(".reveal");


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealItems.forEach(item => {

            item.classList.add(
                "is-visible"
            );

        });

    } else {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealItems.forEach(item => {

            observer.observe(item);

        });

    }


    /*
    =========================================
    FORM ERROR HANDLING
    =========================================
    */

    function setError(
        field,
        message
    ) {

        const wrapper =
            field.closest(".form-field");

        const error =
            wrapper.querySelector(
                ".error-message"
            );


        wrapper.classList.toggle(
            "invalid",
            Boolean(message)
        );


        error.textContent =
            message;

    }


    /*
    =========================================
    EMAIL VALIDATION
    =========================================
    */

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);

    }


    /*
    =========================================
    CONTACT FORM
    =========================================
    */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.querySelector("#name");

            const email =
                document.querySelector("#email");

            const message =
                document.querySelector("#message");

            const status =
                document.querySelector("#form-status");


            /*
            Clear previous errors
            */

            setError(name, "");

            setError(email, "");

            setError(message, "");

            status.textContent = "";


            let valid = true;


            /*
            Name
            */

            if (!name.value.trim()) {

                setError(
                    name,
                    "Please enter your name."
                );

                valid = false;

            }


            /*
            Email
            */

            if (!email.value.trim()) {

                setError(
                    email,
                    "Please enter your email."
                );

                valid = false;

            } else if (
                !isValidEmail(
                    email.value.trim()
                )
            ) {

                setError(
                    email,
                    "Please enter a valid email address."
                );

                valid = false;

            }


            /*
            Message
            */

            if (!message.value.trim()) {

                setError(
                    message,
                    "Please enter a message."
                );

                valid = false;

            }


            /*
            Stop if invalid
            */

            if (!valid) {

                status.textContent =
                    "Please correct the highlighted fields.";

                return;

            }


            /*
            Prepare email
            */

            const subject =
                encodeURIComponent(
                    `Professional inquiry from ${name.value.trim()}`
                );


            const body =
                encodeURIComponent(
                    `Name: ${name.value.trim()}\n` +
                    `Email: ${email.value.trim()}\n\n` +
                    `${message.value.trim()}`
                );


            /*
            Open visitor's email client
            */

            window.location.href =
                `mailto:prvalenzuela05@gmail.com?subject=${subject}&body=${body}`;


            status.textContent =
                "Your email client should open with the message prepared.";

        }
    );

});
