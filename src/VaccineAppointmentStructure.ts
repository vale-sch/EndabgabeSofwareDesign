export class VaccineAppointmentStructur {
    public date: String;
    public vaccineAppointments: number[];
    public start: number[];
    public end: number[];
    public freePlaces: boolean[];
    constructor(_date: String, _vaccineAppointments: number[], _start: number[], _end: number[], _freePlaces: boolean[]) {
        this.date = _date;
        this.vaccineAppointments = _vaccineAppointments;
        this.start = _start;
        this.end = _end;
        this.freePlaces = _freePlaces;
    }
}