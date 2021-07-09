"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const lodash_1 = require("lodash");
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
class Vaccinee {
    vaccineDatabase;
    async showVaccineeMethods() {
        ConsoleHandling_1.default.printInput("hello Vaccinee!".color_at_256(195));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show open appointments for vaccination & registrate", "2. search in specific date for vaccination & registrate", "3. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(answer) {
        switch (answer) {
            default:
            case "1":
                this.getOpenAppointments();
                break;
            case "2":
                break;
            case "3":
                ConsoleHandling_1.default.closeConsole();
        }
    }
    getOpenAppointments() {
        let date = new Date().toJSON();
        let neededPart = date.substring(0, 10);
        let todayDateInNumbers = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
        let wholeAmountOfFree = 0;
        let amountOfFreeDays = 0;
        let amountOfFreeTimes = 0;
        let openEventDates;
        let openEventTimes;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            openEventDates = new Array(this.vaccineDatabase.length);
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateInNumbers[0] >= todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] >= todayDateInNumbers[1]
                    && vaccineDay.dateInNumbers[2] >= todayDateInNumbers[2]) {
                    ConsoleHandling_1.default.printInput("date: " + vaccineDay.dateString);
                    let isSomeAppointmentFree = false;
                    vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                        let isFree = 0;
                        vaccineAppointmentRound.freePlaces.forEach(bool => {
                            if (bool == true) {
                                isFree++;
                                wholeAmountOfFree++;
                                isSomeAppointmentFree = true;
                            }
                        });
                        if (isFree > 0) {
                            ConsoleHandling_1.default.printInput(vaccineAppointmentRound.start.toString() + "  (" + isFree.toString().color_at_256(118) + ")");
                            amountOfFreeTimes++;
                        }
                    });
                    if (amountOfFreeTimes > 0) {
                        let counterOfEventTimes = 0;
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
                    ConsoleHandling_1.default.printInput("");
                }
            });
            ConsoleHandling_1.default.printInput("whole amount of " + "free vaccine appointments".color_at_256(118) + ": " + wholeAmountOfFree.toString().color_at_256(118));
            ConsoleHandling_1.default.printInput("");
        }
        this.registrateMe(openEventDates, openEventTimes);
    }
    async registrateMe(_openAppointmentsDate, _openAppointmentTimes) {
        let dateReqeust = await ConsoleHandling_1.default.question("do you want to " + "registrate".color_at_256(226) + "? enter date of chosen vaccine day " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        let isValidDate = false;
        _openAppointmentsDate.forEach(date => {
            if (date == dateReqeust)
                isValidDate = true;
        });
        if (!isValidDate)
            this.goBack();
        let timeRequest = await ConsoleHandling_1.default.question("when ".color_at_256(226) + "do you want to get " + "vaccinaded".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
        let timeNumberFormat = new Array(lodash_1.toInteger(timeRequest.substring(0, 2)), lodash_1.toInteger(timeRequest.substring(3, 5)));
        let formatedTimeRequest = timeNumberFormat[0].toString() + timeNumberFormat[1];
        let validTime = false;
        _openAppointmentTimes.forEach(openTimes => {
            if (openTimes == formatedTimeRequest)
                validTime = true;
        });
        if (validTime) {
            let email = await ConsoleHandling_1.default.question("please enter " + "email".color_at_256(226) + ": ");
            let familyName = await ConsoleHandling_1.default.question("please enter " + "familyName".color_at_256(226) + ": ");
            let name = await ConsoleHandling_1.default.question("please enter " + "name".color_at_256(226) + ": ");
            let birth = await ConsoleHandling_1.default.question("please enter " + "birth".color_at_256(226) + ": ");
            let phone = await ConsoleHandling_1.default.question("please enter " + "phone".color_at_256(226) + ": ");
            let adress = await ConsoleHandling_1.default.question("please enter " + "adress".color_at_256(226) + ": ");
            let calculatedVaccineDayCache = this.vaccineDatabase;
            calculatedVaccineDayCache.forEach(vaccineDay => {
                if (vaccineDay.dateString == dateReqeust)
                    vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                        if (timeNumberFormat[0] + timeNumberFormat[1] == vaccineAppointmentRound.start[0] + vaccineAppointmentRound.start[1]) {
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
            console.log("you have successfully registrated!");
            this.goBack();
        }
        else {
            console.log("this time is not avaible or not avaible anymore!");
        }
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