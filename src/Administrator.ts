import ConsoleHandling from "./ConsoleHandling";
import Vaccinee from "./Vaccinee";
import { AdministratorUtils } from "./AdministratorUtils";
import CheckOfNullDB from "./CheckOfNullDB";

export class Administrator {

    private adminUtils: AdministratorUtils;

    public async adminLogin(): Promise<void> {
        let username: String = await ConsoleHandling.question("admin: ".color_at_256(196));
        if (username == "admin") {
            let password: String = await ConsoleHandling.question("password: ".color_at_256(196));
            if (password == "password") {
                ConsoleHandling.printInput("\n");
                ConsoleHandling.printInput("hello admin!".color_at_256(195));
                this.adminUtils = new AdministratorUtils(this);
                this.adminUtils.vaccineDatabase = CheckOfNullDB.getVaccineDays();
                this.showAdminMethods();
            }
            else
                ConsoleHandling.closeConsole();
        }
        else
            ConsoleHandling.closeConsole();
    }

    public async showAdminMethods(): Promise<void> {
        let answer: String = await ConsoleHandling.showPossibilities(["1. create new vaccination day", "2. get specific day overview", "3. get complete statistics overview", "4. enter vaccine role", "5. quit"],
            // tslint:disable-next-line: align
            "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }

    public async handleAnswer(answer: String): Promise<void> {
        switch (answer) {
            default:
            case "1":
                this.adminUtils.getInputForNewDayInformation();
                break;
            case "2":
                if (this.checkVaccineDB())
                    await this.adminUtils.getSpecificDay();
                else
                    this.showAdminMethods()
                break;
            case "3":
                if (this.checkVaccineDB())
                    await this.adminUtils.showStatisticsMenu();
                else
                    this.showAdminMethods()
                break;
            case "4":
                Vaccinee.showVaccineeMethods();
                break;
            case "5":
                ConsoleHandling.closeConsole();
                break;
        }
    }
    public checkVaccineDB(): boolean {
        if (this.adminUtils.vaccineDatabase.length > 0)
            return true;
        else {
            ConsoleHandling.printInput("no data in database".color_at_256(196) + " -> first you have to create a new day".color_at_256(118));
            return false;
        }
    }
    public async goBack(): Promise<void> {
        let answer: String = await ConsoleHandling.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            case "y":
            default:
                this.showAdminMethods();
                break;
            case "z":
                ConsoleHandling.closeConsole();
                break;
        }
    }
}
