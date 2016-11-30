/**/;"use strict";
window.demoLib = window.demoLib || {};

/**
 *
 * @param globalName
 * @returns {{create: (function(*=, *=))}}
 */
demoLib.jsonCallbackManager = function (globalName) {
  // Current counter
  let _counter = 0;
  // Callback collection
  let _fn = {};
  // Global Name
  let _globalName = globalName;


  /**
   * Returns the next available Callback ID
   * @returns {string}
   */
  const getNextId = () => {
    return "_" + (++_counter);
  };


  /**
   * Create a new callback proxy
   * @param callback
   * @param context
   * @returns {string} Callback ID
   */
  const createCallback = (callback, context) => {
    const _id = getNextId();

    // Create the global-level callback
    _fn[_id] = (payload) => {

      // It's executed, remove it.
      delete _fn[_id];

      // Delegate the callback back to the original caller, with context
      callback(payload, context);
    };

    // Return the global callback name
    return _globalName + '.callback.' + _id + '';
  };


  // Public API
  return {
    // Create a new callback, returns a number
    'create': (callback, context) => {
      return createCallback(callback, context);
    },

    // Global Callback handler
    get 'callback'() {
      return _fn;
    }
  };
};
