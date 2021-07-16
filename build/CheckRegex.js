"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRegex = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
class CheckRegex {
    static _instance = new CheckRegex();
    constructor() {
        if (CheckRegex._instance)
            throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
        CheckRegex._instance = this;
    }
    static getInstance() {
        return CheckRegex._instance;
    }
    date(_day) {
        let dateReg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!_day.match(dateReg)) {
            ConsoleHandling_1.default.printInput("unvalid date format".color_at_256(196) + "\n");
            return false;
        }
        return true;
    }
    timeAndPeriod(_period, _noPeriod) {
        let hourReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (_noPeriod != true) {
            if (!_period.substring(0, 5).match(hourReg) || !_period.substring(6, 11).match(hourReg) || _period[5] != "-") {
                ConsoleHandling_1.default.printInput("unvalid period format".color_at_256(196));
                return false;
            }
        }
        else {
            if (!_period.match(hourReg)) {
                ConsoleHandling_1.default.printInput("unvalid time format".color_at_256(196));
                return false;
            }
        }
        return true;
    }
    email(_email) {
        let emeailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!_email.match(emeailReg)) {
            ConsoleHandling_1.default.printInput("unvalid email format");
            return false;
        }
        return true;
    }
}
exports.CheckRegex = CheckRegex;
exports.default = CheckRegex.getInstance();
//# sourceMappingURL=CheckRegex.js.map