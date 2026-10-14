import {
  getSavedEvents,
  toggleSavedEvent,
  isEventSaved
} from "./storage.js";

import { createEventDialog } from "./modal.js";

const eventContainer = document.querySelector("#history-events");
const searchInput = document.querySelector("#event-search");
const periodFilter = document.querySelector("#period-filter");
const savedOnly = document.querySelector("#saved-only");
const status = document.querySelector("#event-status");

let events = [];
let dialogController;

function saveEvent(id) {
  try {
    return toggleSavedEvent(id);
  } catch (error) {
    status.textContent = error.message;
    return getSavedEvents();
  }
}

saveEvent.isSaved = isEventSaved;

function createCard(event) {
  const article = document.createElement("article");
  article.className = "event-card";

  const date = document.createElement("span");
  date.className = "event-date";
  date.textContent = event.date || String(event.year);

  const heading = document.createElement("h3");
  heading.textContent = event.title;

  const category = document.createElement("p");
  category.className = "event-category";
  category.textContent = event.category;

  const summary = document.createElement("p");
  summary.textContent = event.summary;

  const significance = document.createElement("p");
  significance.className = "event-significance";
  significance.textContent = `Why it matters: ${event.significance}`;

  const details = document.createElement("button");
  details.type = "button";
  details.className = "button";
  details.textContent = "Read details";
  details.addEventListener("click", () => dialogController.open(event));

  const save = document.createElement("button");
  save.type = "button";
  save.className = "button button-secondary saved-button";
  save.setAttribute("aria-pressed", String(isEventSaved(event.id)));
  save.textContent = isEventSaved(event.id)
    ? "Remove saved event"
    : "Save event";

  save.addEventListener("click", () => {
    const updated = saveEvent(event.id);
    const isSaved = updated.includes(event.id);

    save.setAttribute("aria-pressed", String(isSaved));
    save.textContent = isSaved
      ? "Remove saved event"
      : "Save event";

    document.dispatchEvent(new Event("saved-events-changed"));
  });

  article.append(
    date,
    heading,
    category,
    summary,
    significance,
    details,
    save
  );

  return article;
}

function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const category = periodFilter.value;
  const onlySaved = savedOnly.checked;
  const saved = getSavedEvents();

  const filtered = events.filter(event => {
    const searchableText =
      `${event.date} ${event.year} ${event.title} ` +
      `${event.category} ${event.summary} ${event.significance}`;

    const matchesSearch = searchableText.toLowerCase().includes(query);
    const matchesCategory =
      category === "all" || event.category === category;
    const matchesSaved = !onlySaved || saved.includes(event.id);

    return matchesSearch && matchesCategory && matchesSaved;
  });

  const fragment = document.createDocumentFragment();

  filtered.forEach(event => fragment.append(createCard(event)));

  eventContainer.replaceChildren(fragment);

  status.textContent = filtered.length
    ? `Showing ${filtered.length} of ${events.length} historical events.`
    : "No events match your search. Try a different keyword or filter.";
}

async function initializeHistory() {
  try {
    const response = await fetch("./data/events.json");

    if (!response.ok) {
      throw new Error(`Unable to load events: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("The event data must be a JSON array.");
    }

    events = data
      .filter(event =>
        event.id &&
        event.title &&
        event.category &&
        event.summary &&
        event.significance &&
        Number.isFinite(event.year)
      )
      .sort((a, b) => a.year - b.year);

    if (events.length === 0) {
      throw new Error("No valid historical events were found.");
    }

    const categories = [...new Set(events.map(event => event.category))];

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      periodFilter.append(option);
    });

    dialogController = createEventDialog(events, saveEvent);

    searchInput.addEventListener("input", renderEvents);
    periodFilter.addEventListener("change", renderEvents);
    savedOnly.addEventListener("change", renderEvents);

    document.addEventListener("saved-events-changed", renderEvents);

    renderEvents();
  } catch (error) {
    console.error("Historical timeline error:", error);
    eventContainer.textContent =
      "We could not load the historical timeline. Check your connection or local server and try again.";
    status.textContent = "Historical data could not be loaded.";
  }
}

initializeHistory();