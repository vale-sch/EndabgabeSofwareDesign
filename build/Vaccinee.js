"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const VaccineeUtils_1 = require("./VaccineeUtils");
class Vaccinee {
    static _instance = new Vaccinee();
    stillOpenDays;
    constructor() {
        if (Vaccinee._instance)
            throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
        Vaccinee._instance = this;
    }
    static getInstance() {
        return Vaccinee._instance;
    }
    async showVaccineeMethods() {
        if (VaccineeUtils_1.default.vaccineDatabase == undefined)
            ConsoleHandling_1.default.printInput("hello Vaccinee!".color_at_256(195));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show open appointments for vaccination & registrate",
            "2. search in specific date for vaccination & registrate", "3. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(_answer) {
        switch (_answer) {
            default:
            case "1":
                if (VaccineeUtils_1.default.getActualVaccineDatabase()) {
                    this.stillOpenDays = VaccineeUtils_1.default.calculateOpenAppointments();
                    if (VaccineeUtils_1.default.wholeAmountOfFree == 0) {
                        await VaccineeUtils_1.default.userIntoWaitinglist();
                        return;
                    }
                    VaccineeUtils_1.default.showAvailableDays(this.stillOpenDays);
                    if (await VaccineeUtils_1.default.checkOfValidInputFromUser(this.stillOpenDays))
                        VaccineeUtils_1.default.registrateUser();
                    else {
                        ConsoleHandling_1.default.printInput("no available appointments at this date or at this time on the day");
                        await this.goBack();
                    }
                }
                else
                    await VaccineeUtils_1.default.userIntoWaitinglist();
                break;
            case "2":
                if (VaccineeUtils_1.default.getActualVaccineDatabase()) {
                    this.stillOpenDays = VaccineeUtils_1.default.calculateOpenAppointments();
                    if (VaccineeUtils_1.default.wholeAmountOfFree == 0) {
                        await VaccineeUtils_1.default.userIntoWaitinglist();
                        return;
                    }
                    await VaccineeUtils_1.default.showAvaibleAppointmentsFromDateInput(this.stillOpenDays);
                    if (await VaccineeUtils_1.default.checkOfValidInputFromUser(this.stillOpenDays))
                        VaccineeUtils_1.default.registrateUser();
                    else {
                        ConsoleHandling_1.default.printInput("wrong date or time input");
                        await this.goBack();
                    }
                }
                else
                    await VaccineeUtils_1.default.userIntoWaitinglist();
                break;
            case "3":
                ConsoleHandling_1.default.closeConsole();
        }
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
exports.default = Vaccinee.getInstance();
//# sourceMappingURL=Vaccinee.js.map