/* =========================================================
   Merlo Chamber of Commerce
   Directory JavaScript
   ========================================================= */

const memberDirectory = document.querySelector("#member-directory");
const directoryStatus = document.querySelector("#directory-status");

const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");


/* ---------- Mobile Navigation ---------- */

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.querySelector("span").textContent = isOpen ? "✕" : "☰";
});


/* ---------- Display Members ---------- */

function createMemberCard(member) {
    const card = document.createElement("article");
    card.className = "member-card";

    const levelName = getMembershipName(member.membershipLevel);
    const levelClass = getMembershipClass(member.membershipLevel);

    card.innerHTML = `
        <img
            class="member-image"
            src="images/members/${member.image}"
            alt="${member.companyName} business"
            loading="lazy"
        >

        <div class="member-content">
            <span class="member-level ${levelClass}">
                ${levelName}
            </span>

            <h3>${member.companyName}</h3>

            <p class="member-description">
                ${member.description}
            </p>

            <div class="member-details">
                <p>
                    <strong>Address:</strong>
                    ${member.address}
                </p>

                <p>
                    <strong>Phone:</strong>
                    <a href="tel:${member.phone.replace(/\s/g, "")}">
                        ${member.phone}
                    </a>
                </p>

                <p>
                    <strong>Website:</strong>
                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                    </a>
                </p>
            </div>
        </div>
    `;

    return card;
}


function getMembershipName(level) {
    switch (Number(level)) {
        case 3:
            return "Gold Member";
        case 2:
            return "Silver Member";
        default:
            return "Chamber Member";
    }
}


function getMembershipClass(level) {
    switch (Number(level)) {
        case 3:
            return "gold";
        case 2:
            return "silver";
        default:
            return "member";
    }
}


async function getMembers() {
    try {
        directoryStatus.textContent = "Loading chamber members...";

        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const members = await response.json();

        memberDirectory.innerHTML = "";

        members.forEach((member) => {
            const card = createMemberCard(member);
            memberDirectory.appendChild(card);
        });

        directoryStatus.textContent =
            `${members.length} chamber members are currently listed.`;

    } catch (error) {
        console.error("Unable to load member data:", error);

        directoryStatus.textContent =
            "Sorry, the member directory could not be loaded.";

        directoryStatus.classList.add("error");
    }
}


/* ---------- Grid/List Toggle ---------- */

function showGrid() {
    memberDirectory.classList.remove("list-view");

    gridButton.classList.add("active");
    listButton.classList.remove("active");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
}


function showList() {
    memberDirectory.classList.add("list-view");

    listButton.classList.add("active");
    gridButton.classList.remove("active");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
}


gridButton.addEventListener("click", showGrid);
listButton.addEventListener("click", showList);


/* ---------- Footer Dates ---------- */

function displayFooterDates() {
    const today = new Date();

    currentYear.textContent = today.getFullYear();

    const modificationDate = new Date(document.lastModified);

    lastModified.textContent = modificationDate.toLocaleString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* ---------- Start Application ---------- */

displayFooterDates();
getMembers();