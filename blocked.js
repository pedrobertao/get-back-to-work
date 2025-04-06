document.addEventListener("DOMContentLoaded", function () {
  // Apply internationalization
  if (typeof getCurrentLanguage === "function") {
    getCurrentLanguage(function (language) {
      if (typeof applyI18n === "function") {
        applyI18n(language);
      }
    });
  }

  // Disable Focus Mode button
  document
    .getElementById("disableButton")
    .addEventListener("click", function (e) {
      e.preventDefault();
      chrome.storage.local.set({ isWorking: false }, function () {
        window.history.back();
      });
    });
});
