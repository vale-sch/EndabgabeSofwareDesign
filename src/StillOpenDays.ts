export class StillOpenDays {
    public openDate: string;
    public openTimes: string[];
    public amountOfFreePlaces: number;

    constructor(_openDates: string, _openTimes: string[]) {
        this.openDate = _openDates;
        this.openTimes = _openTimes;
    }
}