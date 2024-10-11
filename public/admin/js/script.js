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
// Xóa bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("button-delete");
      console.log(link);

      fetch(link, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    });
  });
}
// Hết Xóa bản ghi
//Change Status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length >= 1) {
  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("link");

      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })

    });

  });
}
// End Change Status