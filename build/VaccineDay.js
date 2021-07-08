"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineDay = void 0;
class VaccineDay {
    dateString;
    verficationDayNumber;
    startOfWorkingDay;
    endOfWorkingDay;
    parallelyVaccines;
    timeBetweenVaccines;
    totalAmountOfVaccines;
    vaccineEventStructure;
    constructor(_dateString, _verficationDayNumber, _startOfWorkingDay, _endOfWorkingDay, _parallelyVaccines, _timeBetweenVaccines, _totalAmountOfVaccines, _vaccineEventStructure) {
        this.dateString = _dateString;
        this.verficationDayNumber = _verficationDayNumber;
        this.startOfWorkingDay = _startOfWorkingDay;
        this.endOfWorkingDay = _endOfWorkingDay;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;
        this.vaccineEventStructure = _vaccineEventStructure;
    }
}
exports.VaccineDay = VaccineDay;
//# sourceMappingURL=VaccineDay.js.map