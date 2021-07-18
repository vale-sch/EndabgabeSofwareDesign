export class CheckRegex {
    private static _instance: CheckRegex = new CheckRegex();
    constructor() {
        if (CheckRegex._instance)
            throw new Error("Use Vaccinee.getInstance() instead new Vaccinee()");
        CheckRegex._instance = this;
    }

    public static getInstance(): CheckRegex {
        return CheckRegex._instance;
    }
    public date(_day: string): boolean {
        let dateReg: RegExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!_day.match(dateReg))
            return false;
        return true;
    }

    public timeAndPeriod(_time: string, _isPeriod: boolean): boolean {
        let hourReg: RegExp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (_isPeriod == true) {
            if (!_time.substring(0, 5).match(hourReg) || !_time.substring(6, 11).match(hourReg) || _time[5] != "-")
                return false;
        }
        else {
            if (!_time.match(hourReg))
                return false;
        }
        return true;
    }

    public email(_email: string): boolean {
        let emeailReg: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!_email.match(emeailReg))
            return false;
        return true;
    }
}
export default CheckRegex.getInstance();
