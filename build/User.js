"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const RegisteredUser_1 = require("./RegisteredUser");
class User {
    constructor(_statistic) {
        this._statistic = _statistic;
        if (User._instance)
            throw new Error("use user.getInstance instead of new User");
        User._instance = this;
    }
    static getInstance() {
        return User._instance;
    }
    async register() {
        let newUser = await ConsoleHandling_1.default.question("Enter your new Nickname: ");
        let userArray = FileHandler_1.default.readArrayFile("../EndabgabeSofwareDesign/data/users.json");
        userArray.forEach(user => {
            if (user.username == newUser) {
                console.log("This name is already taken!");
                this.register();
            }
        });
        let newPassword = await ConsoleHandling_1.default.question("Enter your new Password: ");
        userArray.push(new RegisteredUser_1.RegisteredUser(newUser, newPassword));
        // Noch in REGEX prüfen!! Task
        FileHandler_1.default.writeFile("../EndabgabeSofwareDesign/data/users.json", userArray);
        console.log("You have successfully registered!");
    }
    login() {
        console.log("Method // login");
    }
    playQuiz() {
        console.log("Method // playQuiz");
    }
    watchStats() {
        console.log("Method // watchStats");
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map