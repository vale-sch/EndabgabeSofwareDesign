"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineDayWriter = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const VaccineDay_1 = require("./VaccineDay");
const VaccineEventStructure_1 = require("./VaccineEventStructure");
class VaccineDayWriter {
    dateString;
    periodFrom;
    periodTo;
    parallelyVaccines;
    timeBetweeenVaccines;
    admin;
    constructor(_dateString, _periodFrom, _periodTo, _parallelyVaccines, _timeBetweeenVaccines, _admin) {
        this.dateString = _dateString;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweeenVaccines = _timeBetweeenVaccines;
        this.admin = _admin;
        this.calculateEvents();
    }
    calculateEvents() {
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
        let vaccineEventStructure = new Array(Math.round(timeDifference / this.timeBetweeenVaccines));
        let modoloNumber = this.parallelyVaccines;
        let oldModuloNumber = 1;
        let eventCounterModulo = 1;
        for (let eventCounter = 1; eventCounter <= eventAmount; eventCounter++) {
            if (eventCounter % this.parallelyVaccines == 0) {
                if (minutesBegin != 0)
                    if (minutesBegin % 60 == 0) {
                        hoursBegin++;
                        minutesBegin = 0;
                    }
                vaccineEventStructure[eventCounterModulo] = new VaccineEventStructure_1.VaccineEventStructur(this.dateString, new Array(oldModuloNumber, modoloNumber), new Array(hoursBegin, minutesBegin), new Array(hoursBegin, minutesBegin + this.timeBetweeenVaccines), new Array(this.parallelyVaccines).fill(true));
                minutesBegin += this.timeBetweeenVaccines;
                eventCounterModulo++;
                oldModuloNumber = modoloNumber + 1;
                modoloNumber += this.parallelyVaccines;
            }
        }
        vaccineEventStructure.shift();
        let uniqueNumber = Math.round(Date.now() + Math.random());
        // tslint:disable-next-line: no-any
        let newStructuredVaccineDay = new VaccineDay_1.VaccineDay(this.dateString, uniqueNumber, this.periodFrom, this.periodTo, this.parallelyVaccines, this.timeBetweeenVaccines, eventAmount, vaccineEventStructure);
        // tslint:disable-next-line: no-any
        try {
            FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        }
        catch (error) {
            console.log("building JSON for first time...");
            FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", []);
        }
        // tslint:disable-next-line: no-any
        let vaccineDays = FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        vaccineDays.push(newStructuredVaccineDay);
        FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", vaccineDays);
        ConsoleHandling_1.default.printInput("you have succesfully created a new vaccine day!".color_at_256(118));
        this.admin.goBack();
    }
}
exports.VaccineDayWriter = VaccineDayWriter;
//# sourceMappingURL=VaccineDayWriter.js.map