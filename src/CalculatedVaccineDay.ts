import { VaccineAppointmentStructur as VaccineAppointmentStructure } from "./VaccineAppointmentStructure";

export class CalculatedVaccineDay {
    public dateString: String;
    public dateInNumbers: number[];
    public verficationDayNumber: number;

    public startOfWorkingDay: number[];
    public endOfWorkingDay: number[];
    public parallelyVaccines: number;
    public timeBetweenVaccines: number;
    public totalAmountOfVaccines: number;
    public vaccineAppointmentRound: VaccineAppointmentStructure[];

    constructor(_dateString: String, _dateInNumbers: number[], _verficationDayNumber: number, _startOfWorkingDay: number[], _endOfWorkingDay: number[], _parallelyVaccines: number, _timeBetweenVaccines: number, _totalAmountOfVaccines: number, _vaccineAppointmentRound: VaccineAppointmentStructure[]) {
        this.dateString = _dateString;
        this.dateInNumbers = _dateInNumbers;
        this.verficationDayNumber = _verficationDayNumber;
        this.startOfWorkingDay = _startOfWorkingDay;
        this.endOfWorkingDay = _endOfWorkingDay;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;
        this.vaccineAppointmentRound = _vaccineAppointmentRound;

    }
}