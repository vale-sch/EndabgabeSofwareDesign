import { VaccineAppointmentStructur as VaccineAppointmentStructure } from "./VaccineAppointmentStructure";

export class CalculatedVaccineDay {
    public date: string;
    public dateInNumbers: number[];

    public verficationDayNumber: number;
    public parallelyVaccines: number;
    public timeBetweenVaccines: number;
    public totalAmountOfVaccines: number;

    public startOfWorkingDay: string;
    public endOfWorkingDay: string;

    public vaccineAppointmentRound: VaccineAppointmentStructure[];

    constructor(_dateString: string, _dateInNumbers: number[], _verficationDayNumber: number, _parallelyVaccines: number, _timeBetweenVaccines: number,
        _totalAmountOfVaccines: number, _startOfWorkingDay: number[], _endOfWorkingDay: number[], _vaccineAppointmentRound: VaccineAppointmentStructure[]) {
        this.date = _dateString;
        this.dateInNumbers = _dateInNumbers;
        this.verficationDayNumber = _verficationDayNumber;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweenVaccines = _timeBetweenVaccines;
        this.totalAmountOfVaccines = _totalAmountOfVaccines;


        if (_startOfWorkingDay[1] == 0)
            this.startOfWorkingDay = _startOfWorkingDay[0].toString() + ":" + _startOfWorkingDay[1].toString() + "0";
        else if (_startOfWorkingDay[1] < 10 && _startOfWorkingDay[2] != 0)
            this.startOfWorkingDay = _startOfWorkingDay[0].toString() + ":" + "0" + _startOfWorkingDay[1].toString();
        else
            this.startOfWorkingDay = _startOfWorkingDay[0].toString() + ":" + _startOfWorkingDay[1].toString();

        if (_endOfWorkingDay[1] == 0)
            this.endOfWorkingDay = _endOfWorkingDay[0].toString() + ":" + _endOfWorkingDay[1].toString() + "0";
        else if (_endOfWorkingDay[1] < 10 && _endOfWorkingDay[2] != 0)
            this.endOfWorkingDay = _endOfWorkingDay[0].toString() + ":" + "0" + _endOfWorkingDay[1].toString();
        else
            this.endOfWorkingDay = _endOfWorkingDay[0].toString() + ":" + _endOfWorkingDay[1].toString();


        this.vaccineAppointmentRound = _vaccineAppointmentRound;
    }
}