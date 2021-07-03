export class SingleNumber implements Question {
  public _question: String;
  private _answer: Number;

  constructor(_question: String, _answer: Number) {
    this._answer = _answer;
    this._question = _question;
  }
}
