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
  const contactconid = {
    popup,
    title,
    titleunder,
    btncancel,
    btncreate,
    titlecon,
    titleunder,
  };
  return contactconid;
}

/**
 * Close the PopUp
 */
function closeWindow() {
  document.getElementById("contactPopUp").style.display = "none";
}

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
    addContact();
  };
  id.title.innerHTML = "Add contact";
  id.titleunder.style.display = "unset";
}

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
  id.title.innerHTML = "Edit contact";
  id.titleunder.style.display = "none";
}

async function addContact() {
  const newcontact = getValuesInputContact();
  const contacts = await getItem("contacts");
  contacts.push(newcontact);
  await setItem("contacts", contacts);
}

function getValuesInputContact() {
  const id = Date.now();
  const name = document.getElementById("contact-input-name").value;
  const email = document.getElementById("contact-input-email").value;
  const number = document.getElementById("contact-input-number").value;
  const newcontact = { id, name, email, number };
  return newcontact;
}
