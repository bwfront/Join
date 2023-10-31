/**
 * Include and Check wich page is open
 * @param {String} site - The String of the Open Page
 */
async function init(site) {
  await includeHTML(site);
  desktopAttachSubheaderEvents(); // Attach the event after the HTML is loaded
  mobileAttachSubheaderEvents();
}

/**
 * Import the Navigation from desktop_template and mobile_template
 * when called
 * @param {String} site
 */
async function includeHTML(site) {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
  navigationCheck(site);
  setUserInitials();
}

/**
 * Set the User Initiles
 */
function setUserInitials() {
  let name = localStorage.getItem('name');
  if(name){
    let initials = name.slice(0, 2);
    let uppercaseInitials = initials.toUpperCase();
    document.querySelector("[id='initials-user']").innerHTML = `${uppercaseInitials}`; // Dekstop Navbar
    document.querySelector("[id='initial-user-mobile']").innerHTML = `${uppercaseInitials}`; // Mobile Navbar
  }
}

/**
 *  Checks wich Site is currently open
 * @param {String} site
 */
function navigationCheck(site) {
  if (site == 'summary') {
    navigationHighlight('summary');
  } else if (site == 'addtask') {
    navigationHighlight('addtask');
  } else if (site == 'board') {
    navigationHighlight('board');
  } else if (site == 'contacts') {
    navigationHighlight('contacts');
  } else if (site == 'privacypolicy') {
    navigationHighlight('privacypolicy');
  } else if (site == 'legalnotice') {
    navigationHighlight('legalnotice');
  } else if (site == 'help') {
    disabelHelp();
  }
}

/**
 * Disable Help Icon if Help is the open Site
 */
function disabelHelp() {
  document.getElementById('help-icon').style.display = 'none';
}

/**
 * Highlight (CSS) Background the currently open Site
 * Checks if @property {string} site + Mobile exist because
 * Mobile Users dont have in Navigation Bar Privacy Policy / Legal Notice
 * @param {String} site
 */
function navigationHighlight(site) {
  highlightDesktop = document.getElementById(`${site}Desktop`).className += ' desktop-active';
  if (document.getElementById(`${site}Mobile`)) {
    highlightMobile = document.getElementById(`${site}Mobile`).className += ' mobile-active';
  }
}

/**
 * Attaches click events to the desktop header profile element.
 * Toggles the subheader's visibility by using the display: none / display: flex.
 */
function desktopAttachSubheaderEvents() {
  let headerStatus = 'out';
  let subHeader = document.getElementById('desktop-subheader');
  let desktopHeaderProfile = document.querySelector('.desktop-header-profile');

  if (desktopHeaderProfile) {
    desktopHeaderProfile.addEventListener('click', subheaderCheck);
  }

  /**
   * Checks the current status of the subheader.
   * Triggers the display setting based on the current state.
   */
  function subheaderCheck() {
    if (headerStatus === 'out') {
      subHeader.style.display = 'flex';
      headerStatus = 'in';
    } else {
      subHeader.style.display = 'none';
      headerStatus = 'out';
    }
  }
}

/**
 * Attaches click events to the mobile header profile element.
 * Toggles the subheader's visibility by using the slide-in and slide-out animations.
 */
function mobileAttachSubheaderEvents() {
  let headerStatus = 'out';
  let subHeader = document.getElementById('mobile-subheader');
  let mobileHeaderProfile = document.querySelector('.mobile-header-profile');

  if (mobileHeaderProfile) {
    mobileHeaderProfile.addEventListener('click', subheaderCheck);
  }

  /**
   * Checks the current status of the subheader.
   * Triggers the appropriate slide animation based on the current state.
   */
  function subheaderCheck() {
    if (headerStatus === 'out') {
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
    subHeader.classList.add('slidein');
    subHeader.classList.remove('slideout');
    headerStatus = 'in';
  }

  /**
   * Slides out the subheader and updates the header status.
   * Removes the slide-in class and adds the slide-out class from the subheader element.
   */
  function subheaderSlideOut() {
    subHeader.classList.remove('slidein');
    subHeader.classList.add('slideout');
    headerStatus = 'out';
  }
}
