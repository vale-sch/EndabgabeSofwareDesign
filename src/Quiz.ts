export class Quiz {
  public _boolean: boolean;
  private _quiz: Question[];
  private _title: string;

  constructor(_quiz: Question[], _title: string, _boolean: boolean) {
    this._quiz = _quiz;
    this._title = _title;
    this._boolean = _boolean;
  }
  public get title(): string {
    return this._title;
  }

  public validateQuestions(): void {
    console.log("methode // validateQuestions");
  }
}
