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
