"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministratorUtils = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const CheckOfNullDB_1 = require("./CheckOfNullDB");
const CheckRegex_1 = require("./CheckRegex");
const VaccineDayWriter_1 = require("./VaccineDayWriter");
class AdministratorUtils {
    vaccineDatabase;
    admin;
    constructor(_admin) {
        this.admin = _admin;
    }
    async getInputForNewDayInformation() {
        let day = await ConsoleHandling_1.default.question("what is the " + "date".color_at_256(226) + " of the new vaccine day? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        //check valid information with regex
        if (!CheckRegex_1.default.date(day)) {
            ConsoleHandling_1.default.printInput("unvalid date format".color_at_256(196));
            this.getInputForNewDayInformation();
        }
        if (this.vaccineDatabase.length > 0) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.date == day) {
                    ConsoleHandling_1.default.printInput("date already in database".color_at_256(196));
                    this.getInputForNewDayInformation();
                }
            });
        }
        let period = await ConsoleHandling_1.default.question("when is the " + "start and end time (24h-format)".color_at_256(226) +
            " of the new vaccine Day? " + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        if (!CheckRegex_1.default.timeAndPeriod(period, true)) {
            ConsoleHandling_1.default.printInput("unvalid period format".color_at_256(196));
            this.getInputForNewDayInformation();
        }
        let parallelyVaccine = await ConsoleHandling_1.default.question("how many " + "parallely".color_at_256(226) +
            " vaccines are possible? " + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes = await ConsoleHandling_1.default.question("how " + "long".color_at_256(226) +
            " takes one vaccination? " + "(" + "min".color_at_256(196) + ")" + ": ");
        this.convertStringsAndWriteDay(day, period, parallelyVaccine, intervalsInMinutes);
    }
    async getSpecificDay() {
        let specificDayRequest = await ConsoleHandling_1.default.question("which " + "date".color_at_256(226) + " are you looking for? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!CheckRegex_1.default.date(specificDayRequest)) {
            ConsoleHandling_1.default.printInput("unvalid date format".color_at_256(196));
            this.getSpecificDay();
            return;
        }
        let specificVaccineDay;
        this.vaccineDatabase.forEach(vaccineDay => {
            if (vaccineDay.date == specificDayRequest)
                specificVaccineDay = vaccineDay;
        });
        if (!specificVaccineDay) {
            ConsoleHandling_1.default.printInput("no data for this day".color_at_256(196));
            this.admin.goBack();
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
                    this.admin.goBack();
                    break;
            }
        }
        specificDayRequest = null;
    }
    async showPercantageOfDay(_specificDay) {
        let openAmount = 0;
        _specificDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    openAmount++;
            });
        });
        let bookedAmount = _specificDay.totalAmountOfVaccines - openAmount;
        ConsoleHandling_1.default.printInput("booked vaccination: ".color_at_256(196) + ((bookedAmount / _specificDay.totalAmountOfVaccines) * 100).toFixed(2).toString().color_at_256(196) +
            "%".color_at_256(196));
        ConsoleHandling_1.default.printInput("");
        ConsoleHandling_1.default.printInput("still free vaccination appointments: ".color_at_256(118) +
            ((openAmount / _specificDay.totalAmountOfVaccines) * 100).toFixed(2).toString().color_at_256(118) + "%".color_at_256(118));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show free appointments on this day" + "(" + _specificDay.date.color_at_256(196) + ")", "2. go back"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.showFreeAppointmentsOfDay(_specificDay);
                break;
            case "2":
                this.admin.goBack();
                break;
        }
    }
    async showFreeAppointmentsOfDay(_specificDay) {
        ConsoleHandling_1.default.printInput("date: ".color_at_256(226) + _specificDay.date.color_at_256(51) + ", ".color_at_256(226) +
            "  time between vaccines on this day: ".color_at_256(226) + _specificDay.timeBetweenVaccines.toString().color_at_256(51) + ", ".color_at_256(226));
        ConsoleHandling_1.default.printInput("verification number: ".color_at_256(226) + _specificDay.verficationDayNumber.toString().color_at_256(51) +
            ", ".color_at_256(226) + "  total amount of vaccinations on this day: ".color_at_256(226) + _specificDay.totalAmountOfVaccines.toString().color_at_256(51));
        ConsoleHandling_1.default.printInput("");
        ConsoleHandling_1.default.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
        _specificDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
            let counterOfOpenAppointments = 0;
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    counterOfOpenAppointments++;
            });
            if (counterOfOpenAppointments > 0)
                ConsoleHandling_1.default.printInput(vaccineAppointmentRound.startTime.color_at_256(226) + "     (".color_at_256(118) + counterOfOpenAppointments.toString().color_at_256(118) + ")".color_at_256(118));
            else
                ConsoleHandling_1.default.printInput(vaccineAppointmentRound.startTime.color_at_256(226) + "     (".color_at_256(196) + counterOfOpenAppointments.toString().color_at_256(196) + ")".color_at_256(196));
        });
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show percantage of day" + "(" + _specificDay.date.color_at_256(196) + ")" + " statistics", "2. go back"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.showPercantageOfDay(_specificDay);
                break;
            case "2":
                this.admin.goBack();
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
                this.admin.showAdminMethods();
                break;
        }
    }
    getPercantageOverAll() {
        let bookedAmount = 0;
        let stillFreeAmount = 0;
        let wholeAmount = 0;
        if (this.vaccineDatabase.length > 0) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
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
            ConsoleHandling_1.default.printInput("all vaccinations in database : " + wholeAmount.toString().color_at_256(226));
            ConsoleHandling_1.default.printInput("");
            ConsoleHandling_1.default.printInput("booked vaccination: " + ((bookedAmount / wholeAmount) * 100).toFixed(2).toString().color_at_256(196) +
                "%".color_at_256(196));
            ConsoleHandling_1.default.printInput("");
            ConsoleHandling_1.default.printInput("still free vaccination events: " + ((stillFreeAmount / wholeAmount) * 100).toFixed(2).toString().color_at_256(118) +
                "%".color_at_256(118));
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
        if (this.vaccineDatabase.length > 0) {
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
                ConsoleHandling_1.default.printInput(openAppointmentsInFuture.toString().color_at_256(118) + " appointments which are " + "open ".color_at_256(118) + "for" + " next vaccinations".color_at_256(118));
            this.showStatisticsMenu();
        }
    }
    convertStringsAndWriteDay(_day, _period, _parallelyVaccines, _intervalsInMinutes) {
        //convert input to numbers
        let dayInNumber = new Array(parseInt(_day.substring(0, 4)), parseInt(_day.substring(5, 7)), parseInt(_day.substring(8, 10)));
        let periodFromNumber = new Array(parseInt("" + parseInt(_period[0]) + parseInt(_period[1])), parseInt("" + parseInt(_period[3]) + parseInt(_period[4])));
        let periodToNumber = new Array(parseInt("" + parseInt(_period[6]) + parseInt(_period[7])), parseInt("" + parseInt(_period[9]) + parseInt(_period[10])));
        let parallelyVacccineNumber = parseInt(_parallelyVaccines.substring(0, _parallelyVaccines.length));
        let intervalsInMinutesNumber = parseInt(_intervalsInMinutes.substring(0, _intervalsInMinutes.length));
        if (_intervalsInMinutes == "" || _parallelyVaccines == "" || intervalsInMinutesNumber >= 61) {
            ConsoleHandling_1.default.printInput("you typed in some bad value, i will bring you back".color_at_256(196));
            this.admin.goBack();
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        new VaccineDayWriter_1.VaccineDayWriter(_day, dayInNumber, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber, this.admin);
        this.vaccineDatabase = CheckOfNullDB_1.default.getVaccineDays();
    }
    calculateOpenAppointments(_vaccineDay, _increment) {
        _vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    _increment++;
            });
        });
        return _increment;
    }
}
exports.AdministratorUtils = AdministratorUtils;
//# sourceMappingURL=AdministratorUtils.js.map