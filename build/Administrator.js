"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrator = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const VaccineDayWriter_1 = require("./VaccineDayWriter");
class Administrator {
    vaccineDatabase;
    async adminLogin() {
        ConsoleHandling_1.default.printInput("hello admin!".color_at_256(195) + "\n");
        let username = await ConsoleHandling_1.default.question("enter Admin Name:");
        if (username == "admin") {
            let password = await ConsoleHandling_1.default.question("enter Password:");
            if (password == "password")
                this.showAdminMethods();
            else
                ConsoleHandling_1.default.closeConsole();
        }
        else
            ConsoleHandling_1.default.closeConsole();
    }
    async showAdminMethods() {
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. create new vaccination day", "2. get specific day overview", "3. get the percantage of open and booked Vaccinations",
            "4. get the free clock times", "5. get complete statistics", "6. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(answer) {
        switch (answer) {
            case "1":
                this.createNewDay();
                break;
            case "2":
                this.getSpecificDay();
                break;
            case "3":
                this.getPercantageOverAll();
                break;
            case "4":
                this.getOnlyFreeEvents();
                break;
            case "5":
                break;
            case "6":
                ConsoleHandling_1.default.closeConsole();
            default:
                this.createNewDay();
                break;
        }
    }
    async createNewDay() {
        let day = await ConsoleHandling_1.default.question("what is the " + "date".color_at_256(226) + " of the new vaccine day? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        //check valid information with regex
        if (!this.checkRegexDate(day))
            this.createNewDay();
        if (this.getActualDatabase(this.vaccineDatabase, true)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateString == day) {
                    ConsoleHandling_1.default.printInput("already in database".color_at_256(196) + "\n");
                    this.createNewDay();
                }
            });
        }
        let period = await ConsoleHandling_1.default.question("what is the " + "period (24h-format)".color_at_256(226) + " of the new vaccine Day? " + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        let hourReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!period.substring(0, 5).match(hourReg) || !period.substring(6, 11).match(hourReg) || period[5] != "-") {
            ConsoleHandling_1.default.printInput("unvalid period format".color_at_256(196) + "\n");
            this.createNewDay();
        }
        let parallelyVaccine = await ConsoleHandling_1.default.question("how many " + "parallely".color_at_256(226) + " vaccines are possible? " + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes = await ConsoleHandling_1.default.question("how " + "long".color_at_256(226) + " takes one vaccination? " + "(" + "min".color_at_256(196) + ")" + ": ");
        //convert input to numbers
        let periodFromNumber = new Array(parseInt("" + parseInt(period[0]) + parseInt(period[1])), parseInt("" + parseInt(period[3]) + parseInt(period[4])));
        let periodToNumber = new Array(parseInt("" + parseInt(period[6]) + parseInt(period[7])), parseInt("" + parseInt(period[9]) + parseInt(period[10])));
        let parallelyVacccineNumber = parseInt(parallelyVaccine.substring(0, intervalsInMinutes.length));
        let intervalsInMinutesNumber = parseInt(intervalsInMinutes.substring(0, intervalsInMinutes.length));
        if (intervalsInMinutesNumber >= 31 || parallelyVacccineNumber <= 0 || intervalsInMinutesNumber <= 0) {
            ConsoleHandling_1.default.printInput("you typed in some bad values, i will bring you back".color_at_256(196) + "\n");
            this.goBack();
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        new VaccineDayWriter_1.VaccineDayWriter(day, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber, this);
    }
    async getSpecificDay() {
        let specificDayRequest = await ConsoleHandling_1.default.question("which " + "date".color_at_256(226) + " are you looking for? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!this.checkRegexDate(specificDayRequest)) {
            this.getSpecificDay();
            return;
        }
        let hasFound = false;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateString == specificDayRequest) {
                    hasFound = true;
                    ConsoleHandling_1.default.printInput(JSON.stringify(vaccineDay, null, 2));
                    this.goBack();
                }
            });
            if (!hasFound) {
                ConsoleHandling_1.default.printInput("no data for this day".color_at_256(196) + "\n");
                this.goBack();
                return;
            }
        }
        else
            this.goBack();
        specificDayRequest = null;
    }
    async getPercantageOverAll() {
        let bookedAmount = 0;
        let stillFreeAmount = 0;
        let wholeAmount = 0;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineEventStructure.forEach(vaccineEventStructure => {
                    vaccineEventStructure.freePlaces.forEach(bool => {
                        wholeAmount++;
                        if (bool == false)
                            bookedAmount++;
                        else
                            stillFreeAmount++;
                    });
                });
            });
            ConsoleHandling_1.default.printInput("Booked Vaccination: ".color_at_256(196) + ((bookedAmount / wholeAmount) * 100).toString().color_at_256(196) + "%".color_at_256(196) + "\n" + "Still free Vaccination Events: ".color_at_256(118) + ((stillFreeAmount / wholeAmount) * 100).toString().color_at_256(118) + "%".color_at_256(118));
            this.goBack();
        }
        else
            this.goBack();
    }
    async getOnlyFreeEvents() {
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineEventStructure.forEach(vaccineEventStructure => {
                    vaccineEventStructure.freePlaces.forEach(bool => {
                        if (bool == true) {
                            ConsoleHandling_1.default.printInput(JSON.stringify(vaccineEventStructure, null, 2));
                            this.goBack();
                        }
                    });
                });
            });
        }
        else
            this.getSpecificDay();
    }
    // tslint:disable-next-line: no-any
    getActualDatabase(_vaccineDatabase, _isCheckingDays) {
        try {
            this.vaccineDatabase = FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        }
        catch (error) {
            if (!_isCheckingDays)
                ConsoleHandling_1.default.printInput("No Data in Database - make new vaccine day".color_at_256(196) + "\n");
        }
        if (this.vaccineDatabase == undefined)
            return false;
        else
            return true;
    }
    checkRegexDate(_day) {
        let dateReg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!_day.match(dateReg)) {
            ConsoleHandling_1.default.printInput("unvalid date format".color_at_256(196) + "\n");
            return false;
        }
        return true;
    }
    async goBack() {
        let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            case "y":
            default:
                this.showAdminMethods();
                break;
            case "z":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Administrator = Administrator;
//# sourceMappingURL=Administrator.js.map