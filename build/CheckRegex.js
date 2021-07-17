"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRegex = void 0;
class CheckRegex {
    date(_day) {
        let dateReg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!_day.match(dateReg))
            return false;
        return true;
    }
    timeAndPeriod(_timeString, _isPeriod) {
        let hourReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (_isPeriod == true) {
            if (!_timeString.substring(0, 5).match(hourReg) || !_timeString.substring(6, 11).match(hourReg) || _timeString[5] != "-")
                return false;
        }
        else {
            if (!_timeString.match(hourReg))
                return false;
        }
        return true;
    }
    email(_email) {
        let emeailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!_email.match(emeailReg))
            return false;
        return true;
    }
}
exports.CheckRegex = CheckRegex;
//# sourceMappingURL=CheckRegex.js.map