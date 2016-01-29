var answers = getAnswersListFromStorage();
updateAnswersList();

function updateAnswersList() {
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
    answers[item.answerId].name = title.value;
    answers[item.answerId].desc = text.value;

    // Save to local storage.
    var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';
    localStorage.setItem(localStorageKey, JSON.stringify(answers));
  }
});
