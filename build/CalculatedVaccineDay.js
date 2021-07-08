"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatedVaccineDay = void 0;
class CalculatedVaccineDay {
    dateString;
    dateInNumbers;
    verficationDayNumber;
    startOfWorkingDay;
    endOfWorkingDay;
    parallelyVaccines;
    timeBetweenVaccines;
    totalAmountOfVaccines;
    vaccineAppointmentRound;
    constructor(_dateString, _dateInNumbers, _verficationDayNumber, _startOfWorkingDay, _endOfWorkingDay, _parallelyVaccines, _timeBetweenVaccines, _totalAmountOfVaccines, _vaccineAppointmentRound) {
        this.dateString = _dateString;
        this.dateInNumbers = _dateInNumbers;
        this.verficationDayNumber = _verficationDayNumber;
        this.startOfWorkingDay = _startOfWorkingDay;
        this.endOfWorkingDay = _endOfWorkingDay;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;
        this.vaccineAppointmentRound = _vaccineAppointmentRound;
    }
}
exports.CalculatedVaccineDay = CalculatedVaccineDay;
//# sourceMappingURL=CalculatedVaccineDay.js.map