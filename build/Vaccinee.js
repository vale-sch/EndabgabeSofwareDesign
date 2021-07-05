"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
class Vaccinee {
    async showVaccineeMethods() {
        ConsoleHandling_1.default.consoleLine.write("Hello Vaccinee!".color_at_256(195));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. Show Open Events for Vaccination", "2. Search for specific Date", "3. QuitApp"], "Which function do you want to use?(" + "Y".color_at_256(192) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(answer) {
        let wantClose = false;
        switch (answer) {
            case "1":
                break;
            case "2":
                break;
            case "3":
                wantClose = true;
                ConsoleHandling_1.default.closeConsole();
            default:
                break;
        }
        if (!wantClose)
            await this.goNext();
    }
    async goNext() {
        let answer = await ConsoleHandling_1.default.question("Back to overview? ");
        switch (answer.toLowerCase()) {
            case "y":
            case "yes":
            default:
                this.showVaccineeMethods();
                break;
            case "n":
            case "no":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Vaccinee = Vaccinee;
//# sourceMappingURL=Vaccinee.js.map