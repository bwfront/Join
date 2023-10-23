let statusPopUpWindow = "close";

function openPopUp() {
  if (statusPopUpWindow === "close") {
    document.getElementById("contactPopUp").style.display = "block";
    statusPopUpWindow = "open";
  } else {
    document.getElementById("contactPopUp").style.display = "none";
    statusPopUpWindow = "close";
  }
}

function closeWindow() {
  document.getElementById("contactPopUp").style.display = "none";
  statusPopUpWindow = "close";
}
