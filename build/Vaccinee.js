"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccinee = void 0;
const ConsoleHandling_1 = require("./ConsoleHandling");
const FileHandler_1 = require("./FileHandler");
const GMailService_1 = require("./GMailService");
const StillOpenDays_1 = require("./StillOpenDays");
const VaccineeInformation_1 = require("./VaccineeInformation");
const alert = require("alert");
class Vaccinee {
    wholeAmountOfFree = 0;
    stillOpenDays;
    vaccineDatabase;
    waitingList;
    validDateReqeust;
    validTimeRequest;
    async showVaccineeMethods() {
        if (this.vaccineDatabase == undefined)
            ConsoleHandling_1.default.printInput("hello Vaccinee!".color_at_256(195));
        let answer = await ConsoleHandling_1.default.showPossibilities(["1. show open appointments for vaccination & registrate", "2. search in specific date for vaccination & registrate", "3. quit"], 
        // tslint:disable-next-line: align
        "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }
    async handleAnswer(_answer) {
        switch (_answer) {
            default:
            case "1":
                if (this.getActualVaccineDatabase()) {
                    this.stillOpenDays = this.calculateOpenAppointments();
                    if (this.wholeAmountOfFree == 0) {
                        await this.userIntoWaitinglist();
                        return;
                    }
                    this.showAvailableDays(this.stillOpenDays);
                    if (await this.checkOfValidInputFromUser(this.stillOpenDays))
                        this.registrateUser();
                    else {
                        ConsoleHandling_1.default.printInput("wrong date or time input");
                        await this.goBack();
                    }
                }
                else
                    await this.userIntoWaitinglist();
                break;
            case "2":
                if (this.getActualVaccineDatabase()) {
                    this.stillOpenDays = this.calculateOpenAppointments();
                    if (this.wholeAmountOfFree == 0) {
                        await this.userIntoWaitinglist();
                        return;
                    }
                    await this.showAvaibleAppointmentsFromDateInput(this.stillOpenDays);
                    if (await this.checkOfValidInputFromUser(this.stillOpenDays))
                        this.registrateUser();
                    else {
                        ConsoleHandling_1.default.printInput("wrong date or time input");
                        await this.goBack();
                    }
                }
                else
                    await this.userIntoWaitinglist();
                break;
            case "3":
                ConsoleHandling_1.default.closeConsole();
        }
    }
    async userIntoWaitinglist() {
        ConsoleHandling_1.default.printInput("at " + "this time".color_at_256(226) + " there is " + "no open".color_at_256(196) + " vaccine appointment, do you want to " + "registrate".color_at_256(118) + " into the " + "waiting list".color_at_256(118) + "?");
        let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to Continue, or " + "Z".color_at_256(196) + " to go back (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            default:
            case "y":
                this.registrateUser(true);
                break;
            case "z":
                this.showVaccineeMethods();
                break;
        }
    }
    calculateOpenAppointments() {
        let date = new Date().toJSON();
        let neededPart = date.substring(0, 10);
        let todayDateInNumbers = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
        let stillOpenDays;
        let dayIterator = 0;
        this.wholeAmountOfFree = 0;
        if (this.getActualVaccineDatabase()) {
            stillOpenDays = new Array(this.vaccineDatabase.length);
            this.vaccineDatabase.forEach(vaccineDay => {
                let isPast = false;
                if (vaccineDay.dateInNumbers[0] < todayDateInNumbers[0])
                    isPast = true;
                if (vaccineDay.dateInNumbers[0] == todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] < todayDateInNumbers[1])
                    isPast = true;
                if (vaccineDay.dateInNumbers[0] == todayDateInNumbers[0] && vaccineDay.dateInNumbers[1] == todayDateInNumbers[1] && vaccineDay.dateInNumbers[2] < todayDateInNumbers[2])
                    isPast = true;
                if (!isPast) {
                    let appointmentIterator = 0;
                    vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                        let howManyOpenPlaces = 0;
                        vaccineAppointmentRound.freePlaces.forEach(bool => {
                            if (bool == true) {
                                this.wholeAmountOfFree++;
                                howManyOpenPlaces++;
                            }
                        });
                        if (howManyOpenPlaces > 0) {
                            if (stillOpenDays[dayIterator] == undefined)
                                stillOpenDays[dayIterator] = new StillOpenDays_1.StillOpenDays(vaccineDay.date, new Array(vaccineDay.vaccineAppointmentRound.length));
                            if (stillOpenDays[dayIterator].openTimes[appointmentIterator] == undefined)
                                stillOpenDays[dayIterator].openTimes[appointmentIterator] = vaccineAppointmentRound.startTime + " (" + howManyOpenPlaces.toString().color_at_256(118) + ")";
                        }
                        appointmentIterator++;
                    });
                    dayIterator++;
                }
            });
        }
        return stillOpenDays;
    }
    async showAvaibleAppointmentsFromDateInput(_stillOpenDays) {
        let specificDate = await ConsoleHandling_1.default.question("on which date".color_at_256(226) + " you want to see " + "open ".color_at_256(118) + "appointments? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        _stillOpenDays.forEach(openDay => {
            if (openDay.openDate == specificDate) {
                _stillOpenDays.forEach(day => {
                    ConsoleHandling_1.default.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
                    ConsoleHandling_1.default.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
                    day.openTimes.forEach(time => {
                        ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + " am  " + time.substring(6, 23).color_at_256(118) + ")".color_at_256(118));
                    });
                    ConsoleHandling_1.default.printInput("");
                    ConsoleHandling_1.default.printInput("please " + "note down ".color_at_256(226) + "your favourite " + "suitable time".color_at_256(118) + "\n");
                    return;
                });
            }
            else {
                ConsoleHandling_1.default.printInput("on this date are no appointments available anymore");
                this.goBack();
            }
        });
    }
    showAvailableDays(_stillOpenDays) {
        _stillOpenDays.forEach(day => {
            ConsoleHandling_1.default.printInput("open ".color_at_256(118) + "vaccines on: " + day.openDate.color_at_256(226));
            ConsoleHandling_1.default.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
            day.openTimes.forEach(time => {
                ConsoleHandling_1.default.printInput(time.substring(0, 5).color_at_256(226) + " am  " + time.substring(6, 23).color_at_256(118) + ")".color_at_256(118));
            });
            ConsoleHandling_1.default.printInput("");
        });
        ConsoleHandling_1.default.printInput("");
        ConsoleHandling_1.default.printInput("whole amount of " + "open ".color_at_256(118) + "vaccine appointments: " + this.wholeAmountOfFree.toString().color_at_256(118));
        ConsoleHandling_1.default.printInput("please " + "note down ".color_at_256(226) + "your favourite " + "date".color_at_256(118) +
            " from the list and the " + "suitable time".color_at_256(118) + "\n");
    }
    async checkOfValidInputFromUser(_stillOpenDays) {
        this.validDateReqeust = await ConsoleHandling_1.default.question("which date".color_at_256(226) + " do you choose to " + "vaccinate".color_at_256(226) + "? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        let isValidDate = false;
        _stillOpenDays.forEach(openDay => {
            if (openDay.openDate == this.validDateReqeust)
                isValidDate = true;
        });
        if (!isValidDate)
            return false;
        this.validTimeRequest = await ConsoleHandling_1.default.question("when ".color_at_256(226) + "do you want to get " + "vaccinaded".color_at_256(226) + "? " + "(" + "hh:mm".color_at_256(196) + ")" + ": ");
        let validTime = false;
        _stillOpenDays.forEach(openDay => {
            if (openDay.openDate == this.validDateReqeust)
                openDay.openTimes.forEach(time => {
                    if (time.localeCompare(this.validTimeRequest))
                        validTime = true;
                });
        });
        return validTime;
    }
    async registrateUser(_inWaitingList) {
        let email = await ConsoleHandling_1.default.question("please enter " + "email".color_at_256(226) + ": ");
        let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!email.match(regexp)) {
            ConsoleHandling_1.default.printInput("this is not a valid email");
            this.registrateUser();
        }
        if (_inWaitingList)
            if (this.getActualWaitingList())
                this.waitingList.forEach(vaccineeInformation => {
                    if (email == vaccineeInformation.email) {
                        ConsoleHandling_1.default.printInput("this email is " + "already registrated ".color_at_256(226) + "in waiting list");
                        this.goBack();
                        return;
                    }
                });
        if (_inWaitingList != true)
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                    vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                        if (email == vaccineeInformation.email) {
                            ConsoleHandling_1.default.printInput("this email is " + "already registrated ".color_at_256(226) + "in a appointment");
                            this.goBack();
                            return;
                        }
                    });
                });
            });
        let familyName = await ConsoleHandling_1.default.question("please enter " + "familyName".color_at_256(226) + ": ");
        let name = await ConsoleHandling_1.default.question("please enter " + "name".color_at_256(226) + ": ");
        let birth = await ConsoleHandling_1.default.question("please enter " + "birth".color_at_256(226) + ": ");
        let phone = await ConsoleHandling_1.default.question("please enter " + "phone".color_at_256(226) + ": ");
        let adress = await ConsoleHandling_1.default.question("please enter " + "adress".color_at_256(226) + ": ");
        let verficationNumber;
        if (_inWaitingList != true) {
            let vaccineDatabaseCache = this.vaccineDatabase;
            vaccineDatabaseCache.forEach(vaccineDay => {
                if (vaccineDay.date == this.validDateReqeust)
                    vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                        if (this.validTimeRequest == vaccineAppointmentRound.startTime) {
                            verficationNumber = vaccineDay.verficationDayNumber.toString();
                            let isRegistrated = false;
                            let whichBoolToSet = 0;
                            vaccineAppointmentRound.vaccineeInformations.forEach(vaccineeInformation => {
                                if (!isRegistrated)
                                    if (vaccineeInformation.email == "") {
                                        vaccineeInformation.adress = adress;
                                        vaccineeInformation.birth = birth;
                                        vaccineeInformation.email = email;
                                        vaccineeInformation.familyName = familyName;
                                        vaccineeInformation.name = name;
                                        vaccineeInformation.phone = phone;
                                        vaccineAppointmentRound.freePlaces[whichBoolToSet] = false;
                                        isRegistrated = true;
                                    }
                                whichBoolToSet++;
                            });
                        }
                        FileHandler_1.default.writeFile("/data/vaccineDaysDB.json", vaccineDatabaseCache);
                    });
            });
            this.vaccineDatabase = vaccineDatabaseCache;
            alert("you have successfully registrated to vaccine appointment, you will get an email with the important information");
            let gmailService = new GMailService_1.GMailService();
            gmailService.sendMail(email, "Vaccine Appointment on " + this.validDateReqeust, "Hello from VaccineApp," + " \n\n\n " + "you have successfully booked appointment on " + this.validDateReqeust + " at " + this.validTimeRequest + ", " + " \n " + "Your Informations: " +
                " \n\n " + "Email: " + email + " \n " + "family name: " + familyName + " \n " + "name: " + name + " \n " + "birth: " + birth + " \n "
                + "phone: " + phone + " \n " + "adress: " + adress + " \n " + "Your verification number: " + verficationNumber +
                " \n\n\n " + "thank you for supporting our app, stay healthy!");
        }
        if (_inWaitingList == true) {
            let vaccineeInformation = new VaccineeInformation_1.VaccineeInformation(email, familyName, name, birth, phone, adress);
            if (!this.getActualWaitingList())
                FileHandler_1.default.writeFile("/data/waitListVaccinees.json", []);
            this.waitingList = FileHandler_1.default.readArrayFile("/data/waitListVaccinees.json");
            this.waitingList.push(vaccineeInformation);
            alert("you have successfully registrated into waitinglist, as soon as appointment is open you will get an email with information");
            FileHandler_1.default.writeFile("/data/waitListVaccinees.json", this.waitingList);
        }
        await this.goBack();
    }
    getActualWaitingList() {
        try {
            this.waitingList = FileHandler_1.default.readArrayFile("/data/waitListVaccinees.json");
        }
        catch (error) {
            return false;
        }
        return true;
    }
    getActualVaccineDatabase() {
        try {
            this.vaccineDatabase = FileHandler_1.default.readArrayFile("/data/vaccineDaysDB.json");
        }
        catch (error) {
            return false;
        }
        return true;
    }
    async goBack() {
        let answer = await ConsoleHandling_1.default.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            case "y":
            default:
                this.showVaccineeMethods();
                break;
            case "z":
                ConsoleHandling_1.default.closeConsole();
                break;
        }
    }
}
exports.Vaccinee = Vaccinee;
//# sourceMappingURL=Vaccinee.js.map