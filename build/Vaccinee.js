"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const lodash_1 = require("lodash");
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const GMailService_1 = require("./GMailService");
const StillOpenDays_1 = require("./StillOpenDays");
class Vaccinee {
    wholeAmountOfFree = 0;
    stillOpenDays;
    vaccineDatabase;
    dateReqeust;
    timeNumberFormat;
    async showVaccineeMethods() {
        if (this.vaccineDatabase == undefined) {
            ConsoleHandling_1.default.printInput("hello Vaccinee!".color_at_256(195));
        }
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show open appointments for vaccination & registrate", "2. search in specific date for vaccination & registrate", "3. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(_answer) {
        switch (_answer) {
            default:
            case "1":
                this.stillOpenDays = this.getOpenAppointments();
                this.showAvailableDays(this.stillOpenDays);
                let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to" + " registrate".color_at_256(226) +
                    " yourself, or " + "Z".color_at_256(196) + " to go back (" + "Y".color_at_256(118) + "): ");
                switch (answer.toLowerCase()) {
                    default:
                    case "y":
                        if (await this.checkOfValidInputFromUser(this.stillOpenDays))
                            this.registrateUser();
                        else {
                            ConsoleHandling_1.default.printInput("wrong date or time input");
                            this.goBack();
                        }
                        break;
                    case "z":
                        this.showVaccineeMethods();
                        break;
                }
                break;
            case "2":
                this.stillOpenDays = this.getOpenAppointments();
                if (await this.checkOfValidInputFromUser(this.stillOpenDays))
                    this.registrateUser();
                else {
                    ConsoleHandling_1.default.printInput("wrong date or time input");
                    this.goBack();
                }
                break;
            case "3":
                ConsoleHandling_1.default.closeConsole();
        }
    }
    getOpenAppointments() {
        let date = new Date().toJSON();
        let neededPart = date.substring(0, 10);
        let todayDateInNumbers = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
        let amountOfFreeDays = 0;
        let stillOpenDays;
        let dayIterator = 0;
        if (this.getActualDatabase(this.vaccineDatabase, false))
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateInNumbers[0] >= todayDateInNumbers[0] && vaccineDay.dateInNumbers[1]
                    >= todayDateInNumbers[1] && vaccineDay.dateInNumbers[2] >= todayDateInNumbers[2]) {
                    let dayHasOpenAppointment = false;
                    let howMuchPlaces = 0;
                    vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                        let hasAppointmentOpenPlaces = false;
                        vaccineAppointmentRound.freePlaces.forEach(bool => {
                            if (bool == true) {
                                dayHasOpenAppointment = true;
                                hasAppointmentOpenPlaces = true;
                            }
                        });
                        if (hasAppointmentOpenPlaces)
                            howMuchPlaces++;
                    });
                    if (dayHasOpenAppointment)
                        amountOfFreeDays++;
                    if (stillOpenDays == undefined)
                        stillOpenDays = new Array(amountOfFreeDays);
                    if (stillOpenDays[dayIterator] == undefined)
                        stillOpenDays[dayIterator] = new StillOpenDays_1.StillOpenDays(vaccineDay.dateString, new Array(howMuchPlaces));
                }
                let appointmentIteratorStartTimeIterator = 0;
                vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                    let amountOfFreeTimes = 0;
                    let hasAppointmentOpenPlaces = false;
                    vaccineAppointmentRound.freePlaces.forEach(bool => {
                        if (bool == true) {
                            this.wholeAmountOfFree++;
                            amountOfFreeTimes++;
                            hasAppointmentOpenPlaces = true;
                        }
                    });
                    if (hasAppointmentOpenPlaces) {
                        if (stillOpenDays[dayIterator].openTimes[appointmentIteratorStartTimeIterator] == undefined)
                            stillOpenDays[dayIterator].openTimes[appointmentIteratorStartTimeIterator] = vaccineAppointmentRound.start.toString() + " (" + amountOfFreeTimes + ")";
                        appointmentIteratorStartTimeIterator++;
                    }
                });
                dayIterator++;
            });
        return stillOpenDays;
    }
    showAvailableDays(_stillOpenDays) {
        _stillOpenDays.forEach(day => {
            ConsoleHandling_1.default.printInput("");
            ConsoleHandling_1.default.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(118));
            ConsoleHandling_1.default.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
            ConsoleHandling_1.default.printInput("");
            day.openTimes.forEach(time => {
                if (time[3] == "0")
                    ConsoleHandling_1.default.printInput(time.substring(0, 4).color_at_256(226) + "0".color_at_256(226) + " am  " + time.substring(5, 9).color_at_256(118));
                else if (time[4] == " ")
                    ConsoleHandling_1.default.printInput(time.substring(0, 3).color_at_256(226) + "0".color_at_256(226) + time[3].color_at_256(226) + " am  " + time.substring(5, 9).color_at_256(118));
                else
                    ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + " am " + time.substring(5, 9).color_at_256(118));
            });
        });
        ConsoleHandling_1.default.printInput("");
        ConsoleHandling_1.default.printInput("whole amount of " + "open ".color_at_256(118) + "vaccine appointments: " + this.wholeAmountOfFree.toString().color_at_256(118));
        ConsoleHandling_1.default.printInput("");
        ConsoleHandling_1.default.printInput("please " + "note down ".color_at_256(226) + "your favourite " + "day".color_at_256(118) +
            " from the list and the " + "suitable time".color_at_256(118) + "\n");
    }
    async checkOfValidInputFromUser(_stillOpenDays) {
        this.dateReqeust = await ConsoleHandling_1.default.question("which date".color_at_256(226) + " are you looking forward to " + "vaccinate".color_at_256(226) + "? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        let isValidDate = false;
        _stillOpenDays.forEach(openDay => {
            if (openDay.openDate == this.dateReqeust)
                isValidDate = true;
        });
        if (!isValidDate)
            return false;
        let timeRequest = await ConsoleHandling_1.default.question("when ".color_at_256(226) + "do you want to get " + "vaccinaded".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
        this.timeNumberFormat = new Array(lodash_1.toInteger(timeRequest.substring(0, 2)), lodash_1.toInteger(timeRequest.substring(3, 5)));
        let formatedTimeRequest = this.timeNumberFormat[0].toString() + "," + +this.timeNumberFormat[1].toString();
        let validTime = false;
        _stillOpenDays.forEach(openDay => {
            openDay.openTimes.forEach(time => {
                if (time[4] == " ") {
                    if (time.substring(0, 4) == formatedTimeRequest)
                        validTime = true;
                }
                else if (time.substring(0, 5) == formatedTimeRequest)
                    validTime = true;
            });
        });
        return validTime;
    }
    async registrateUser() {
        let email = await ConsoleHandling_1.default.question("please enter " + "email".color_at_256(226) + ": ");
        let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!email.match(regexp)) {
            ConsoleHandling_1.default.printInput("this is not a valid email");
            this.registrateUser();
        }
        let calculatedVaccineDayCache = this.vaccineDatabase;
        calculatedVaccineDayCache.forEach(vaccineDay => {
            vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                    if (email == vaccineeInformation.email) {
                        ConsoleHandling_1.default.printInput("this email is " + "already registrated".color_at_256(226));
                        this.goBack();
                        return;
                    }
                });
            });
        });
        let familyName = await ConsoleHandling_1.default.question("please enter " + "familyName".color_at_256(226) + ": ");
        let name = await ConsoleHandling_1.default.question("please enter " + "name".color_at_256(226) + ": ");
        let birth = await ConsoleHandling_1.default.question("please enter " + "birth".color_at_256(226) + ": ");
        let phone = await ConsoleHandling_1.default.question("please enter " + "phone".color_at_256(226) + ": ");
        let adress = await ConsoleHandling_1.default.question("please enter " + "adress".color_at_256(226) + ": ");
        calculatedVaccineDayCache.forEach(vaccineDay => {
            if (vaccineDay.dateString == this.dateReqeust)
                vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                    if (this.timeNumberFormat[0] + this.timeNumberFormat[1] == vaccineAppointmentRound.start[0] + vaccineAppointmentRound.start[1]) {
                        let isRegistrated = false;
                        let whichBoolToSet = 0;
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
                    FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", calculatedVaccineDayCache);
                });
        });
        ConsoleHandling_1.default.printInput("you have successfully registrated!");
        let gmailService = new GMailService_1.GMailService();
        gmailService.sendMail(email, "Vaccine Appointment" + this.dateReqeust, "Hello from VaccineApp,  you have successfully booked appointment on " + this.timeNumberFormat.toString() + ", thank you for supporting this app");
        this.goBack();
    }
    getActualDatabase(_vaccineDatabase, _isCheckingDays) {
        try {
            this.vaccineDatabase = FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        }
        catch (error) {
            if (!_isCheckingDays) {
                ConsoleHandling_1.default.printInput("no data in database - make new vaccine day".color_at_256(196) + "\n");
                this.goBack();
            }
        }
        if (this.vaccineDatabase == undefined)
            return false;
        else
            return true;
    }
    async goBack() {
        let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            case "y":
            default:
                this.showVaccineeMethods();
                break;
            case "z":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Vaccinee = Vaccinee;
//# sourceMappingURL=Vaccinee.js.map