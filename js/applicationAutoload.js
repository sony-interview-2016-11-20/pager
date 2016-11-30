/**/
"use strict";

window.demo = window.demo || {};
demo.serviceDefinitions = {
  'application': (locator) => {
    const options = {
      dataProvider: locator.get('searchDataProvider'),
      callbackManager: locator.get('callbackManager'),
      searchResultPager: locator.get('searchResultPager')
    };

    return new demo.app(options);
  },

  'callbackManager': () => {
    const callbackManager = new demoLib.jsonCallbackManager('demo.callbackManager');
    demo.callbackManager = callbackManager;
    return callbackManager;
  },

  'cssAccessor': () => {
    return new demoLib.cssAccessor();
  },

  'searchDataProvider': (locator) => {
    const callbackManager = locator.get('callbackManager');
    const twitchProvider = new demoLib.twitchDataProvider(callbackManager);
    twitchProvider.configure({
      callbackManager: callbackManager,
      clientId: '73qn4wj6jtxqhf1q13gl3i436lzkuux',
      pageSize: 10,
    });
    return twitchProvider;
  },

  'searchResultPager': () => {
    const pager = new demoLib.simplePager();
    pager.configure({
      'eventPrefix': 'search',
      'prevButton': document.querySelector('#top-counter\\.previous-page'),
      "nextButton": document.querySelector('#top-counter\\.next-page'),
    });
    return pager;
  },

  'searchResultRenderer': () => {
    const renderer = new demo.searchResultRenderer();
    renderer.configure({
      templateSelector: '.template.search-result-entry'
    });
    return renderer;
  },

  'view': (locator) => {
    const options = {
      cssAccessor: locator.get('cssAccessor'),
      searchResultRenderer: locator.get('searchResultRenderer')
    };
    const view = new demo.view(options);
    return view;
  }
};


document.addEventListener('DOMContentLoaded', () => {
  let locator = new demoLib.serviceContainer();
  locator.configure({
    factories: demo.serviceDefinitions
  });
  // locator.selfRef = locator;
  let application = locator.get('application');
  application.serviceLocator = locator;
  // Make this visible for debugging
  window.application = application;
  // Load modules
  locator.get('view');

  application.bootstrap();
  // locator.get('view').init();
  application.run();
});
