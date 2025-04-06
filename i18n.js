// Modified i18n.js - Simplify to use browser language only
// i18n.js - Simplified without language selector
function getCurrentLanguage(callback) {
  // Default to browser language or English
  let browserLang = navigator.language.split("-")[0];

  // Check if we support this language
  const supportedLanguages = ["en", "es", "fr", "de", "pt_BR"];
  if (!supportedLanguages.includes(browserLang)) {
    browserLang = "en"; // Default to English
  }

  callback(browserLang);
}

// Apply translations based on language
function applyI18n(language) {
  // Translate all elements with data-i18n attribute
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(function (element) {
    const messageKey = element.getAttribute("data-i18n");
    element.textContent = chrome.i18n.getMessage(messageKey);
  });

  // Translate all placeholders
  const placeholderElements = document.querySelectorAll(
    "[data-i18n-placeholder]"
  );
  placeholderElements.forEach(function (element) {
    const messageKey = element.getAttribute("data-i18n-placeholder");
    element.placeholder = chrome.i18n.getMessage(messageKey);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the browser language and apply translations
  getCurrentLanguage(function (language) {
    applyI18n(language);
  });
});
