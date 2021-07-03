import { RegisteredUser } from "./RegisteredUser";
import { User } from "./User";
import { Quiz } from "./Quiz";
import ConsoleHandling from "./ConsoleHandling";
import { Statistic } from "./Statistic";

export class Quizapp {
  private _user: User = new User(new Statistic(0,0,0));
  private _registeredUser: RegisteredUser;
  private _quizzes: Quiz[];
  constructor() {
    this._user = User.getInstance();
  }
  public async showMethods(): Promise<void> {
    let answer: String = await ConsoleHandling.showPossibilities(["1. Play a Quiz", "2. Login", "3. Register", "4. Show Statistic"], "Which function do you want to use? (default 1): ");

    this.handleAnswer(answer);
  }
  public async handleAnswer(answer: String): Promise<void> {
    switch (answer) {
      case "1":
        this.showAllQuizzes();
        break;
      case "2":
        this._user.login();
        break;
      case "3":
        await this._user.register();
        break;
      case "4":
        ConsoleHandling.printInput("search by box office greater than");
        break;
      default:
        this.showAllQuizzes();
        break;
    }
    await this.goNext();
  }
  public showAllQuizzes(): void {
    ConsoleHandling.printInput("\n");
 
    ConsoleHandling.printInput("Hier sind 5 Quizze");
    for (let index in this._quizzes) {
      let quiz: Quiz = this._quizzes[index];
      let _index: Number = Number.parseInt(index) + 1;
      ConsoleHandling.printInput(`${_index}. Quizname: ${quiz.title}`);
    }
  }

  public async goNext(): Promise<void> {
    let answer: String = await ConsoleHandling.question("Back to overview? ");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
      default:
        this.showMethods();
        break;
      case "n":
      case "no":
        ConsoleHandling.closeConsole();
        break;
    }
  }
}
