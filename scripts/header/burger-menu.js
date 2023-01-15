var burgerMenuInstance;
var burgerMenuPreventScroll;

document.addEventListener("DOMContentLoaded", initBurgerMenu);

function initBurgerMenu() {

  let openButton = document.querySelector(".header__burger");
  let closeButton = document.querySelector(".nav__close-button");
  let burgerMenu = document.querySelector(".nav");

  var burgerFocusTrap = initFocusTrap(openButton, closeButton, burgerMenu, {preventScroll: true, });

  initMySlide(".nav", {
    closedClass: "nav_closed", 
    openSelectors: ".header__burger", 
    exitSelectors: ".nav__close-button, .nav__link, header-login__link",
    place: "left", 
    noScroll: true, 
    onSlideOpening: function () {
      // document.body.classList.add("body-fixed-scroll");

    }, 

    onSlideClosing: function () {
      // document.body.classList.remove("body-fixed-scroll");

    }, 
  });


  // Old slider implementation using slider plugin

  // burgerMenuInstance = $('.nav-slider').SlidePanel({
  //   toggle: ".header__burger",
  //   exit_selector: ".nav-slider__close-button, .nav__link, header-login__link",
  //   place: "left",
  //   body_slide: false,

  //   // Option doesn't work apparently, because preventDefault() doesn't work in passive event listeners or something
  //   no_scroll: false,
  //   auto_close: true, 
  //   animation_duration: "0.5s",
//
  //   onSlideOpening: function () {
  //     // document.body.classList.add("body-fixed-scroll");

  //     document.addEventListener("keyup", checkForClosingKey);
  //   }, 

  //   onSlideClosing: function () {
  //     // document.body.classList.remove("body-fixed-scroll");

  //     document.removeEventListener("keyup", checkForClosingKey);
  //   }, 
  // });
}

