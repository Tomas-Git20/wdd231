const SAVED_KEY = "argentina-saved-events";
const THEME_KEY = "argentina-theme";

export function getSavedEvents() {
  try {
    const value = localStorage.getItem(SAVED_KEY);
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed)
      ? parsed.filter(item => typeof item === "string")
      : [];
  } catch (error) {
    console.warn("Unable to read saved events:", error);
    return [];
  }
}

export function isEventSaved(id) {
  return getSavedEvents().includes(id);
}

export function toggleSavedEvent(id) {
  const saved = getSavedEvents();
  const updated = saved.includes(id)
    ? saved.filter(item => item !== id)
    : [...saved, id];

  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Unable to save event:", error);
    throw new Error("Your browser could not save this event.");
  }

  return updated;
}

export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export function saveTheme(theme) {
  if (!["light", "dark"].includes(theme)) {
    return;
  }

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn("Unable to save theme preference:", error);
  }
}