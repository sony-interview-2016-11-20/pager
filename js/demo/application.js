'use strict';
/**
 * Application namespace
 */
window.demo = window.demo || {};

// The main application
// It's a bit of a hack in that the view is directly accessed from the use-case events
// Since they should all be configured to listen to a message pump for data actions
// That way each view element will be fully able to implement it's own private logic
// that doesn't need to be orchestrated by the application code.
demo.app = function (options) {
  // Data Provider.
  let dataProvider;
  let callbackManager;
  let searchResultPager;
  let searchResults;
  let delayedInit = [];
  let applicationBootstrap = false;

  const configure = (options) => {
    options.dataProvider && (dataProvider = options.dataProvider);
    options.callbackManager && (callbackManager = options.callbackManager);
    options.searchResultPager && (searchResultPager = options.searchResultPager);
  };
  if (options) {
    configure(options);
  }

  // Configure dependencies
  const init = () => {
    delayedInit.forEach((callback) => {
      callback();
    });
    document.dispatchEvent(new CustomEvent('application.init'));
  };

  const bootstrap = () => {
    if (applicationBootstrap) {
      return;
    }
    applicationBootstrap = true;

    document.dispatchEvent(new CustomEvent('application.bootstrap'));
    init();
  };


  // All Use Case Wiring could be anonymous, as they are never referenced outside themeselves
  // Giving names solely to make finding the correct handlers easier.
  // Use Case 1:  Search Event trigger Data Load.
  const searchEventTriggerDataLoad = (() => {
    const listener = (e) => {
      const query = e.detail.searchQuery;
      dataProvider.search(query, 0);
    };

    delayedInit.push(() => {
      document.addEventListener('search', listener)
    });
    return {};
  })();


  // Use Case 2: Search Result Failure
  // Translate to a known error message.
  const searchResultDataLoadFailure = (() => {
    const listener = (e) => {
      let data = e.detail.data || {};
      let message = "[" + (new Date()).toLocaleString() + ']';
      message += ' There was an error executing your search.';
      if (data.message) {
        message += ' [' + data.message + ']';
      }
      data.message = message;
    };
    delayedInit.push(() => {
      document.addEventListener('search-data-load-error', listener);
    });
    return {};
  })();


  // Use Case 3: Search Result Success
  // - on Success
  // - Set total search results
  // - Set paging information (correct if now out of range)
  // - Set results
  const searchResultDataLoadSuccess = (() => {
    const updatePager = (currentPage, maxPage, query) => {
      searchResultPager.maxPage = maxPage;
      searchResultPager.currentPage = currentPage;
      searchResultPager.data.searchQuery = query;
    };
    const listener = (e) => {
      let context = e.detail.context;
      let data = e.detail.data || {};

      searchResults = {
        query: context.query,
        count: data._total,
        currentPage: context.page,
        maxPage: Math.ceil(data._total / context.pageSize),
        resultSet: data.streams,
      };
      context.searchResults = searchResults;
      updatePager(searchResults.currentPage + 1, searchResults.maxPage, searchResults.query);
    };
    delayedInit.push(() => {
      document.addEventListener('search-data-load', listener);
    });
    return {};
  })();



  // Use Case 4: Previous Page Button
  // - Trigger search for current result-set query, previous page
  const searchResultNextPage = (() => {
    const listener = (e) => {
      const query = e.detail.data.searchQuery;
      let currentSearchPage = e.detail.currentPage - 1;
      dataProvider.search(query, currentSearchPage + 1);
    };
    delayedInit.push(() => {
      document.addEventListener('search.page-next', listener);
    });
    return {};
  })();

  // Use Case 5: Next Page Button
  // - Trigger search for current result-set query, next page
  const searchResultPreviousPage = (() => {
    const listener = (e) => {
      const query = e.detail.data.searchQuery;
      let currentSearchPage = e.detail.currentPage - 1;
      dataProvider.search(query, currentSearchPage - 1);
    };
    delayedInit.push(() => {
      document.addEventListener('search.page-prev', listener);
    });
    return {};
  })();


  let _serviceLocator;

  return {
    'bootstrap': () => {
      init();

    },
    'run': () => {

    },
    get serviceLocator() {return _serviceLocator;},
    set serviceLocator(value) {_serviceLocator = value;}
  };
};
