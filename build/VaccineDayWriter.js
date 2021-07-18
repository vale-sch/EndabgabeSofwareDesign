"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineDayWriter = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const CheckOfNullDB_1 = require("./CheckOfNullDB");
const CalculatedVaccineDay_1 = require("./CalculatedVaccineDay");
const VaccineAppointmentStructure_1 = require("./VaccineAppointmentStructure");
const VaccineeInformation_1 = require("./VaccineeInformation");
const GMailService_1 = require("./GMailService");
class VaccineDayWriter {
    dateString;
    parallelyVaccines;
    timeBetweeenVaccines;
    dateInNumbers;
    periodFrom;
    periodTo;
    waitingList;
    admin;
    constructor(_dateString, _dateInNumbers, _periodFrom, _periodTo, _parallelyVaccines, _timeBetweeenVaccines, _admin) {
        this.dateString = _dateString;
        this.dateInNumbers = _dateInNumbers;
        this.periodFrom = _periodFrom;
        this.periodTo = _periodTo;
        this.parallelyVaccines = _parallelyVaccines;
        this.timeBetweeenVaccines = _timeBetweeenVaccines;
        this.admin = _admin;
        this.calculateAppointmentAmount();
    }
    calculateAppointmentAmount() {
        let hoursBegin = this.periodFrom[0];
        let minutesBegin = this.periodFrom[1];
        let hoursStop = this.periodTo[0];
        let minutesStop = this.periodTo[1];
        let timeDifference = Math.abs(hoursBegin - hoursStop) * 60;
        if ((hoursBegin - hoursStop) >= 0) {
            if (minutesBegin - minutesStop >= 0 || (hoursBegin - hoursStop) > 0) {
                ConsoleHandling_1.default.printInput("dude you going backward - wrong period input".color_at_256(196) + "\n");
                this.admin.goBack();
                return;
            }
        }
        if ((minutesBegin - minutesStop) < 0)
            timeDifference += Math.abs(minutesBegin - minutesStop);
        else
            timeDifference -= Math.abs(minutesBegin - minutesStop);
        let eventAmount = Math.round((timeDifference / this.timeBetweeenVaccines) * this.parallelyVaccines);
        let vaccineAppointmentStructure = new Array(Math.round(timeDifference / this.timeBetweeenVaccines));
        this.createAppointmentStructure(eventAmount, minutesBegin, hoursBegin, vaccineAppointmentStructure);
    }
    createAppointmentStructure(_appointmentAmount, _minutesBegin, _hoursBegin, _vaccineAppointments) {
        let modoloNumber = this.parallelyVaccines;
        let oldModuloNumber = 1;
        let eventCounterModulo = 1;
        let hoursAfter = _hoursBegin;
        let minAfter = _minutesBegin;
        for (let eventCounter = 1; eventCounter <= _appointmentAmount; eventCounter++) {
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
                let emptyVaccineInformations = new Array(this.parallelyVaccines);
                for (let i = 0; i < this.parallelyVaccines; i++)
                    emptyVaccineInformations[i] = new VaccineeInformation_1.VaccineeInformation("", "", "", "", "", "");
                _vaccineAppointments[eventCounterModulo] = new VaccineAppointmentStructure_1.VaccineAppointmentStructur(this.dateString, oldModuloNumber.toString() + "-" + modoloNumber.toString(), 
                // tslint:disable-next-line: align
                new Array(_hoursBegin, _minutesBegin), new Array(hoursAfter, minAfter), new Array(this.parallelyVaccines).fill(true), emptyVaccineInformations);
                _minutesBegin = minAfter;
                _hoursBegin = hoursAfter;
                eventCounterModulo++;
                oldModuloNumber = modoloNumber + 1;
                modoloNumber += this.parallelyVaccines;
            }
        }
        _vaccineAppointments.shift();
        let uniqueNumber = Math.round(Date.now() + Math.random());
        let newCalculatedVaccineDay = new CalculatedVaccineDay_1.CalculatedVaccineDay(this.dateString, this.dateInNumbers, uniqueNumber, this.parallelyVaccines, this.timeBetweeenVaccines, _appointmentAmount, 
        // tslint:disable-next-line: align
        new Array(this.periodFrom[0], +this.periodFrom[1]), new Array(this.periodTo[0], +this.periodTo[1]), _vaccineAppointments);
        this.writeNewDay(newCalculatedVaccineDay);
    }
    writeNewDay(_newCalculatedVaccineDay) {
        let vaccineDays = CheckOfNullDB_1.default.getVaccineDays();
        vaccineDays.push(_newCalculatedVaccineDay);
        this.waitingList = CheckOfNullDB_1.default.getWaitList();
        if (this.waitingList.length > 0) {
            vaccineDays.forEach(vaccineDay => {
                vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
                    let lengthOfWaiters = 0;
                    vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformationInDB => {
                        this.waitingList.forEach(vaccineeInformation => {
                            if (vaccineeInformationInDB.email == "") {
                                let isAppointmentFree = false;
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
                                        let gmailService = new GMailService_1.GMailService();
                                        gmailService.sendMail(vaccineeInformation.email, "Vaccine Appointment on " + vaccineDay.dateInNumbers, "Hello from vaccineMe," + " \n\n\n " + "you have successfully booked an appointment on " +
                                            vaccineDay.dateInNumbers + " at " + vaccineAppointmentRound.startTime + ", " +
                                            " \n " + "Your Informations: " + " \n\n " + "Email: " + vaccineeInformation.email +
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
        FileHandler_1.default.writeFile("/data/vaccineDays.json", vaccineDays);
        if (this.waitingList.length == 0)
            FileHandler_1.default.writeFile("/data/waitListVaccinees.json", []);
        else
            FileHandler_1.default.writeFile("/data/waitListVaccinees.json", this.waitingList);
        ConsoleHandling_1.default.printInput("you have succesfully created a new vaccine day!".color_at_256(118));
        this.admin.goBack();
    }
}
exports.VaccineDayWriter = VaccineDayWriter;
//# sourceMappingURL=VaccineDayWriter.js.map