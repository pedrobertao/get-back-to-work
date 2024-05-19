const MAIN_KEY = "gbtw";
const saveButton = document.getElementById("savePage");
const pageInput = document.getElementById("pages");
const pagesSaved = document.getElementById("savedPages");

let cacheList = [];

function loadSavedStorage() {
  const listUnparsed = localStorage.getItem(MAIN_KEY);
  if (!listUnparsed) {
    chrome.storage.local.set({ MAIN_KEY: JSON.stringify([page]) }, () => {
      console.log("Value saved", JSON.stringify([page]));
    });
  }
}

function saveOnLocalStorage(page) {
  const listUnparsed = localStorage.getItem(MAIN_KEY);
  if (!listUnparsed || !listUnparsed.length) {
    chrome.storage.local.set({ MAIN_KEY: JSON.stringify([page]) }, () => {
      console.log("Value saved", parsedList);
    });
  }

  const parsedList = JSON.parse(listUnparsed);
  cacheList.concat(parsedList);

  if (parsedList) {
    parsedList.push(page);
    chrome.storage.local.set({ MAIN_KEY: parsedList }, () => {
      console.log("Value saved", parsedList);
    });
  }
  cacheList.push(page);
}

function removeFromLocalStorage(page) {
  if (cacheList.indexOf(page) > -1) {
    cacheList = cacheList.filter((p) => p !== page);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // chrome.storage.local.get(MAIN_KEY).then((r) => {
  //   console.log("Value is set", r);
  //   const li = document.createElement("li");
  //   li.appendChild(document.createTextNode(r));
  // });

  saveButton.addEventListener("click", async () => {
    const page = pageInput.value;
    chrome.storage.local.set({ MAIN_KEY: page }).then(() => {
      console.log("Value is set", page);
    });
    const li = document.createElement("li");
    const removeButton = document.createElement("button");
    removeButton.textContent = "✖️";
    removeButton.id = page;

    removeButton.addEventListener("click", async () =>
      removeFromLocalStorage(page)
    );

    saveOnLocalStorage(page);

    li.appendChild(document.createTextNode(page));
    li.append(removeButton);
    pagesSaved.appendChild(li);
  });
});
