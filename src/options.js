var __gcrExtAnswers = getAnswersListFromStorage();
var localStorageKey = '__GH_CANNED_ANSWERS__EXT__';

var gcrExtEditorSaveAnswers = function() {
  localStorage.setItem(localStorageKey, JSON.stringify(__gcrExtAnswers));
}

gcrExtEditorSetup();
gcrExtEditorUpdateAnswersList();
