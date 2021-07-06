"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeNewVaccinationDay = void 0;
class MakeNewVaccinationDay {
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
}
exports.MakeNewVaccinationDay = MakeNewVaccinationDay;
//# sourceMappingURL=makeNewVaccinationDay.js.map