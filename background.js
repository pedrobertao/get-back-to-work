const list = [];
const checkAndResolve = async (tabId, tab) => {
  if (list.length) {
    for (let i = 0; i < blockedSites.length; i++) {
      if (tab.url.indexOf(blockedSites[i]) > -1) {
        await chrome.tabs.update(tabId, {
          url: "cool-klv.png",
        });
      }
    }
  }
};

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "onboarding.html",
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
