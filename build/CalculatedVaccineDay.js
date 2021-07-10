"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatedVaccineDay = void 0;
class CalculatedVaccineDay {
    dateString;
    verficationDayNumber;
    parallelyVaccines;
    timeBetweenVaccines;
    totalAmountOfVaccines;
    date;
    startOfWorkingDay;
    endOfWorkingDay;
    vaccineAppointmentRound;
    constructor(_dateString, _verficationDayNumber, _parallelyVaccines, _timeBetweenVaccines, _totalAmountOfVaccines, _dateInNumbers, _startOfWorkingDay, _endOfWorkingDay, _vaccineAppointmentRound) {
        this.dateString = _dateString;
        this.verficationDayNumber = _verficationDayNumber;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;
        this.date = _dateInNumbers;
        this.startOfWorkingDay = _startOfWorkingDay;
        this.endOfWorkingDay = _endOfWorkingDay;
        this.vaccineAppointmentRound = _vaccineAppointmentRound;
    }
}
exports.CalculatedVaccineDay = CalculatedVaccineDay;
//# sourceMappingURL=CalculatedVaccineDay.js.map