import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import CheckOfNullDB from "./CheckOfNullDB";
import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import { VaccineAppointmentStructur } from "./VaccineAppointmentStructure";
import { VaccineeInformation } from "./VaccineeInformation";
import { GMailService } from "./GMailService";
import { Administrator } from "./Administrator";

export class VaccineDayWriter {
    public dateString: string;

    public parallelyVaccines: number;
    public timeBetweeenVaccines: number;
    public dateInNumbers: number[];
    public periodFrom: number[];
    public periodTo: number[];

    private waitingList: VaccineeInformation[];
    private admin: Administrator;

    constructor(_dateString: string, _dateInNumbers: number[], _periodFrom: number[], _periodTo: number[], _parallelyVaccines: number, _timeBetweeenVaccines: number, _admin: Administrator) {
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

        for (let eventCounter: number = 1; eventCounter <= _eventAmount; eventCounter++) {
            if (eventCounter % this.parallelyVaccines == 0) {
                minAfter += this.timeBetweeenVaccines;
                if (minAfter != 0)
                    if (minAfter / 60 >= 1) {
                        hoursAfter++;
                        if (minAfter / 60 > 1)
                            minAfter = minAfter % 60;
                        else
                            minAfter = 0;
                    }
                let emptyVaccineInformations: VaccineeInformation[] = new Array<VaccineeInformation>(this.parallelyVaccines);
                for (let i: number = 0; i < this.parallelyVaccines; i++)
                    emptyVaccineInformations[i] = new VaccineeInformation("", "", "", "", "", "");
                _vaccineAppointmentStructure[eventCounterModulo] = new VaccineAppointmentStructur(this.dateString, oldModuloNumber.toString() + "-" + modoloNumber.toString(),
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
        let newCalculatedVaccineDay: CalculatedVaccineDay = new CalculatedVaccineDay(this.dateString, this.dateInNumbers, uniqueNumber, this.parallelyVaccines, this.timeBetweeenVaccines, _eventAmount,
            // tslint:disable-next-line: align
            new Array(this.periodFrom[0], + this.periodFrom[1]), new Array(this.periodTo[0], + this.periodTo[1]), _vaccineAppointmentStructure);

        this.writeNewDay(newCalculatedVaccineDay);
    }

    public writeNewDay(_newCalculatedVaccineDay: CalculatedVaccineDay): void {
        let vaccineDays: CalculatedVaccineDay[] = CheckOfNullDB.getVaccineDays();
        vaccineDays.push(_newCalculatedVaccineDay);

        this.waitingList = CheckOfNullDB.getWaitList();
        if (this.waitingList.length > 0) {
            vaccineDays.forEach(vaccineDay => {
                vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                    let lengthOfWaiters: number = 0;
                    vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformationInDB => {
                        this.waitingList.forEach(vaccineeInformation => {
                            if (vaccineeInformationInDB.email == "") {
                                let isAppointmentFree: boolean = false;
                                vaccineAppointmentRound.freePlaces.forEach(free => {
                                    if (free == true)
                                        isAppointmentFree = true;
                                });
                                if (isAppointmentFree)
                                    if (0 < this.waitingList.length) {
                                        vaccineeInformationInDB.adress = vaccineeInformation.adress;
                                        vaccineeInformationInDB.birth = vaccineeInformation.birth;
                                        vaccineeInformationInDB.email = vaccineeInformation.email;
                                        vaccineeInformationInDB.familyName = vaccineeInformation.familyName;
                                        vaccineeInformationInDB.name = vaccineeInformation.name;
                                        vaccineeInformationInDB.phone = vaccineeInformation.phone;
                                        vaccineAppointmentRound.freePlaces[lengthOfWaiters] = false;
                                        lengthOfWaiters++;
                                        let gmailService: GMailService = new GMailService();
                                        gmailService.sendMail(
                                            <string>vaccineeInformation.email,
                                            "Vaccine Appointment on " + vaccineDay.dateInNumbers,
                                            "Hello from VaccineApp," + " \n\n\n " + "you have successfully booked appointment on " +
                                            vaccineDay.dateInNumbers + " at " + vaccineAppointmentRound.startTime + ", " +
                                            " \n " + "Your Informations: " + " \n\n " + "Email: " + <string>vaccineeInformation.email +
                                            " \n " + "family name: " + vaccineeInformation.familyName + " \n " +
                                            "name: " + vaccineeInformation.name + " \n " + "birth: " + vaccineeInformation.birth +
                                            " \n " + "phone: " + vaccineeInformation.phone + " \n " + "adress: " +
                                            vaccineeInformation.adress + " \n " + "Your verification number: " +
                                            vaccineDay.verficationDayNumber + " \n\n\n " + "thank you for supporting our app, stay healthy!");


                                        this.waitingList.shift();
                                    }
                            }
                        });
                    });
                });
            });
        }
        FileHandler.writeFile("/data/vaccineDays.json", vaccineDays);
        FileHandler.writeFile("/data/waitListVaccinees.json", []);
        ConsoleHandling.printInput("you have succesfully created a new vaccine day!".color_at_256(118));
        this.admin.goBack();
    }
}
