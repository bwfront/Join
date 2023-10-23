let allContacts = [
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
];

let user = [];

/**
 * initialize script for contacts.html
 */
function initContacts() {
  renderContacts();
}

/**
 * renders the contacts
 */
function renderContacts() {
  let contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";

  for (let i = 0; i < allContacts.length; i++) {
    let contact = allContacts[i];
    contactList.innerHTML += generateContacts(contact, i);
  }
}

/**
 * generate the elements for the contact list
 * @param {*} contact -
 * @param {*} index - index of the contact
 * @returns
 */
function generateContacts(contact, index) {
  return `
      <div class="sidebar-contacts" onclick="openContactModal(${index})">
        <div>
          <img src="../assets/img/profile_badge.png">
        </div>
        <div>
          <h2>${contact.name}</h2>
          <h3>${contact.email}</h3>
        </div>
      </div>`;
}

function addContact() {
  const newName = "New Contact";
  const newEmail = "new.contact@example.com";

  const newContact = {
    name: newName,
    email: newEmail,
  };
  allContacts.push(newContact);
  renderContacts();
}

