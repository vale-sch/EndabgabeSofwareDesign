"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statistic = void 0;
class Statistic {
    constructor(_playedQuizzes, _correctAnswers, _answeredQuestions) {
        this._playedQuizzes = _playedQuizzes;
        this._correctAnswers = _correctAnswers;
        this._answeredQuestions = _answeredQuestions;
    }
    static get instance() {
        if (this._instance == undefined)
            return null;
        return this._instance;
    }
}
exports.Statistic = Statistic;
//# sourceMappingURL=Statistic.js.map