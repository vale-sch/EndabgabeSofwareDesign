"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeNewVaccinenDay = void 0;
const FileHandler_1 = require("./FileHandler");
class MakeNewVaccinenDay {
    day;
    period = new Array("", "");
    simultanVaccinee;
    intervalsInMinutes;
    constructor(_day, _period, _simultanVaccinee, _intervalsInMinutes) {
        this.day = _day;
        this.period = _period;
        this.simultanVaccinee = _simultanVaccinee;
        this.intervalsInMinutes = _intervalsInMinutes;
    }
    writeNewVaccineDay() {
        FileHandler_1.default.writeFile("/data/vaccineDB.json", this);
    }
}
exports.MakeNewVaccinenDay = MakeNewVaccinenDay;
//# sourceMappingURL=MakeNewVaccineDay.js.map