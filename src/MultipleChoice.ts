namespace QuizApp {
  type Answer = {
    name: String;
    istrue: Boolean;
  };
  export class MultipleChoice implements Question {
    _question: String;
    _answers: Answer[];
    constructor(_question: String, _answers: Answer[]) {
      this._question = _question;
      this._answers = _answers;
    }
    private validateQuestion(): void {
      console.log("true");
    }
  }
}
