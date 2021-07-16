"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrator = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const Vaccinee_1 = require("./Vaccinee");
const AdministratorUtils_1 = require("./AdministratorUtils");
class Administrator {
    static _instance = new Administrator();
    constructor() {
        if (Administrator._instance)
            throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
        Administrator._instance = this;
    }
    static getInstance() {
        return Administrator._instance;
    }
    async adminLogin() {
        let username = await ConsoleHandling_1.default.question("admin: ".color_at_256(196));
        if (username == "admin") {
            let password = await ConsoleHandling_1.default.question("password: ".color_at_256(196));
            if (password == "password") {
                ConsoleHandling_1.default.printInput("hello admin!".color_at_256(195) + "\n");
                this.showAdminMethods();
            }
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
                AdministratorUtils_1.default.getInputForNewDayInformation();
                break;
            case "2":
                AdministratorUtils_1.default.getSpecificDay();
                break;
            case "3":
                AdministratorUtils_1.default.showStatisticsMenu();
                break;
            case "4":
                Vaccinee_1.default.showVaccineeMethods();
                break;
            case "5":
                ConsoleHandling_1.default.closeConsole();
                break;
            default:
                AdministratorUtils_1.default.getInputForNewDayInformation();
                break;
        }
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
exports.default = Administrator.getInstance();
//# sourceMappingURL=Administrator.js.map