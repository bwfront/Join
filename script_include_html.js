async function init(site) {
  await includeHTML(site);
  attachSubheaderEvents(); // Attach the event after the HTML is loaded
}

/**
 * Import the Navigation from desktop_template and mobile_template
 * when called
 * @param {String} site
 */
async function includeHTML(site) {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  navigationHighlight(site);
}

/**
 *  Checks wich Site is currently open
 * @param {String} site
 */
function navigationCheck(site) {
  if (site == "summary") {
    navigationHighlight("summary");
  } else if (site == "addtask") {
    navigationHighlight("addtask");
  } else if (site == "board") {
    navigationHighlight("board");
  } else if (site == "contacts") {
    navigationHighlight("contacts");
  } else if (site == "privacypolicy") {
    navigationHighlight("privacypolicy");
  } else if (site == "legalnotice") {
    navigationHighlight("legalnotice");
  }
}

/**
 * Highlight (CSS) Background the currently open Site
 * Checks if @property {string} site + Mobile exist because
 * Mobile Users dont have in Navigation Bar Privacy Policy / Legal Notice
 * @param {String} site
 */
function navigationHighlight(site) {
  highlightDesktop = document.getElementById(`${site}Desktop`).className +=
    " desktop-active";
  if (document.getElementById(`${site}Mobile`)) {
    highlightMobile = document.getElementById(`${site}Mobile`).className +=
      " mobile-active";
  }
}

/**
 * Attaches click events to the mobile header profile element.
 * Toggles the subheader's visibility by using the slide-in and slide-out animations.
 */
function attachSubheaderEvents() {
  let headerStatus = "out";
  let subHeader = document.getElementById("subheader");
  let mobileHeaderProfile = document.querySelector(".mobile-header-profile");

  if (mobileHeaderProfile) {
    mobileHeaderProfile.addEventListener("click", subheaderCheck);
  } else {
    console.error(
      "Element with class .mobile-header-profile not found after HTML injection!"
    );
  }

  /**
   * Checks the current status of the subheader.
   * Triggers the appropriate slide animation based on the current state.
   */
  function subheaderCheck() {
    if (headerStatus === "out") {
      subheaderSlideIn();
    } else {
      subheaderSlideOut();
    }
  }

  /**
   * Slides in the subheader and updates the header status.
   * Adds the slide-in class and removes the slide-out class from the subheader element.
   */
  function subheaderSlideIn() {
    subHeader.classList.add("slidein");
    subHeader.classList.remove("slideout");
    headerStatus = "in";
  }

  /**
   * Slides out the subheader and updates the header status.
   * Removes the slide-in class and adds the slide-out class from the subheader element.
   */
  function subheaderSlideOut() {
    subHeader.classList.remove("slidein");
    subHeader.classList.add("slideout");
    headerStatus = "out";
  }
}
