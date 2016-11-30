/**/
;"use strict";
window.demoLib = window.demoLib || {};

demoLib.cssAccessor = function () {
  /**
   * Convenience function hide an element
   * @param element
   */
  const hide = (element) => {
    element.style ? element.style.display = 'none' : undefined;
  };

  /**
   * Convenience function to show an element
   * @param element
   */
  const unhide = (element) => {
    element.style ? element.style.display = '' : undefined;
  };

  /**
   * Public API
   */
  return {
    "hide": hide,
    "unhide": unhide
  };
};

