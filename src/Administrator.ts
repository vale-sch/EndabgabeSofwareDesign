import ConsoleHandling from "./ConsoleHandling";
import { VaccineDay } from "./VaccineDay";


export class Administrator {


    public async adminLogin(): Promise<void> {
        ConsoleHandling.printInput("Hello Admin!".color_at_256(195) + "\n");
        let username: String = await ConsoleHandling.question("Enter Admin Name:");
        if (username == "admin") {
            let password: String = await ConsoleHandling.question("Enter Password:");
            if (password == "password")
                this.showAdminMethods();
            else
                ConsoleHandling.closeConsole();
        }
        else
            ConsoleHandling.closeConsole();

    }
    public async showAdminMethods(): Promise<void> {
        // Davor muss hier noch das password und username abgefragt werden!

        let answer: String = await ConsoleHandling.showPossibilities(["1. Create new vaccination day", "2. Get the day overview", "3. Get the percantage of open and booked Vaccinations", "4. Get the free clock times", "5. Get complete statistics", "6. Quit"], "Which " + "function".color_at_256(226) + " do you want me to use? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }

    public async handleAnswer(answer: String): Promise<void> {
        switch (answer) {
            case "1":
                this.createNewDay();
                break;
            case "2":
                break;
            case "3":
                break;
            case "4":
                ConsoleHandling.printInput("search by box office greater than");
                break;
            case "5":
                break;
            case "6":
                ConsoleHandling.closeConsole();
            default:
                this.createNewDay();
                break;
        }
        await this.goNext();
    }
    public async createNewDay(): Promise<void> {

        let day: String = await ConsoleHandling.question("What is the " + "date".color_at_256(226) + " of the new vaccine day?" + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        //check valid information with regex
        // var dateReg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        // if (!day.match(dateReg))
        //     this.createNewDay();

        let period: String = await ConsoleHandling.question("What is the " + "period".color_at_256(226) + " of the new vaccine Day?" + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        // var hourReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        // if (!period.substring(0, 5).match(hourReg) || !period.substring(6, 11).match(hourReg) || period[5] != "-" ) // hier muss noch abgefrage werden ob 2 uhrzeit auch wirklcih später ist
        //     this.createNewDay();

        let parallelyVaccine: String = await ConsoleHandling.question("How many " + "parallely".color_at_256(226) + " vaccines are possible?" + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes: String = await ConsoleHandling.question("How " + "long".color_at_256(226) + " takes one vaccination ?" + "(" + "min".color_at_256(196) + ")" + ": ");
        //convert input to numbers
        let dayInNumber: number[] = new Array(parseInt("" + parseInt(day[0]) + parseInt(day[1] + parseInt(day[2]) + parseInt(day[3]))), parseInt("" + parseInt(day[5]) + parseInt(day[6])), parseInt("" + parseInt(day[8]) + parseInt(day[9])));
        let periodFromNumber: number[] = new Array(parseInt("" + parseInt(period[0]) + parseInt(period[1])), parseInt("" + parseInt(period[3]) + parseInt(period[4])));
        let periodToNumber: number[] = new Array(parseInt("" + parseInt(period[6]) + parseInt(period[7])), parseInt("" + parseInt(period[9]) + parseInt(period[10])));
        let parallelyVacccineNumber: number = parseInt(parallelyVaccine.substring(0, intervalsInMinutes.length));
        let intervalsInMinutesNumber: number = parseInt(intervalsInMinutes.substring(0, intervalsInMinutes.length));

        //che
        new VaccineDay(dayInNumber, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber);

    }

    public async goNext(): Promise<void> {
        let answer: String = await ConsoleHandling.question("Back to overview? ");
        switch (answer.toLowerCase()) {
            case "y":
            case "yes":
            default:
                this.showAdminMethods();
                break;
            case "n":
            case "no":
                ConsoleHandling.closeConsole();
                break;
        }
    }

}