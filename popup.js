document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements with error checking
  const workingModeToggle = document.getElementById("workingModeToggle");
  const statusText = document.getElementById("statusText");
  const statusIcon = document.getElementById("statusIcon");
  const whitelistContainer = document.getElementById("whitelistContainer");
  const newSiteInput = document.getElementById("newSiteInput");
  const addSiteButton = document.getElementById("addSiteButton");
  const inputError = document.getElementById("inputError");

  // Check if elements exist
  if (!workingModeToggle || !statusText || !statusIcon) {
    console.error("Required elements for working mode toggle are missing");
    return;
  }

  if (!whitelistContainer) {
    console.error("whitelistContainer element is missing");
    return;
  }

  if (!newSiteInput || !addSiteButton || !inputError) {
    console.error("Required elements for adding sites are missing");
    return;
  }

  // Load current state
  loadWorkingMode();
  loadWhitelist();

  // Toggle working mode
  workingModeToggle.addEventListener("change", function () {
    const isWorking = workingModeToggle.checked;
    updateStatusUI(isWorking);

    // Save to storage
    chrome.storage.local.set({ isWorking: isWorking }, function () {
      // Notify background script
      chrome.runtime.sendMessage({
        action: "toggleWorkingMode",
        isWorking: isWorking,
      });
    });
  });

  // Update status UI based on working mode
  function updateStatusUI(isWorking) {
    // Changed text to reflect the action rather than the state
    statusText.textContent = isWorking
      ? chrome.i18n.getMessage("stopWorking") || "Stop Working"
      : chrome.i18n.getMessage("startWorking") || "Start Working";

    if (isWorking) {
      statusIcon.classList.remove("fa-pause-circle", "not-working-icon");
      statusIcon.classList.add("fa-clock", "working-icon");
    } else {
      statusIcon.classList.remove("fa-clock", "working-icon");
      statusIcon.classList.add("fa-pause-circle", "not-working-icon");
    }
  }

  // Add new site to whitelist
  addSiteButton.addEventListener("click", function () {
    addSiteToWhitelist();
  });

  // Allow Enter key to add site
  newSiteInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addSiteToWhitelist();
    }
  });

  // Load working mode state
  function loadWorkingMode() {
    chrome.storage.local.get("isWorking", function (data) {
      const isWorking = data.isWorking || false;
      workingModeToggle.checked = isWorking;
      updateStatusUI(isWorking);
    });
  }

  // Load whitelist
  function loadWhitelist() {
    chrome.storage.local.get("whitelist", function (data) {
      const whitelist = data.whitelist || [];
      renderWhitelist(whitelist);
    });
  }

  // Render whitelist items
  function renderWhitelist(whitelist) {
    if (!whitelistContainer) {
      console.error("whitelistContainer is not available");
      return;
    }

    whitelistContainer.innerHTML = "";

    if (whitelist.length === 0) {
      whitelistContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-info-circle"></i>
          <p>${
            chrome.i18n.getMessage("noSitesAdded") || "No sites added yet"
          }</p>
        </div>`;
      return;
    }

    whitelist.forEach(function (site, index) {
      const siteItem = document.createElement("div");
      siteItem.className = "site-item";
      siteItem.innerHTML = `
        <div class="site-domain">
          <i class="fas fa-link site-icon"></i>
          <span>${site}</span>
        </div>
        <button class="delete-btn" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
      `;
      whitelistContainer.appendChild(siteItem);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        removeSiteFromWhitelist(index);
      });
    });
  }

  // Add site to whitelist
  function addSiteToWhitelist() {
    let site = newSiteInput.value.trim().toLowerCase();

    // Basic validation
    if (!site) {
      showError(
        chrome.i18n.getMessage("enterDomain") || "Please enter a domain"
      );
      return;
    }

    // Remove protocol and path, keep only domain
    site = site.replace(/^https?:\/\//, "");
    site = site.split("/")[0];

    // Validate domain format
    if (!/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i.test(site)) {
      showError(
        chrome.i18n.getMessage("enterValidDomain") ||
          "Please enter a valid domain"
      );
      return;
    }

    // Save to storage
    chrome.storage.local.get("whitelist", function (data) {
      const whitelist = data.whitelist || [];

      // Check for duplicates
      if (whitelist.includes(site)) {
        showError(
          chrome.i18n.getMessage("siteAlreadyAdded") ||
            "This site is already in your whitelist"
        );
        return;
      }

      whitelist.push(site);
      chrome.storage.local.set({ whitelist: whitelist }, function () {
        renderWhitelist(whitelist);
        newSiteInput.value = "";
        hideError();
      });
    });
  }

  // Remove site from whitelist
  function removeSiteFromWhitelist(index) {
    chrome.storage.local.get("whitelist", function (data) {
      const whitelist = data.whitelist || [];
      whitelist.splice(index, 1);
      chrome.storage.local.set({ whitelist: whitelist }, function () {
        renderWhitelist(whitelist);
      });
    });
  }

  // Show error message
  function showError(message) {
    if (inputError) {
      inputError.textContent = message;
      inputError.style.display = "block";
    }
  }

  // Hide error message
  function hideError() {
    if (inputError) {
      inputError.style.display = "none";
    }
  }
});
