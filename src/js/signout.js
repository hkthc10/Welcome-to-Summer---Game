const logoutBtn = document.getElementById("logout");

const handleLogout = () => {
    firebase
    .auth().signOut().then(function () {
      // Đăng xuất thành 
      localStorage.removeItem("current_user_data")
      window.location.replace("login.html"); // Chuyển hướng đến trang đăng nhập sau khi logout
    })
    .catch(function (error) {
      // Xử lý lỗi nếu có
      console.log(error);
    });
};

logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure want to logout ?") == true) {
    handleLogout();
  } else {
    return
  }

});