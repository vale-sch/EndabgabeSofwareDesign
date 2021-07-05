import ConsoleHandling from "./ConsoleHandling";

export class Vaccinee {
  public async showVaccineeMethods(): Promise<void> {
    ConsoleHandling.consoleLine.write("Hello Vaccinee!".color_at_256(195))
    let answer: String = await ConsoleHandling.showPossibilities(["1. Show Open Events for Vaccination", "2. Search for specific Date", "3. QuitApp"], "Which function do you want to use?(" + "Y".color_at_256(192) + "): ");


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




