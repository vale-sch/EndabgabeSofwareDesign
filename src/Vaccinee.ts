import ConsoleHandling from "./ConsoleHandling";

export class Vaccinee {

  public async showVaccineeMethods(): Promise<void> {
    ConsoleHandling.printInput("hello Vaccinee!".color_at_256(195));
    let answer: String = await ConsoleHandling.showPossibilities(["1. show Open Events for Vaccination", "2. search for specific Date", "3. quit"],
      // tslint:disable-next-line: align
      "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
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
  // public getOpenAppointmentsOnSpecificDate(): void {

  // }

  public async goNext(): Promise<void> {
    let answer: String = await ConsoleHandling.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
    switch (answer.toLowerCase()) {
      case "y":
      default:
        this.showVaccineeMethods();
        break;
      case "z":
        ConsoleHandling.closeConsole();
        break;
    }
  }
}




