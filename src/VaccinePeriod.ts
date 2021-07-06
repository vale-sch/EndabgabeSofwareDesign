export class VaccinePeriod {
    public vaccinations: number[];
    public date: number[];
    public start: number[];
    public end: number[];
    public freeAmount: boolean[];
    constructor(_vaccinations: number[], _date: number[], _start: number[], _end: number[], _freeAmount: boolean[]) {
        this.vaccinations = _vaccinations;
        this.date = _date;
        this.start = _start;
        this.end = _end;
        this.freeAmount = _freeAmount;
    }
}