"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const CheckOfNullDB_1 = require("./CheckOfNullDB");
const ConsoleHandling_1 = require("./ConsoleHandling");
const VaccineeUtils_1 = require("./VaccineeUtils");
class Vaccinee {
    static _instance = new Vaccinee();
    vaccineeUtils = new VaccineeUtils_1.VaccineeUtils();
    constructor() {
        if (Vaccinee._instance)
            throw new Error("Use Vaccinee.getInstance() instead new Vaccinee()");
        Vaccinee._instance = this;
    }
    static getInstance() {
        return Vaccinee._instance;
    }
    async showVaccineeMethods() {
        if (this.vaccineeUtils.vaccineDatabase == undefined) {
            this.vaccineeUtils.vaccineDatabase = CheckOfNullDB_1.default.getVaccineDays();
            this.vaccineeUtils.waitingList = CheckOfNullDB_1.default.getWaitList();
            ConsoleHandling_1.default.printInput("hello Vaccinee!".color_at_256(195));
        }
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show open appointments for vaccination & registrate",
            "2. search in specific date for vaccination & registrate", "3. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
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
    async handleAnswer(_answer) {
        switch (_answer) {
            default:
            case "1":
                if (this.vaccineeUtils.vaccineDatabase.length > 0) {
                    this.vaccineeUtils.calculateOpenAppointments();
                    if (this.vaccineeUtils.wholeAmountOfFree == 0) {
                        await this.vaccineeUtils.userIntoWaitinglist();
                        return;
                    }
                    this.vaccineeUtils.showAvailableDays();
                    if (await this.vaccineeUtils.checkOfValidInputFromUser())
                        this.vaccineeUtils.checkOfEmailInDB();
                    else {
                        ConsoleHandling_1.default.printInput("no available appointments at this date or at this time on the day");
                        await this.goBack();
                    }
                }
                else
                    await this.vaccineeUtils.userIntoWaitinglist();
                break;
            case "2":
                if (this.vaccineeUtils.vaccineDatabase.length > 0) {
                    this.vaccineeUtils.calculateOpenAppointments();
                    if (this.vaccineeUtils.wholeAmountOfFree == 0) {
                        await this.vaccineeUtils.userIntoWaitinglist();
                        return;
                    }
                    await this.vaccineeUtils.showAvaibleAppointmentsFromDateInput();
                    if (await this.vaccineeUtils.checkOfValidInputFromUser())
                        this.vaccineeUtils.checkOfEmailInDB();
                    else {
                        ConsoleHandling_1.default.printInput("wrong date or time input");
                        await this.goBack();
                    }
                }
                else
                    await this.vaccineeUtils.userIntoWaitinglist();
                break;
            case "3":
                ConsoleHandling_1.default.closeConsole();
        }
    }
}
exports.Vaccinee = Vaccinee;
exports.default = Vaccinee.getInstance();
//# sourceMappingURL=Vaccinee.js.map