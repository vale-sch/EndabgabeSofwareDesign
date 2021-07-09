import { VaccineAppointmentStructur as VaccineAppointmentStructure } from "./VaccineAppointmentStructure";

export class CalculatedVaccineDay {
    public dateString: String;

    public verficationDayNumber: number;
    public parallelyVaccines: number;
    public timeBetweenVaccines: number;
    public totalAmountOfVaccines: number;

    public dateInNumbers: number[];
    public startOfWorkingDay: number[];
    public endOfWorkingDay: number[];

    public vaccineAppointmentRound: VaccineAppointmentStructure[];

    constructor(_dateString: String, _verficationDayNumber: number, _parallelyVaccines: number, _timeBetweenVaccines: number,
        _totalAmountOfVaccines: number, _dateInNumbers: number[], _startOfWorkingDay: number[], _endOfWorkingDay: number[], _vaccineAppointmentRound: VaccineAppointmentStructure[]) {
        this.dateString = _dateString;

        this.verficationDayNumber = _verficationDayNumber;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;

        this.dateInNumbers = _dateInNumbers;
        this.startOfWorkingDay = _startOfWorkingDay;
        this.endOfWorkingDay = _endOfWorkingDay;

        this.vaccineAppointmentRound = _vaccineAppointmentRound;
    }
}