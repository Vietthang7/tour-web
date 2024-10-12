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
//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
}
// End Upload Image
//Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const roles = [];

    const listElementRoleId = tablePermissions.querySelectorAll("[role-id]");
    for (const element of listElementRoleId) {
      const roleId = element.getAttribute("role-id");
      const role = {
        id: roleId,
        permissions: []
      };

      const listInputChecked = tablePermissions.querySelectorAll(`input[data-id="${roleId}"]:checked`);

      listInputChecked.forEach(input => {
        const dataName = input.getAttribute("data-name");
        role.permissions.push(dataName);
      });

      roles.push(role);
    }

    const path = buttonSubmit.getAttribute("button-submit");

    fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roles)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
  });
}
//Hết Phân quyền 
