import { VaccineEventStructur } from "./VaccineEventStructure";

export class VaccineDay {
    public dateString: String;
    public verficationDayNumber: number;

    public startOfWorkingDay: number[];
    public endOfWorkingDay: number[];
    public parallelyVaccines: number;
    public timeBetweenVaccines: number;
    public totalAmountOfVaccines: number;
    public vaccineEventStructure: VaccineEventStructur[];

    constructor(_dateString: String, _verficationDayNumber: number, _startOfWorkingDay: number[], _endOfWorkingDay: number[], _parallelyVaccines: number, _timeBetweenVaccines: number, _totalAmountOfVaccines: number, _vaccineEventStructure: VaccineEventStructur[]) {
        this.dateString = _dateString;
        this.verficationDayNumber = _verficationDayNumber;
        this.startOfWorkingDay = _startOfWorkingDay;
        this.endOfWorkingDay = _endOfWorkingDay;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;
        this.vaccineEventStructure = _vaccineEventStructure;

    }
}