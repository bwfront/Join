/**
 * function to open the modal window and to show details about the contact
 */
function openContactModal(contactIndex) {
  const contactDetails = document.getElementById("contactPopUp");
  const contactBackground = document.getElementById("contact_modal_background");

  if (contactDetails.style.display === "block") {
    contactDetails.style.display = "none";
    contactBackground.style.display = "none";
  } else {
    const contact = allContacts[contactIndex];
    const popupContainer = document.getElementById("contact_modal_details");

    contactBackground.style.display = "block";
    popupContainer.classList.remove("popup-slideout");
    popupContainer.classList.add("popup-slidein");

    contactDetails.innerHTML = generatePopUpContact(contact);
    contactDetails.style.display = "block";
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

function generatePopUpContact(contact) {
  return `
      <div class="modal-content ">
        <div class="modal-splitter">
        <div class = "modal-contacts-head-img">
          <img src="./assets/img/profile_badge.png" />
          <div>
            <h2 id="contactName">${contact.name}</h2>
            <div class="modal-contacts-head-edit">
              <p onclick="editContact()"><img src="./assets/img/editpopup.png">Edit</p>
              <p>|</p>
              <p onclick="deleteContact()"><img src="./assets/img/deletepopup.png">Delete</p>
            </div>
            <a href="add_task.html"><span>+ Assign a task</span></a>
          </div>
        </div>

   

        <div class="modal-contacts-body">
          <div>
        <span>Contact informations</span>
        </div>
        <div class="modal-contacts-body-email">
          <p>Email:</p>
          <h3 id="contactEmail">${contact.email}</h3>
        </div>
        <div class="modal-contacts-body-email">
          <p>Phone number:</p>
          <h3 id="contactPhone">0151 272 832</h3>
        </div>
        <div class="modal-contacts-body-email">
          <p>Tasks assigned:</p>
          <h3 id="tasksAssigned">none</h3>
        </div>
        <img src="./assets/img/closepopup.png " onclick="closeModalContacts()" class= "close-modal-contacts" id="closeModal">
      </div>
      </div>
    
    `;
}
