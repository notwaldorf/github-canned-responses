(function() {
  "use strict";
  var answers;

  // This following code is taken from
  // https://github.com/thieman/github-selfies/blob/master/chrome/selfie.js
  var allowedPaths = [
    // New issues
    /github.com\/[\w\-]+\/[\w\-]+\/issues\/new/,
    // Existing issues (comment)
    /github.com\/[\w\-]+\/[\w\-]+\/issues\/\d+/,
    // New pull request
    /github.com\/[\w\-]+\/[\w\-]+\/compare/,
    // Existing pull requests (comment)
    /github.com\/[\w\-]+\/[\w\-]+\/pull\/\d+/
  ];

  // Inject the code from fn into the page, in an IIFE.
  function inject(fn) {
    var script = document.createElement('script');
    var parent = document.documentElement;
    script.textContent = '('+ fn +')();';
    parent.appendChild(script);
    parent.removeChild(script);
  }

  // Post a message whenever history.pushState is called. GitHub uses
  // pushState to implement page transitions without full page loads.
  // This needs to be injected because content scripts run in a sandbox.
  inject(function() {
    var pushState = history.pushState;
    history.pushState = function on_pushState() {
      window.postMessage('extension:pageUpdated', '*');
      return pushState.apply(this, arguments);
    };
    var replaceState = history.replaceState;
    history.replaceState = function on_replaceState() {
      window.postMessage('extension:pageUpdated', '*');
      return replaceState.apply(this, arguments);
    };
  });

  // Do something when the extension is loaded into the page,
  // and whenever we push/pop new pages.
  window.addEventListener("message", function(event) {
    if (event.data === 'extension:pageUpdated') {
      addAnswerButton();
    }
  });

  window.addEventListener("popstate", load);
  load();

  // End of code from https://github.com/thieman/github-selfies/blob/master/chrome/selfie.js

  function load() {
    chrome.runtime.sendMessage('load', function(response) {
      answers = response.answers;
      addAnswerButton();
    });
  }

  function any(array, predicate) {
    for (var i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        return true;
      }
    }
    return false;
  }

  function addAnswerButton() {
    if (!any(allowedPaths, (path) => path.test(window.location.href))) {
      // NOPE.
      return;
    }

    // If there's already a button nuke it so we can start fresh.
    var existingButtons = document.querySelectorAll('.github-canned-response-item');
    if (existingButtons && existingButtons.length !== 0) {
      for (var i = 0; i < existingButtons.length; i++) {
        existingButtons[i].parentNode.removeChild(existingButtons[i]);
      }
    }

    var targets = document.querySelectorAll('.js-toolbar.toolbar-commenting');

    for (var i = 0; i < targets.length; i++) {
      var target = createNodeWithClass('div', 'toolbar-group github-canned-response-item');
      targets[i].insertBefore(target, targets[i].childNodes[0]);

      var item = createNodeWithClass('div', 'select-menu js-menu-container js-select-menu label-select-menu');
      target.appendChild(item);

      var button = createButton();
      item.appendChild(button);

      if (targets[i]) {
        var dropdown = createDropdown(answers, targets[i]);
        item.appendChild(dropdown);
      }
    }
  }

  function createNodeWithClass(nodeType, className) {
    var element = document.createElement(nodeType);
    element.className = className;
    return element;
  }

  function createButton() {
    var button = createNodeWithClass('button', 'toolbar-item tooltipped tooltipped-n js-menu-target menu-target');

    button.setAttribute('aria-label', 'Insert canned response');
    button.style.display = 'inline-block';

    //var text = document.createTextNode('Canned Response');
    //button.appendChild(text);

    var span = createNodeWithClass('span', 'octicon octicon-mail-read');
    button.appendChild(span);

    var span = createNodeWithClass('span', 'dropdown-caret');
    button.appendChild(span);

    return button;
  }

  function createDropdown(answers, toolbar) {
    // This should use the fuzzy search instead (see labels)
    var outer = createNodeWithClass('div', 'select-menu-modal-holder js-menu-content js-navigation-container');
    var inner = createNodeWithClass('div', 'select-menu-modal');
    outer.appendChild(inner);

    var header = createNodeWithClass('div', 'select-menu-header');
    var headerText = createNodeWithClass('span', 'select-menu-title');
    headerText.innerHTML = 'Insert response';
    header.appendChild(headerText);
    inner.appendChild(header);

    var main = createNodeWithClass('div', 'js-select-menu-deferred-content');
    inner.appendChild(main);

    var filter = createNodeWithClass('div', 'select-menu-filters');
    var filterText = createNodeWithClass('div', 'select-menu-text-filter');
    var filterInput = createNodeWithClass('input', 'js-filterable-field js-navigation-enable form-control');
    filterInput.id = 'canned-response-filter-field';
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter responses';
    filterInput.autocomplete = 'off';
    filterInput.setAttribute('aria-label', 'Type or choose an answer');

    filterText.appendChild(filterInput);
    filter.appendChild(filterText);
    main.appendChild(filter);

    var itemList = createNodeWithClass('div', 'select-menu-list');
    itemList.setAttribute('data-filterable-for', 'canned-response-filter-field');
    itemList.setAttribute('data-filterable-type', 'fuzzy');

    main.appendChild(itemList);

    for (var i = 0; i < answers.length; i++) {
      var item = createDropdownItem(answers[i].name);
      itemList.appendChild(item);
      item.toolbar = toolbar;
      item.answer = answers[i].description;
      item.addEventListener('click', insertAnswer);

      // Gigantic hack because the PR page is not setting up mouse events correctly.
      item.addEventListener('mouseenter', function() {
        this.className += ' navigation-focus';
      });
      item.addEventListener('mouseleave', function() {
        this.className = this.className.replace(/ navigation-focus/g, '');
      });
    }

    return outer;
  }

  function createDropdownItem(text) {
    var item = createNodeWithClass('div', 'select-menu-item js-navigation-item');
    item.textContent = text;
    return item;
  }

  function insertAnswer(event) {
    var item = event.target;
    var textarea = item.toolbar.parentNode.parentNode.querySelector('textarea');
    textarea.value += item.answer + '\n';

    // Scroll down.
    textarea.focus();
    textarea.scrollTop = textarea.scrollHeight;
  }
})();
