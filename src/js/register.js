
// DOM
const registerForm = document.querySelector("#register-form");
const fullnameIp = document.querySelector("#fullname")
const emailIp = document.querySelector("#email")
const passwordIp = document.querySelector("#password")
const passwordConfirmIp = document.querySelector("#password-confirm")

// Function
const handleRegister = (event) => {
    // Prevent form from reloading page
    event.preventDefault();

    // Get data
    const fullname = fullnameIp.value;
    const email = emailIp.value;
    const password = passwordIp.value;
    const passwordConfirm = passwordConfirmIp.value;

    // Validate
    if (!fullname || !email || !password || !passwordConfirm) {
        alert("Fill in all fields!");
        return;
    }

    if (password !== passwordConfirm) {
        alert("Passwords do not match!");
        return;
    }

    let creationTime;

    // Register user with Firebase authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed in
            let user = userCredential.user;
            creationTime = user.metadata.creationTime;

            // Store user data in localStorage
            localStorage.setItem("current_user_data", JSON.stringify(user.email));

            // Alert and switch to login page
            alert("Signed up successfully!");
        })
        .then(() => {
            // Save user data into Firebase
            return db.collection("users").add({
                displayName: fullname, // Display Name
                email: email, // Email
                password: password, // Password - Note: This is not recommended for security reasons, consider removing this line.
                creationTime: creationTime // Account Creation Time
            });
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            // Handle errors
            console.error("Error: ", error);
            alert("Error: " + error.message);
        });
}


auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        window.location.href = "index.html";
    } else {
        // User is signed out
        // ...
        registerForm.addEventListener("submit", handleRegister);
    }
});