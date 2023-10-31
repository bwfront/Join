/* Contacts Dropdown Open and Close*/
document.addEventListener("DOMContentLoaded", function () {
  const assignedContact = document.getElementById("assigned_contact");
  const inputElement = document.getElementById("task-contact-input");
  inputElement.addEventListener("click", function (event) {
    event.stopPropagation();
    if (assignedContact.style.display === "flex") {
      assignedContact.style.display = "none";
    } else {
      assignedContact.style.display = "flex";
    }
  });
  document.addEventListener("click", function (event) {
    if (
      !assignedContact.contains(event.target) &&
      event.target !== inputElement
    ) {
      assignedContact.style.display = "none";
    }
  });
});

/**
 * Check wich Contact is Checked
 * @returns - The Contacts that Checked
 */
function getCheckedContacts() {
  const checkedContacts = [];
  const checkboxes = document.querySelectorAll(
    "#assigned_contact input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedContacts.push(checkbox.value);
    }
  });
  if (checkedContacts.length > 0) {
  }
  return checkedContacts;
}

/**
 * Inner the Contacts in the PopUp
 * @param {Array} contacts - The Array of the Contacts
 * @param {String} id  - The ID o the Container that inner the Profiles
 */
async function innerPopUpContactHTML(contacts, id) {
  const container = document.getElementById(`task-profile-${id}`);
  if (container) {
    let count = 0;
    for (let contact of contacts) {
      if(count >= 5){
        const rest = contacts.length - count;
        innerPopUpContactPlus(rest, container);
        break;
      }
      const bgColor = await contactBackgroundColor(contact);
      container.innerHTML += `
        <div class="profile" id="profile" style="background-color: ${bgColor}">${setContactInitial(contact)}</div>`;
      count++;
    }
  }
}

/**
 * 
 * @param {String} rest - The Value of the Contacts - 5
 * @param {*} container - The ID o the Container that inner the Profiles
 */
function innerPopUpContactPlus(rest, container){
  container.innerHTML += `<div class="board-task-plus">+${rest}</div>`
}

/**
 * Give the Date Picker the min Value
 */
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("task-date-input").min = formattedDate;
});
