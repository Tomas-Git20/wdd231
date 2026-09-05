// ------------------------------
// Responsive Navigation
// ------------------------------

const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector("#navigation");

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});


// ------------------------------
// Course List Array
// ------------------------------

const courses = [
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    },
    {
        subject: "WDD",
        number: 330,
        title: "Web Frontend Development II",
        credits: 2,
        completed: false
    },
    {
        subject: "WDD",
        number: 430,
        title: "Web Full-Stack Development",
        credits: 3,
        completed: false
    },
    {
        subject: "CSE",
        number: 110,
        title: "Programming with Functions",
        credits: 2,
        completed: false
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Data Structures",
        credits: 2,
        completed: true
    }
];


// ------------------------------
// Course Display
// ------------------------------

const courseContainer = document.querySelector("#courseContainer");
const creditTotal = document.querySelector("#creditTotal");
const filterButtons = document.querySelectorAll(".filter-button");

function displayCourses(filter = "all") {
    let coursesToDisplay;

    if (filter === "all") {
        coursesToDisplay = courses;
    } else {
        coursesToDisplay = courses.filter(
            course => course.subject === filter
        );
    }

    courseContainer.innerHTML = "";

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement("article");

        courseCard.classList.add("course-card");

        if (course.completed) {
            courseCard.classList.add("completed");
        }

        courseCard.innerHTML = `
            <span class="course-code">
                ${course.subject} ${course.number}
            </span>

            <span class="course-name">
                ${course.title}
            </span>

            <span class="course-credits">
                ${course.credits} credit${course.credits !== 1 ? "s" : ""}
            </span>

            ${
                course.completed
                    ? '<span class="completed-label">Completed</span>'
                    : ""
            }
        `;

        courseContainer.appendChild(courseCard);
    });

    // Dynamically calculate credits for displayed courses.
    const totalCredits = coursesToDisplay.reduce(
        (total, course) => total + course.credits,
        0
    );

    creditTotal.textContent = totalCredits;
}


// ------------------------------
// Course Filter Buttons
// ------------------------------

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        displayCourses(filter);
    });
});


// ------------------------------
// Dynamic Copyright Year
// ------------------------------

const currentYear = document.querySelector("#currentYear");

currentYear.textContent = new Date().getFullYear();


// ------------------------------
// Dynamic Last Modified Date
// ------------------------------

const lastModified = document.querySelector("#lastModified");

const modifiedDate = new Date(document.lastModified);

lastModified.textContent =
    `Last Modification: ${modifiedDate.toLocaleString()}`;


// ------------------------------
// Initial Course Display
// ------------------------------

displayCourses();
