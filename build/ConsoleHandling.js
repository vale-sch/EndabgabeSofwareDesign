"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
class ConsoleHandling {
    static _instance = new ConsoleHandling();
    // logger object with syslog levels as specified loglevels
    // logs into build_service.log in directory log and onto console of running node.js process
    consoleLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    constructor() {
        if (ConsoleHandling._instance)
            throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
        ConsoleHandling._instance = this;
    }
    static getInstance() {
        return ConsoleHandling._instance;
    }
    question(question) {
        return new Promise((resolve) => {
            this.consoleLine.question(question.toString(), (_answer) => {
                resolve(_answer);
            });
        });
    }
    showPossibilities(showPossibilities, question) {
        this.consoleLine.write("\n");
        this.consoleLine.write("what want you do? ".color_at_256(226));
        this.consoleLine.write("\n");
        for (let possibility of showPossibilities) {
            this.consoleLine.write(possibility.toString());
            this.consoleLine.write("\n");
        }
        this.consoleLine.write("\n");
        return new Promise((resolve) => this.consoleLine.question(question.toString(), (answer) => {
            resolve(answer);
        }));
    }
    printInput(input) {
        this.consoleLine.write(input);
        this.consoleLine.write("\n");
    }
    closeConsole() {
        this.consoleLine.close();
    }
}
exports.default = ConsoleHandling.getInstance();
//# sourceMappingURL=ConsoleHandling.js.map