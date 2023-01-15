/* Module for moving modal using focus-trap */

/* 
 * To use call function initFocusTrap() 
 * with 3 mandatory and other parameters
 */

function initFocusTrap(openButton, closeButton, modalElement, parameters = {}) {

  let focusElement = parameters.focusElement;

  let preventScroll = parameters.preventScroll;

  let customOnActivateFunction = parameters.onActivate;
  let customOnPostActivateFunction = parameters.postActivate;
  let customOnDeactivateFunction = parameters.onDeactivate;
  let customOnPostDeactivateFunction = parameters.postDeactivate;

  let trap = focusTrap.createFocusTrap(modalElement, {
    // returnFocusOnDeactivate: false, 
    preventScroll: preventScroll, 

    onActivate: createOpenModalFunction(modalElement, customOnActivateFunction),

    onPostActivate: customOnPostActivateFunction,

    onDeactivate: createCloseModalFunction(modalElement, customOnDeactivateFunction),

    onPostDeactivate: createPostCloseModalFunction(openButton, customOnPostDeactivateFunction),

    clickOutsideDeactivates: true,

    initialFocus: focusElement ? focusElement : closeButton,

    checkCanFocusTrap: (trapContainers) => {
      const results = trapContainers.map((trapContainer) => {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (getComputedStyle(trapContainer).visibility !== 'hidden') {
              // let element = trapContainer.querySelector(".close-modal");
              let element = focusElement ? focusElement : closeButton;

              // Check if any button in a container is focusable
              element.focus();
              if(document.activeElement === element) {
                resolve();
                clearInterval(interval);
              }
            }
          }, 5);
        });
      });
      // Return a promise that resolves when all the trap containers are able to receive focus
      return Promise.all(results);
    },
  });

  openButton.addEventListener("click", trap.activate);
  closeButton.addEventListener("click", trap.deactivate);

  // openButton.addEventListener("click", () => activateFocusTrap(trap, modalElement));
  // closeButton.addEventListener("click", () => deactivateFocusTrap(trap, modalElement));

  // modalElement.inert = true;

  return trap;
}

function activateFocusTrap(trap, modalElement) {
  // modalElement.inert = false;
  trap.activate();
}

function deactivateFocusTrap(trap, modalElement) {
  trap.deactivate();
  // modalElement.inert = true;
}

function createOpenModalFunction(modalElement, customOnActivateFunction) {
  return () => {
    modalCheckAndCallFunction(customOnActivateFunction);
  }
}

function createCloseModalFunction(modalElement, customOnDeactivateFunction) {
  return () => {
    modalCheckAndCallFunction(customOnDeactivateFunction);
  }
}

function createPostCloseModalFunction(openButton, customOnPostDeactivateFunction) {
  return () => {
    // Leads to problems apparently
    // openButton.focus();

    modalCheckAndCallFunction(customOnPostDeactivateFunction);
  }
}

function modalCheckAndCallFunction(checkedFunction) {
  if(checkedFunction) {
    checkedFunction();
  }
}
