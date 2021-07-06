import ConsoleHandling from "./ConsoleHandling";

export class Vaccinee {
  public async showVaccineeMethods(): Promise<void> {
    ConsoleHandling.printInput("Hello Vaccinee!".color_at_256(195))
    let answer: String = await ConsoleHandling.showPossibilities(["1. Show Open Events for Vaccination", "2. Search for specific Date", "3. Quit"], "Which " + "function".color_at_256(226) + " do you want me to use? (" + "1".color_at_256(226) + "): ");


    this.handleAnswer(answer);
  }
  public async handleAnswer(answer: String): Promise<void> {
    let wantClose: boolean = false;
    switch (answer) {
      case "1":
        break;
      case "2":
        break;
      case "3":
        wantClose = true;
        ConsoleHandling.closeConsole();
      default:
        break;
    }
    if (!wantClose)
      await this.goNext();
  }
  public async goNext(): Promise<void> {
    let answer: String = await ConsoleHandling.question("Back to overview? ");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
      default:
        this.showVaccineeMethods();
        break;
      case "n":
      case "no":
        ConsoleHandling.closeConsole();
        break;
    }
  }
}




