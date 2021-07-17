"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vaccinee_1 = require("./Vaccinee");
const ConsoleHandling_1 = require("./ConsoleHandling");
const Colors = require("colors.ts");
const Administrator_1 = require("./Administrator");
startApp();
async function startApp() {
    Colors.enable();
    ConsoleHandling_1.default.printInput("");
    ConsoleHandling_1.default.printInput("welcome to our vaccine app!".color_at_256(195) + "\n\n" + "do you want an vaccination appointment?".color_at_256(226));
    let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to continue, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
    switch (answer.toLowerCase()) {
        default:
        case "y":
            Vaccinee_1.default.showVaccineeMethods();
            break;
        case "z":
            ConsoleHandling_1.default.closeConsole();
            break;
        case "a":
            let newAdmin = new Administrator_1.Administrator();
            newAdmin.adminLogin();
            break;
    }
}
//# sourceMappingURL=VaccineAppMain.js.map