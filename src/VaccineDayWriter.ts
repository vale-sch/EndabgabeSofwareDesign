import { Administrator } from "./Administrator";
import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import { VaccineDay } from "./VaccineDay";
import { VaccineEventStructur } from "./VaccineEventStructure";



export class VaccineDayWriter {
    public dateString: String;
    public periodFrom: number[];
    public periodTo: number[];
    public parallelyVaccines: number;
    public timeBetweeenVaccines: number;
    public admin: Administrator;
    constructor(_dateString: String, _periodFrom: number[], _periodTo: number[], _parallelyVaccines: number, _timeBetweeenVaccines: number, _admin: Administrator) {
        this.dateString = _dateString;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweeenVaccines = _timeBetweeenVaccines;
        this.admin = _admin;
        this.calculateEvents();

    }
    public calculateEvents(): void {
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

        let vaccineEventStructure: VaccineEventStructur[] = new Array(Math.round(timeDifference / this.timeBetweeenVaccines));
        let modoloNumber: number = this.parallelyVaccines;
        let oldModuloNumber: number = 1;
        let eventCounterModulo: number = 1;

        for (let eventCounter: number = 1; eventCounter <= eventAmount; eventCounter++) {
            if (eventCounter % this.parallelyVaccines == 0) {

                if (minutesBegin != 0)
                    if (minutesBegin % 60 == 0) {
                        hoursBegin++;
                        minutesBegin = 0;
                    }
                vaccineEventStructure[eventCounterModulo] = new VaccineEventStructur(this.dateString, new Array(oldModuloNumber, modoloNumber), new Array(hoursBegin, minutesBegin), new Array(hoursBegin, minutesBegin + this.timeBetweeenVaccines), new Array(this.parallelyVaccines).fill(true));
                minutesBegin += this.timeBetweeenVaccines;
                eventCounterModulo++;
                oldModuloNumber = modoloNumber + 1;
                modoloNumber += this.parallelyVaccines;
            }
        }

        vaccineEventStructure.shift();
        let uniqueNumber: number = Math.round(Date.now() + Math.random());

        // tslint:disable-next-line: no-any
        let newStructuredVaccineDay: VaccineDay = new VaccineDay(this.dateString, uniqueNumber, this.periodFrom, this.periodTo, this.parallelyVaccines, this.timeBetweeenVaccines, eventAmount, vaccineEventStructure);

        // tslint:disable-next-line: no-any
        try {
            FileHandler.readArrayFile("/data/vaccineDaysDB.json");
        } catch (error) {
            console.log("building JSON for first time...");
            FileHandler.writeFile("/data/vaccineDaysDB.json", []);
        }

        // tslint:disable-next-line: no-any
        let vaccineDays: VaccineDay[] = FileHandler.readArrayFile("/data/vaccineDaysDB.json");

        vaccineDays.push(newStructuredVaccineDay);
        FileHandler.writeFile("/data/vaccineDaysDB.json", vaccineDays);
        ConsoleHandling.printInput("you have succesfully created a new vaccine day!".color_at_256(118));
        this.admin.goBack();
    }
}
