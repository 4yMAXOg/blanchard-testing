// Requires my-focus-control.js
//
// Options

// options.tabListSelector
// options.tabLists - DOM element with tabs nodeList
// options.tabSelector
// options.tabs - Double array of tabs - [[tab1, tab2], ]
// options.tabPanelSelector
// options.tabIdPrefix
// options.orientation
// options.active

class MyTabs {
  constructor (containerSelector, options) {
    // Container
    this.container = document.querySelector(containerSelector);

    // Tab lists
    if(options.tabListSelector) {
      this.tabLists = this.container.querySelectorAll(options.tabListSelector);
    } else if(options.tabLists) {
      this.tabLists = options.tabLists;
    } else {
      throw "tabListSelector or tabLists should be provided";
    }
    this.tabLists.forEach((tabList) => {
      tabList.setAttribute("role", "tablist");
    });

    // Tabs
    if(options.tabSelector) {
      this.tabLists.forEach((list) => {
        list.tabs = list.querySelectorAll(options.tabSelector);
      });
    } else if(options.tabs) {
      this.tabLists.forEach((list, i) => {
        list.tabs = tabs[i];
      });
    } else {
      throw "tabSelector or tabs should be provided";
    }

    // Tab prefix
    if(options.tabIdPrefix) {
      this.tabIdPrefix = options.tabIdPrefix;
    } else {
      this.tabIdPrefix = MyTabs.generateIdPrefix();
    }

    // Tabs init
    this.tabLists.forEach((list, i) => {
      list.tabs.forEach((tab, j) => {
        tab.setAttribute("role", "tab");

        let panelHref = tab.dataset.panel;
        tab.setAttribute("aria-controls", panelHref);
        tab.setAttribute("aria-selected", false);
        tab.id = this.tabIdPrefix + i + "-" + j;

        let panel = document.querySelector(panelHref);
        panel.setAttribute("aria-labeledby", tab.id);
      });
    });

    // Tab panels
    if(options.tabPanelSelector) {
      this.tabPanels = this.container.querySelectorAll(options.tabPanelSelector);
    } else {
      this.tabPanels = [];

      this.tabLists.forEach((list) => {
        list.tabs.forEach((tab) => {
          let id = tab.dataset.panel;
          let panel = document.querySelector(id);

          if(!this.tabPanels.includes(panel)) {
            this.tabPanels.push(panel);
          }
        });
      });
    }
    this.tabPanels.forEach((panel) => {
      panel.setAttribute("role", "tabpanel");
    });

    this.focusControl = [];
    this.tabLists.forEach((list, index) => {
      this.focusControl.push(new FocusControl({
        container: list, 
        items: list.tabs, 
        orientation: options.orientation, 
      }));
    });

    // Disable all content
    this.tabPanels.forEach((panel) => {
      panel.style.display = "none";
    });

    // Enable first content
    let panel;

    if(options.active) {
      this.activatePanel(options.active);
    } else {
      this.activatePanel(this.tabs[0]);
    }

    this.tabLists.forEach((list) => {
      list.tabs.forEach((element) => {
        element.addEventListener("click", (event) => {
          this.tabClick(event);
        });
      });
    });
  }

  static generateIdPrefix() {
    let prefix = "tab-";

    if(!(document.querySelector('[id^="' + prefix +'"]') == null)) {
      prefix = Date.now() + "-tab-";
    }

    return prefix;
  }

  tabClick(event) {
    event.preventDefault();

    this.deactivatePanel();

    this.activatePanel(event.currentTarget);
  }

  deactivatePanel() {
    this.activeTab.setAttribute("aria-selected", false);
    this.activeTab.classList.remove("is-activated");
    this.active.style.display = "none";
  }

  activatePanel(activatedTab) {
    this.activeTab = activatedTab;
    this.activeTab.setAttribute("aria-selected", true);
    this.activeTab.classList.add("is-activated");

    let id = this.activeTab.dataset.panel;
    let panel = document.querySelector(id);

    this.active = panel;
    this.active.style.display = "initial";
  }
}
