import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import { GMailService } from "./GMailService";
import { StillOpenDays } from "./StillOpenDays";
import { VaccineeInformation } from "./VaccineeInformation";

export class Vaccinee {
  public wholeAmountOfFree: number = 0;
  public stillOpenDays: StillOpenDays[];

  private vaccineDatabase: CalculatedVaccineDay[];
  private waitingList: VaccineeInformation[];
  private validDateReqeust: String;
  private validTimeRequest: string;

  public async showVaccineeMethods(): Promise<void> {
    if (this.vaccineDatabase == undefined)
      ConsoleHandling.printInput("hello Vaccinee!".color_at_256(195));
    let answer: String = await ConsoleHandling.showPossibilities(["1. show open appointments for vaccination & registrate", "2. search in specific date for vaccination & registrate", "3. quit"],
      // tslint:disable-next-line: align
      "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
    this.handleAnswer(answer);
  }

  public async handleAnswer(_answer: String): Promise<void> {
    switch (_answer) {
      default:
      case "1":
        if (this.getActualVaccineDatabase()) {
          this.stillOpenDays = this.calculateOpenAppointments();
          this.showAvailableDays(this.stillOpenDays);
          if (await this.checkOfValidInputFromUser(this.stillOpenDays))
            this.registrateUser();
          else {
            ConsoleHandling.printInput("wrong date or time input");
            await this.goBack();
          }
        } else
          await this.userIntoWaitinglist();
        break;

      case "2":
        if (this.getActualVaccineDatabase()) {
          this.stillOpenDays = this.calculateOpenAppointments();
          await this.showAvaibleAppointmentsFromDateInput(this.stillOpenDays);
          if (await this.checkOfValidInputFromUser(this.stillOpenDays))
            this.registrateUser();
          else {
            ConsoleHandling.printInput("wrong date or time input");
            await this.goBack();
          }
        } else
          await this.userIntoWaitinglist();
        break;

      case "3":
        ConsoleHandling.closeConsole();
    }
  }
  public async userIntoWaitinglist(): Promise<void> {
    ConsoleHandling.printInput("at " + "this time".color_at_256(226) + " there is " + "no open".color_at_256(196) + " vaccine appointment, do you want to " + "registrate".color_at_256(118) + " into the " + "waiting list".color_at_256(118) + "?");
    let answer: String = await ConsoleHandling.question("press " + "Y".color_at_256(118) + " to Continue, or " + "Z".color_at_256(196) + " to go back (" + "Y".color_at_256(118) + "): ");
    switch (answer.toLowerCase()) {
      default:
      case "y":
        this.registrateUser(true);
        break;
      case "z":
        this.showVaccineeMethods();
        break;
    }
  }
  public calculateOpenAppointments(): StillOpenDays[] {
    let date: String = new Date().toJSON();
    let neededPart: String = date.substring(0, 10);
    let todayDateInNumbers: number[] = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));

