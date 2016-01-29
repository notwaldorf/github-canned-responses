var answers = getAnswersListFromStorage();
var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';
var list = document.getElementById('answerList');

updateAnswersList();

function updateAnswersList() {
  for (var i = 0; i < answers.length; i++ ) {
    var li = createItem(answers[i].name, answers[i].description);
    li.answerId = i;
    list.appendChild(li);
  }
}

document.querySelector('#new').addEventListener('click', function(event) {
  var name = document.getElementById('newTitle').value;
  var text = document.getElementById('newText').value;

  if (name.trim() === '' || text.trim() === '') {
    document.querySelector('#newConfirm').hidden = true;
    document.querySelector('#newError').hidden = false;
    return;
  }

  document.querySelector('#newConfirm').hidden = true;
  document.querySelector('#newError').hidden = true;

  var answerId = answers.length;
  answers.push({name: name, description: text});

  // Save to local storage.
  localStorage.setItem(localStorageKey, JSON.stringify(answers));

  // Add to the UI list.
  var li = createItem(name, text);
  li.answerId = answerId;
  list.appendChild(li);

  document.querySelector('#newConfirm').hidden = false;
  document.getElementById('newTitle').value = '';
  document.getElementById('newText').value = '';

  // Clear it after a bit.
  setTimeout(function() {
    document.querySelector('#newConfirm').hidden = true;
  }, 2000);
});

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
    answers[item.answerId].name = title.value;
    answers[item.answerId].description = text.value;

    // Save to local storage.
    localStorage.setItem(localStorageKey, JSON.stringify(answers));
  }
});

function createItem(name, text) {
  var li = document.createElement('li');

  var title = document.createElement('input');
  title.className = 'answer-title single-line';
  title.value = name;
  title.disabled = true;

  var desc = document.createElement('textarea');
  desc.className = 'answer-text';
  desc.textContent = text;
  desc.disabled = true;

  var button = document.createElement('button');
  button.className = 'edit';
  button.textContent = 'Edit';

  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(button);
  return li;
}
