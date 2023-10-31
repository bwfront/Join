let currentID;
/**
 * initialize script for contacts.html
 */
async function initContacts() {
  const contacts = await getItem("contacts");
  aplhabetUniqeFirstLetter(contacts);
}

/**
 * Get the First Letters of the Name and the contacts in Alphabet Structure
 * @param {Object} contacts - The fetched data from server
 */
function aplhabetUniqeFirstLetter(contacts) {
  let contactLetters = [];
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  contacts.forEach((contact) => {
    contactLetters.push(contact);
  });
  const uniqeLetters = [
    ...new Set(contactLetters.map((contact) => contact.name[0].toUpperCase())),
  ];
  renderContactCons(uniqeLetters);
  renderContacts(contacts);
}

/**
 * Inner the diffrent Containers
 * @param {Array} uniqeLetters - Store all Uniqe First Letters in Alphabet structure
 */
function renderContactCons(uniqeLetters) {
  let contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";
  for (let i = 0; i < uniqeLetters.length; i++) {
    contactList.innerHTML += `        
    <div class="contact-list-letter-con">
      <div class="contact-list-letter">${uniqeLetters[i]}</div>
    </div>
    <div id='contact-${uniqeLetters[i]}'></div>`;
  }
}

/**
 * renders the contacts in the right container
 */
function renderContacts(contacts) {
  contacts.forEach((contact) => {
    let firstLetter = contact.name[0].toUpperCase();
    let contactList = document.getElementById(`contact-${firstLetter}`);
    contactList.innerHTML += innerContacts(contact);
  });
}

/**
 * generate the elements for the contact list
 * @param {*} contact -
 * @param {*} index - index of the contact
 * @returns
 */
function innerContacts(contact) {
  return `
      <div class="sidebar-contacts" onclick="openContact(${contact.id})" id="contact${contact.id}">
        <div>
          <div class="contacts-small-profile" style="background-color: ${
            contact.color
          }">${getInitials(contact.name)}</div>
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
  removeClassHovered()
  const showcon = document.getElementById("contact-show-container");
  showcon.style.display = "none";
  const contact = await getContactInfo(id);
  showcon.style.display = "unset";
  showcon.innerHTML = showContactHTML(contact);
  mobileOpenContact();
  currentID = id;
  const contactcon = document.getElementById(`contact${id}`);
  contactcon.classList.add('sidebar-contacts-script');
}
function removeClassHovered(){
  if(currentID){
    const contactcon = document.getElementById(`contact${currentID}`);
    if(contactcon){
      contactcon.classList.remove('sidebar-contacts-script');
    }
  }
}

/**
 * Open the Contact in Mobile Screen
 */
function mobileOpenContact() {
  const containerInfo = document.getElementById(
    "contact-details-container-mobile"
  );
  const containerbtn = document.getElementById("mobile-btn");
  if ($(window).width() < 781) {
    containerInfo.style.display = "block";
    containerbtn.innerHTML = `
    <div class="add-person-resonsive" onclick="openMobileMenu()">
      <img src="./assets/img/more_vert.png">
    </div>
    `;
  }
}

/**
 * CloseContact in Mobile Screen
 */
function closeContactMobile() {
  removeClassHovered();
  closeMobileMenu();
  const containerInfo = document.getElementById(
    "contact-details-container-mobile"
  );
  const containerbtn = document.getElementById("mobile-btn");
  containerInfo.style.display = "none";
  containerbtn.innerHTML = `
  <div class="add-person-resonsive" onclick="openPopUpContact('add')">
    <img src="./assets/img/person_add.png" id="add-responsive">
  </div>
  `;
}

/**
 * Open Contact Mobile Screen Menu
 */
function openMobileMenu() {
  const mobilecon = document.getElementById("mobile-container");
  mobilecon.innerHTML = `
  <div class="mobile-edit-delete" id="mobile-edit-delete">
      <div class="contact-show-btn" onclick="editContact(${currentID})"><img src="./assets/img/editpopup.png" alt="edit">Edit</div>
      <div class="contact-show-btn" onclick="deleteContact(${currentID})"><img src="./assets/img/deletepopup.png" alt="delte">Delete</div>
    </div>
  `;
  const containerbtn = document.getElementById("mobile-btn");
  containerbtn.innerHTML = `
  <div class="add-person-resonsive" onclick="closeMobileMenu()">
    <img src="./assets/img/more_vert.png">
  </div>
  `;
}

function closeMobileMenu() {
  const mobilecon = document.getElementById("mobile-container");
  mobilecon.innerHTML = '';
  const containerbtn = document.getElementById("mobile-btn");
  containerbtn.innerHTML = `
  <div class="add-person-resonsive" onclick="openMobileMenu()">
    <img src="./assets/img/more_vert.png">
  </div>
  `;
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
    <div class="contact-profile-container" id="contact-profile-container-info" style="background-color: ${
      contact.color
    }">${getInitials(contact.name)}</div>
    <div class="contact-show-btn-name-container">
      <div class="contact-show-name">${contact.name}</div>
      <div class="show-btn-conatiner">
        <div class="contact-show-btn" onclick="editContact(${
          contact.id
        })"><img src="./assets/img/editpopup.png" alt="edit">Edit</div>
        <div class="contact-show-btn" onclick="deleteContact(${
          contact.id
        })"><img src="./assets/img/deletepopup.png" alt="delte">Delete</div>
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
function checkNumber(number) {
  if (number == "") {
    return "No number assigned";
  } else {
    return number;
  }
}

/**
 * Delete the Contact and Render
 */
async function deleteContact(id) {
  const contacts = await getItem("contacts");
  const updatedcontacts = contacts.filter((contact) => contact.id !== id);
  await setItem("contacts", updatedcontacts);
  initContacts();
  const showcon = document.getElementById("contact-show-container");
  showcon.style.display = "none";
  if ($(window).width() < 781) {
    closeContactMobile();
  }
  closeWindow();
}

/**
 * Shows the Container Contact Details
 */
$(window).on('resize', function() {
  if ($(window).width() > 781) {
      document.getElementById('contact-details-container-mobile').style.display = 'block';
    }else{
      document.getElementById('contact-details-container-mobile').style.display = 'none';
  }
});


/**
 * Generate a Random Color for the Profile
 * @returns - Return a Random Color from an Array
 */
function randomColor() {
  const colors = [
    "#93F6FA",
    "#82FA91",
    "#FFF06F",
    "#FFB486",
    "#F89B9C",
    "#FE4553",
    "#ACC1C6"
  ];
  const pickedcolor = colors[Math.floor(Math.random() * colors.length)];
  return pickedcolor;
}

/**
 * Get the Initals fpr the Profile
 * @param {String} name
 * @returns - The Initals of the Name
 */
function getInitials(name) {
  const words = name.split(" ").slice(0, 2);
  const initials = words.map((word) => word[0]).join("");
  return initials.toUpperCase();
}
