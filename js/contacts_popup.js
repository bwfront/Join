/**
 * Check wich PopUp should open
 * @param {String} value - The Value of the PopUp that should be open
 */
function openPopUpCopntact(value) {
  if (value == "edit") {
    innerEditContactPopUp(getPopUpId());
  } else if (value == "add") {
    console.log('test');
    innerAddContactPopUp(getPopUpId());
  }
}

/**
 * Return the HTML ID to openPopUp
 * @returns - Return the ID of the HTML
 */
function getPopUpId(){
  const popup = document.getElementById('contactPopUp');
  const title = document.getElementById("popup-title-span");
  const titleunder = document.getElementById("popup-title-span-underline");
  const btncancel = document.getElementById("contact-delete-btn");
  const btncreate = document.getElementById("contact-save-btn");
  const titlecon = document.getElementById("contact-popup-title-logo");
  const contactconid = {
    popup, title, titleunder, btncancel, btncreate, titlecon, titleunder
  }
  return contactconid;
}

/**
 * Close the PopUp
 */
function closeWindow() {
  document.getElementById("contactPopUp").style.display = "none";
}

/**
 * Inner the Values in the HTML
 * @param {Object} id - The HTML ID's
 */
function innerAddContactPopUp(id) {
  id.popup.style.display = 'flex';
  id.titlecon.style.marginTop = "-30px";
  id.btncancel.innerHTML = "Cancel";
  id.btncreate.innerHTML = `Create Contact <img src="./assets/img/check.png" alt="check" />`;
  id.title.innerHTML = "Add contact";
  id.titleunder.style.display = "unset";
}

/**
 * Inner the Values in the HTML
 * @param {Object} id - The HTML ID's
 */
function innerEditContactPopUp(id) {
  id.popup.style.display = 'flex';
  id.titlecon.style.marginTop = "0px";
  id.btncancel.innerHTML = "Delete";
  id.btncreate.innerHTML = `Save <img src="./assets/img/check.png" alt="check" />`;
  id.title.innerHTML = "Edit contact";
  id.titleunder.style.display = "none";
}
