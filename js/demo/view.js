'use strict';
window.demo = window.demo || {};
window.demo.view = window.demo.view || {};

// View specific event handlers
demo.view = function (options) {
  let cssAccessor;
  let searchResultRenderer;
  let delayedInit = [];

  // Bind to application init event
  document.addEventListener('application.init', () => {
    init();
  });


  const configure = (options) => {
    if (options.cssAccessor) {
      cssAccessor = options.cssAccessor;
    }
    if (options.searchResultRenderer) {
      searchResultRenderer = options.searchResultRenderer;
    }
  };

  if (options) {
    configure(options);
  }


  const init = () => {
    delayedInit.forEach((callback) => {
      callback();
    });
  };


  const fetchElement = (selector) => {
    // This can be cached in a local variable, but hoping that the browser is smart.
    return document.querySelector(selector);
  };

  // Use Case 1:
  // Search Box Submit triggers Search event
  const searchBox = (() => {
    const listener = (e) => {
      const event = new CustomEvent('search', {
        'bubbles': true,
        'cancelable': true,
        detail: {
          searchQuery: fetchElement('#search-query').value
        }
      });
      e.preventDefault();
      fetchElement('#search-form').dispatchEvent(event);
    };
    delayedInit.push(() => {
      fetchElement('#search-form').addEventListener('submit', listener)
    });
  })();

  // Message Box: Use Case 1
  // On Data Load Error, display error message.
  const topMessageBoxDisplaysErrorMessage = (() => {
    const listener = (e) => {
      const data = e.detail.data || {};
      fetchElement('#message').innerText = data.message;
    };
    delayedInit.push(() => {
      document.addEventListener('search-data-load-error', listener)
    });
  })();

  // Message Box: Use Case 2
  const topMessageBoxClearsOnSuccess = (() => {
    const listener = () => {
      fetchElement('#message').innerText = '';
    };
    delayedInit.push(() => {
      document.addEventListener('search-data-load', listener)
    });
  })();

  // Message Box: Use Case 3
  // Display if it has content
  // = on Empty Content then hide
  // = on Content unhide
  const topMessageBoxContentDisplay = (() => {
    const listener = (records, observer) => {
      observer.takeRecords();
      // Check if the element has content
      let element = document.querySelector('#message');
      const hasContent = element.innerText;
      hasContent ? cssAccessor.unhide(element) : cssAccessor.hide(element);
    };

    const init = () => {
      const observer = new MutationObserver(listener);
      observer.observe(document.querySelector('#message'), {
        subtree: true,
        characterData: true,
        childList: true
      });
    };
    delayedInit.push(init);
  })();


  // Result Totals: Use Case 1
  // On Successful data Load: Update Counts
  const onSearchDataUpdateTotalCounter = (() => {
    const listener = (e) => {
      const count = e.detail.context.searchResults.count;
      fetchElement('#result-total-count').innerText = count.toLocaleString();
    };
    delayedInit.push(() => {
      document.addEventListener('search-data-load', listener)
    });
  })();


  // Result Set: Use Case 1 - Display Results
  const onSearchDataRenderResults = (() => {
    const listener = (e) => {
      const resultSet = e.detail.context.searchResults.resultSet;
      const resultSetElement = fetchElement('#search-results');
      // Clear the container
      resultSetElement.innerHTML = '';

      // Append all the new results!
      resultSet.forEach((result) => {
        const renderedElement = searchResultRenderer.render(result);
        resultSetElement.appendChild(renderedElement);
      });
    };
    delayedInit.push(() => {
      document.addEventListener('search-data-load', listener);
    });
  })();

  // Pager Element: On Pager Update, update display
  const onPagerChangeUpdateDisplay = (() => {
    const updateText = (currentPage, maxPage) => {
      const pageDisplay = currentPage.toLocaleString() + ' / ' + maxPage.toLocaleString();
      document.querySelector('#top-counter\\.page-count').innerText = pageDisplay;
    };

    const updateButtons = (currentPage, maxPage) => {
      let isActive;
      // Previous
      isActive = currentPage > 1;
      document.querySelector('#top-counter\\.previous-page').classList.toggle('disabled', !isActive);

      // Next
      isActive = currentPage < maxPage;
      document.querySelector('#top-counter\\.next-page').classList.toggle('disabled', !isActive);
    };

    const listener = (e) => {
      updateText(e.detail.currentPage, e.detail.maxPage);
      updateButtons(e.detail.currentPage, e.detail.maxPage);
    };
    delayedInit.push(() => {
      document.addEventListener('search.page-change', listener);
    })
  })();

  return {};
};
