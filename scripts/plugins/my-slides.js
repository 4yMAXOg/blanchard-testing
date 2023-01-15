function initMySlide (slideSelector, parameters = {}) {
	// Parameters:
	// noScroll - bool

	let closedClass = parameters.closedClass;

	let toggleSelectors = parameters.toggleSelectors;
	let openSelectors = parameters.openSelectors;
	let exitSelectors = parameters.exitSelectors;
	// Not implemented
	let place = parameters.place;
	// Not implemented
	let autoClose = parameters.autoClose;

	// Not implemented
	let customOnActivateFunction = parameters.onSlideOpening;
	// Not implemented
	let customOnDeactivateFunction = parameters.onSlideClosing;

	// Initialize slide
	let slideElement = document.querySelector(slideSelector);

	slideElement.classList.add();

	// Initialize buttons
	let openElements = document.querySelectorAll(openSelectors);

	openElements.forEach((element) => {
		element.addEventListener("click", () => {
			mySlideOpenSlide(slideElement, parameters);
		});
	});

	let closeElements = document.querySelectorAll(exitSelectors);

	closeElements.forEach((element) => {
		element.addEventListener("click", () => {
			mySlideCloseSlide(slideElement, parameters);
		});
	});

	let toggleElements = document.querySelectorAll(toggleSelectors);

	toggleElements.forEach((element) => {
		element.addEventListener("click", () => {
			mySlideToggleSlide(slideElement, parameters);
		});
	});

	document.addEventListener("keyup", createFunctionCheckForClosingKey(slideElement));
}

function mySlideOpenSlide(slideElement, parameters) {
	if(parameters.noScroll) {
		document.body.classList.add("my-slide-body-fixed-scroll");
	}

	slideElement.classList.remove(parameters.closedClass);
}

function mySlideCloseSlide(slideElement, parameters) {
	if(parameters.noScroll) {
		document.body.classList.remove("my-slide-body-fixed-scroll");
	}

	slideElement.classList.add(parameters.closedClass);

}

function mySlideToggleSlide(slideElement, parameters) {
	if(parameters.noScroll) {
		document.body.classList.toggle("my-slide-body-fixed-scroll");
	}

	slideElement.classList.toggle(parameters.closedClass);

}

function createFunctionCheckForClosingKey(slideElement) {
	return (event) => {
		if(event.code == "Escape") {
			mySlideCloseSlide(slideElement);
		}
	}
}
