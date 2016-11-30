/**/
;"use strict";
window.demoLib = window.demoLib || {};

// Simple pager class, one-to-one with a button capture
demoLib.simplePager = function () {
  let currentPage = 0;
  let maxPage = 0;
  let eventEmitter = document.querySelector('body');
  let prevElement;
  let nextElement;
  let customData = {};
  let eventPrefix = '';

  document.addEventListener('application.init', () => {onInit();});
  const onInit = () => {
    if (prevElement) {
      prevElement.addEventListener('click', (e) => {
        e.preventDefault();
        pagePrev();
      })
    }
    if (nextElement) {

      nextElement.addEventListener('click', (e) => {
        e.preventDefault();
        pageNext();
      })
    }
  };

  const configure = (options) => {
    // WHat is emitting the event
    if (options.eventEmitter) {
      eventEmitter = options.eventEmitter;
    }

    if (options.prevButton) {
      prevElement = options.prevButton;
    }

    if (options.nextButton) {
      nextElement = options.nextButton;
    }

    if (options.eventPrefix) {
      eventPrefix = '' + options.eventPrefix;
    }
  };

  const setCurrentPage = (value) => {
    if (value < 1) {
      value = 1;
    }
    if (value > maxPage) {
      value = maxPage;
    }
    currentPage = value;

  };

  const setMaxPage = (value) => {
    if (value < 1) {
      value = 1;
    }
    maxPage = value;
    if (currentPage > maxPage) {
      currentPage = maxPage;
    }
  };

  const setRange = (currentPage, maxPage) => {
    setMaxPage(maxPage);
    setCurrentPage(currentPage);
    generateEvent('page-change');
  };

  const canPagePrevious = () => {
    return currentPage > 1;
  };

  const canPageNext = () => {
    return currentPage < maxPage;
  };

  const generateEvent = (name, detail) => {

    const event = new CustomEvent(eventPrefix + '.' + name, {
      'bubbles': true,
      'cancelable': true,
      'detail': Object.assign({
        'pager': self,
        'currentPage': currentPage,
        'maxPage': maxPage,
        'data': customData
      }, detail)
    });

    eventEmitter.dispatchEvent(event);
  };


  const pageNext = () => {
    if (canPageNext()) {
      generateEvent('page-next');
    }
  };

  const pagePrev = () => {
    if (canPagePrevious()) {
      generateEvent('page-prev');
    }
  };

  // Public API
  const self = {
    get currentPage() {
      return currentPage;
    },
    set currentPage(value) {
      setRange(value, maxPage);
    },
    get maxPage() {
      return maxPage;
    },
    set maxPage(value) {
      setRange(currentPage, value);
    },
    get data() {
      return customData;
    },
    'setRange': (currentPage, maxPage) => {
      setRange(currentPage, maxPage);
    },
    'configure': (options) => {
      configure(options);
    },
    'pageNext': () => {
      pageNext();
    },
    'pagePrevious': () => {
      pagePrev();
    },
  };
  return self;
};