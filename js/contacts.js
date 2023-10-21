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
    contactList.innerHTML += generateContacts(contact);
  }
}

/**
 *
 * generates the contact list
 * @param {*} contact
 * @returns
 */

function generateContacts(contact) {
  return `
  <div class="sidebar-contacts" onclick="openContactModal(allContacts[0])">
    <div>
      <img src = "../assets/img/profile_badge.png">
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

/**
 * function to open the modal window and to show details about the contact
 * @param {*} contact
 */
function openContactModal(contact) {
  const modal = document.getElementById("contact_modal_details");
  const nameModal = document.getElementById("contactName");
  const emailModal = document.getElementById("contactEmail");

  if (modal.style.display === "block") {
    modal.style.display = "none";
  } else {
    nameModal.textContent = contact.name;
    emailModal.textContent = contact.email;
    modal.style.display = "block";
  }
}

function closeModalContacts() {
  const modal = document.getElementById("contact_modal_details");
  modal.style.display = "none";
}
