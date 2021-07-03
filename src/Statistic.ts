export class Statistic {
  private _playedQuizzes: Number;
  private _answeredQuestions: Number;
  private _correctAnswers: Number;
  private static _instance: Statistic;

  constructor(_playedQuizzes: Number, _correctAnswers: Number, _answeredQuestions: Number) {
    this._playedQuizzes = _playedQuizzes;
    this._correctAnswers = _correctAnswers;
    this._answeredQuestions = _answeredQuestions;
  }
  static get instance(): Statistic {
    if (this._instance == undefined) return null;
    return this._instance;
  }
}
