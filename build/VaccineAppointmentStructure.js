"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineAppointmentStructur = void 0;
class VaccineAppointmentStructur {
    date;
    vaccineAppointments;
    startTime;
    endTime;
    freePlaces;
    vaccineeInformations;
    constructor(_date, _vaccineAppointments, _start, _end, _freePlaces, _vaccineeInformations) {
        this.date = _date;
        this.vaccineAppointments = _vaccineAppointments;
        this.freePlaces = _freePlaces;
        this.vaccineeInformations = _vaccineeInformations;
        if (_start[1] == 0)
            this.startTime = _start[0].toString() + ":" + _start[1].toString() + "0";
        else if (_start[1] < 10 && _start[2] != 0)
            this.startTime = _start[0].toString() + ":" + "0" + _start[1].toString();
        else
            this.startTime = _start[0].toString() + ":" + _start[1].toString();
        if (_end[1] == 0)
            this.endTime = _end[0].toString() + ":" + _end[1].toString() + "0";
        else if (_end[1] < 10 && _end[2] != 0)
            this.endTime = _end[0].toString() + ":" + "0" + _end[1].toString();
        else
            this.endTime = _end[0].toString() + ":" + _end[1].toString();
    }
}
exports.VaccineAppointmentStructur = VaccineAppointmentStructur;
//# sourceMappingURL=VaccineAppointmentStructure.js.map