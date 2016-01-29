(function() {
  "use strict";
  var answers;

  // Thanks https://github.com/thieman/github-selfies/blob/master/chrome/selfie.js
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

  chrome.runtime.sendMessage('load', function(response) {
    answers = response.answers;
    addAnswerButton();
  });

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

    var b1 = document.querySelector('.form-actions').querySelector('button');
    var i = document.createElement('input');

    var targets = document.querySelectorAll('.js-toolbar.toolbar-commenting');

    for (var i = 0; i < targets.length; i++) {
      var target = createNodeWithClass('div', 'toolbar-group');
      targets[i].insertBefore(target, targets[i].childNodes[0]);

      var item = createNodeWithClass('div', 'toolbar-item dropdown js-menu-container');
      target.appendChild(item);

      var button = createButton();
      item.appendChild(button);

      var dropdown = createDropdown(answers, targets[i]);
      item.appendChild(dropdown);
    }

    document.querySelector('#new_comment_field').value = "zomg update";
  }

  function createNodeWithClass(nodeType, className) {
    var element = document.createElement(nodeType);
    element.className = className;
    return element;
  }

  function createButton() {
    var button = createNodeWithClass('button', 'js-menu-target menu-target tooltipped tooltipped-n');

    button.setAttribute('aria-label', 'Insert canned response');
    button.style.display = 'inline-block';

    var text = document.createTextNode('Canned Response');
    button.appendChild(text);

    var span = createNodeWithClass('span', 'dropdown-caret');
    button.appendChild(span);

    return button;
  }

  function createDropdown(answers, toolbar) {
    // This should use the fuzzy search instead (see labels)
    var outer = createNodeWithClass('div', 'dropdown-menu-content js-menu-content');
    var inner = createNodeWithClass('ul', 'dropdown-menu dropdown-menu-s');
    inner.style.width = '200px';
    outer.appendChild(inner);

    for (var i = 0; i < answers.length; i++) {
      var item = createDropdownItem(answers[i].name);
      inner.appendChild(item);
      item.toolbar = toolbar;
      item.answer = answers[i].description;
      item.addEventListener('click', insertAnswer);
    }

    return outer;
  }

  function createDropdownItem(text) {
    var item = createNodeWithClass('a', 'dropdown-item');
    item.style.cursor = 'pointer';
    item.style.fontWeight = 'normal';
    item.style.lineHeight = 'inherit';
    item.style.padding = '4px 10px 4px 15px';
    item.textContent = text;
    return item;
  }

  function insertAnswer(event) {
    var item = event.target;
    var textarea = item.toolbar.parentNode.parentNode.querySelector('textarea');
    textarea.value += '\n' + '**Automatic response:** ' + item.answer + '\n';
    
    // Scroll down.
    textarea.scrollTop = textarea.scrollHeight;
  }
})();