    let stillOpenDays: StillOpenDays[];
    let dayIterator: number = 0;
    this.wholeAmountOfFree = 0;
    if (this.getActualVaccineDatabase()) {
      stillOpenDays = new Array(this.vaccineDatabase.length);
      this.vaccineDatabase.forEach(vaccineDay => {
        if (vaccineDay.date[0] >= todayDateInNumbers[0] && vaccineDay.date[1]
          >= todayDateInNumbers[1] && vaccineDay.date[2] >= todayDateInNumbers[2]) {
          if (stillOpenDays[dayIterator] == undefined)
            stillOpenDays[dayIterator] = new StillOpenDays(<string>vaccineDay.dateString, new Array(vaccineDay.vaccineAppointmentRound.length));
          let appointmentIterator: number = 0;
          vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            let howManyOpenPlaces: number = 0;
            vaccineAppointmentRound.freePlaces.forEach(bool => {
              if (bool == true) {
                this.wholeAmountOfFree++;
                howManyOpenPlaces++;
              }
            });
            if (stillOpenDays[dayIterator].openTimes[appointmentIterator] == undefined)
              stillOpenDays[dayIterator].openTimes[appointmentIterator] = vaccineAppointmentRound.startTime + " (" + howManyOpenPlaces.toString().color_at_256(118) + ")";
            appointmentIterator++;

          });

          dayIterator++;
        }
      });
    }
    return stillOpenDays;
  }
  public async showAvaibleAppointmentsFromDateInput(_stillOpenDays: StillOpenDays[]): Promise<void> {
    let specificDate: String = await ConsoleHandling.question("on which date".color_at_256(226) + " you want to see " + "open ".color_at_256(118) + "appointments? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
    _stillOpenDays.forEach(openDay => {
      if (openDay.openDate == specificDate) {
        _stillOpenDays.forEach(day => {

          ConsoleHandling.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
          ConsoleHandling.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
          day.openTimes.forEach(time => {
            ConsoleHandling.printInput(time.substring(0, 5).color_at_256(226) + " am  " + time.substring(6, 23).color_at_256(118) + ")".color_at_256(118));
          });
          ConsoleHandling.printInput("");
          ConsoleHandling.printInput("please " + "note down ".color_at_256(226) + "your favourite " + "suitable time".color_at_256(118) + "\n");
          return;
        });
      } else {
        ConsoleHandling.printInput("on this date are no appointments available anymore");
        this.goBack();
      }
    });
  }
  public showAvailableDays(_stillOpenDays: StillOpenDays[]): void {
    _stillOpenDays.forEach(day => {
      ConsoleHandling.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
      ConsoleHandling.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
      day.openTimes.forEach(time => {
        ConsoleHandling.printInput(time.substring(0, 5).color_at_256(226) + " am  " + time.substring(6, 23).color_at_256(118) + ")".color_at_256(118));
      });
      ConsoleHandling.printInput("");
    });
    ConsoleHandling.printInput("");
    ConsoleHandling.printInput("whole amount of " + "open ".color_at_256(118) + "vaccine appointments: " + this.wholeAmountOfFree.toString().color_at_256(118));
    ConsoleHandling.printInput("please " + "note down ".color_at_256(226) + "your favourite " + "date".color_at_256(118) +
      " from the list and the " + "suitable time".color_at_256(118) + "\n");

  }

  public async checkOfValidInputFromUser(_stillOpenDays: StillOpenDays[]): Promise<boolean> {
    this.validDateReqeust = await ConsoleHandling.question("which date".color_at_256(226) + " do you choose to " + "vaccinate".color_at_256(226) + "? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
    let isValidDate: boolean = false;
    _stillOpenDays.forEach(openDay => {
      if (openDay.openDate == this.validDateReqeust)
        isValidDate = true;
    });
    if (!isValidDate)
      return false;

    this.validTimeRequest = <string>await ConsoleHandling.question("when ".color_at_256(226) + "do you want to get " + "vaccinaded".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
    let validTime: boolean = false;
    _stillOpenDays.forEach(openDay => {
      if (openDay.openDate == this.validDateReqeust)
        openDay.openTimes.forEach(time => {
          if (time.localeCompare(this.validTimeRequest))
            validTime = true;
        });
    });
    return validTime;
  }

  public async registrateUser(_inWaitingList?: boolean): Promise<void> {
    let email: string = <string>await ConsoleHandling.question("please enter " + "email".color_at_256(226) + ": ");
    let regexp: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!email.match(regexp)) {
      ConsoleHandling.printInput("this is not a valid email");
      this.registrateUser();
    }
    if (_inWaitingList)
      if (this.getActualWaitingList())
        this.waitingList.forEach(vaccineeInformation => {
          if (email == vaccineeInformation.email) {
            ConsoleHandling.printInput("this email is " + "already registrated ".color_at_256(226) + "in waiting list");
            this.goBack();
            return;
          }
        });

    if (_inWaitingList != true)
      this.vaccineDatabase.forEach(vaccineDay => {
        vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
          vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
            if (email == vaccineeInformation.email) {
              ConsoleHandling.printInput("this email is " + "already registrated ".color_at_256(226) + "in a appointment");
              this.goBack();
              return;
            }
          });
        });
      });

    let familyName: String = await ConsoleHandling.question("please enter " + "familyName".color_at_256(226) + ": ");
    let name: String = await ConsoleHandling.question("please enter " + "name".color_at_256(226) + ": ");
    let birth: String = await ConsoleHandling.question("please enter " + "birth".color_at_256(226) + ": ");
    let phone: String = await ConsoleHandling.question("please enter " + "phone".color_at_256(226) + ": ");
    let adress: String = await ConsoleHandling.question("please enter " + "adress".color_at_256(226) + ": ");
    let verficationNumber: String;
    if (_inWaitingList != true) {
      let vaccineDatabaseCache: CalculatedVaccineDay[] = this.vaccineDatabase;
      vaccineDatabaseCache.forEach(vaccineDay => {
        if (vaccineDay.dateString == this.validDateReqeust)
          vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            if (this.validTimeRequest == vaccineAppointmentRound.startTime) {
              verficationNumber = vaccineDay.verficationDayNumber.toString();
              let isRegistrated: boolean = false;
              let whichBoolToSet: number = 0;
              vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                if (!isRegistrated)
                  if (vaccineeInformation.email == "") {
                    vaccineeInformation.adress = adress;
                    vaccineeInformation.birth = birth;
                    vaccineeInformation.email = email;
                    vaccineeInformation.familyName = familyName;
                    vaccineeInformation.name = name;
                    vaccineeInformation.phone = phone;
                    vaccineAppointmentRound.freePlaces[whichBoolToSet] = false;
                    isRegistrated = true;
                  }
                whichBoolToSet++;
              });
            }
            FileHandler.writeFile("/data/vaccineDaysDB.json", vaccineDatabaseCache);
          });
      });

      this.vaccineDatabase = vaccineDatabaseCache;
      ConsoleHandling.printInput("you have successfully registrated to vaccine appointment, ypu will get an email");
      let gmailService: GMailService = new GMailService();
      gmailService.sendMail(
        email,
        "Vaccine Appointment on " + this.validDateReqeust,
        "Hello from VaccineApp," + " \n\n\n " + "you have successfully booked appointment on " + this.validDateReqeust + " at " + this.validTimeRequest + ", " + " \n " + "Your Informations: " +
        " \n\n " + "Email: " + email + " \n " + "family name: " + familyName + " \n " + "name: " + name + " \n " + "birth: " + birth + " \n "
        + "phone: " + phone + " \n " + "adress: " + adress + " \n " + "Your verification number: " + verficationNumber +
        " \n\n\n " + "thank you for supporting our app, stay healthy!");

    }
    if (_inWaitingList == true) {
      let vaccineeInformation: VaccineeInformation = new VaccineeInformation(email, familyName, name, birth, phone, adress);
      if (!this.getActualWaitingList())
        FileHandler.writeFile("/data/waitListVaccinees.json", []);
      this.waitingList = FileHandler.readArrayFile("/data/waitListVaccinees.json");
      this.waitingList.push(vaccineeInformation);


      ConsoleHandling.printInput("you have successfully registrated into waitinglist, as soon as appointment is open you will get an email with information");
      FileHandler.writeFile("/data/waitListVaccinees.json", this.waitingList);
    }
    await this.goBack();
  }

  public getActualWaitingList(): boolean {
    try {
      this.waitingList = FileHandler.readArrayFile("/data/waitListVaccinees.json");
    } catch (error) {

      return false;
    }
    return true;
  }
  public getActualVaccineDatabase(): boolean {
    try {
      this.vaccineDatabase = FileHandler.readArrayFile("/data/vaccineDaysDB.json");
    } catch (error) {
      return false;
    }
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





