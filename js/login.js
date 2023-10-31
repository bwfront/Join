/**
 * The token used for accessing the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = "0BPXH9KOB3KK14LPEUWH02NBW7QT7YIO3LQDS7R4";
/**
 * The URL used for accessing the remote storage API
 * @constant {String}
 */
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Global Variables for the different task counters
 *
 */

let currentLogin;
let allUsers = [];

/**
 * Gets the value of the login try: username + password.
 */
async function login() {
  currentLogin = {
    email: email.value,
    password: password.value,
  };
  checkAccount("users");
}

/**
 *
 * @param {string} key - 'users' - checks the combination of the username and password
 */
async function checkAccount(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  let json = await response.json();
  allUsers = JSON.parse(json.data.value);
  checkAccountExists();
}

/**
 * Checks if the account exists and if it exists save the email in localstorage of init the summary greeting name.
 */
async function checkAccountExists() {
  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    if (
      currentLogin.password == user["password"] &&
      user["email"] == currentLogin.email
    ) {
      localStorage.setItem("email", currentLogin.email); // Get Email from LocalStorage in Summary to Display Hello "NAME" - clear LocalStorage afterwards;
      location.href = "summary.html";
      return true;
    }
  }
  document.getElementById("info-box").classList.remove("d-none");
}

/**
 * Set 'Guest' as name to localstorage.
 */
function guestLogIn() {
  localStorage.removeItem("email");
  localStorage.setItem("name", "Guest");
}

/**
 * Shows the password as plain text if the user click the img in password input container.
 */
function showClearPassword() {
  let inputField = document.getElementById("password");
  if (inputField.type == "password") {
    inputField.type = "text";
  } else {
    inputField.type = "password";
  }
}
