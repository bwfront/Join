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
let account = []; // current login input onsubmit = email + password // This need to be checked
let allUsers = [];

async function login() {
  account.push({
    email: email.value,
    password: password.value,
  });
  checkAccount('users');
}

async function checkAccount(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  let json = await response.json();
  allUsers = json.data.value;
}

/*async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then((res) => res.json());
}*/
