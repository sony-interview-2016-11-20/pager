/**/
;"use strict";
window.demo = window.demo || {};

demo.searchResultRenderer = function () {
  let templateElement;

  // Configuration
  const configure = (options) => {
    if (options.templateSelector) {
      templateElement = document.querySelector(options.templateSelector);
    }
  };

  // Render the template
  const renderData = (data) => {
    const fragment = templateElement.cloneNode(true);
    let description = '[' + data.created_at + '] ' + '[' + data.channel.language + '] ' + data.channel.status;
    fragment.classList.remove('template');
    fragment.querySelector('.stream-title').innerText = data.channel.display_name;
    fragment.querySelector('.stream-title').setAttribute('src', data.channel.url);
    fragment.querySelector('.game-title').innerText = data.channel.game;
    fragment.querySelector('.viewers').innerText = data.viewers.toLocaleString();
    fragment.querySelector('.description').innerText = description;
    fragment.querySelector('.preview-image img').setAttribute('src', data.preview.medium);
    return fragment;
  };

  // Public API
  return {
    'configure': (options) => {
      configure(options);
    },
    'render': (data) => {
      return renderData(data);
    }
  };
};