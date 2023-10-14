console.log("Script Loaded");

document.addEventListener('DOMContentLoaded', function() {
    let headerStatus = 'out';
    let subHeader = document.getElementById('subheader');
    let mobileHeaderProfile = document.querySelector('.mobile-header-profile');

    if (mobileHeaderProfile) {
        console.log("Element found:", mobileHeaderProfile);
        mobileHeaderProfile.addEventListener('click', subheaderCheck);
    } else {
        console.error("Element with class .mobile-header-profile not found!");
    }

    function subheaderCheck() {
        console.log('Clicked!')
        if (headerStatus === 'out') {
            subheaderSlideIn();
        } else {
            subheaderSlideOut();
        }
    }

    function subheaderSlideIn() {
        subHeader.classList.add('slidein');
        subHeader.classList.remove('slideout');
        headerStatus = 'in';
    }

    function subheaderSlideOut() {
        subHeader.classList.remove('slidein');
        subHeader.classList.add('slideout');
        headerStatus = 'out';
    }
});
