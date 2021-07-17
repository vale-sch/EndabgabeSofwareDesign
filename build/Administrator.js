"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrator = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const Vaccinee_1 = require("./Vaccinee");
const AdministratorUtils_1 = require("./AdministratorUtils");
const CheckOfNullDB_1 = require("./CheckOfNullDB");
class Administrator {
    adminUtils;
    async adminLogin() {
        let username = await ConsoleHandling_1.default.question("admin: ".color_at_256(196));
        if (username == "admin") {
            let password = await ConsoleHandling_1.default.question("password: ".color_at_256(196));
            if (password == "password") {
                ConsoleHandling_1.default.printInput("\n");
                ConsoleHandling_1.default.printInput("hello admin!".color_at_256(195));
                this.adminUtils = new AdministratorUtils_1.AdministratorUtils(this);
                this.adminUtils.vaccineDatabase = CheckOfNullDB_1.default.getVaccineDays();
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
            default:
            case "1":
                this.adminUtils.getInputForNewDayInformation();
                break;
            case "2":
                if (this.checkVaccineDB())
                    await this.adminUtils.getSpecificDay();
                else
                    this.showAdminMethods();
                break;
            case "3":
                if (this.checkVaccineDB())
                    await this.adminUtils.showStatisticsMenu();
                else
                    this.showAdminMethods();
                break;
            case "4":
                Vaccinee_1.default.showVaccineeMethods();
                break;
            case "5":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
    checkVaccineDB() {
        if (this.adminUtils.vaccineDatabase.length > 0)
            return true;
        else {
            ConsoleHandling_1.default.printInput("no data in database".color_at_256(196) + " -> first you have to create a new day".color_at_256(118));
            return false;
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
//# sourceMappingURL=Administrator.js.map