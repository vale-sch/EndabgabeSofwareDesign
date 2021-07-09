import { toInteger } from "lodash";
import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";

export class Vaccinee {
  private vaccineDatabase: CalculatedVaccineDay[];

  public async showVaccineeMethods(): Promise<void> {
    ConsoleHandling.printInput("hello Vaccinee!".color_at_256(195));
    let answer: String = await ConsoleHandling.showPossibilities(["1. show open appointments for vaccination & registrate", "2. search in specific date for vaccination & registrate", "3. quit"],
      // tslint:disable-next-line: align
      "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
    this.handleAnswer(answer);
  }

  public async handleAnswer(answer: String): Promise<void> {

    switch (answer) {
      default:
      case "1":
        this.getOpenAppointments();
        break;
      case "2":
        break;
      case "3":
        ConsoleHandling.closeConsole();
    }

  }
  public getOpenAppointments(): void {

    let date: String = new Date().toJSON();
    let neededPart: String = date.substring(0, 10);
    let todayDateInNumbers: number[] = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
    let wholeAmountOfFree: number = 0;
    let amountOfFreeDays: number = 0;
    let amountOfFreeTimes: number = 0;
    let openEventDates: String[];
    let openEventTimes: String[];
    if (this.getActualDatabase(this.vaccineDatabase, false)) {
      openEventDates = new Array(this.vaccineDatabase.length);
      this.vaccineDatabase.forEach(vaccineDay => {

        if (vaccineDay.dateInNumbers[0] >= todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] >= todayDateInNumbers[1]
          && vaccineDay.dateInNumbers[2] >= todayDateInNumbers[2]) {
          ConsoleHandling.printInput("date: " + vaccineDay.dateString);
          let isSomeAppointmentFree: boolean = false;
          vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            let isFree: number = 0;
            vaccineAppointmentRound.freePlaces.forEach(bool => {
              if (bool == true) {
                isFree++;
                wholeAmountOfFree++;
                isSomeAppointmentFree = true;
              }
            });
            if (isFree > 0) {
              ConsoleHandling.printInput(vaccineAppointmentRound.start.toString() + "  (" + isFree.toString().color_at_256(118) + ")");
              amountOfFreeTimes++;

            }
          });
          if (amountOfFreeTimes > 0) {
            let counterOfEventTimes: number = 0;
            openEventTimes = new Array(amountOfFreeTimes);
            vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
              vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true) {
                  openEventTimes[counterOfEventTimes] = vaccineAppointmentRound.start[0].toString() + vaccineAppointmentRound.start[1].toString();
                  counterOfEventTimes++;
                }
              });
            });
          }
          if (isSomeAppointmentFree) {
            openEventDates[amountOfFreeDays] = vaccineDay.dateString;
            amountOfFreeDays++;
          }
          ConsoleHandling.printInput("");
        }
      });
      ConsoleHandling.printInput("whole amount of " + "free vaccine appointments".color_at_256(118) + ": " + wholeAmountOfFree.toString().color_at_256(118));
      ConsoleHandling.printInput("");
    }

    this.registrateMe(openEventDates, openEventTimes);
  }

  public async registrateMe(_openAppointmentsDate: String[], _openAppointmentTimes: String[]): Promise<void> {

    let dateReqeust: String = await ConsoleHandling.question("do you want to " + "registrate".color_at_256(226) + "? enter date of chosen vaccine day " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
    let isValidDate: boolean = false;
    _openAppointmentsDate.forEach(date => {
      if (date == dateReqeust)
        isValidDate = true;
    });
    if (!isValidDate) this.goBack();
    let timeRequest: String = await ConsoleHandling.question("when ".color_at_256(226) + "do you want to get " + "vaccinaded".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
    let timeNumberFormat: number[] = new Array(toInteger(timeRequest.substring(0, 2)), toInteger(timeRequest.substring(3, 5)));
    let formatedTimeRequest: String = timeNumberFormat[0].toString() + timeNumberFormat[1];
    let validTime: boolean = false;
    _openAppointmentTimes.forEach(openTimes => {
      if (openTimes == formatedTimeRequest)
        validTime = true;
    });
    if (validTime) {
      let email: String = await ConsoleHandling.question("please enter " + "email".color_at_256(226) + ": ");
      let familyName: String = await ConsoleHandling.question("please enter " + "familyName".color_at_256(226) + ": ");
      let name: String = await ConsoleHandling.question("please enter " + "name".color_at_256(226) + ": ");
      let birth: String = await ConsoleHandling.question("please enter " + "birth".color_at_256(226) + ": ");
      let phone: String = await ConsoleHandling.question("please enter " + "phone".color_at_256(226) + ": ");
      let adress: String = await ConsoleHandling.question("please enter " + "adress".color_at_256(226) + ": ");

      let calculatedVaccineDayCache: CalculatedVaccineDay[] = this.vaccineDatabase;
      calculatedVaccineDayCache.forEach(vaccineDay => {
        if (vaccineDay.dateString == dateReqeust)
          vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            if (timeNumberFormat[0] + timeNumberFormat[1] == vaccineAppointmentRound.start[0] + vaccineAppointmentRound.start[1]) {


              let isRegistrated: boolean = false;
              let whichBoolToSet: number = 0;
              vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                if (!isRegistrated)
                  if (vaccineeInformation.email == "") {
                    vaccineeInformation.email = email;
                    vaccineeInformation.familyName = familyName;
                    vaccineeInformation.name = name;
                    vaccineeInformation.birth = birth;
                    vaccineeInformation.phone = phone;
                    vaccineeInformation.adress = adress;
                    vaccineAppointmentRound.freePlaces[whichBoolToSet] = false;
                    isRegistrated = true;
                  }
                whichBoolToSet++;
              });
            }
            FileHandler.writeFile("/data/vaccineDaysDB.json", calculatedVaccineDayCache);
          });
      });
      console.log("you have successfully registrated!");
      this.goBack();
    } else {
      console.log("this time is not avaible or not avaible anymore!");
    }
    this.goBack();


  }

  public getActualDatabase(_vaccineDatabase: CalculatedVaccineDay[], _isCheckingDays: boolean): boolean {
    try {
      this.vaccineDatabase = FileHandler.readArrayFile("/data/vaccineDaysDB.json");
    } catch (error) {
      if (!_isCheckingDays) {
        ConsoleHandling.printInput("no data in database - make new vaccine day".color_at_256(196) + "\n");
        this.goBack();
      }

    }
    if (this.vaccineDatabase == undefined)
      return false;
    else
      return true;
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




