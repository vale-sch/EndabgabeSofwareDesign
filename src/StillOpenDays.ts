export class StillOpenDays {
    public openDate: string;
    public openTimes: string[];
    constructor(_openDates: string, _openTimes: string[]) {
        this.openDate = _openDates;
        this.openTimes = _openTimes;
    }
}