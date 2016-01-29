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

// Load the answers.
var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';
var saved = localStorage.getItem(localStorageKey);
var answers;

i//f (!saved || saved === '') {
  localStorage.setItem(localStorageKey, JSON.stringify(defaultAnswers));
  answers = defaultAnswers;
//} else {
//  answers = JSON.parse(localStorage.getItem(localStorageKey));
//}

// var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';
// var saved = chrome.storage.sync.get();
// var answers;
//
// if (!saved || saved === '') {
//   chrome.storage.sync.set({localStorageKey: JSON.stringify(defaultAnswers)});
//   answers = defaultAnswers;
// } else {
//   answers = JSON.parse(chrome.storage.sync.get(localStorageKey));
// }

// Display the UI.
var list = document.getElementById('answerList');
for (var i = 0; i < answers.length; i++ ) {
  var li = document.createElement('li');
  li.answerId = i;
  list.appendChild(li);

  var title = document.createElement('input');
  title.className = 'answer-title single-line';
  title.value = answers[i].name;
  title.disabled = true;

  var desc = document.createElement('textarea');
  desc.className = 'answer-text';
  desc.textContent = answers[i].description;
  desc.disabled = true;

  var button = document.createElement('button');
  button.className = 'edit';
  button.textContent = 'Edit';

  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(button);
}

document.querySelector('.list').addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() !== 'button')
    return;

  var button = event.target;
  var item = button.parentNode;
  var title = item.querySelector('.answer-title');
  var text = item.querySelector('.answer-text');
  if (button.textContent.toLowerCase() === 'edit') {
    title.disabled = text.disabled = false;
    button.textContent = 'Save';
    title.focus();
  } else {
    title.disabled = text.disabled = true;
    button.textContent = 'Edit';

    // Save locally.
    var answerId = item.answerId;
    answers[item.answerId].name = title.textContent;
    answers[item.answerId].desc = text.textContent;

    // Save to local storage.
    localStorage.setItem(localStorageKey, JSON.stringify(answers));
  }
});
