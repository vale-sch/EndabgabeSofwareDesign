import Vaccinee from "./Vaccinee";
import ConsoleHandling from "./ConsoleHandling";
import Colors = require("colors.ts");
import { Administrator } from "./Administrator";
startApp();

async function startApp(): Promise<void> {
    Colors.enable();
    ConsoleHandling.printInput("");
    ConsoleHandling.printInput("welcome to our vaccine app!".color_at_256(195) + "\n\n" + "do you want an vaccination appointment?".color_at_256(226));

    let answer: String = await ConsoleHandling.question("press " + "Y".color_at_256(118) + " to continue, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
    switch (answer.toLowerCase()) {
        default:
        case "y":
            Vaccinee.showVaccineeMethods();
            break;
        case "z":
            ConsoleHandling.closeConsole();
            break;
        case "a":
            let newAdmin: Administrator = new Administrator();
            newAdmin.adminLogin();
            break;
    }
}



