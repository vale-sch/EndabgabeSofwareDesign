export class SingleText implements Question {
  public _question: String;
  private _answer: String;

  constructor(_question: String, _answer: String) {
    this._answer = _answer;
    this._question = _question;
  }
}
