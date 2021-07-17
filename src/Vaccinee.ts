import CheckOfNullDB from "./CheckOfNullDB";
import ConsoleHandling from "./ConsoleHandling";
import { StillOpenDays } from "./StillOpenDays";
import { VaccineeUtils } from "./VaccineeUtils";

export class Vaccinee {
  private static _instance: Vaccinee = new Vaccinee();

  private stillOpenDays: StillOpenDays[];
  private vaccineUtils: VaccineeUtils = new VaccineeUtils();

  constructor() {
    if (Vaccinee._instance)
      throw new Error("Use Vaccinee.getInstance() instead new Vaccinee()");
    Vaccinee._instance = this;
  }

  public static getInstance(): Vaccinee {
    return Vaccinee._instance;
  }

  public async showVaccineeMethods(): Promise<void> {
    if (this.vaccineUtils.vaccineDatabase == undefined) {
      this.vaccineUtils.vaccineDatabase = CheckOfNullDB.getVaccineDays();
      this.vaccineUtils.waitingList = CheckOfNullDB.getWaitList();
      ConsoleHandling.printInput("hello Vaccinee!".color_at_256(195));
    }

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
        if (this.vaccineUtils.vaccineDatabase.length > 0) {
          this.stillOpenDays = this.vaccineUtils.calculateOpenAppointments();
          if (this.vaccineUtils.wholeAmountOfFree == 0) {
            await this.vaccineUtils.userIntoWaitinglist();
            return;
          }
          this.vaccineUtils.showAvailableDays(this.stillOpenDays);
          if (await this.vaccineUtils.checkOfValidInputFromUser(this.stillOpenDays))
            this.vaccineUtils.checkOfEmailInDB();
          else {
            ConsoleHandling.printInput("no available appointments at this date or at this time on the day");
            await this.goBack();
          }
        } else
          await this.vaccineUtils.userIntoWaitinglist();
        break;

      case "2":
        if (this.vaccineUtils.vaccineDatabase.length > 0) {
          this.stillOpenDays = this.vaccineUtils.calculateOpenAppointments();
          if (this.vaccineUtils.wholeAmountOfFree == 0) {
            await this.vaccineUtils.userIntoWaitinglist();
            return;
          }
          await this.vaccineUtils.showAvaibleAppointmentsFromDateInput(this.stillOpenDays);
          if (await this.vaccineUtils.checkOfValidInputFromUser(this.stillOpenDays))
            this.vaccineUtils.checkOfEmailInDB();
          else {
            ConsoleHandling.printInput("wrong date or time input");
            await this.goBack();
          }
        } else
          await this.vaccineUtils.userIntoWaitinglist();
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




