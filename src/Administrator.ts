import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import { VaccineDayWriter } from "./VaccineDayWriter";

export class Administrator {

    private vaccineDatabase: CalculatedVaccineDay[];

    public async adminLogin(): Promise<void> {
        ConsoleHandling.printInput("hello admin!".color_at_256(195) + "\n");
        let username: String = await ConsoleHandling.question("enter Admin Name:");
        if (username == "admin") {
            let password: String = await ConsoleHandling.question("enter Password:");
            if (password == "password")
                this.showAdminMethods();
            else
                ConsoleHandling.closeConsole();
        }
        else
            ConsoleHandling.closeConsole();

    }

    public async showAdminMethods(): Promise<void> {
        let answer: String = await ConsoleHandling.showPossibilities(["1. create new vaccination day", "2. get specific day overview", "3. get complete statistics overview", "4. quit"],
            // tslint:disable-next-line: align
            "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        this.handleAnswer(answer);
    }

    public async handleAnswer(answer: String): Promise<void> {
        switch (answer) {
            case "1":
                this.createNewDay();
                break;
            case "2":
                this.getSpecificDay();
                break;
            case "3":
                this.showStatisticsMenu();
                break;
            case "4":
                ConsoleHandling.closeConsole();
                break;
            default:
                this.createNewDay();
                break;
        }
    }
    public async createNewDay(): Promise<void> {
        let day: String = await ConsoleHandling.question("what is the " + "date".color_at_256(226) + " of the new vaccine day? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        //check valid information with regex
        if (!this.checkRegexDate(day))
            this.createNewDay();

        if (this.getActualDatabase(this.vaccineDatabase, true)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateString == day) {
                    ConsoleHandling.printInput("already in database".color_at_256(196) + "\n");
                    this.createNewDay();
                }
            });
        }

        let period: String = await ConsoleHandling.question("what is the " + "period (24h-format)".color_at_256(226) + " of the new vaccine Day? " + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        let hourReg: RegExp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!period.substring(0, 5).match(hourReg) || !period.substring(6, 11).match(hourReg) || period[5] != "-") {
            ConsoleHandling.printInput("unvalid period format".color_at_256(196) + "\n");
            this.createNewDay();
        }

        let parallelyVaccine: String = await ConsoleHandling.question("how many " + "parallely".color_at_256(226) + " vaccines are possible? " + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes: String = await ConsoleHandling.question("how " + "long".color_at_256(226) + " takes one vaccination? " + "(" + "min".color_at_256(196) + ")" + ": ");

        this.convertStrings(day, period, parallelyVaccine, intervalsInMinutes);
    }

