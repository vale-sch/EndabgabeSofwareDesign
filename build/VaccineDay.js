"use strict";
//import FileHandler from "./FileHandler";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineDay = void 0;
const FileHandler_1 = require("./FileHandler");
const VaccinePeriod_1 = require("./VaccinePeriod");
class VaccineDay {
    day;
    periodFrom;
    periodTo;
    parallelyVaccines;
    intervalInMinutes;
    constructor(_day, _periodFrom, _periodTo, _parallelyVaccines, _intervalsInMinutes) {
        this.day = _day;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.intervalInMinutes = _intervalsInMinutes;
        // let allDays: VaccineDay[] = FileHandler.readArrayFile("/data/vaccineDaysDB.json");
        // allDays.push(this);
        // FileHandler.writeFile("/data/vaccineDaysDB.json", allDays);
        this.calculateEvents();
    }
    calculateEvents() {
        let hoursBegin = this.periodFrom[0];
        let minutesBegin = this.periodFrom[1];
        let hoursStop = this.periodTo[0];
        let minutesStop = this.periodTo[1];
        let timeDifference = Math.abs(hoursBegin - hoursStop) * 60;
        if ((minutesBegin - minutesStop) < 0)
            timeDifference += Math.abs(minutesBegin - minutesStop);
        else
            timeDifference -= Math.abs(minutesBegin - minutesStop);
        let eventAmount = (timeDifference / this.intervalInMinutes) * this.parallelyVaccines;
        let vaccinePeriodChache = new Array((timeDifference / this.intervalInMinutes));
        let modoloNumber = this.parallelyVaccines;
        let oldModuloNumber = 1;
        let eventCounterModulo = 1;
        for (let eventCounter = 0; eventCounter <= eventAmount; eventCounter++) {
            console.log(eventCounter);
            console.log(eventCounter % this.parallelyVaccines == 0);
            if (eventCounter != 0)
                if (eventCounter % this.parallelyVaccines == 0) {
                    if (minutesBegin != 0)
                        if (minutesBegin % 60 == 0) {
                            hoursBegin++;
                            minutesBegin = 0;
                        }
                    vaccinePeriodChache[eventCounterModulo] = new VaccinePeriod_1.VaccinePeriod(new Array(oldModuloNumber, modoloNumber), this.day, new Array(hoursBegin, minutesBegin), new Array(hoursBegin, minutesBegin + this.intervalInMinutes), new Array(this.parallelyVaccines).fill(true));
                    minutesBegin += this.intervalInMinutes;
                    eventCounterModulo++;
                    oldModuloNumber = modoloNumber + 1;
                    modoloNumber += this.parallelyVaccines;
                }
        }
        // tslint:disable-next-line: typedef
        let vaccinePeriodStructure = vaccinePeriodChache.filter(function (error) {
            return error != null;
        });
        // tslint:disable-next-line: no-any
        const newDay = {
            day: this.day,
            from: this.periodFrom,
            to: this.periodTo,
            vaccinePeriodStructure: [{ vaccinePeriodStructure }]
        };
        FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", newDay);
    }
}
exports.VaccineDay = VaccineDay;
//# sourceMappingURL=VaccineDay.js.map