/* ==========================================================================
   Merlo Chamber of Commerce - Join & Thank You Script
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Menu Toggle & Footer Dates
    // ----------------------------------------------------------------------
    const menuButton = document.getElementById("menu-button");
    const primaryNav = document.getElementById("primary-navigation");

    if (menuButton && primaryNav) {
        menuButton.addEventListener("click", () => {
            const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", !isExpanded);
            primaryNav.classList.toggle("open");
        });
    }

    const currentYearSpan = document.getElementById("current-year");
    const lastModifiedSpan = document.getElementById("last-modified");

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // ----------------------------------------------------------------------
    // 2. Set Timestamp on Form Load (join.html)
    // ----------------------------------------------------------------------
    const timestampInput = document.getElementById("timestamp");
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }

    // ----------------------------------------------------------------------
    // 3. HTML Modals Logic for Membership Cards (join.html)
    // ----------------------------------------------------------------------
    const openModalButtons = document.querySelectorAll(".open-modal-btn");
    openModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    const closeModalButtons = document.querySelectorAll(".close-modal-btn");
    closeModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest("dialog");
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking on the backdrop
    const modals = document.querySelectorAll(".benefits-modal");
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    });

    // ----------------------------------------------------------------------
    // 4. URL Search Params Processing (thankyou.html)
    // ----------------------------------------------------------------------
    const summaryCard = document.getElementById("summary-card");
    if (summaryCard) {
        const currentUrl = window.location.href;
        const formData = new URLSearchParams(window.location.search);

        function getParamValue(paramName) {
            return formData.get(paramName) ? decodeURIComponent(formData.get(paramName).replace(/\+/g, " ")) : "N/A";
        }

        const fname = getParamValue("fname");
        const lname = getParamValue("lname");
        const email = getParamValue("email");
        const phone = getParamValue("phone");
        const organization = getParamValue("organization");
        const rawTimestamp = getParamValue("timestamp");

        // Format Timestamp into a readable date string if available
        let formattedTimestamp = rawTimestamp;
        if (rawTimestamp !== "N/A") {
            const parsedDate = new Date(rawTimestamp);
            if (!isNaN(parsedDate.getTime())) {
                formattedTimestamp = parsedDate.toLocaleString();
            }
        }

        const fnameElem = document.getElementById("display-fname");
        const lnameElem = document.getElementById("display-lname");
        const emailElem = document.getElementById("display-email");
        const phoneElem = document.getElementById("display-phone");
        const orgElem = document.getElementById("display-organization");
        const timeElem = document.getElementById("display-timestamp");

        if (fnameElem) fnameElem.textContent = fname;
        if (lnameElem) lnameElem.textContent = lname;
        if (emailElem) emailElem.textContent = email;
        if (phoneElem) phoneElem.textContent = phone;
        if (orgElem) orgElem.textContent = organization;
        if (timeElem) timeElem.textContent = formattedTimestamp;
    }
});