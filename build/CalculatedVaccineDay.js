"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatedVaccineDay = void 0;
class CalculatedVaccineDay {
    date;
    dateInNumbers;
    verficationDayNumber;
    parallelyVaccines;
    timeBetweenVaccines;
    totalAmountOfVaccines;
    startOfWorkingDay;
    endOfWorkingDay;
    vaccineAppointmentRound;
    constructor(_dateString, _dateInNumbers, _verficationDayNumber, _parallelyVaccines, _timeBetweenVaccines, _totalAmountOfVaccines, _startOfWorkingDay, _endOfWorkingDay, _vaccineAppointmentRound) {
        this.date = _dateString;
        this.dateInNumbers = _dateInNumbers;
        this.verficationDayNumber = _verficationDayNumber;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;
        if (_startOfWorkingDay[1] == 0)
            this.startOfWorkingDay = _startOfWorkingDay[0].toString() + ":" + _startOfWorkingDay[1].toString() + "0";
        else if (_startOfWorkingDay[1] < 10 && _startOfWorkingDay[2] != 0)
            this.startOfWorkingDay = _startOfWorkingDay[0].toString() + ":" + "0" + _startOfWorkingDay[1].toString();
        else
            this.startOfWorkingDay = _startOfWorkingDay[0].toString() + ":" + _startOfWorkingDay[1].toString();
        if (_endOfWorkingDay[1] == 0)
            this.endOfWorkingDay = _endOfWorkingDay[0].toString() + ":" + _endOfWorkingDay[1].toString() + "0";
        else if (_endOfWorkingDay[1] < 10 && _endOfWorkingDay[2] != 0)
            this.endOfWorkingDay = _endOfWorkingDay[0].toString() + ":" + "0" + _endOfWorkingDay[1].toString();
        else
            this.endOfWorkingDay = _endOfWorkingDay[0].toString() + ":" + _endOfWorkingDay[1].toString();
        this.vaccineAppointmentRound = _vaccineAppointmentRound;
    }
}
exports.CalculatedVaccineDay = CalculatedVaccineDay;
//# sourceMappingURL=CalculatedVaccineDay.js.map