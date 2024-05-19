const MAIN_KEY = "gbtw";

const checkAndResolve = async (tabId, tab) => {
  // await chrome.tabs.update(tabId, {
  //   url: "cool-klv.png",
  // });
};

chrome.storage.local.get([MAIN_KEY]).then((result) => {
  console.log("Value is " + result.key);
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if (msg.from === "content" && msg.subject === "showPageAction") {
    // Enable the page-action for the requesting tab.
  }
});

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "./onboarding/onboarding.html",
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await checkAndResolve(tab.id, tab);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  await checkAndResolve(activeInfo.tabId, tab);
});
