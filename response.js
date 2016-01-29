(function() {
  "use strict";

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

  var defaultAnswers = [
    {
      name: 'Issue: thanks! help fix?',
      description: "Thanks a lot for filing this issue! Would you like to write a patch for this? We'd be more than happy to walk you through the steps involved."
    },
    {
      name: 'Issue: thanks! looking!',
      description: "Thanks a lot for filing this issue! We'll triage and take a look at it as soon as possible!"
    },
    {
      name: 'Issue: looks inactive',
      description: "This issue is fairly old and there hasn't been much activity on it. Closing, but please re-open if it still occurs."
    },
    {
      name: 'Issue: closing, no repro steps',
      description: "This issue has no reproducible steps. Please re-open this issue if it still occurs, with a JSBin containing a set of reproducible steps. Check this element's CONTRIBUTING.md for an example."
    },
    {
      name: 'Issue: provide repro steps',
      description: "Please provide a JSBin containing a set of reproducible steps. Check this element's CONTRIBUTING.md for an example."
    },
    {
      name: 'Issue: cannot reproduce',
      description: "Not reproducible in the latest release. Please re-open this issue if it still occurs, with a JSBin containing a set of reproducible steps. Check this element's CONTRIBUTING.md for an example."
    },
    {
      name: 'PR: thanks! looking!',
      description: "Thanks for your contribution! We'll triage and take a look at it as soon as possible!"
    },
    {
      name: 'PR: against MD spec',
      description: "Thanks for your thoughtful contribution! Unfortunately, this is against the Material Design spec, and we can't accept it at this time."
    },
    {
      name: 'PR: needs test',
      description: "Please add a test case that tests the problem this PR is fixing"
    }
  ];

  var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';
  var saved = localStorage.getItem(localStorageKey);
  var answers;
  if (!saved || saved === '') {
    localStorage.setItem(localStorageKey, JSON.stringify(defaultAnswers));
    answers = defaultAnswers;
  } else {
    answers = JSON.parse(localStorage.getItem(localStorageKey));
  }

  function any(array, predicate) {
    for (var i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        return true;
      }
    }
    return false;
  }

  addAnswerButton();

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
    button.setAttribute('aria-label', 'Insert canned answer');
    button.style.display = 'inline-block';

    var text = document.createTextNode('Canned Answer');
    button.appendChild(text);

    var span = createNodeWithClass('span', 'dropdown-caret');
    button.appendChild(span);

    return button;
  }

  function createDropdown(answers, toolbar) {
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
  }
})();
