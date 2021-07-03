"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quizapp = void 0;
const User_1 = require("./User");
const ConsoleHandling_1 = require("./ConsoleHandling");
const Statistic_1 = require("./Statistic");
class Quizapp {
    constructor() {
        this._user = new User_1.User(new Statistic_1.Statistic(0, 0, 0));
        this._user = User_1.User.getInstance();
    }
    async showMethods() {
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. Play a Quiz", "2. Login", "3. Register", "4. Show Statistic"], "Which function do you want to use? (default 1): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(answer) {
        switch (answer) {
            case "1":
                this.showAllQuizzes();
                break;
            case "2":
                this._user.login();
                break;
            case "3":
                await this._user.register();
                break;
            case "4":
                ConsoleHandling_1.default.printInput("search by box office greater than");
                break;
            default:
                this.showAllQuizzes();
                break;
        }
        await this.goNext();
    }
    showAllQuizzes() {
        ConsoleHandling_1.default.printInput("\n");
        ConsoleHandling_1.default.printInput("Hier sind 5 Quizze");
        for (let index in this._quizzes) {
            let quiz = this._quizzes[index];
            let _index = Number.parseInt(index) + 1;
            ConsoleHandling_1.default.printInput(`${_index}. Quizname: ${quiz.title}`);
        }
    }
    async goNext() {
        let answer = await ConsoleHandling_1.default.question("Back to overview? ");
        switch (answer.toLowerCase()) {
            case "y":
            case "yes":
            default:
                this.showMethods();
                break;
            case "n":
            case "no":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Quizapp = Quizapp;
//# sourceMappingURL=Quizapp.js.map