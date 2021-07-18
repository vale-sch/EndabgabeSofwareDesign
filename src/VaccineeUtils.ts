import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import { GMailService } from "./GMailService";
import { StillOpenDays } from "./StillOpenDays";
import { VaccineeInformation } from "./VaccineeInformation";
import CheckRegex from "./CheckRegex";
import * as alert from "alert";
import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import Vaccinee from "./Vaccinee";
export class VaccineeUtils {

    public stillOpenDays: StillOpenDays[];
    public vaccineDatabase: CalculatedVaccineDay[];
    public waitingList: VaccineeInformation[];
    public wholeAmountOfFree: number = 0;

    private validDateReqeust: string;
    private validTimeRequest: string;

    public async userIntoWaitinglist(): Promise<void> {
        ConsoleHandling.printInput("at " + "this time".color_at_256(226) + " there are " + "no open".color_at_256(196) + " vaccine appointments, do you want to " +
            "registrate".color_at_256(118) + " into the " + "waiting list".color_at_256(118) + "?");
        ConsoleHandling.printInput("");
        let answer: String = await ConsoleHandling.question("press " + "Y".color_at_256(118) + " to Continue, or " +
            "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            default:
            case "y":
                this.checkOfEmailInDB(true);
                break;
            case "z":
                ConsoleHandling.closeConsole();
                break;
        }
    }

