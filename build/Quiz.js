"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
class Quiz {
    constructor(_quiz, _title, _boolean) {
        this._quiz = _quiz;
        this._title = _title;
        this._boolean = _boolean;
    }
    get title() {
        return this._title;
    }
    validateQuestions() {
        console.log("methode // validateQuestions");
    }
}
exports.Quiz = Quiz;
//# sourceMappingURL=Quiz.js.map