    public convertStrings(_day: String, _period: String, _parallelyVaccines: String, _intervalsInMinutes: String): void {
        //convert input to numbers
        let periodFromNumber: number[] = new Array(parseInt("" + parseInt(_period[0]) + parseInt(_period[1])), parseInt("" + parseInt(_period[3]) + parseInt(_period[4])));
        let periodToNumber: number[] = new Array(parseInt("" + parseInt(_period[6]) + parseInt(_period[7])), parseInt("" + parseInt(_period[9]) + parseInt(_period[10])));
        let parallelyVacccineNumber: number = parseInt(_parallelyVaccines.substring(0, _intervalsInMinutes.length));
        let intervalsInMinutesNumber: number = parseInt(_intervalsInMinutes.substring(0, _intervalsInMinutes.length));
        if (intervalsInMinutesNumber >= 31 || parallelyVacccineNumber <= 0 || intervalsInMinutesNumber <= 0) {
            ConsoleHandling.printInput("you typed in some bad values, i will bring you back".color_at_256(196) + "\n");
            this.goBack();
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        new VaccineDayWriter(_day, new Array(1, 2, 3), periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber, this);
    }

    public async getSpecificDay(): Promise<void> {
        let specificDayRequest: String = await ConsoleHandling.question("which " + "date".color_at_256(226) + " are you looking for? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!this.checkRegexDate(specificDayRequest)) {
            this.getSpecificDay();
            return;
        }
        let specificVaccineDay: CalculatedVaccineDay;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateString == specificDayRequest)
                    specificVaccineDay = vaccineDay;

            });
            if (!specificVaccineDay) {
                ConsoleHandling.printInput("no data for this day".color_at_256(196) + "\n");
                this.goBack();
                return;
            } else {
                let answer: String = await ConsoleHandling.showPossibilities(["1. show percantage of day statistics", "2. show free appointments on this day", "3. quit"],
                    // tslint:disable-next-line: align
                    "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
                switch (answer) {
                    default:
                    case "1":
                        this.showPercantageOfDay(specificVaccineDay);
                        break;
                    case "2":
                        this.showFreeAppointmentsOfDay(specificVaccineDay);
                        break;
                    case "3":
                        ConsoleHandling.closeConsole();
                        break;
                }
            }
        }
        else
            this.goBack();
        specificDayRequest = null;
    }
    public showPercantageOfDay(_specificDay: CalculatedVaccineDay): void {
        let openAmount: number = 0;
        _specificDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    openAmount++;
            });
        });
        let bookedAmount: number = _specificDay.totalAmountOfVaccines - openAmount;

        ConsoleHandling.printInput("Booked Vaccination: ".color_at_256(196) + ((bookedAmount / _specificDay.totalAmountOfVaccines) * 100).toString().color_at_256(196) + "%".color_at_256(196) + "\n" + "Still free Vaccination Events: ".color_at_256(118) + ((openAmount / _specificDay.totalAmountOfVaccines) * 100).toString().color_at_256(118) + "%".color_at_256(118));

    }

    public showFreeAppointmentsOfDay(_specificDay: CalculatedVaccineDay): void {
        ConsoleHandling.printInput("date: ".color_at_256(226) + _specificDay.dateString.color_at_256(51) + ", ".color_at_256(226) + "  time between vaccines on this day: ".color_at_256(226) + _specificDay.timeBetweenVaccines.toString().color_at_256(51));
        ConsoleHandling.printInput("verfification number: ".color_at_256(226) + _specificDay.verficationDayNumber.toString().color_at_256(51) + "  total amount on this day: ".color_at_256(226) + _specificDay.totalAmountOfVaccines.toString().color_at_256(51));
        ConsoleHandling.printInput("open times:".color_at_256(226));
        _specificDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
            let counterOfOpenAppointments: number = 0;
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    counterOfOpenAppointments++;
            });
            if (counterOfOpenAppointments > 0)
                ConsoleHandling.printInput(vaccineAppointmentRound.start.toString() + "  (" + counterOfOpenAppointments.toString().color_at_256(118) + ")");
            else
                ConsoleHandling.printInput(vaccineAppointmentRound.start.toString() + "  (" + counterOfOpenAppointments.toString().color_at_256(196) + ")");
        });
    }
    public async showStatisticsMenu(): Promise<void> {
        let answer: String = await ConsoleHandling.showPossibilities(["1. show statistics for all days and how many appointments are still open", "2. show free appointments in the past", "3. show free appointments in the future", "4. Quit"],
            // tslint:disable-next-line: align
            "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.getPercantageOverAll();
                break;
            case "2":
                this.getFreeEvents(true);
                break;
            case "3":
                this.getFreeEvents(false);
                break;
            case "4":
                ConsoleHandling.closeConsole();
                break;
        }
    }
    public getPercantageOverAll(): void {
        let bookedAmount: number = 0;
        let stillFreeAmount: number = 0;
        let wholeAmount: number = 0;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
                    vaccineAppointmentRound.freePlaces.forEach(bool => {
                        wholeAmount++;
                        if (bool == false)
                            bookedAmount++;
                        else
                            stillFreeAmount++;
                    });
                });
            });
            ConsoleHandling.printInput("");
            ConsoleHandling.printInput("All Vaccinations in Database : ".color_at_256(51) + wholeAmount.toString().color_at_256(51));
            ConsoleHandling.printInput("");
            ConsoleHandling.printInput("Booked Vaccination: ".color_at_256(196) + ((bookedAmount / wholeAmount) * 100).toString().color_at_256(196) + "%".color_at_256(196) + "\n" + "Still free Vaccination Events: ".color_at_256(118) + ((stillFreeAmount / wholeAmount) * 100).toString().color_at_256(118) + "%".color_at_256(118));
            ConsoleHandling.printInput("");
            this.goBack();
        }
        else
            this.goBack();
    }
    public getFreeEvents(_isPast: boolean): void {
        let date: String = new Date().toJSON();
        let neededPart: String = date.substring(0, 10);
        console.log(neededPart);
        // if (this.getActualDatabase(this.vaccineDatabase, false)) {
        //     this.vaccineDatabase.forEach(vaccineDay => {

        //         vaccineDay.vaccineAppointmentRound.forEach(vaccineAppointmentRound => {
        //             let counterOfOpenAppointments: number = 0;
        //             vaccineAppointmentRound.freePlaces.forEach(bool => {
        //                 if (bool == true)
        //                     counterOfOpenAppointments++;
        //             });

        //         });

        //     });
        //     this.goBack();
        // }
        // else
        //     this.getSpecificDay();
    }

    // tslint:disable-next-line: no-any
    public getActualDatabase(_vaccineDatabase: any[], _isCheckingDays: boolean): boolean {
        try {
            this.vaccineDatabase = FileHandler.readArrayFile("/data/vaccineDaysDB.json");
        } catch (error) {
            if (!_isCheckingDays)
                ConsoleHandling.printInput("No Data in Database - make new vaccine day".color_at_256(196) + "\n");
        }
        if (this.vaccineDatabase == undefined)
            return false;
        else
            return true;
    }

    public checkRegexDate(_day: String): boolean {
        let dateReg: RegExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!_day.match(dateReg)) {
            ConsoleHandling.printInput("unvalid date format".color_at_256(196) + "\n");
            return false;

        }
        return true;
    }
    public async goBack(): Promise<void> {
        let answer: String = await ConsoleHandling.question("press " + "Y".color_at_256(118) + " to go back to overview, or " + "Z".color_at_256(196) + " to quit (" + "Y".color_at_256(118) + "): ");
        switch (answer.toLowerCase()) {
            case "y":
            default:
                this.showAdminMethods();
                break;
            case "z":
                ConsoleHandling.closeConsole();
                break;
        }
    }

}