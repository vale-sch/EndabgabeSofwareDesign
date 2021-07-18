"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineeUtils = void 0;
const GMailService_1 = require("./GMailService");
const StillOpenDays_1 = require("./StillOpenDays");
const VaccineeInformation_1 = require("./VaccineeInformation");
const CheckRegex_1 = require("./CheckRegex");
const alert = require("alert");
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const Vaccinee_1 = require("./Vaccinee");
class VaccineeUtils {
    stillOpenDays;
    vaccineDatabase;
    waitingList;
    wholeAmountOfFree = 0;
    validDateReqeust;
    validTimeRequest;
    async userIntoWaitinglist() {
        ConsoleHandling_1.default.printInput("at " + "this time".color_at_256(226) + " there are " + "no open".color_at_256(196) + " vaccine appointments, do you want to " +
            "registrate".color_at_256(118) + " into the " + "waiting list".color_at_256(118) + "?");
        ConsoleHandling_1.default.printInput("");
        let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to Continue, or " +
            "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            default:
            case "y":
                this.checkOfEmailInDB(true);
                break;
            case "z":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
    calculateOpenAppointments() {
        let date = new Date().toJSON();
        let neededPart = date.substring(0, 10);
        let todayDateInNumbers = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
        let dayIterator = 0;
        this.wholeAmountOfFree = 0;
        if (this.vaccineDatabase.length > 0) {
            this.stillOpenDays = new Array(this.vaccineDatabase.length);
            console.log(this.stillOpenDays.length);
            this.vaccineDatabase.forEach(vaccineDay => {
                let isPast = false;
                if (vaccineDay.dateInNumbers[0] < todayDateInNumbers[0])
                    isPast = true;
                if (vaccineDay.dateInNumbers[0] == todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] < todayDateInNumbers[1])
                    isPast = true;
                if (vaccineDay.dateInNumbers[0] == todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] == todayDateInNumbers[1] && vaccineDay.dateInNumbers[2] < todayDateInNumbers[2])
                    isPast = true;
                if (!isPast) {
                    let appointmentIterator = 0;
                    vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                        let howManyOpenPlaces = 0;
                        vaccineAppointmentRound.freePlaces.forEach(bool => {
                            if (bool == true) {
                                this.wholeAmountOfFree++;
                                howManyOpenPlaces++;
                            }
                        });
                        if (this.stillOpenDays[dayIterator] == undefined)
                            this.stillOpenDays[dayIterator] = new StillOpenDays_1.StillOpenDays(vaccineDay.date, new Array(vaccineDay.vaccineAppointments.length));
                        if (this.stillOpenDays[dayIterator].openTimes[appointmentIterator] == undefined)
                            this.stillOpenDays[dayIterator].openTimes[appointmentIterator] = vaccineAppointmentRound.startTime + howManyOpenPlaces.toString();
                        appointmentIterator++;
                    });
                    dayIterator++;
                }
            });
        }
    }
    showAvailableDays() {
        this.stillOpenDays.forEach(day => {
            ConsoleHandling_1.default.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
            ConsoleHandling_1.default.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
            day.openTimes.forEach(time => {
                if (parseInt(time[5]) > 0)
                    ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + "    (".color_at_256(118) + time.substring(5, 7).color_at_256(118) + ")".color_at_256(118));
                else
                    ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + "    (".color_at_256(196) + time[5].color_at_256(196) + ")".color_at_256(196));
            });
            ConsoleHandling_1.default.printInput("");
        });
        ConsoleHandling_1.default.printInput("whole amount of " + "open ".color_at_256(118) + "vaccine appointments: " + this.wholeAmountOfFree.toString().color_at_256(118));
        ConsoleHandling_1.default.printInput("");
        ConsoleHandling_1.default.printInput("---registration---".color_at_256(226));
        ConsoleHandling_1.default.printInput("choose ".color_at_256(226) + "your favorite " + "date".color_at_256(118) +
            " from the list and the " + "suitable time".color_at_256(118) + "\n");
    }
    async showAvaibleAppointmentsFromDateInput() {
        let specificDate = await ConsoleHandling_1.default.question("on which date".color_at_256(226) + " you want to see " +
            "open ".color_at_256(118) + "appointments? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!CheckRegex_1.default.date(specificDate)) {
            ConsoleHandling_1.default.printInput("unvalid date format".color_at_256(196));
            this.showAvaibleAppointmentsFromDateInput();
        }
        this.stillOpenDays.forEach(openDay => {
            if (openDay.openDate == specificDate) {
                this.stillOpenDays.forEach(day => {
                    ConsoleHandling_1.default.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
                    ConsoleHandling_1.default.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
                    day.openTimes.forEach(time => {
                        if (parseInt(time[5]) > 0)
                            ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + "      (".color_at_256(118) + time[5].color_at_256(118) + ")".color_at_256(118));
                        else
                            ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + "      (100% full".color_at_256(196) + ")".color_at_256(196));
                    });
                    ConsoleHandling_1.default.printInput("");
                    ConsoleHandling_1.default.printInput("---registration---");
                    ConsoleHandling_1.default.printInput("choose ".color_at_256(226) + "your favorite " + "date".color_at_256(118) +
                        " from the list and the " + "suitable time".color_at_256(118) + "\n");
                });
            }
            else {
                ConsoleHandling_1.default.printInput("on this date are no appointments available anymore".color_at_256(196));
                Vaccinee_1.default.goBack();
            }
        });
    }
    async checkOfValidInputFromUser() {
        this.validDateReqeust = await ConsoleHandling_1.default.question("which date".color_at_256(226) + " do you choose to get " +
            "vaccinated".color_at_256(226) + "? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!CheckRegex_1.default.date(this.validDateReqeust)) {
            ConsoleHandling_1.default.printInput("unvalid date format".color_at_256(196));
            return false;
        }
        let isValidDate = false;
        this.stillOpenDays.forEach(openDay => {
            if (openDay.openDate == this.validDateReqeust)
                isValidDate = true;
        });
        if (!isValidDate)
            return false;
        this.validTimeRequest = await ConsoleHandling_1.default.question("on which time ".color_at_256(226) + "do you want to get " +
            "vaccinated".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
        if (!CheckRegex_1.default.timeAndPeriod(this.validTimeRequest, false)) {
            ConsoleHandling_1.default.printInput("unvalid time format".color_at_256(196));
            return false;
        }
        let validTime = false;
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
    async checkOfEmailInDB(_inWaitingList) {
        let email = await ConsoleHandling_1.default.question("please enter " + "email".color_at_256(226) + ": ");
        let isValid = true;
        if (!CheckRegex_1.default.email(email)) {
            ConsoleHandling_1.default.printInput("this is not a valid email");
            this.checkOfEmailInDB();
        }
        if (_inWaitingList) {
            this.waitingList.forEach(vaccineeInformation => {
                if (email == vaccineeInformation.email) {
                    ConsoleHandling_1.default.printInput("this email is " + "already registrated ".color_at_256(226) + "in waiting list");
                    isValid = false;
                }
            });
        }
        else
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                    vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                        if (email == vaccineeInformation.email) {
                            ConsoleHandling_1.default.printInput("this email is " + "already registrated ".color_at_256(226) + "in a appointment");
                            isValid = false;
                        }
                    });
                });
            });
        if (isValid)
            this.registrateUser(email, _inWaitingList);
        else
            Vaccinee_1.default.goBack();
    }
    async registrateUser(_email, _inWaitingList) {
        let familyName = await ConsoleHandling_1.default.question("please enter " + "familyName".color_at_256(226) + ": ");
        let name = await ConsoleHandling_1.default.question("please enter " + "name".color_at_256(226) + ": ");
        let birth = await ConsoleHandling_1.default.question("please enter " + "birth".color_at_256(226) + ": ");
        let phone = await ConsoleHandling_1.default.question("please enter " + "phone".color_at_256(226) + ": ");
        let adress = await ConsoleHandling_1.default.question("please enter " + "adress".color_at_256(226) + ": ");
        let verficationNumber;
        if (!_inWaitingList) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.date == this.validDateReqeust)
                    vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                        if (this.validTimeRequest == vaccineAppointmentRound.startTime) {
                            verficationNumber = vaccineDay.verficationDayNumber.toString();
                            let isRegistrated = false;
                            let whichBoolToSet = 0;
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
            FileHandler_1.default.writeFile("/data/vaccineDays.json", this.vaccineDatabase);
            let gmailService = new GMailService_1.GMailService();
            gmailService.sendMail(_email, "Vaccine Appointment on " + this.validDateReqeust, "Hello from vaccineMe," + " \n\n\n " + "you have successfully booked an appointment on " + this.validDateReqeust +
                " at " + this.validTimeRequest + ", " + " \n " + "Your Informations: " +
                " \n\n " + "Email: " + _email + " \n " + "family name: " + familyName + " \n " + "name: " + name + " \n " + "birth: " + birth + " \n "
                + "phone: " + phone + " \n " + "adress: " + adress + " \n " + "Your verification number: " + verficationNumber +
                " \n\n\n " + "thank you for supporting our app, stay healthy!");
            alert("you have successfully registrated to vaccine appointment, you will get an email with the important information");
        }
        else {
            let vaccineeInformation = new VaccineeInformation_1.VaccineeInformation(_email, familyName, name, birth, phone, adress);
            this.waitingList.push(vaccineeInformation);
            FileHandler_1.default.writeFile("/data/waitListVaccinees.json", this.waitingList);
            alert("you have successfully registrated into waitinglist, as soon as appointment is open you will get an email with information");
        }
        ConsoleHandling_1.default.closeConsole();
    }
}
exports.VaccineeUtils = VaccineeUtils;
//# sourceMappingURL=VaccineeUtils.js.map