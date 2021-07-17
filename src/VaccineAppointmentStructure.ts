import { VaccineeInformation } from "./VaccineeInformation";

export class VaccineAppointmentStructur {
    public date: string;
    public vaccineAppointments: string;

    public startTime: string;
    public endTime: string;

    public freePlaces: boolean[];
    public vaccineeInformations: VaccineeInformation[];

    constructor(_date: string, _vaccineAppointments: string, _start: number[], _end: number[], _freePlaces: boolean[], _vaccineeInformations: VaccineeInformation[]) {
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