import CheckOfNullDB from "./CheckOfNullDB";
import ConsoleHandling from "./ConsoleHandling";
import { VaccineeUtils } from "./VaccineeUtils";

export class Vaccinee {
  private static _instance: Vaccinee = new Vaccinee();

  private vaccineeUtils: VaccineeUtils = new VaccineeUtils();

  constructor() {
    if (Vaccinee._instance)
      throw new Error("Use Vaccinee.getInstance() instead new Vaccinee()");
    Vaccinee._instance = this;
  }

  public static getInstance(): Vaccinee {
    return Vaccinee._instance;
  }

  public async showVaccineeMethods(): Promise<void> {
    if (this.vaccineeUtils.vaccineDatabase == undefined) {
      this.vaccineeUtils.vaccineDatabase = CheckOfNullDB.getVaccineDays();
      this.vaccineeUtils.waitingList = CheckOfNullDB.getWaitList();
      ConsoleHandling.printInput("hello Vaccinee!".color_at_256(195));
    }

    let answer: string = await ConsoleHandling.showPossibilities(["1. show open appointments for vaccination & registrate",
      "2. search in specific date for vaccination & registrate", "3. quit"],
      // tslint:disable-next-line: align
      "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
    this.handleAnswer(answer);
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

  private async handleAnswer(_answer: string): Promise<void> {
    switch (_answer) {
      default:
      case "1":
        if (this.vaccineeUtils.vaccineDatabase.length > 0) {
          this.vaccineeUtils.calculateOpenAppointments();
          if (this.vaccineeUtils.wholeAmountOfFree == 0) {
            await this.vaccineeUtils.userIntoWaitinglist();
            return;
          }
          this.vaccineeUtils.showAvailableDays();
          if (await this.vaccineeUtils.checkOfValidInputFromUser())
            this.vaccineeUtils.checkOfEmailInDB();
          else {
            ConsoleHandling.printInput("no available appointments at this date or at this time on the day");
            await this.goBack();
          }
        } else
          await this.vaccineeUtils.userIntoWaitinglist();
        break;

      case "2":
        if (this.vaccineeUtils.vaccineDatabase.length > 0) {
          this.vaccineeUtils.calculateOpenAppointments();
          if (this.vaccineeUtils.wholeAmountOfFree == 0) {
            await this.vaccineeUtils.userIntoWaitinglist();
            return;
          }
          await this.vaccineeUtils.showAvaibleAppointmentsFromDateInput();
          if (await this.vaccineeUtils.checkOfValidInputFromUser())
            this.vaccineeUtils.checkOfEmailInDB();
          else {
            ConsoleHandling.printInput("wrong date or time input");
            await this.goBack();
          }
        } else
          await this.vaccineeUtils.userIntoWaitinglist();
        break;
      case "3":
        ConsoleHandling.closeConsole();
    }
  }
}

export default Vaccinee.getInstance();




