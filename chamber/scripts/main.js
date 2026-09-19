/* ==========================================================================
   Merlo Chamber of Commerce - Main JavaScript (index.html)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

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

    const LATITUDE = "-34.6653";
    const LONGITUDE = "-58.7276";
    const API_KEY = "TU_API_KEY_AQUI";

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

    async function fetchWeatherData() {
        try {

            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl)
            ]);

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error("Error getting weather responses.");
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            displayCurrentWeather(currentData);
            displayForecast(forecastData);
        } catch (error) {
            console.error("Error getting weather data:", error);
            const weatherContainer = document.getElementById("weather-card-content");
            if (weatherContainer) {
                weatherContainer.innerHTML = "<p>The weather information could not be loaded at this time.</p>";
            }
        }
    }

    function displayCurrentWeather(data) {
    const tempElement = document.getElementById("current-temp");
    const descElement = document.getElementById("weather-description");
    const iconElement = document.getElementById("weather-icon");
    const humidityElement = document.getElementById("humidity");
    const windSpeedElement = document.getElementById("wind-speed");

    if (tempElement) tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    if (humidityElement) humidityElement.textContent = data.main.humidity;
    if (windSpeedElement) windSpeedElement.textContent = Math.round(data.wind.speed * 3.6);

    if (data.weather && data.weather.length > 0) {
        const condition = data.weather[0];
        const descriptionCapitalized = condition.description.charAt(0).toUpperCase() + condition.description.slice(1);
        
        if (descElement) descElement.textContent = descriptionCapitalized;

        if (iconElement) {
            iconElement.src = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;
            iconElement.alt = descriptionCapitalized;
            
            // Se maneja la visibilidad alternando clases CSS
            iconElement.classList.remove("hidden");
            iconElement.classList.add("visible");
        }
    }
}

    function displayForecast(data) {
        const forecastContainer = document.getElementById("forecast-container");
        if (!forecastContainer) return;

        forecastContainer.innerHTML = "";

        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const temp = Math.round(day.main.temp);
            const iconCode = day.weather[0].icon;
            const description = day.weather[0].description;

            const forecastCard = document.createElement("div");
            forecastCard.className = "forecast-item";
            forecastCard.innerHTML = `
                <p class="forecast-day"><strong>${dayName}</strong></p>
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}">
                <p class="forecast-temp">${temp}°C</p>
            `;

            forecastContainer.appendChild(forecastCard);
        });
    }

    const MEMBERS_JSON_URL = "data/members.json";

    async function fetchAndDisplaySpotlights() {
        const spotlightsGrid = document.getElementById("spotlights-grid");
        if (!spotlightsGrid) return;

        try {
            const response = await fetch(MEMBERS_JSON_URL);
            if (!response.ok) {
                throw new Error("Could not fetch members file.");
            }

            const members = await response.json();

            const qualifiedMembers = members.filter(member => {
                const level = String(member.membership_level || member.membershipLevel || "").toLowerCase();
                return level === "gold" || level === "silver" || level === "3" || level === "2";
            });

            const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
            const countToDisplay = Math.floor(Math.random() * 2) + 2;
            const selectedMembers = shuffled.slice(0, countToDisplay);

            spotlightsGrid.innerHTML = "";
            selectedMembers.forEach(member => {
                const card = document.createElement("article");
                card.className = `spotlight-card ${getMembershipClass(member)}`;

                card.innerHTML = `
                    <div class="spotlight-header">
                        <img src="${member.image || member.logo}" alt="${member.name} Logo" class="spotlight-logo" loading="lazy">
                        <h3>${member.name}</h3>
                        <span class="membership-badge">${getMembershipLabel(member)} Member</span>
                    </div>
                    <div class="spotlight-details">
                        <p class="spotlight-phone"><strong>Phone:</strong> ${member.phone}</p>
                        <p class="spotlight-address"><strong>Address:</strong> ${member.address}</p>
                        <p class="spotlight-website">
                            <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
                        </p>
                    </div>
                `;

                spotlightsGrid.appendChild(card);
            });

        } catch (error) {
            console.error("Error getting featured members:", error);
            spotlightsGrid.innerHTML = "<p>Could not load featured members.</p>";
        }
    }

    function getMembershipLabel(member) {
        const level = String(member.membership_level || member.membershipLevel || "").toLowerCase();
        if (level === "gold" || level === "3") return "Gold";
        if (level === "silver" || level === "2") return "Silver";
        return "Member";
    }

    function getMembershipClass(member) {
        return getMembershipLabel(member).toLowerCase();
    }

    fetchWeatherData();
    fetchAndDisplaySpotlights();
});