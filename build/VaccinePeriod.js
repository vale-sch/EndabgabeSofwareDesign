"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccinePeriod = void 0;
class VaccinePeriod {
    vaccinations;
    date;
    start;
    end;
    freeAmount;
    constructor(_vaccinations, _date, _start, _end, _freeAmount) {
        this.vaccinations = _vaccinations;
        this.date = _date;
        this.start = _start;
        this.end = _end;
        this.freeAmount = _freeAmount;
    }
}
exports.VaccinePeriod = VaccinePeriod;
//# sourceMappingURL=VaccinePeriod.js.map