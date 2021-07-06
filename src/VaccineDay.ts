//import FileHandler from "./FileHandler";

import FileHandler from "./FileHandler";
import { VaccinePeriod } from "./VaccinePeriod";



export class VaccineDay {
    public day: number[];
    public periodFrom: number[];
    public periodTo: number[];
    public parallelyVaccines: number;
    public intervalInMinutes: number;

    constructor(_day: number[], _periodFrom: number[], _periodTo: number[], _parallelyVaccines: number, _intervalsInMinutes: number) {
        this.day = _day;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.intervalInMinutes = _intervalsInMinutes;

        // let allDays: VaccineDay[] = FileHandler.readArrayFile("/data/vaccineDaysDB.json");
        // allDays.push(this);
        // FileHandler.writeFile("/data/vaccineDaysDB.json", allDays);
        this.calculateEvents();

    }
    public calculateEvents(): void {
        let hoursBegin: number = this.periodFrom[0];
        let minutesBegin: number = this.periodFrom[1];

        let hoursStop: number = this.periodTo[0];
        let minutesStop: number = this.periodTo[1];
        let timeDifference: number = Math.abs(hoursBegin - hoursStop) * 60;
        if ((minutesBegin - minutesStop) < 0)
            timeDifference += Math.abs(minutesBegin - minutesStop);
        else
            timeDifference -= Math.abs(minutesBegin - minutesStop);
        let eventAmount: number = (timeDifference / this.intervalInMinutes) * this.parallelyVaccines;

        let vaccinePeriodChache: VaccinePeriod[] = new Array((timeDifference / this.intervalInMinutes));
        let modoloNumber: number = this.parallelyVaccines;
        let oldModuloNumber: number = 1;
        let eventCounterModulo: number = 1;

        for (let eventCounter: number = 0; eventCounter <= eventAmount; eventCounter++) {
            console.log(eventCounter);
            console.log(eventCounter % this.parallelyVaccines == 0);
            if (eventCounter != 0)
                if (eventCounter % this.parallelyVaccines == 0) {
                    if (minutesBegin != 0)
                        if (minutesBegin % 60 == 0) {
                            hoursBegin++;
                            minutesBegin = 0;
                        }

                    vaccinePeriodChache[eventCounterModulo] = new VaccinePeriod(new Array(oldModuloNumber, modoloNumber), this.day, new Array(hoursBegin, minutesBegin), new Array(hoursBegin, minutesBegin + this.intervalInMinutes), new Array(this.parallelyVaccines).fill(true));
                    minutesBegin += this.intervalInMinutes;
                    eventCounterModulo++;
                    oldModuloNumber = modoloNumber + 1;
                    modoloNumber += this.parallelyVaccines;
                }
        }

        // tslint:disable-next-line: typedef
        let vaccinePeriodStructure: VaccinePeriod[] = vaccinePeriodChache.filter(function (error) {
            return error != null;

        });

        // tslint:disable-next-line: no-any
        const newDay: any = {
            day: this.day,
            from: this.periodFrom,
            to: this.periodTo,
            vaccinePeriodStructure: [{ vaccinePeriodStructure }]
        };
        FileHandler.writeFile("/data/vaccineDaysDB.json", newDay);
    }
}
