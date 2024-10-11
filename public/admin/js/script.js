// show-alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  let time = showAlert.getAttribute("show-alert") || 3000;
  time = parseInt(time);
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert