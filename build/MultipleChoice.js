"use strict";
var QuizApp;
(function (QuizApp) {
    class MultipleChoice {
        constructor(_question, _answers) {
            this._question = _question;
            this._answers = _answers;
        }
        validateQuestion() {
            console.log("true");
        }
    }
    QuizApp.MultipleChoice = MultipleChoice;
})(QuizApp || (QuizApp = {}));
//# sourceMappingURL=MultipleChoice.js.map