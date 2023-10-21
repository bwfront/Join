/**
 * The token used for accessing the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = '0BPXH9KOB3KK14LPEUWH02NBW7QT7YIO3LQDS7R4';
/**
 * The URL used for accessing the remote storage API
 * @constant {String}
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Global Variables for the different task counters
 *
 */

/*
 * KEY = 'user' for fetching users
 * JUST FOR TEST
 */
let currentLogin; // current login input onsubmit = email + password // This need to be checked
let allUsers = [];

async function login() {
  currentLogin = {
    email: email.value,
    password: password.value,
  };
  checkAccount('users');
}

async function checkAccount(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  let json = await response.json();
  allUsers = JSON.parse(json.data.value);
  checkAccountExists();
}

async function checkAccountExists() {
  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    if (currentLogin.password == user['password'] && user['email'] == currentLogin.email) {
      localStorage.setItem('email', currentLogin.email); // Get Email from LocalStorage in Summary to Display Hello "NAME" - clear LocalStorage afterwards;
      location.href = 'summary.html';
    }
  }
}

function guestLogIn() {
  localStorage.removeItem('email');
  localStorage.setItem('name', 'Guest');
}
