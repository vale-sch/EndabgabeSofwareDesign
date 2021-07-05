"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vaccinee_1 = require("./Vaccinee");
const ConsoleHandling_1 = require("./ConsoleHandling");
const administrator_1 = require("./administrator");
const Colors = require("colors.ts");
startApp();
async function startApp() {
    ConsoleHandling_1.default.consoleLine.write(" \n");
    Colors.enable();
    ConsoleHandling_1.default.consoleLine.write("Welcome to our Vaccinee App!".color_at_256(195) + " \n" + "Do you want an Vaccination Appointment?" + " \n");
    let answer = await ConsoleHandling_1.default.question("Press 'Y' to Continue, or 'Z' to quit (" + "Y".color_at_256(192) + "): ");
    let vaccinee = new Vaccinee_1.Vaccinee();
    ConsoleHandling_1.default.consoleLine.write("\n");
    switch (answer.toLowerCase()) {
        case "y":
            vaccinee.showVaccineeMethods();
            break;
        case "z":
            ConsoleHandling_1.default.closeConsole();
            break;
        case "a":
            vaccinee = null;
            const admin = new administrator_1.Administrator();
            admin.showAdminMethods();
            break;
        default:
            vaccinee.showVaccineeMethods();
            break;
    }
}
//# sourceMappingURL=VaccineMain.js.map