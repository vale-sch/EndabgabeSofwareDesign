import ConsoleHandling from "./ConsoleHandling";
import Vaccinee from "./Vaccinee";
import AdministratorUtils from "./AdministratorUtils";

export class Administrator {
    private static _instance: Administrator = new Administrator();

    constructor() {
        if (Administrator._instance)
            throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
        Administrator._instance = this;
    }
    public static getInstance(): Administrator {
        return Administrator._instance;
    }

    public async adminLogin(): Promise<void> {
        let username: String = await ConsoleHandling.question("admin: ".color_at_256(196));
        if (username == "admin") {
            let password: String = await ConsoleHandling.question("password: ".color_at_256(196));
            if (password == "password") {
                ConsoleHandling.printInput("hello admin!".color_at_256(195) + "\n");
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
            case "1":
                AdministratorUtils.getInputForNewDayInformation();
                break;
            case "2":
                AdministratorUtils.getSpecificDay();
                break;
            case "3":
                AdministratorUtils.showStatisticsMenu();
                break;
            case "4":
                Vaccinee.showVaccineeMethods();
                break;
            case "5":
                ConsoleHandling.closeConsole();
                break;
            default:
                AdministratorUtils.getInputForNewDayInformation();
                break;
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
export default Administrator.getInstance();