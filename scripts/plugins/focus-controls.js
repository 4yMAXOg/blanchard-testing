// Options
//
// One of two is required
// options.containerSelector
// options.container
//
// One of two is required
// options.itemsSelector
// options.items
//
// options.loop - boolean
// options.orientation - vertical or horizontal(default)
// options.onFocus
// options.onBlur

class FocusControl {
	constructor (options = {}) {
		this.outer = true;
		this.index = 0;
		this.options = options;

		if(options.orientation == "vertical") {
			this.next = ["ArrowDown", "ArrowRight"]
			this.prev = ["ArrowUp", "ArrowLeft"]
		} else {
			this.next = ["ArrowRight"]
			this.prev = ["ArrowLeft"]
		}

		if(options.containerSelector) {
			this.container = document.querySelector(options.containerSelector);
		} 
		else if(options.container) {
			this.container = options.container;
		}
		else {
			throw "FocusControl: containerSelector or container element should be provided";
		}

		if(options.itemsSelector) {
			this.items = this.container.querySelectorAll(options.itemsSelector);
		} 
		else if(options.items) {
			this.items = options.items;
		}
		else {
			throw "FocusControl: itemsSelector or items nodelist should be provided";
		}

		this.loop = options.loop;

		for(let i = 0; i < this.items.length; i++) {
			this.items[i].tabIndex = -1;
			this.items[i].index = i;
			this.items[i].addEventListener("click", this.createItemClicked());
		}

		this.items[this.index].tabIndex = 0;
		this.onFocus = this.createOnFocus(event);
		this.onBlur = this.createOnBlur(event);
		this.keyListener = this.createKeyListener();
		this.addItemListener(this.items[this.index]);
	}

	createItemClicked(event) {
		let control = this;

		return function(event) {
			let oldItem = control.items[control.index];
			let newItem = event.currentTarget;

			control.index = newItem.index;

			control.moveFocus(oldItem, newItem);
		}
	}

	addItemListener(item) {
		item.addEventListener("focus", () => {
			this.onFocus();
		});
		item.addEventListener("blur", () => {
			this.onBlur();
		});
	}

	removeItemListener(item) {
		item.removeEventListener("focus", () => {
			this.onFocus();
		});
		item.removeEventListener("blur", () => {
			this.onBlur();
		});
	}

	addControls() {
		document.addEventListener("keydown", this.keyListener);
	}

	removeControls() {
		document.removeEventListener("keydown", this.keyListener);
	}

	createKeyListener() {
		let control = this;

		return function(event) {
			let focusMoved = false;
			let oldItem = control.items[control.index];

			conditionalMove: if(control.next.includes(event.code)) {
				if(!control.loop) {
					if((control.index + 1) >= control.items.length) {
						break conditionalMove;
					}
				}

				control.index = (control.index + 1) % control.items.length;
				focusMoved = true;
			}
			else if(control.prev.includes(event.code)) {
				if(!control.loop) {
					if((control.index - 1) < 0) {
						break conditionalMove;
					}
				}

				control.index = (control.index - 1 + control.items.length) % control.items.length;
				focusMoved = true;
			}

			if(focusMoved) {
				event.preventDefault();

				let newItem = control.items[control.index];

				control.moveFocus(oldItem, newItem);

				this.outer = false;
				newItem.focus();
			}
		}
	}

	moveFocus(oldItem, newItem) {
				oldItem.tabIndex = -1;
				this.removeItemListener(oldItem);

				newItem.tabIndex = 0;
				this.addItemListener(newItem);
	}

	createOnFocus(event) {
		return function(event) {
			if(this.outer) {
				this.addControls(this);
			}
			this.outer = true;
		}
	}
	createOnBlur(event) {
		return function(event) {
			if(this.outer) {
				this.removeControls(this);
			}
			this.outer = true;
		}
	}
}


