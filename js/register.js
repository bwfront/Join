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
 * global array where the fetched userdata loaded in.
 */
let users = [];

async function init() {
  await loadUsers();
}

/**
 *
 * @param {*} key - users
 * @param {*} value - object with userdata: username, password, name
 * @returns
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 *
 * @param {*} key - fetch userdata from backend
 * @returns json of userdata
 */

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}

/**
 * Sets all users to the users array
 */
async function loadUsers() {
  try {
    users = await JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Submit the valid userdata to backend and create user account.
 */

async function register() {
  users.push({
    name: document.getElementById("name").value,
    email: email.value,
    password: password.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
}

/**
 * Resets the input forms.
 */
function resetForm() {
  document.getElementById("name").value = "";
  email.value = "";
  password.value = "";
  document.getElementById("confirmPassword").value = "";
  location.href = "index.html";
  //registerBtn.disabled = false;
}

/**
 * Checks the Passoword
 */
function checkPasswordValidation() {
  let errorContainer = document.getElementById("passwordError");
  if (
    document.getElementById("password").value ==
    document.getElementById("confirmPassword").value
  ) {
    errorContainer.style.color = "green";
    errorContainer.innerHTML = "Password matching";
  } else {
    errorContainer.style.color = "red";
    errorContainer.innerHTML = "Passwords do <b>not</b> match!";
  }
}
