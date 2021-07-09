"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrator = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const VaccineDayWriter_1 = require("./VaccineDayWriter");
const Vaccinee_1 = require("./Vaccinee");
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
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. create new vaccination day", "2. get specific day overview", "3. get complete statistics overview", "4. enter vaccine role", "5. quit"], 
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
                this.showStatisticsMenu();
                break;
            case "4":
                this.enterMemberRole();
                break;
            case "5":
                ConsoleHandling_1.default.closeConsole();
                break;
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
                    ConsoleHandling_1.default.printInput("date already in database".color_at_256(196));
                    this.createNewDay();
                }
            });
        }
        let period = await ConsoleHandling_1.default.question("what is the " + "period (24h-format)".color_at_256(226) + " of the new vaccine Day? " + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        let hourReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!period.substring(0, 5).match(hourReg) || !period.substring(6, 11).match(hourReg) || period[5] != "-") {
            ConsoleHandling_1.default.printInput("unvalid period format".color_at_256(196));
            this.createNewDay();
        }
        let parallelyVaccine = await ConsoleHandling_1.default.question("how many " + "parallely".color_at_256(226) + " vaccines are possible? " + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes = await ConsoleHandling_1.default.question("how " + "long".color_at_256(226) + " takes one vaccination? " + "(" + "min".color_at_256(196) + ")" + ": ");
        this.convertStrings(day, period, parallelyVaccine, intervalsInMinutes);
    }
    convertStrings(_day, _period, _parallelyVaccines, _intervalsInMinutes) {
        //convert input to numbers
        let dayInNumber = new Array(parseInt(_day.substring(0, 4)), parseInt(_day.substring(5, 7)), parseInt(_day.substring(8, 10)));
        let periodFromNumber = new Array(parseInt("" + parseInt(_period[0]) + parseInt(_period[1])), parseInt("" + parseInt(_period[3]) + parseInt(_period[4])));
        let periodToNumber = new Array(parseInt("" + parseInt(_period[6]) + parseInt(_period[7])), parseInt("" + parseInt(_period[9]) + parseInt(_period[10])));
        let parallelyVacccineNumber = parseInt(_parallelyVaccines.substring(0, _intervalsInMinutes.length));
        let intervalsInMinutesNumber = parseInt(_intervalsInMinutes.substring(0, _intervalsInMinutes.length));
        if (intervalsInMinutesNumber >= 31 || parallelyVacccineNumber <= 0 || intervalsInMinutesNumber <= 0) {
            ConsoleHandling_1.default.printInput("you typed in some bad values, i will bring you back".color_at_256(196));
            this.goBack();
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        new VaccineDayWriter_1.VaccineDayWriter(_day, dayInNumber, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber, this);
    }
    async getSpecificDay() {
        let specificDayRequest = await ConsoleHandling_1.default.question("which " + "date".color_at_256(226) + " are you looking for? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!this.checkRegexDate(specificDayRequest)) {
            this.getSpecificDay();
            return;
        }
        let specificVaccineDay;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateString == specificDayRequest)
                    specificVaccineDay = vaccineDay;
            });
            if (!specificVaccineDay) {
                ConsoleHandling_1.default.printInput("no data for this day".color_at_256(196) + "\n");
                this.goBack();
                return;
            }
            else {
                let answer = await ConsoleHandling_1.default.showPossibilities(["1. show percantage of day statistics", "2. show free appointments on this day", "3. go back"], 
                // tslint:disable-next-line: align
                "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
                switch (answer) {
                    default:
                    case "1":
                        this.showPercantageOfDay(specificVaccineDay);
                        break;
                    case "2":
                        this.showFreeAppointmentsOfDay(specificVaccineDay);
                        break;
                    case "3":
                        this.goBack();
                        break;
                }
            }
        }
        specificDayRequest = null;
    }
    async showPercantageOfDay(_specificDay) {
        let openAmount = 0;
        _specificDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    openAmount++;
            });
        });
        let bookedAmount = _specificDay.totalAmountOfVaccines - openAmount;
        ConsoleHandling_1.default.printInput("booked Vaccination: ".color_at_256(196) + ((bookedAmount / _specificDay.totalAmountOfVaccines) * 100).toFixed(2).toString().color_at_256(196) +
            "%".color_at_256(196) + "\n" + "still free vaccination appointments: ".color_at_256(118) +
            ((openAmount / _specificDay.totalAmountOfVaccines) * 100).toFixed(2).toString().color_at_256(118) + "%".color_at_256(118));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show free appointments on this day" + "(" + _specificDay.dateString.color_at_256(196) + ")", "2. go back"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.showFreeAppointmentsOfDay(_specificDay);
                break;
            case "2":
                this.goBack();
                break;
        }
    }
    async showFreeAppointmentsOfDay(_specificDay) {
        ConsoleHandling_1.default.printInput("date: ".color_at_256(226) + _specificDay.dateString.color_at_256(51) + ", ".color_at_256(226) +
            "  time between vaccines on this day: ".color_at_256(226) + _specificDay.timeBetweenVaccines.toString().color_at_256(51));
        ConsoleHandling_1.default.printInput("verfification number: ".color_at_256(226) + _specificDay.verficationDayNumber.toString().color_at_256(51) +
            "  total amount on this day: ".color_at_256(226) + _specificDay.totalAmountOfVaccines.toString().color_at_256(51));
        ConsoleHandling_1.default.printInput("open times:".color_at_256(226));
        _specificDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            let counterOfOpenAppointments = 0;
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    counterOfOpenAppointments++;
            });
            if (counterOfOpenAppointments > 0)
                ConsoleHandling_1.default.printInput(vaccineAppointmentRound.start.toString() + "  (" + counterOfOpenAppointments.toString().color_at_256(118) + ")");
            else
                ConsoleHandling_1.default.printInput(vaccineAppointmentRound.start.toString() + "  (" + counterOfOpenAppointments.toString().color_at_256(196) + ")");
        });
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show percantage of day" + "(" + _specificDay.dateString.color_at_256(196) + ")" + " statistics", "2. go back"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.showPercantageOfDay(_specificDay);
                break;
            case "2":
                this.goBack();
                break;
        }
    }
    async showStatisticsMenu() {
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show statistics for all days and how many appointments are still open",
            "2. show free appointments in the past", "3. show free appointments in the future", "4. go back"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.getPercantageOverAll();
                break;
            case "2":
                this.getFreeEvents(true);
                break;
            case "3":
                this.getFreeEvents(false);
                break;
            case "4":
                this.goBack();
                break;
        }
    }
    getPercantageOverAll() {
        let bookedAmount = 0;
        let stillFreeAmount = 0;
        let wholeAmount = 0;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                    vaccineAppointmentRound.freePlaces.forEach(bool => {
                        wholeAmount++;
                        if (bool == false)
                            bookedAmount++;
                        else
                            stillFreeAmount++;
                    });
                });
            });
            ConsoleHandling_1.default.printInput("");
            ConsoleHandling_1.default.printInput("All Vaccinations in Database : ".color_at_256(51) + wholeAmount.toString().color_at_256(51));
            ConsoleHandling_1.default.printInput("");
            ConsoleHandling_1.default.printInput("Booked Vaccination: ".color_at_256(196) + ((bookedAmount / wholeAmount) * 100).toString().color_at_256(196) +
                "%".color_at_256(196) + "\n" + "Still free Vaccination Events: ".color_at_256(118) + ((stillFreeAmount / wholeAmount) * 100).toString().color_at_256(118) + "%".color_at_256(118));
            ConsoleHandling_1.default.printInput("");
            this.showStatisticsMenu();
        }
    }
    getFreeEvents(_isPast) {
        let date = new Date().toJSON();
        let neededPart = date.substring(0, 10);
        let todayInNumbers = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
        let openAppointmentsInPast = 0;
        let openAppointmentsInFuture = 0;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (_isPast) {
                    if (vaccineDay.dateInNumbers[0] < todayInNumbers[0])
                        openAppointmentsInPast = this.calculateOpenAppointments(vaccineDay, openAppointmentsInPast);
                    if (vaccineDay.dateInNumbers[0] == todayInNumbers[0]) {
                        if (vaccineDay.dateInNumbers[1] < todayInNumbers[1])
                            openAppointmentsInPast = this.calculateOpenAppointments(vaccineDay, openAppointmentsInPast);
                        if (vaccineDay.dateInNumbers[1] == todayInNumbers[1])
                            if (vaccineDay.dateInNumbers[2] < todayInNumbers[2])
                                openAppointmentsInPast = this.calculateOpenAppointments(vaccineDay, openAppointmentsInPast);
                    }
                }
                else {
                    if (vaccineDay.dateInNumbers[0] > todayInNumbers[0])
                        openAppointmentsInFuture = this.calculateOpenAppointments(vaccineDay, openAppointmentsInFuture);
                    if (vaccineDay.dateInNumbers[0] == todayInNumbers[0]) {
                        if (vaccineDay.dateInNumbers[1] > todayInNumbers[1])
                            openAppointmentsInFuture = this.calculateOpenAppointments(vaccineDay, openAppointmentsInFuture);
                        if (vaccineDay.dateInNumbers[1] == todayInNumbers[1])
                            if (vaccineDay.dateInNumbers[2] > todayInNumbers[2])
                                openAppointmentsInFuture = this.calculateOpenAppointments(vaccineDay, openAppointmentsInFuture);
                    }
                }
            });
            if (_isPast)
                ConsoleHandling_1.default.printInput(openAppointmentsInPast.toString().color_at_256(196) + " appointments which " + "werent booked".color_at_256(196) + " and therefore " + "wasted".color_at_256(196));
            else
                ConsoleHandling_1.default.printInput(openAppointmentsInFuture.toString().color_at_256(118) + " appointments which are " + "open ".color_at_256(118) + "for" + " next appointments".color_at_256(118));
            this.showStatisticsMenu();
        }
    }
    enterMemberRole() {
        let newMember = new Vaccinee_1.Vaccinee();
        newMember.showVaccineeMethods();
    }
    calculateOpenAppointments(_vaccineDay, _increment) {
        _vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    _increment++;
            });
        });
        return _increment;
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