chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    isWorking: false,
    whitelist: [],
    // Add 'chrome-extension' to the special exceptions that should never be blocked
    specialExceptions: ["chrome-extension", "chrome", "chrome-devtools"],
  });
});

// Listen for tab navigation
chrome.webNavigation.onCommitted.addListener(function (details) {
  // Skip non-top-level navigations
  if (details.frameId !== 0) {
    return;
  }

  checkAndRedirect(details.tabId, details.url);
});

// Listen for working mode toggle
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleWorkingMode") {
    if (request.isWorking) {
      // Check all open tabs when turning on working mode
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          checkAndRedirect(tab.id, tab.url);
        });
      });
    }
  }
});
// Listen for working mode toggle
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleWorkingMode") {
    if (request.isWorking) {
      // Check all open tabs when turning on working mode
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          checkAndRedirect(tab.id, tab.url);
        });
      });
    }
  }
});

function checkAndRedirect(tabId, url) {
  chrome.storage.local.get(
    ["isWorking", "whitelist", "specialExceptions"],
    function (data) {
      if (!data.isWorking) {
        return; // Not in working mode
      }

      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const protocol = urlObj.protocol;

        // Allow special protocols and chrome extensions
        if (
          data.specialExceptions &&
          data.specialExceptions.some(
            (exception) =>
              protocol.startsWith(exception) ||
              urlObj.href.startsWith(exception)
          )
        ) {
          return; // Allow access to special URLs like chrome-extension://
        }

        // Check if the hostname is in whitelist
        const whitelist = data.whitelist || [];
        const isWhitelisted = whitelist.some((domain) => {
          return hostname === domain || hostname.endsWith("." + domain);
        });

        if (!isWhitelisted) {
          // Redirect to blocked page
          chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL("blocked.html"),
          });
        }
      } catch (e) {
        console.error("Error checking URL:", e);
      }
    }
  );
}
