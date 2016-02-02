var __gcrExtAnswers = getAnswersListFromStorage();
var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';
var list = document.getElementById('answerList');

var saveAnswers = function() {
  localStorage.setItem(localStorageKey, JSON.stringify(__gcrExtAnswers));
}

updateAnswersList();
