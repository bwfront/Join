async function init() {
  await includeHTML();
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
  navigationHighlight(site);
}

/**
 *  Checks wich Site is currently open
 * @param {String} site 
 */
function navigationCheck(site){
  if(site == 'summary'){
    navigationHighlight('summary');
  }else if(site == 'addtask') {
    navigationHighlight('addtask');
  }else if(site == 'board'){
    navigationHighlight('board');
  }else if(site == 'contacts'){
    navigationHighlight('contacts');
  }else if(site == 'privacypolicy'){
    navigationHighlight('privacypolicy');
  }else if(site == 'legalnotice'){
    navigationHighlight('legalnotice');
  }
}

/**
 * Highlight (CSS) Background the currently open Site
 * Checks if @property {string} site + Mobile exist because 
 * Mobile Users dont have in Navigation Bar Privacy Policy / Legal Notice
 * @param {String} site 
 */
function navigationHighlight(site){
  highlightDesktop = document.getElementById(`${site}Desktop`).className += ' desktop-active';
  if(document.getElementById(`${site}Mobile`)){
    highlightMobile = document.getElementById(`${site}Mobile`).className += ' mobile-active';
  }
}
