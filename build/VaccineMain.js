"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vaccinee_1 = require("./Vaccinee");
const ConsoleHandling_1 = require("./ConsoleHandling");
const administrator_1 = require("./administrator");
const Colors = require("colors.ts");
startApp();
async function startApp() {
    Colors.enable();
    ConsoleHandling_1.default.printInput("Welcome to our Vaccinee App!".color_at_256(195) + "\n\n" + "Do you want an Vaccination Appointment?".color_at_256(226));
    let answer = await ConsoleHandling_1.default.question("Press " + "Y".color_at_256(118) + " to Continue, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
    let vaccinee = new Vaccinee_1.Vaccinee();
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
            //admin.adminLogin();
            break;
        default:
            vaccinee.showVaccineeMethods();
            break;
    }
}
//# sourceMappingURL=VaccineMain.js.map