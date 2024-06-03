// Dùng DOM
const loginForm = document.querySelector(".login-form");
let email_login = document.getElementById("email");
let password_login = document.getElementById("password");
let login_btn = document.getElementById("login_btn");
////////////////////////////////////////////////////////////////////// Đăng nhập 1 tải khoản có sẵn
const handleLogin = (event) => {

  event.preventDefault();

  let email = email_login.value;
  let password = password_login.value;

  // Validate
  if (!email || !password) {
    alert("Fill in all fields!");
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      // Lưu thông tin user vào Localtorage
      localStorage.setItem('current_user_data', JSON.stringify(user.email))
    })

    .then(() => {
      alert("Đăng nhập thành công");
      window.location.pathname = "index.html";
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      alert(errorCode + ": " + errorMessage);
    });
}

// Kiểm tra trạng thái đăng nhập
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // Nếu người dùng đã đăng nhập, chuyển hướng đến trang khác
    window.location.replace("index.html");
  } else {
    // Người dùng chưa đăng nhập, tiếp tục xử lý đăng nhập
    loginForm.addEventListener("submit", handleLogin);
  }
});