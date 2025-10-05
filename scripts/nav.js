var navOpen;

function openNav() {
    if (navOpen) {
        navOpen = false;
        closeNav();
    } else {
        document.getElementById("nav").style.width = "66%";
        navOpen = true;
    }
}

function closeNav() {
    document.getElementById("nav").style.width = "0%";
}
