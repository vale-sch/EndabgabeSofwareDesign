export class StillOpenDays {
    public openDate: string;
    public openTimes: string[];

    constructor(_openDate: string, _openTimes: string[]) {
        this.openDate = _openDate;
        this.openTimes = _openTimes;
    }
}