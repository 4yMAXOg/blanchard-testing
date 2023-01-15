navSearchFormInit();

function navSearchFormInit() {
  let openButton = document.querySelector(".search-small__open");
  let closeButton = document.querySelector(".search-small__close");

  openButton.addEventListener("click", openNavSearchForm);
  closeButton.addEventListener("click", closeNavSearchForm);

  // Testing search
  let searchButton = document.querySelector(".search-small__search-button");
  searchButton.addEventListener("click", () => { 
    event.preventDefault();
    alert("search"); 
  });

  // Set focus trap
  let burgerMenu = document.querySelector(".search-small-form");
  let focusElement = document.querySelector(".search-small__text");

  initFocusTrap(openButton, closeButton, burgerMenu, {
    focusElement: focusElement, 
  });
}

function openNavSearchForm(event) {
  event.preventDefault();

  let search = document.querySelector(".search-small-form");
  let open = document.querySelector(".search-small__open");

  let searchButton = document.querySelector(".search-small__search-button");
  let text = document.querySelector(".search-small__text");
  let close = document.querySelector(".search-small__close");

  close.tabIndex = 0;
  searchButton.tabIndex = 0;
  text.tabIndex = 0;

  close.setAttribute("aria-hidden", "false");
  searchButton.setAttribute("aria-hidden", "false");
  text.setAttribute("aria-hidden", "false");

  search.classList.remove("search-small-form_closed");

  open.classList.add("search-small__open_hidden")
}

function closeNavSearchForm() {
  event.preventDefault();

  let search = document.querySelector(".search-small-form");
  let searchButton = document.querySelector(".search-small__search-button");
  let text = document.querySelector(".search-small__text");
  let close = document.querySelector(".search-small__close");

  search.classList.add("search-small-form_closed");

  searchButton.tabIndex = -1;
  text.tabIndex = -1;
  close.tabIndex = -1;

  close.setAttribute("aria-hidden", "true");
  searchButton.setAttribute("aria-hidden", "true");
  text.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    let open = document.querySelector(".search-small__open");

    open.classList.remove("search-small__open_hidden");

    open.focus();
  }, 500);
}
