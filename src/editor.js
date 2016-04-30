function gcrExtEditorUpdateAnswersList() {
  var list = document.querySelector('#gcr-ext-editor .gcr-ext-answer-list');
  list.innerHTML = '';
  for (var i = 0; i < __gcrExtAnswers.length; i++ ) {
    var li = gcrExtEditorCreateItem(__gcrExtAnswers[i].name, __gcrExtAnswers[i].description);
    li.setAttribute('data-answer-id', i);
    list.appendChild(li);
  }
}

document.addEventListener('click', function(event) {
  if (event.target.id !== 'gcrExtNewButton')
    return;

  var list = document.querySelector('.gcr-ext-answer-list');
  var name = document.getElementById('gcrExtNewTitle').value;
  var text = document.getElementById('gcrExtNewText').value;

  if (name.trim() === '' || text.trim() === '') {
    document.querySelector('#gcrExtNewConfirm').hidden = true;
    document.querySelector('#gcrExtNewError').hidden = false;
    return;
  }

  document.querySelector('#gcrExtNewConfirm').hidden = true;
  document.querySelector('#gcrExtNewError').hidden = true;

  var answerId = __gcrExtAnswers.length;
  __gcrExtAnswers.push({name: name, description: text});

  // Save to local storage.
  gcrExtEditorSaveAnswers();

  // Add to the UI list.
  var li = gcrExtEditorCreateItem(name, text);
  li.setAttribute('data-answer-id', answerId);
  list.appendChild(li);

  document.querySelector('#gcrExtNewConfirm').hidden = false;
  document.getElementById('gcrExtNewTitle').value = '';
  document.getElementById('gcrExtNewText').value = '';

  // Clear it after a bit.
  setTimeout(function() {
    document.querySelector('#gcrExtNewConfirm').hidden = true;
  }, 2000);
});

document.addEventListener('click', function(event) {
  if (!event.target.classList.contains('gcr-editor-action-button'))
    return;

  var button = event.target;
  var item = button.parentNode;
  var title = item.querySelector('.gcr-ext-editor-answer-title');
  var text = item.querySelector('.gcr-ext-editor-answer-text');
  var answerId = item.getAttribute('data-answer-id');

  // This is pretty lame.
  if (button.textContent.toLowerCase() === 'edit') {
    title.disabled = text.disabled = false;
    button.textContent = 'Save';
    title.focus();
  } else if (button.textContent.toLowerCase() === 'save') {
    title.disabled = text.disabled = true;
    button.textContent = 'Edit';

    // Save locally.
    __gcrExtAnswers[answerId].name = title.value;
    __gcrExtAnswers[answerId].description = text.value;

    // Save to local storage.
    gcrExtEditorSaveAnswers();
  } else if (button.textContent.toLowerCase() === 'delete') {
    __gcrExtAnswers.splice(answerId, 1);
    item.remove();
    // Save to local storage.
    gcrExtEditorSaveAnswers();
    gcrExtEditorUpdateAnswersList();
  }
});


function gcrExtEditorCreateItem(name, text) {
  var li = document.createElement('li');

  var title = document.createElement('input');
  title.className = 'gcr-ext-editor-answer-title gcr-ext-editor-single-line';
  title.setAttribute('value', name);
  title.setAttribute('aria-label', 'Canned reply name');
  title.disabled = true;

  var desc = document.createElement('textarea');
  desc.className = 'gcr-ext-editor-answer-text';
  desc.textContent = text;
  desc.setAttribute('aria-label', 'Canned reply answer');
  desc.disabled = true;

  var edit = document.createElement('button');
  edit.className = 'btn btn-sm btn-primary gcr-editor-action-button';
  edit.textContent = 'Edit';

  var del = document.createElement('button');
  del.className = 'btn btn-sm gcr-editor-action-button';
  del.textContent = 'Delete';
  del.style.marginLeft = '10px';

  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(edit);
  li.appendChild(del);
  return li;
}
