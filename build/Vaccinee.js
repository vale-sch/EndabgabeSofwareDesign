"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
class Vaccinee {
    async showVaccineeMethods() {
        ConsoleHandling_1.default.printInput("hello Vaccinee!".color_at_256(195));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show Open Events for Vaccination", "2. search for specific Date", "3. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
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
        let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            case "y":
            default:
                this.showVaccineeMethods();
                break;
            case "z":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Vaccinee = Vaccinee;
//# sourceMappingURL=Vaccinee.js.map