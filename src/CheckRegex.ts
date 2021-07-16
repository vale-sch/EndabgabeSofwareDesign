import ConsoleHandling from "./ConsoleHandling";

export class CheckRegex {
    private static _instance: CheckRegex = new CheckRegex();
    constructor() {
        if (CheckRegex._instance)
            throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
        CheckRegex._instance = this;
    }
    public static getInstance(): CheckRegex {
        return CheckRegex._instance;
    }

    public date(_day: String): boolean {
        let dateReg: RegExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!_day.match(dateReg)) {
            ConsoleHandling.printInput("unvalid date format".color_at_256(196) + "\n");
            return false;
        }
        return true;
    }
    public timeAndPeriod(_period: String, _noPeriod?: boolean): boolean {
        let hourReg: RegExp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (_noPeriod != true) {
            if (!_period.substring(0, 5).match(hourReg) || !_period.substring(6, 11).match(hourReg) || _period[5] != "-") {
                ConsoleHandling.printInput("unvalid period format".color_at_256(196));
                return false;
            }
        }
        else {
            if (!_period.match(hourReg)) {
                ConsoleHandling.printInput("unvalid time format".color_at_256(196));
                return false;
            }
        }
        return true;
    }
    public email(_email: String): boolean {
        let emeailReg: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!_email.match(emeailReg)) {
            ConsoleHandling.printInput("unvalid email format");
            return false;
        }
        return true;
    }
}
export default CheckRegex.getInstance();