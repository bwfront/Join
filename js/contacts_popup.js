/**
 * function to open the modal window and to show details about the contact
 */
function openContactModal(contactIndex) {
  const contactDetails = document.getElementById("contactPopUp");
  const contactBackground = document.getElementById("contact_modal_background");

  if (contactDetails.style.display === "block") {
    contactBackground.style.display = "none";
  } else {
    const contact = allContacts[contactIndex];
    const popupContainer = document.getElementById("contact_modal_details");

    contactBackground.style.display = "block";
    popupContainer.classList.remove("popup-slideout");
    popupContainer.classList.add("popup-slidein");

    contactDetails.innerHTML = generatePopUpContact(contact);
  }
}
function closeModalContacts() {
  const contactDetails = document.getElementById("contactPopUp");
  const contactBackground = document.getElementById("contact_modal_background");
  const popupContainer = document.getElementById("contact_modal_details");


  popupContainer.classList.add("popup-slideout");
  popupContainer.classList.remove("popup-slidein");

  setTimeout(() => {
    contactDetails.style.display = "none";
    contactBackground.style.display = "none";
  }, 600); 
}

