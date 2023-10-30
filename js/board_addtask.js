/* Contacts Dropdown */

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("task-contact-input")
    .addEventListener("click", function () {
      const assignedContact = document.getElementById("assigned_contact");
      if (assignedContact.style.display === "flex") {
        assignedContact.style.display = "none";
      } else {
        assignedContact.style.display = "flex";
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
 * @param {Array} contacts
 * @param {String} id
 */
async function innerPopUpContactHTML(contacts, id) {
  const container = document.getElementById(`task-profile-${id}`);
  for (let contact of contacts) {
    const bgColor = await contactBackgroundColor(contact);
    container.innerHTML += `
        <div class="profile" id="profile" style="background-color: ${bgColor}">${setContactInitial(
          contact)}
        </div>
      `;
  }
}

/**
 * Give the Date Picker the min Value
 */
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("task-date-input").min = formattedDate;
});
