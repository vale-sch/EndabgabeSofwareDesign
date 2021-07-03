export class RegisteredUser {
  public username: String;
  public password: String;

  constructor(_username: String, _password: String) {
    this.username = _username;
    this.password = _password;
  }

  private playQuiz(Quiz: String): void {
    console.log("Methode // playQuiz");
  }

  private createQuiz(): void {
    console.log("Methode // createQuiz");
  }

  private watchStats(): void {
    console.log("Methode // watchStats");
  }
}