    public calculateOpenAppointments(): void {
        let date: String = new Date().toJSON();
        let neededPart: String = date.substring(0, 10);
        let todayDateInNumbers: number[] = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));

        let dayIterator: number = 0;
        this.wholeAmountOfFree = 0;
        if (this.vaccineDatabase.length > 0) {
            this.stillOpenDays = new Array(this.vaccineDatabase.length);
            console.log(this.stillOpenDays.length);
            this.vaccineDatabase.forEach(vaccineDay => {
                let isPast: boolean = false;
                if (vaccineDay.dateInNumbers[0] < todayDateInNumbers[0])
                    isPast = true;
                if (vaccineDay.dateInNumbers[0] == todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] < todayDateInNumbers[1])
                    isPast = true;
                if (vaccineDay.dateInNumbers[0] == todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] == todayDateInNumbers[1] && vaccineDay.dateInNumbers[2] < todayDateInNumbers[2])
                    isPast = true;
                if (!isPast) {
                    let appointmentIterator: number = 0;
                    vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                        let howManyOpenPlaces: number = 0;
                        vaccineAppointmentRound.freePlaces.forEach(bool => {
                            if (bool == true) {
                                this.wholeAmountOfFree++;
                                howManyOpenPlaces++;
                            }
                        });
                        if (this.stillOpenDays[dayIterator] == undefined)
                            this.stillOpenDays[dayIterator] = new StillOpenDays(vaccineDay.date, new Array(vaccineDay.vaccineAppointments.length));
                        if (this.stillOpenDays[dayIterator].openTimes[appointmentIterator] == undefined)
                            this.stillOpenDays[dayIterator].openTimes[appointmentIterator] = vaccineAppointmentRound.startTime + howManyOpenPlaces.toString();
                        appointmentIterator++;
                    });
                    dayIterator++;
                }
            });

        }
    }

    public showAvailableDays(): void {
        this.stillOpenDays.forEach(day => {
            ConsoleHandling.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
            ConsoleHandling.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
            day.openTimes.forEach(time => {
                if (parseInt(time[5]) > 0)
                    ConsoleHandling.printInput(time.substring(0, 5).color_at_256(226) + "    (".color_at_256(118) + time.substring(5, 7).color_at_256(118) + ")".color_at_256(118));
                else
                    ConsoleHandling.printInput(time.substring(0, 5).color_at_256(226) + "    (".color_at_256(196) + time[5].color_at_256(196) + ")".color_at_256(196));
            });
            ConsoleHandling.printInput("");
        });
        ConsoleHandling.printInput("whole amount of " + "open ".color_at_256(118) + "vaccine appointments: " + this.wholeAmountOfFree.toString().color_at_256(118));
        ConsoleHandling.printInput("");
        ConsoleHandling.printInput("---registration---".color_at_256(226));
        ConsoleHandling.printInput("choose ".color_at_256(226) + "your favorite " + "date".color_at_256(118) +
            " from the list and the " + "suitable time".color_at_256(118) + "\n");
    }

    public async showAvaibleAppointmentsFromDateInput(): Promise<void> {
        let specificDate: string = await ConsoleHandling.question("on which date".color_at_256(226) + " you want to see " +
            "open ".color_at_256(118) + "appointments? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!CheckRegex.date(specificDate)) {
            ConsoleHandling.printInput("unvalid date format".color_at_256(196));
            this.showAvaibleAppointmentsFromDateInput();
        }
        this.stillOpenDays.forEach(openDay => {
            if (openDay.openDate == specificDate) {
                this.stillOpenDays.forEach(day => {
                    ConsoleHandling.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
                    ConsoleHandling.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
                    day.openTimes.forEach(time => {
                        if (parseInt(time[5]) > 0)
                            ConsoleHandling.printInput(time.substring(0, 5).color_at_256(226) + "      (".color_at_256(118) + time[5].color_at_256(118) + ")".color_at_256(118));
                        else
                            ConsoleHandling.printInput(time.substring(0, 5).color_at_256(226) + "      (100% full".color_at_256(196) + ")".color_at_256(196));
                    });
                    ConsoleHandling.printInput("");
                    ConsoleHandling.printInput("---registration---");
                    ConsoleHandling.printInput("choose ".color_at_256(226) + "your favorite " + "date".color_at_256(118) +
                        " from the list and the " + "suitable time".color_at_256(118) + "\n");
                });
            } else {
                ConsoleHandling.printInput("on this date are no appointments available anymore".color_at_256(196));
                Vaccinee.goBack();
            }
        });
    }

    public async checkOfValidInputFromUser(): Promise<boolean> {
        this.validDateReqeust = await ConsoleHandling.question("which date".color_at_256(226) + " do you choose to get " +
            "vaccinated".color_at_256(226) + "? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!CheckRegex.date(this.validDateReqeust)) {
            ConsoleHandling.printInput("unvalid date format".color_at_256(196));
            return false;
        }


        let isValidDate: boolean = false;
        this.stillOpenDays.forEach(openDay => {
            if (openDay.openDate == this.validDateReqeust)
                isValidDate = true;
        });
        if (!isValidDate)
            return false;

        this.validTimeRequest = await ConsoleHandling.question("on which time ".color_at_256(226) + "do you want to get " +
            "vaccinated".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
        if (!CheckRegex.timeAndPeriod(this.validTimeRequest, false)) {
            ConsoleHandling.printInput("unvalid time format".color_at_256(196));
            return false;
        }

        let validTime: boolean = false;
        this.stillOpenDays.forEach(openDay => {
            if (openDay.openDate == this.validDateReqeust)
                openDay.openTimes.forEach(time => {
                    if (time.substring(0, 5) == this.validTimeRequest)
                        if (parseInt(time.substring(5, 7)) > 0)
                            validTime = true;
                        else
                            validTime = false;
                });
        });
        return validTime;
    }
    public async checkOfEmailInDB(_inWaitingList?: boolean): Promise<void> {
        let email: string = await ConsoleHandling.question("please enter " + "email".color_at_256(226) + ": ");
        let isValid: boolean = true;
        if (!CheckRegex.email(email)) {
            ConsoleHandling.printInput("this is not a valid email");
            this.checkOfEmailInDB();
        }
        if (_inWaitingList) {
            this.waitingList.forEach(vaccineeInformation => {
                if (email == vaccineeInformation.email) {
                    ConsoleHandling.printInput("this email is " + "already registrated ".color_at_256(226) + "in waiting list");
                    isValid = false;
                }
            });
        } else
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                    vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                        if (email == vaccineeInformation.email) {
                            ConsoleHandling.printInput("this email is " + "already registrated ".color_at_256(226) + "in a appointment");
                            isValid = false;
                        }
                    });
                });
            });

        if (isValid)
            this.registrateUser(email, _inWaitingList);
        else
            Vaccinee.goBack();
    }

    private async registrateUser(_email?: string, _inWaitingList?: boolean): Promise<void> {

        let familyName: string = await ConsoleHandling.question("please enter " + "familyName".color_at_256(226) + ": ");
        let name: string = await ConsoleHandling.question("please enter " + "name".color_at_256(226) + ": ");
        let birth: string = await ConsoleHandling.question("please enter " + "birth".color_at_256(226) + ": ");
        let phone: string = await ConsoleHandling.question("please enter " + "phone".color_at_256(226) + ": ");
        let adress: string = await ConsoleHandling.question("please enter " + "adress".color_at_256(226) + ": ");
        let verficationNumber: string;

        if (!_inWaitingList) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.date == this.validDateReqeust)
                    vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                        if (this.validTimeRequest == vaccineAppointmentRound.startTime) {
                            verficationNumber = vaccineDay.verficationDayNumber.toString();
                            let isRegistrated: boolean = false;
                            let whichBoolToSet: number = 0;
                            vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                                if (!isRegistrated && vaccineeInformation.email == "") {
                                    vaccineeInformation.adress = adress;
                                    vaccineeInformation.birth = birth;
                                    vaccineeInformation.email = _email;
                                    vaccineeInformation.familyName = familyName;
                                    vaccineeInformation.name = name;
                                    vaccineeInformation.phone = phone;
                                    vaccineAppointmentRound.freePlaces[whichBoolToSet] = false;
                                    isRegistrated = true;
                                }
                                whichBoolToSet++;
                            });
                        }
                    });
            });
            FileHandler.writeFile("/data/vaccineDays.json", this.vaccineDatabase);

            let gmailService: GMailService = new GMailService();
            gmailService.sendMail(
                _email,
                "Vaccine Appointment on " + this.validDateReqeust,
                "Hello from vaccineMe," + " \n\n\n " + "you have successfully booked an appointment on " + this.validDateReqeust +
                " at " + this.validTimeRequest + ", " + " \n " + "Your Informations: " +
                " \n\n " + "Email: " + _email + " \n " + "family name: " + familyName + " \n " + "name: " + name + " \n " + "birth: " + birth + " \n "
                + "phone: " + phone + " \n " + "adress: " + adress + " \n " + "Your verification number: " + verficationNumber +
                " \n\n\n " + "thank you for supporting our app, stay healthy!");
            alert("you have successfully registrated to vaccine appointment, you will get an email with the important information");

        } else {
            let vaccineeInformation: VaccineeInformation = new VaccineeInformation(_email, familyName, name, birth, phone, adress);
            this.waitingList.push(vaccineeInformation);

            FileHandler.writeFile("/data/waitListVaccinees.json", this.waitingList);
            alert("you have successfully registrated into waitinglist, as soon as appointment is open you will get an email with information");
        }
        ConsoleHandling.closeConsole();
    }
}
