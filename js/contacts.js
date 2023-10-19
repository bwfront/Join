let contacts = [
  {
    name: "Axel Baum",
    email: "axel.baum@gmail.com",
  },
];

function initContacts() {
  renderContacts();
}

function renderContacts() {
  let contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    contactList.innerHTML += generateContacts(contact);
  }
}

function generateContacts(contact) {
  return `
  <div class="contact">
    <h2>${contact.name}</h2>
    <h3>${contact.email}</h3>
  </div>`;
}

function addContact() {
  const newName = "New Contact";
  const newEmail = "new.contact@example.com";

  const newContact = {
    name: newName,
    email: newEmail,
  };
  contacts.push(newContact);
  renderContacts();
}
