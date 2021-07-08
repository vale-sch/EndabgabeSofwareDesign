"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineDayWriter = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const CalculatedVaccineDay_1 = require("./CalculatedVaccineDay");
const VaccineAppointmentStructure_1 = require("./VaccineAppointmentStructure");
class VaccineDayWriter {
    dateString;
    dateInNumbers;
    periodFrom;
    periodTo;
    parallelyVaccines;
    timeBetweeenVaccines;
    admin;
    constructor(_dateString, _dateInNumbers, _periodFrom, _periodTo, _parallelyVaccines, _timeBetweeenVaccines, _admin) {
        this.dateString = _dateString;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweeenVaccines = _timeBetweeenVaccines;
        this.admin = _admin;
        this.calculateAppointmentAmount();
    }
    calculateAppointmentAmount() {
        let hoursBegin = this.periodFrom[0];
        let minutesBegin = this.periodFrom[1];
        let hoursStop = this.periodTo[0];
        let minutesStop = this.periodTo[1];
        let timeDifference = Math.abs(hoursBegin - hoursStop) * 60;
        if ((hoursBegin - hoursStop) >= 0) {
            if (minutesBegin - minutesStop >= 0 || (hoursBegin - hoursStop) > 0) {
                ConsoleHandling_1.default.printInput("dude you going backward - wrong period input".color_at_256(196) + "\n");
                this.admin.goBack();
                return;
            }
        }
        if ((minutesBegin - minutesStop) < 0)
            timeDifference += Math.abs(minutesBegin - minutesStop);
        else
            timeDifference -= Math.abs(minutesBegin - minutesStop);
        let eventAmount = Math.round((timeDifference / this.timeBetweeenVaccines) * this.parallelyVaccines);
        let vaccineAppointmentStructure = new Array(Math.round(timeDifference / this.timeBetweeenVaccines));
        this.createAppointmentStructure(eventAmount, minutesBegin, hoursBegin, vaccineAppointmentStructure);
    }
    createAppointmentStructure(_eventAmount, _minutesBegin, _hoursBegin, _vaccineAppointmentStructure) {
        let modoloNumber = this.parallelyVaccines;
        let oldModuloNumber = 1;
        let eventCounterModulo = 1;
        let hoursAfter = _hoursBegin;
        let minAfter = _minutesBegin;
        for (let eventCounter = 1; eventCounter <= _eventAmount; eventCounter++) {
            if (eventCounter % this.parallelyVaccines == 0) {
                minAfter += this.timeBetweeenVaccines;
                if (minAfter != 0)
                    if (minAfter % 60 == 0) {
                        hoursAfter++;
                        minAfter = 0;
                    }
                _vaccineAppointmentStructure[eventCounterModulo] = new VaccineAppointmentStructure_1.VaccineAppointmentStructur(this.dateString, new Array(oldModuloNumber, modoloNumber), 
                // tslint:disable-next-line: align
                new Array(_hoursBegin, _minutesBegin), new Array(hoursAfter, minAfter), new Array(this.parallelyVaccines).fill(false));
                _minutesBegin = minAfter;
                _hoursBegin = hoursAfter;
                eventCounterModulo++;
                oldModuloNumber = modoloNumber + 1;
                modoloNumber += this.parallelyVaccines;
            }
        }
        _vaccineAppointmentStructure.shift();
        let uniqueNumber = Math.round(Date.now() + Math.random());
        let newCalculatedVaccineDay = new CalculatedVaccineDay_1.CalculatedVaccineDay(this.dateString, this.dateInNumbers, uniqueNumber, this.periodFrom, this.periodTo, this.parallelyVaccines, this.timeBetweeenVaccines, _eventAmount, _vaccineAppointmentStructure);
        this.writeNewDay(newCalculatedVaccineDay);
    }
    writeNewDay(_newCalculatedVaccineDay) {
        try {
            FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        }
        catch (error) {
            console.log("building JSON for first time...");
            FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", []);
        }
        let vaccineDays = FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        vaccineDays.push(_newCalculatedVaccineDay);
        FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", vaccineDays);
        ConsoleHandling_1.default.printInput("you have succesfully created a new vaccine day!".color_at_256(118));
        this.admin.goBack();
    }
}
exports.VaccineDayWriter = VaccineDayWriter;
//# sourceMappingURL=VaccineDayWriter.js.map