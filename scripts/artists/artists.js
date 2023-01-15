document.addEventListener("DOMContentLoaded", artistsInit);
window.addEventListener("resize", refreshArtistsAccordion);

function artistsInit() {

  artistsAccordionInit();
  artistsTabsInit();
}

function artistsAccordionInit() {
  $( ".artists" ).accordion({
    header: ".artists__century",
    // collapsible: true,
    active: false,
    heightStyle: 'content',
    beforeActivate: artistsAccordionActivate,
  });
}

function artistsTabsInit() {
  let active = document.querySelector(".artists__item_start");

  var artistsTabs = new MyTabs(".catalog__artists-info", {
    tabPanelSelector: ".artist__content", 
    tabListSelector: ".artists__list", 
    tabSelector: ".artists__item", 
    active: active, 
    orientation: "vertical", 
  });
}

function refreshArtistsAccordion() {
  $( ".artists" ).accordion("refresh");
}

function artistsAccordionActivate(event, ui) {
  ui.oldHeader.removeClass("artists__century_active");
  ui.newHeader.addClass("artists__century_active");
}
