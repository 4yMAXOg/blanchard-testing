/*!
* focus-trap 6.7.1
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tabbable')) :
  typeof define === 'function' && define.amd ? define(['exports', 'tabbable'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global.focusTrap;
    var exports = global.focusTrap = {};
    factory(exports, global.tabbable);
    exports.noConflict = function () { global.focusTrap = current; return exports; };
  })());
})(this, (function (exports, tabbable) { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var activeFocusTraps = function () {
    var trapQueue = [];
    return {
      activateTrap: function activateTrap(trap) {
        if (trapQueue.length > 0) {
          var activeTrap = trapQueue[trapQueue.length - 1];

          if (activeTrap !== trap) {
            activeTrap.pause();
          }
        }

        var trapIndex = trapQueue.indexOf(trap);

        if (trapIndex === -1) {
          trapQueue.push(trap);
        } else {
          // move this existing trap to the front of the queue
          trapQueue.splice(trapIndex, 1);
          trapQueue.push(trap);
        }
      },
      deactivateTrap: function deactivateTrap(trap) {
        var trapIndex = trapQueue.indexOf(trap);

        if (trapIndex !== -1) {
          trapQueue.splice(trapIndex, 1);
        }

        if (trapQueue.length > 0) {
          trapQueue[trapQueue.length - 1].unpause();
        }
      }
    };
  }();

  var isSelectableInput = function isSelectableInput(node) {
    return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
  };

  var isEscapeEvent = function isEscapeEvent(e) {
    return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
  };

  var isTabEvent = function isTabEvent(e) {
    return e.key === 'Tab' || e.keyCode === 9;
  };

  var delay = function delay(fn) {
    return setTimeout(fn, 0);
  }; // Array.find/findIndex() are not supported on IE; this replicates enough
  //  of Array.findIndex() for our needs


  var findIndex = function findIndex(arr, fn) {
    var idx = -1;
    arr.every(function (value, i) {
      if (fn(value)) {
        idx = i;
        return false; // break
      }

      return true; // next
    });
    return idx;
  };
  /**
   * Get an option's value when it could be a plain value, or a handler that provides
   *  the value.
   * @param {*} value Option's value to check.
   * @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
   * @returns {*} The `value`, or the handler's returned value.
   */


  var valueOrHandler = function valueOrHandler(value) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return typeof value === 'function' ? value.apply(void 0, params) : value;
  };

  var getActualTarget = function getActualTarget(event) {
    // NOTE: If the trap is _inside_ a shadow DOM, event.target will always be the
    //  shadow host. However, event.target.composedPath() will be an array of
    //  nodes "clicked" from inner-most (the actual element inside the shadow) to
    //  outer-most (the host HTML document). If we have access to composedPath(),
    //  then use its first element; otherwise, fall back to event.target (and
    //  this only works for an _open_ shadow DOM; otherwise,
    //  composedPath()[0] === event.target always).
    return event.target.shadowRoot && typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target;
  };

  var createFocusTrap = function createFocusTrap(elements, userOptions) {
    var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;

    var config = _objectSpread2({
      returnFocusOnDeactivate: true,
      escapeDeactivates: true,
      delayInitialFocus: true
    }, userOptions);

    var state = {
      // @type {Array<HTMLElement>}
      containers: [],
      // list of objects identifying the first and last tabbable nodes in all containers/groups in
      //  the trap
      // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
      //  is active, but the trap should never get to a state where there isn't at least one group
      //  with at least one tabbable node in it (that would lead to an error condition that would
      //  result in an error being thrown)
      // @type {Array<{ container: HTMLElement, firstTabbableNode: HTMLElement|null, lastTabbableNode: HTMLElement|null }>}
      tabbableGroups: [],
      nodeFocusedBeforeActivation: null,
      mostRecentlyFocusedNode: null,
      active: false,
      paused: false,
      // timer ID for when delayInitialFocus is true and initial focus in this trap
      //  has been delayed during activation
      delayInitialFocusTimer: undefined
    };
    var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

    var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
      return configOverrideOptions && configOverrideOptions[optionName] !== undefined ? configOverrideOptions[optionName] : config[configOptionName || optionName];
    };

    var containersContain = function containersContain(element) {
      return !!(element && state.containers.some(function (container) {
        return container.contains(element);
      }));
    };
    /**
     * Gets the node for the given option, which is expected to be an option that
     *  can be either a DOM node, a string that is a selector to get a node, `false`
     *  (if a node is explicitly NOT given), or a function that returns any of these
     *  values.
     * @param {string} optionName
     * @returns {undefined | false | HTMLElement | SVGElement} Returns
     *  `undefined` if the option is not specified; `false` if the option
     *  resolved to `false` (node explicitly not given); otherwise, the resolved
     *  DOM node.
     * @throws {Error} If the option is set, not `false`, and is not, or does not
     *  resolve to a node.
     */


    var getNodeForOption = function getNodeForOption(optionName) {
      var optionValue = config[optionName];

      if (typeof optionValue === 'function') {
        for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          params[_key2 - 1] = arguments[_key2];
        }

        optionValue = optionValue.apply(void 0, params);
      }

      if (!optionValue) {
        if (optionValue === undefined || optionValue === false) {
          return optionValue;
        } // else, empty string (invalid), null (invalid), 0 (invalid)


        throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
      }

      var node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

      if (typeof optionValue === 'string') {
        node = doc.querySelector(optionValue); // resolve to node, or null if fails

        if (!node) {
          throw new Error("`".concat(optionName, "` as selector refers to no known node"));
        }
      }

      return node;
    };

    var getInitialFocusNode = function getInitialFocusNode() {
      var node = getNodeForOption('initialFocus'); // false explicitly indicates we want no initialFocus at all

      if (node === false) {
        return false;
      }

      if (node === undefined) {
        // option not specified: use fallback options
        if (containersContain(doc.activeElement)) {
          node = doc.activeElement;
        } else {
          var firstTabbableGroup = state.tabbableGroups[0];
          var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode; // NOTE: `fallbackFocus` option function cannot return `false` (not supported)

          node = firstTabbableNode || getNodeForOption('fallbackFocus');
        }
      }

      if (!node) {
        throw new Error('Your focus-trap needs to have at least one focusable element');
      }

      return node;
    };

    var updateTabbableNodes = function updateTabbableNodes() {
      state.tabbableGroups = state.containers.map(function (container) {
        var tabbableNodes = tabbable.tabbable(container);

        if (tabbableNodes.length > 0) {
          return {
            container: container,
            firstTabbableNode: tabbableNodes[0],
            lastTabbableNode: tabbableNodes[tabbableNodes.length - 1]
          };
        }

        return undefined;
      }).filter(function (group) {
        return !!group;
      }); // remove groups with no tabbable nodes
      // throw if no groups have tabbable nodes and we don't have a fallback focus node either

      if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus') // returning false not supported for this option
      ) {
        throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
      }
    };

    var tryFocus = function tryFocus(node) {
      if (node === false) {
        return;
      }

      if (node === doc.activeElement) {
        return;
      }

      if (!node || !node.focus) {
        tryFocus(getInitialFocusNode());
        return;
      }

      node.focus({
        preventScroll: !!config.preventScroll
      });
      state.mostRecentlyFocusedNode = node;

      if (isSelectableInput(node)) {
        node.select();
      }
    };

    var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
      var node = getNodeForOption('setReturnFocus', previousActiveElement);
      return node ? node : node === false ? false : previousActiveElement;
    }; // This needs to be done on mousedown and touchstart instead of click
    // so that it precedes the focus event.


    var checkPointerDown = function checkPointerDown(e) {
      var target = getActualTarget(e);

      if (containersContain(target)) {
        // allow the click since it ocurred inside the trap
        return;
      }

      if (valueOrHandler(config.clickOutsideDeactivates, e)) {
        // immediately deactivate the trap
        trap.deactivate({
          // if, on deactivation, we should return focus to the node originally-focused
          //  when the trap was activated (or the configured `setReturnFocus` node),
          //  then assume it's also OK to return focus to the outside node that was
          //  just clicked, causing deactivation, as long as that node is focusable;
          //  if it isn't focusable, then return focus to the original node focused
          //  on activation (or the configured `setReturnFocus` node)
          // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
          //  which will result in the outside click setting focus to the node
          //  that was clicked, whether it's focusable or not; by setting
          //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
          //  on activation (or the configured `setReturnFocus` node)
          returnFocus: config.returnFocusOnDeactivate && !tabbable.isFocusable(target)
        });
        return;
      } // This is needed for mobile devices.
      // (If we'll only let `click` events through,
      // then on mobile they will be blocked anyways if `touchstart` is blocked.)


      if (valueOrHandler(config.allowOutsideClick, e)) {
        // allow the click outside the trap to take place
        return;
      } // otherwise, prevent the click


      e.preventDefault();
    }; // In case focus escapes the trap for some strange reason, pull it back in.


    var checkFocusIn = function checkFocusIn(e) {
      var target = getActualTarget(e);
      var targetContained = containersContain(target); // In Firefox when you Tab out of an iframe the Document is briefly focused.

      if (targetContained || target instanceof Document) {
        if (targetContained) {
          state.mostRecentlyFocusedNode = target;
        }
      } else {
        // escaped! pull it back in to where it just left
        e.stopImmediatePropagation();
        tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
      }
    }; // Hijack Tab events on the first and last focusable nodes of the trap,
    // in order to prevent focus from escaping. If it escapes for even a
    // moment it can end up scrolling the page and causing confusion so we
    // kind of need to capture the action at the keydown phase.


    var checkTab = function checkTab(e) {
      var target = getActualTarget(e);
      updateTabbableNodes();
      var destinationNode = null;

      if (state.tabbableGroups.length > 0) {
        // make sure the target is actually contained in a group
        // NOTE: the target may also be the container itself if it's tabbable
        //  with tabIndex='-1' and was given initial focus
        var containerIndex = findIndex(state.tabbableGroups, function (_ref) {
          var container = _ref.container;
          return container.contains(target);
        });

        if (containerIndex < 0) {
          // target not found in any group: quite possible focus has escaped the trap,
          //  so bring it back in to...
          if (e.shiftKey) {
            // ...the last node in the last group
            destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
          } else {
            // ...the first node in the first group
            destinationNode = state.tabbableGroups[0].firstTabbableNode;
          }
        } else if (e.shiftKey) {
          // REVERSE
          // is the target the first tabbable node in a group?
          var startOfGroupIndex = findIndex(state.tabbableGroups, function (_ref2) {
            var firstTabbableNode = _ref2.firstTabbableNode;
            return target === firstTabbableNode;
          });

          if (startOfGroupIndex < 0 && state.tabbableGroups[containerIndex].container === target) {
            // an exception case where the target is the container itself, in which
            //  case, we should handle shift+tab as if focus were on the container's
            //  first tabbable node, and go to the last tabbable node of the LAST group
            startOfGroupIndex = containerIndex;
          }

          if (startOfGroupIndex >= 0) {
            // YES: then shift+tab should go to the last tabbable node in the
            //  previous group (and wrap around to the last tabbable node of
            //  the LAST group if it's the first tabbable node of the FIRST group)
            var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
            var destinationGroup = state.tabbableGroups[destinationGroupIndex];
            destinationNode = destinationGroup.lastTabbableNode;
          }
        } else {
          // FORWARD
          // is the target the last tabbable node in a group?
          var lastOfGroupIndex = findIndex(state.tabbableGroups, function (_ref3) {
            var lastTabbableNode = _ref3.lastTabbableNode;
            return target === lastTabbableNode;
          });

          if (lastOfGroupIndex < 0 && state.tabbableGroups[containerIndex].container === target) {
            // an exception case where the target is the container itself, in which
            //  case, we should handle tab as if focus were on the container's
            //  last tabbable node, and go to the first tabbable node of the FIRST group
            lastOfGroupIndex = containerIndex;
          }

          if (lastOfGroupIndex >= 0) {
            // YES: then tab should go to the first tabbable node in the next
            //  group (and wrap around to the first tabbable node of the FIRST
            //  group if it's the last tabbable node of the LAST group)
            var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;

            var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
            destinationNode = _destinationGroup.firstTabbableNode;
          }
        }
      } else {
        // NOTE: the fallbackFocus option does not support returning false to opt-out
        destinationNode = getNodeForOption('fallbackFocus');
      }

      if (destinationNode) {
        e.preventDefault();
        tryFocus(destinationNode);
      } // else, let the browser take care of [shift+]tab and move the focus

    };

    var checkKey = function checkKey(e) {
      if (isEscapeEvent(e) && valueOrHandler(config.escapeDeactivates, e) !== false) {
        e.preventDefault();
        trap.deactivate();
        return;
      }

      if (isTabEvent(e)) {
        checkTab(e);
        return;
      }
    };

    var checkClick = function checkClick(e) {
      if (valueOrHandler(config.clickOutsideDeactivates, e)) {
        return;
      }

      var target = getActualTarget(e);

      if (containersContain(target)) {
        return;
      }

      if (valueOrHandler(config.allowOutsideClick, e)) {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();
    }; //
    // EVENT LISTENERS
    //


    var addListeners = function addListeners() {
      if (!state.active) {
        return;
      } // There can be only one listening focus trap at a time


      activeFocusTraps.activateTrap(trap); // Delay ensures that the focused element doesn't capture the event
      // that caused the focus trap activation.

      state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function () {
        tryFocus(getInitialFocusNode());
      }) : tryFocus(getInitialFocusNode());
      doc.addEventListener('focusin', checkFocusIn, true);
      doc.addEventListener('mousedown', checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener('touchstart', checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener('click', checkClick, {
        capture: true,
        passive: false
      });
      doc.addEventListener('keydown', checkKey, {
        capture: true,
        passive: false
      });
      return trap;
    };

    var removeListeners = function removeListeners() {
      if (!state.active) {
        return;
      }

      doc.removeEventListener('focusin', checkFocusIn, true);
      doc.removeEventListener('mousedown', checkPointerDown, true);
      doc.removeEventListener('touchstart', checkPointerDown, true);
      doc.removeEventListener('click', checkClick, true);
      doc.removeEventListener('keydown', checkKey, true);
      return trap;
    }; //
    // TRAP DEFINITION
    //


    trap = {
      activate: function activate(activateOptions) {
        if (state.active) {
          return this;
        }

        var onActivate = getOption(activateOptions, 'onActivate');
        var onPostActivate = getOption(activateOptions, 'onPostActivate');
        var checkCanFocusTrap = getOption(activateOptions, 'checkCanFocusTrap');

        if (!checkCanFocusTrap) {
          updateTabbableNodes();
        }

        state.active = true;
        state.paused = false;
        state.nodeFocusedBeforeActivation = doc.activeElement;

        if (onActivate) {
          onActivate();
        }

        var finishActivation = function finishActivation() {
          if (checkCanFocusTrap) {
            updateTabbableNodes();
          }

          addListeners();

          if (onPostActivate) {
            onPostActivate();
          }
        };

        if (checkCanFocusTrap) {
          checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
          return this;
        }

        finishActivation();
        return this;
      },
      deactivate: function deactivate(deactivateOptions) {
        if (!state.active) {
          return this;
        }

        clearTimeout(state.delayInitialFocusTimer); // noop if undefined

        state.delayInitialFocusTimer = undefined;
        removeListeners();
        state.active = false;
        state.paused = false;
        activeFocusTraps.deactivateTrap(trap);
        var onDeactivate = getOption(deactivateOptions, 'onDeactivate');
        var onPostDeactivate = getOption(deactivateOptions, 'onPostDeactivate');
        var checkCanReturnFocus = getOption(deactivateOptions, 'checkCanReturnFocus');

        if (onDeactivate) {
          onDeactivate();
        }

        var returnFocus = getOption(deactivateOptions, 'returnFocus', 'returnFocusOnDeactivate');

        var finishDeactivation = function finishDeactivation() {
          delay(function () {
            if (returnFocus) {
              tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
            }

            if (onPostDeactivate) {
              onPostDeactivate();
            }
          });
        };

        if (returnFocus && checkCanReturnFocus) {
          checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
          return this;
        }

        finishDeactivation();
        return this;
      },
      pause: function pause() {
        if (state.paused || !state.active) {
          return this;
        }

        state.paused = true;
        removeListeners();
        return this;
      },
      unpause: function unpause() {
        if (!state.paused || !state.active) {
          return this;
        }

        state.paused = false;
        updateTabbableNodes();
        addListeners();
        return this;
      },
      updateContainerElements: function updateContainerElements(containerElements) {
        var elementsAsArray = [].concat(containerElements).filter(Boolean);
        state.containers = elementsAsArray.map(function (element) {
          return typeof element === 'string' ? doc.querySelector(element) : element;
        });

        if (state.active) {
          updateTabbableNodes();
        }

        return this;
      }
    }; // initialize container elements

    trap.updateContainerElements(elements);
    return trap;
  };

  exports.createFocusTrap = createFocusTrap;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=focus-trap.umd.js.map
