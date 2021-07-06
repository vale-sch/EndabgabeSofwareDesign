"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrator = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const VaccineDay_1 = require("./VaccineDay");
class Administrator {
    async adminLogin() {
        ConsoleHandling_1.default.printInput("Hello Admin!".color_at_256(195) + "\n");
        let username = await ConsoleHandling_1.default.question("Enter Admin Name:");
        if (username == "admin") {
            let password = await ConsoleHandling_1.default.question("Enter Password:");
            if (password == "password")
                this.showAdminMethods();
            else
                ConsoleHandling_1.default.closeConsole();
        }
        else
            ConsoleHandling_1.default.closeConsole();
    }
    async showAdminMethods() {
        // Davor muss hier noch das password und username abgefragt werden!
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. Create new vaccination day", "2. Get the day overview", "3. Get the percantage of open and booked Vaccinations", "4. Get the free clock times", "5. Get complete statistics", "6. Quit"], "Which " + "function".color_at_256(226) + " do you want me to use? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(answer) {
        switch (answer) {
            case "1":
                this.createNewDay();
                break;
            case "2":
                break;
            case "3":
                break;
            case "4":
                ConsoleHandling_1.default.printInput("search by box office greater than");
                break;
            case "5":
                break;
            case "6":
                ConsoleHandling_1.default.closeConsole();
            default:
                this.createNewDay();
                break;
        }
        await this.goNext();
    }
    async createNewDay() {
        let day = await ConsoleHandling_1.default.question("What is the " + "date".color_at_256(226) + " of the new vaccine day?" + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        //check valid information with regex
        // var dateReg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        // if (!day.match(dateReg))
        //     this.createNewDay();
        let period = await ConsoleHandling_1.default.question("What is the " + "period".color_at_256(226) + " of the new vaccine Day?" + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        // var hourReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        // if (!period.substring(0, 5).match(hourReg) || !period.substring(6, 11).match(hourReg) || period[5] != "-" ) // hier muss noch abgefrage werden ob 2 uhrzeit auch wirklcih später ist
        //     this.createNewDay();
        let parallelyVaccine = await ConsoleHandling_1.default.question("How many " + "parallely".color_at_256(226) + " vaccines are possible?" + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes = await ConsoleHandling_1.default.question("How " + "long".color_at_256(226) + " takes one vaccination ?" + "(" + "min".color_at_256(196) + ")" + ": ");
        //convert input to numbers
        let dayInNumber = new Array(parseInt("" + parseInt(day[0]) + parseInt(day[1] + parseInt(day[2]) + parseInt(day[3]))), parseInt("" + parseInt(day[5]) + parseInt(day[6])), parseInt("" + parseInt(day[8]) + parseInt(day[9])));
        let periodFromNumber = new Array(parseInt("" + parseInt(period[0]) + parseInt(period[1])), parseInt("" + parseInt(period[3]) + parseInt(period[4])));
        let periodToNumber = new Array(parseInt("" + parseInt(period[6]) + parseInt(period[7])), parseInt("" + parseInt(period[9]) + parseInt(period[10])));
        let parallelyVacccineNumber = parseInt(parallelyVaccine.substring(0, intervalsInMinutes.length));
        let intervalsInMinutesNumber = parseInt(intervalsInMinutes.substring(0, intervalsInMinutes.length));
        //che
        new VaccineDay_1.VaccineDay(dayInNumber, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber);
    }
    async goNext() {
        let answer = await ConsoleHandling_1.default.question("Back to overview? ");
        switch (answer.toLowerCase()) {
            case "y":
            case "yes":
            default:
                this.showAdminMethods();
                break;
            case "n":
            case "no":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Administrator = Administrator;
//# sourceMappingURL=Administrator.js.map