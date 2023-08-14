const saveButton = document.getElementById("savePage");
const pageInput = document.getElementById("pages");
const pagesSaved = document.getElementById("savedPages");

saveButton.addEventListener("click", function () {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(pageInput.value));
  pagesSaved.appendChild(li);
});
