import ConsoleHandling from "./ConsoleHandling";
import { StillOpenDays } from "./StillOpenDays";
import VaccineeUtils from "./VaccineeUtils";

export class Vaccinee {
  private static _instance: Vaccinee = new Vaccinee();

  private stillOpenDays: StillOpenDays[];

  constructor() {
    if (Vaccinee._instance)
      throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
    Vaccinee._instance = this;
  }

  public static getInstance(): Vaccinee {
    return Vaccinee._instance;
  }

  public async showVaccineeMethods(): Promise<void> {
    if (VaccineeUtils.vaccineDatabase == undefined)
      ConsoleHandling.printInput("hello Vaccinee!".color_at_256(195));
    let answer: String = await ConsoleHandling.showPossibilities(["1. show open appointments for vaccination & registrate",
      "2. search in specific date for vaccination & registrate", "3. quit"],
      // tslint:disable-next-line: align
      "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
    this.handleAnswer(answer);
  }

  public async handleAnswer(_answer: String): Promise<void> {
    switch (_answer) {
      default:
      case "1":
        if (VaccineeUtils.getActualVaccineDatabase()) {
          this.stillOpenDays = VaccineeUtils.calculateOpenAppointments();
          if (VaccineeUtils.wholeAmountOfFree == 0) {
            await VaccineeUtils.userIntoWaitinglist();
            return;
          }
          VaccineeUtils.showAvailableDays(this.stillOpenDays);
          if (await VaccineeUtils.checkOfValidInputFromUser(this.stillOpenDays))
            VaccineeUtils.registrateUser();
          else {
            ConsoleHandling.printInput("no available appointments at this date or at this time on the day");
            await this.goBack();
          }
        } else
          await VaccineeUtils.userIntoWaitinglist();
        break;

      case "2":
        if (VaccineeUtils.getActualVaccineDatabase()) {
          this.stillOpenDays = VaccineeUtils.calculateOpenAppointments();
          if (VaccineeUtils.wholeAmountOfFree == 0) {
            await VaccineeUtils.userIntoWaitinglist();
            return;
          }
          await VaccineeUtils.showAvaibleAppointmentsFromDateInput(this.stillOpenDays);
          if (await VaccineeUtils.checkOfValidInputFromUser(this.stillOpenDays))
            VaccineeUtils.registrateUser();
          else {
            ConsoleHandling.printInput("wrong date or time input");
            await this.goBack();
          }
        } else
          await VaccineeUtils.userIntoWaitinglist();
        break;
      case "3":
        ConsoleHandling.closeConsole();
    }
  }

  public async goBack(): Promise<void> {
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

export default Vaccinee.getInstance();




