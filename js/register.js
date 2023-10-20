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

let users = [];

async function init() {
  await loadUsers();
}

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then((res) => res.json());
}

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

async function loadUsers() {
  try {
    users = await JSON.parse(await getItem('users'));
  } catch (e) {
    console.error('Loading error:', e);
  }
}

async function register() {
  //registerBtn.disabled = true;
  //debugger;
  users.push({
    name: document.getElementById('name').value,
    email: email.value,
    password: password.value,
  });
  await setItem('users', JSON.stringify(users));
  resetForm();
}

function resetForm() {
  document.getElementById('name').value = '';
  email.value = '';
  password.value = '';
  document.getElementById('confirmPassword').value = '';
  //registerBtn.disabled = false;
}
