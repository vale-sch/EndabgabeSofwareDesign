import { VaccineeInformation } from "./VaccineeInformation";

export class VaccineAppointmentStructur {
    public date: String;
    public vaccineAppointments: number[];
    public start: number[];
    public end: number[];
    public freePlaces: boolean[];
    public vaccineeInformations: VaccineeInformation[];
    constructor(_date: String, _vaccineAppointments: number[], _start: number[], _end: number[], _freePlaces: boolean[], _vaccineeInformations: VaccineeInformation[]) {
        this.date = _date;
        this.vaccineAppointments = _vaccineAppointments;
        this.start = _start;
        this.end = _end;
        this.freePlaces = _freePlaces;
        this.vaccineeInformations = _vaccineeInformations;
    }
}