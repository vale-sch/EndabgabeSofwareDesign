export class VaccineEventStructur {
    public date: String;
    public vaccineEvents: number[];
    public start: number[];
    public end: number[];
    public freePlaces: boolean[];
    constructor(_date: String, _vaccineEvents: number[], _start: number[], _end: number[], _freePlaces: boolean[]) {
        this.date = _date;
        this.vaccineEvents = _vaccineEvents;
        this.start = _start;
        this.end = _end;
        this.freePlaces = _freePlaces;
    }
}