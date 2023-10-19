let contacts = [
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
];

function init() {
  renterContacts();
}

function renterContacts() {
  let contact_container = document.getElementById("contacts_container");
  contact_container.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    contact = contacts[i];
    contact_container.innerHTML += contactCreated(contact);
  }
}

function contactCreated(contact) {
  return `
  <div class="main-content-contacts" >
  <h2>${contact.name}<h2>
  <span>${contact.email}</span>
  <div>`;
}

function addNewContact() {
  const newContact = {
    name: "name of the person",
    email: "mail of the person",
  };

  contacts.push(newContact);
  renterContacts();
}
