import { Vaccinee } from "./Vaccinee";
import ConsoleHandling from "./ConsoleHandling";
import { Administrator } from "./administrator";
import Colors = require('colors.ts');



startApp();

async function startApp(): Promise<void> {

    Colors.enable();
    ConsoleHandling.printInput("Welcome to our Vaccinee App!".color_at_256(195) + "\n\n" + "Do you want an Vaccination Appointment?".color_at_256(226));

    let answer: String = await ConsoleHandling.question("Press " + "Y".color_at_256(118) + " to Continue, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");

    let vaccinee: Vaccinee = new Vaccinee();
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
            //admin.adminLogin();
            break;
        default:
            vaccinee.showVaccineeMethods();
            break;
    }

}



