import { Administrator } from "./Administrator";
import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import { VaccineAppointmentStructur } from "./VaccineAppointmentStructure";
import { VaccineeInformation } from "./VaccineeInformation";



export class VaccineDayWriter {
    public dateString: String;
    public dateInNumbers: number[];
    public periodFrom: number[];
    public periodTo: number[];
    public parallelyVaccines: number;
    public timeBetweeenVaccines: number;
    public admin: Administrator;
    constructor(_dateString: String, _dateInNumbers: number[], _periodFrom: number[], _periodTo: number[], _parallelyVaccines: number, _timeBetweeenVaccines: number, _admin: Administrator) {
        this.dateString = _dateString;
        this.dateInNumbers = _dateInNumbers;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweeenVaccines = _timeBetweeenVaccines;
        this.admin = _admin;
        this.calculateAppointmentAmount();

    }
    public calculateAppointmentAmount(): void {
        let hoursBegin: number = this.periodFrom[0];
        let minutesBegin: number = this.periodFrom[1];

        let hoursStop: number = this.periodTo[0];
        let minutesStop: number = this.periodTo[1];

        let timeDifference: number = Math.abs(hoursBegin - hoursStop) * 60;

        if ((hoursBegin - hoursStop) >= 0) {
            if (minutesBegin - minutesStop >= 0 || (hoursBegin - hoursStop) > 0) {
                ConsoleHandling.printInput("dude you going backward - wrong period input".color_at_256(196) + "\n");
                this.admin.goBack();
                return;
            }
        }
        if ((minutesBegin - minutesStop) < 0)
            timeDifference += Math.abs(minutesBegin - minutesStop);
        else
            timeDifference -= Math.abs(minutesBegin - minutesStop);

        let eventAmount: number = Math.round((timeDifference / this.timeBetweeenVaccines) * this.parallelyVaccines);
        let vaccineAppointmentStructure: VaccineAppointmentStructur[] = new Array(Math.round(timeDifference / this.timeBetweeenVaccines));
        this.createAppointmentStructure(eventAmount, minutesBegin, hoursBegin, vaccineAppointmentStructure);
    }

    public createAppointmentStructure(_eventAmount: number, _minutesBegin: number, _hoursBegin: number, _vaccineAppointmentStructure: VaccineAppointmentStructur[]): void {
        let modoloNumber: number = this.parallelyVaccines;
        let oldModuloNumber: number = 1;
        let eventCounterModulo: number = 1;
        let hoursAfter: number = _hoursBegin;
        let minAfter: number = _minutesBegin;
        let emptyVaccineInformations: VaccineeInformation[] = new Array<VaccineeInformation>();
        for (let i: number = 0; i < this.parallelyVaccines; i++)
            emptyVaccineInformations[i] = new VaccineeInformation("", "", "", "", "", "");
        for (let eventCounter: number = 1; eventCounter <= _eventAmount; eventCounter++) {
            if (eventCounter % this.parallelyVaccines == 0) {
                minAfter += this.timeBetweeenVaccines;
                if (minAfter != 0)
                    if (minAfter % 60 == 0) {
                        hoursAfter++;
                        minAfter = 0;
                    }
                _vaccineAppointmentStructure[eventCounterModulo] = new VaccineAppointmentStructur(this.dateString, new Array(oldModuloNumber, modoloNumber),
                    // tslint:disable-next-line: align
                    new Array(_hoursBegin, _minutesBegin), new Array(hoursAfter, minAfter), new Array(this.parallelyVaccines).fill(true), emptyVaccineInformations);
                _minutesBegin = minAfter;
                _hoursBegin = hoursAfter;
                eventCounterModulo++;
                oldModuloNumber = modoloNumber + 1;
                modoloNumber += this.parallelyVaccines;
            }
        }
        _vaccineAppointmentStructure.shift();
        let uniqueNumber: number = Math.round(Date.now() + Math.random());
        let newCalculatedVaccineDay: CalculatedVaccineDay = new CalculatedVaccineDay(this.dateString, uniqueNumber, this.parallelyVaccines, this.timeBetweeenVaccines, _eventAmount, this.dateInNumbers, this.periodFrom, this.periodTo, _vaccineAppointmentStructure);

        this.writeNewDay(newCalculatedVaccineDay);
    }

    public writeNewDay(_newCalculatedVaccineDay: CalculatedVaccineDay): void {
        try {
            FileHandler.readArrayFile("/data/vaccineDaysDB.json");
        } catch (error) {
            console.log("building JSON for first time...");
            FileHandler.writeFile("/data/vaccineDaysDB.json", []);
        }
        let vaccineDays: CalculatedVaccineDay[] = FileHandler.readArrayFile("/data/vaccineDaysDB.json");
        vaccineDays.push(_newCalculatedVaccineDay);
        FileHandler.writeFile("/data/vaccineDaysDB.json", vaccineDays);

        ConsoleHandling.printInput("you have succesfully created a new vaccine day!".color_at_256(118));
        this.admin.goBack();
    }
}
