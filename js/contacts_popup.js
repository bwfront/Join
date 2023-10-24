/**
 * Check wich PopUp should open
 * @param {String} value - The Value of the PopUp that should be open
 */
function openPopUpCopntact(value) {
  if (value == "edit") {
    innerEditContactPopUp(getPopUpId());
  } else if (value == "add") {
    innerAddContactPopUp(getPopUpId());
  }
}

/**
 * Return the HTML ID to openPopUp
 * @returns - Return the ID of the HTML
 */
function getPopUpId() {
  const popup = document.getElementById("contactPopUp");
  const title = document.getElementById("popup-title-span");
  const titleunder = document.getElementById("popup-title-span-underline");
  const btncancel = document.getElementById("contact-delete-btn");
  const btncreate = document.getElementById("contact-save-btn");
  const titlecon = document.getElementById("contact-popup-title-logo");
  const background = document.getElementById('contact_modal_background');
  const contactconid = {
    popup,
    title,
    titleunder,
    btncancel,
    btncreate,
    titlecon,
    titleunder,
    background
  };
  return contactconid;
}

/**
 * Close the PopUp
 */
function closeWindow() {
  document.getElementById("contactPopUp").style.display = "none";
  initContacts();
  const background = document.getElementById('contact_modal_background');
  background.style.display = 'none';
}

/**
 * Check if the Inputs are not empty If not then go to the next Function
 * @param {String} con - The PopUp Name
 * @returns 
 */
function contactCheck(con) {
  const nameInput = document.getElementById("contact-input-name").value;
  const emailInput = document.getElementById("contact-input-email").value;
  if (nameInput == '' || emailInput == '') {
    return;
  } else {
    if(con == 'addContact'){
      addContact();
    }
    if(con = 'editContact'){
      editContact();
    }
  }
}

/**
 *
 * @returns - Return the Contact Values within the Input and clear it
 */
function getValuesInputContact() {
  const id = Date.now();
  const nameInput = document.getElementById("contact-input-name");
  const emailInput = document.getElementById("contact-input-email");
  const numberInput = document.getElementById("contact-input-number");
  const name = nameInput.value;
  const email = emailInput.value;
  const number = numberInput.value;
  const newcontact = { id, name, email, number };
  nameInput.value = "";
  emailInput.value = "";
  numberInput.value = "";
  return newcontact;
}

/* ADD CONTACT */
/**
 * Inner the Values in the HTML for Add Contact Pupup
 * @param {Object} id - The HTML ID's
 */
function innerAddContactPopUp(id) {
  id.popup.style.display = "flex";
  id.titlecon.style.marginTop = "-30px";
  id.btncancel.innerHTML = "Cancel";
  id.btncancel.onclick = function () {
    closeWindow();
  };
  id.btncreate.innerHTML = `Create Contact <img src="./assets/img/check.png" alt="check" />`;
  id.btncreate.onclick = function () {
    contactCheck('addContact');
  };
  id.title.innerHTML = "Add contact";
  id.titleunder.style.display = "unset";
  id.background.style.display = 'unset';
}

/**
 * Get The Contacts
 * Push the new Contact
 * Set the Contacts
 */
async function addContact() {
  const newcontact = getValuesInputContact();
  const contacts = await getItem("contacts");
  contacts.push(newcontact);
  await setItem("contacts", contacts);
  closeWindow();
}

/* EDIT CONTACT */

/**
 * Inner the Values in the HTML for Edit Contact Popup
 * @param {Object} id - The HTML ID's
 */
function innerEditContactPopUp(id) {
  id.popup.style.display = "flex";
  id.titlecon.style.marginTop = "0px";
  id.btncancel.innerHTML = "Delete";
  id.btncancel.onclick = function () {
    deleteContact();
  };
  id.btncreate.innerHTML = `Save <img src="./assets/img/check.png" alt="check" />`;
  id.btncreate.onclick = function(){
    contactCheck('editContact');
  }
  id.title.innerHTML = "Edit contact";
  id.titleunder.style.display = "none";
  id.background.style.display = 'unset';
}

function openContact(){}

function editContact(){}