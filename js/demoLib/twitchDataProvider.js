/**/
;"use strict";
window.demoLib = window.demoLib || {};

/**
 * Data Provider - realized from twitch.tv
 *
 * @type {{configure, search, searchCallback}}
 */
demoLib.twitchDataProvider = function (callbackManager) {
  let apiVersion = 3;
  let clientId;
  let jsonCallbackManager = callbackManager;
  let pageSize = 10;
  const MAX_PAGE_SIZE = 100; // api limit

  // Generates a URL for use in a script tag
  const generateUrl = (searchQuery, page, callback) => {
    let url = 'https://api.twitch.tv/kraken/search/streams';
    let query = [];
    query.push('q=' + encodeURIComponent(searchQuery));
    query.push('client_id=' + encodeURIComponent(clientId));
    query.push('api_version=' + apiVersion);
    query.push('callback=' + encodeURIComponent(callback));
    query.push('limit=' + pageSize);
    query.push('offset=' + (pageSize * page));
    url += '?' + query.join('&');
    return url;
  };

  // Configuration processor
  const configureWith = (options) => {
    if (options.callbackManager) {
      jsonCallbackManager = options.callbackManager;
    }
    if (options.pageSize) {
      // Max Range
      pageSize = Math.min(MAX_PAGE_SIZE, options.pageSize);
      // Min Range
      pageSize = Math.max(0, pageSize);
    }

    if (options.clientId) {
      clientId = options.clientId;
    }
  };

  const search = (() => {
    // Executes a search against the API for a given page.
    const execute = (query, page) => {
      let scriptElement = document.createElement('script');
      let context = {
        'query': query,
        'page': page,
        'pageSize': pageSize,
        'domElement': scriptElement,
      };
      // Generate a instance callback for the script tag
      let callback = jsonCallbackManager.create(process, context);
      let targetUrl = generateUrl(query, page, callback);

      // If the query is empty, dispatch to error
      if (!query) {
        dispatchError({}, context);
        return;
      }
      // Dispatch the request
      scriptElement.setAttribute('src', targetUrl);
      document.querySelector('head').appendChild(scriptElement);
    };

    // Processes the data as it's returned from the API instance.
    const process = (data, context) => {
      // Clean up after our self
      if (context.domElement) {
        context.domElement.parentNode.removeChild(context.domElement);
      }

      // Twitch API Data response
      if (!data) {
        dispatchError({});
        return;
      }
      // API returned an error status
      if (data.error) {
        dispatchError(data, context);
        return;
      }

      // Dispatch result set
      dispatchSuccess(data, context);
    };

    // Search Data event emitter function
    const dispatch = (type, data, context) => {
      const event = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: {
          data: data,
          context: context
        }
      });

      // Event originates at <head>
      document.querySelector('head').dispatchEvent(event);
    };

    // Search Data Event
    const dispatchSuccess = (data, context) => {
      // To Do: Normalize the response data to separate from data source
      //        rather than return the raw response
      dispatch('search-data-load', data, context);
    };

    // Search Data Error Event
    const dispatchError = (data, context) => {
      dispatch('search-data-load-error', data, context);
    };

    return {
      'execute': (query, page) => { execute(query, page); }
    }
  })();


  return {
    'configure': (options) => {
      configureWith(options);
    },
    'search': (query, page) => {
      search.execute(query, page);
    }
  };
};
