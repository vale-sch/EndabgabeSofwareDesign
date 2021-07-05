"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrator = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
class Administrator {
    async showAdminMethods() {
        // Davor muss hier noch das password und username abgefragt werden!
        ConsoleHandling_1.default.consoleLine.write("Hello Admin!".color_at_256(195));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. Create new Vaccination Day", "2. Get the Day Overview", "3. Get the percantage of open and booked Vaccinations", "4. Get the free clock times", "5. Get complete Statistics", "6. Quit"], "Which function do you want to use?(" + "1".color_at_256(118) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(answer) {
        switch (answer) {
            case "1":
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
                ConsoleHandling_1.default.consoleLine.close();
            default:
                break;
        }
        await this.goNext();
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
Administrator.username = "admin";
Administrator.password = "password";
//# sourceMappingURL=Administrator.js.map