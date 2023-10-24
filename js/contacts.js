/**
 * initialize script for contacts.html
 */
function initContacts() {
  getContacts();
}

async function getContacts() {
  const contacts = await getItem("contacts");
  renderContacts(contacts);
}

/**
 * renders the contacts
 */
function renderContacts(contacts) {
  let contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    contactList.innerHTML += innerContacts(contacts[i]);
  }
}

/**
 * generate the elements for the contact list
 * @param {*} contact -
 * @param {*} index - index of the contact
 * @returns
 */
function innerContacts(contact) {
  return `
      <div class="sidebar-contacts" onclick="openContact(${contact.id})">
        <div>
          <img src="../assets/img/profile_badge.png">
        </div>
        <div>
          <h2>${contact.name}</h2>
          <h3>${contact.email}</h3>
        </div>
      </div>`;
}

/**
 * The Init Function for the Contact 'Show'
 * @param {String} id - The ID of the Contact
 */
async function openContact(id) {
  const showcon = document.getElementById("contact-show-container");
  showcon.style.display = "none";
  const contact = await getContactInfo(id);
  showcon.style.display = "unset";
  showcon.innerHTML = showContactHTML(contact);
}

/**
 * Fetch the Information and filter it with the ID
 * @param {String} id - The ID of the Contact
 * @returns - The filtered Object
 */
async function getContactInfo(id) {
  const contacts = await getItem("contacts");
  const contact = contacts.find((contact) => contact.id === id);
  return contact;
}

/**
 * 
 * @param {Object} contact - The Filtert Object
 * @returns - The HTML Code
 */
function showContactHTML(contact) {
  return `
  <div class="contact-show-head">
    <div class="contact-profile-container">US</div>
    <div class="contact-show-btn-name-container">
      <div class="contact-show-name">${contact.name}</div>
      <div class="show-btn-conatiner">
        <div class="contact-show-btn" onclick="editContact(${contact.id})"><img src="./assets/img/editpopup.png" alt="edit">Edit</div>
        <div class="contact-show-btn"><img src="./assets/img/deletepopup.png" alt="delte" onclick="deleteContact(${contact.id})">Delete</div>
      </div>
    </div>
  </div>
  <div class="contact-show-information">
    <div class="contact-show-info-text">Contact Information</div>
    <div class="contact-show-email">
      <div class="show-heading">Email</div>
      <div class="show-email-text">${contact.email}</div>
    </div>
    <div class="contact-show-phone">
      <div class="show-heading">Phone</div>
      <div class="show-phone-text">${checkNumber(contact.number)}</div>
    </div>
  </div>
  `;
}

/**
 * Check if a Telephone Number was Set and Return
 * @param {String} number - The Telephone Number
 * @returns - The String that get in to the HTML
 */
function checkNumber(number){
  if(number == ''){
    return 'No number assigned'
  }else{
    return number;
  }
}