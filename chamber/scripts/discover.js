/* ==========================================================================
   Merlo Chamber of Commerce - Discover Page ES Module
   ========================================================================== */

import { discoverItems } from "../data/discover.mjs";

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Navigation & Footer Dates
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
    // 2. LocalStorage Last Visit Calculation & Banner Display
    // ----------------------------------------------------------------------
    const visitMessageElem = document.getElementById("visit-message");

    if (visitMessageElem) {
        const lastVisitTimestamp = localStorage.getItem("lastVisitDate");
        const currentTimestamp = Date.now();

        if (!lastVisitTimestamp) {
            // First time visiting
            visitMessageElem.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const timeDifferenceMs = currentTimestamp - parseInt(lastVisitTimestamp, 10);
            const msInOneDay = 1000 * 60 * 60 * 24;
            const daysDifference = Math.floor(timeDifferenceMs / msInOneDay);

            if (timeDifferenceMs < msInOneDay) {
                visitMessageElem.textContent = "Back so soon! Awesome!";
            } else if (daysDifference === 1) {
                visitMessageElem.textContent = "You last visited 1 day ago.";
            } else {
                visitMessageElem.textContent = `You last visited ${daysDifference} days ago.`;
            }
        }

        // Save current timestamp in localStorage for future visits
        localStorage.setItem("lastVisitDate", currentTimestamp.toString());
    }

    // ----------------------------------------------------------------------
    // 3. Render 8 Discover Cards dynamically from ES Module
    // ----------------------------------------------------------------------
    const discoverContainer = document.getElementById("discover-grid");

    if (discoverContainer && discoverItems && discoverItems.length > 0) {
        discoverContainer.innerHTML = ""; // Clear container

        discoverItems.forEach(item => {
            const card = document.createElement("article");
            card.classList.add("discover-card");
            card.style.gridArea = item.id; // Assigns named grid area dynamically

            card.innerHTML = `
                <h2>${item.name}</h2>
                <figure class="card-figure">
                    <img src="${item.image}" 
                         alt="${item.alt}" 
                         width="300" 
                         height="200" 
                         loading="lazy">
                </figure>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button type="button" class="learn-more-btn" data-id="${item.id}">Learn More</button>
            `;

            discoverContainer.appendChild(card);
        });
    }
});