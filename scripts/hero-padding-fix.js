document.addEventListener("DOMContentLoaded", heroPaddingFixInit);

function heroPaddingFixInit() {
    window.addEventListener("resize", heroPaddingFix);
    window.addEventListener("orientationchange", heroPaddingFix);
    heroPaddingFix();
}

function heroPaddingFix() {
    let headerTop = document.querySelector(".header__top");
    let headerTopHeight = headerTop.offsetHeight;
    let headerBottom = document.querySelector(".header__bottom");
    let headerBottomHeight = headerBottom.offsetHeight;

    let headerHeight = headerTopHeight + headerBottomHeight;

    // Setting css variable
    document.documentElement.style.setProperty('--header-height', headerHeight + "px");
}


