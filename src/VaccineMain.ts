import { Vaccinee } from "./Vaccinee";
import ConsoleHandling from "./ConsoleHandling";
import { Administrator } from "./administrator";
import Colors = require('colors.ts');

startApp();

async function startApp(): Promise<void> {
    ConsoleHandling.consoleLine.write(" \n");
    Colors.enable();
    ConsoleHandling.consoleLine.write("Welcome to our Vaccinee App!".color_at_256(195) + "\n\n" + "Do you want an Vaccination Appointment?".color_at_256(226));
    ConsoleHandling.consoleLine.write(" \n");
    let answer: String = await ConsoleHandling.question("Press " + "Y".color_at_256(118) + " to Continue, or " + "Z".color_at_256(160) + " to quit (" + "Y".color_at_256(118) + "): ");

    let vaccinee: Vaccinee = new Vaccinee();
    ConsoleHandling.consoleLine.write("\n");
    switch (answer.toLowerCase()) {
        case "y":
            vaccinee.showVaccineeMethods();
            break;
        case "z":
            ConsoleHandling.closeConsole();
            break;
        case "a":
            vaccinee = null;
            const admin: Administrator = new Administrator();
            admin.showAdminMethods();
            break;
        default:
            vaccinee.showVaccineeMethods();
            break;
    }
}



