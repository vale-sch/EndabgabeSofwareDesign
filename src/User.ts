import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import { RegisteredUser } from "./RegisteredUser";
import { Statistic } from "./Statistic";
export class User {
  private static _instance: User;
  private _statistic: Statistic;

  constructor(_statistic: Statistic) {
    this._statistic = _statistic;
    if (User._instance) throw new Error("use user.getInstance instead of new User");
    User._instance = this;
  }
  public static getInstance(): User {
    return User._instance;
  }

  public async register(): Promise<void> {

    let newUser: String = await ConsoleHandling.question("Enter your new Nickname: ");
    let userArray: RegisteredUser[] = FileHandler.readArrayFile("../EndabgabeSofwareDesign/data/users.json");
    userArray.forEach(user => {
      if (user.username == newUser) {
        console.log("This name is already taken!");
        this.register();
      }

    });
    let newPassword: String = await ConsoleHandling.question("Enter your new Password: ");
    userArray.push(new RegisteredUser(newUser, newPassword));


    // Noch in REGEX prüfen!! Task



    FileHandler.writeFile("../EndabgabeSofwareDesign/data/users.json", userArray);
    console.log("You have successfully registered!");
  }
  public login(): void {
    console.log("Method // login");
  }
  private playQuiz(): void {
    console.log("Method // playQuiz");
  }
  private watchStats(): void {
    console.log("Method // watchStats");
  }
}
