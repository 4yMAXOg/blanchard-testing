var numberOfClickOutsideDropdown;

myHeaderDropdownsInit();

function myHeaderDropdownsInit() {
  let links = document.querySelectorAll(".genre-link__link");

  links.forEach(genreLinkAddDropdown);
}

function genreLinkAddDropdown(link) {
  link.addEventListener('click', openDropdown);

  dropdown = document.getElementById(link.dataset.dropdownid);
  let dropdownOffset = window.getComputedStyle(document.querySelector(".header__bottom")).getPropertyValue('height');

  dropdown.style.top = dropdownOffset;
}

function openDropdown(event) {
  event.preventDefault();

  // Remove previous activated element
  removeActivatedDropdown();

  document.addEventListener("click", checkForClickOutsideDropdown)
  numberOfClickOutsideDropdown = 0;

  // Add new activated element
  let newDropdown = document.getElementById(event.currentTarget.dataset.dropdownid);
  
  newDropdown.classList.add("genre-link__dropdown_visible");

  event.currentTarget.classList.add("genre-link__link_active");
}

function checkForClickOutsideDropdown(event) {
  let dropdown = document.querySelector(".genre-link__dropdown_visible");

  let withinBoundaries = event.composedPath().includes(dropdown)

  if (!withinBoundaries && numberOfClickOutsideDropdown++ > 0) {
    document.removeEventListener("click", checkForClickOutsideDropdown);

    removeActivatedDropdown();
  } 
}

function removeActivatedDropdown() {
  let oldActiveDropdowns = document.querySelectorAll(".genre-link__dropdown_visible");

  oldActiveDropdowns.forEach(((dropdown) => dropdown.classList.remove("genre-link__dropdown_visible")));

  let oldActiveLinks = document.querySelectorAll(".genre-link__link_active");

  oldActiveLinks.forEach(((link) => link.classList.remove("genre-link__link_active")));
}
