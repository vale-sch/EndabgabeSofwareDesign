
import ConsoleHandling from "./ConsoleHandling";
import FileHandler from "./FileHandler";
import { VaccineDay } from "./VaccineDay";
import { VaccineDayWriter } from "./VaccineDayWriter";


export class Administrator {

    private vaccineDatabase: VaccineDay[];

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
        let answer: String = await ConsoleHandling.showPossibilities(["1. create new vaccination day", "2. get specific day overview", "3. get the percantage of open and booked Vaccinations",
            "4. get the free clock times", "5. get complete statistics", "6. quit"],
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
                this.getPercantageOverAll();
                break;
            case "4":
                this.getOnlyFreeEvents();
                break;
            case "5":
                break;
            case "6":
                ConsoleHandling.closeConsole();
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
        //convert input to numbers
        let periodFromNumber: number[] = new Array(parseInt("" + parseInt(period[0]) + parseInt(period[1])), parseInt("" + parseInt(period[3]) + parseInt(period[4])));
        let periodToNumber: number[] = new Array(parseInt("" + parseInt(period[6]) + parseInt(period[7])), parseInt("" + parseInt(period[9]) + parseInt(period[10])));
        let parallelyVacccineNumber: number = parseInt(parallelyVaccine.substring(0, intervalsInMinutes.length));
        let intervalsInMinutesNumber: number = parseInt(intervalsInMinutes.substring(0, intervalsInMinutes.length));
        if (intervalsInMinutesNumber >= 31 || parallelyVacccineNumber <= 0 || intervalsInMinutesNumber <= 0) {
            ConsoleHandling.printInput("you typed in some bad values, i will bring you back".color_at_256(196) + "\n");
            this.goBack();
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        new VaccineDayWriter(day, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber, this);
    }

    public async getSpecificDay(): Promise<void> {
        let specificDayRequest: String = await ConsoleHandling.question("which " + "date".color_at_256(226) + " are you looking for? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!this.checkRegexDate(specificDayRequest)) {
            this.getSpecificDay();
            return;
        }
        let hasFound: boolean = false;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.dateString == specificDayRequest) {
                    hasFound = true;
                    ConsoleHandling.printInput(JSON.stringify(vaccineDay, null, 2));
                    this.goBack();
                }

            });
            if (!hasFound) {
                ConsoleHandling.printInput("no data for this day".color_at_256(196) + "\n");
                this.goBack();
                return;
            }
        }
        else
            this.goBack();


        specificDayRequest = null;
    }
    public async getPercantageOverAll(): Promise<void> {
        let bookedAmount: number = 0;
        let stillFreeAmount: number = 0;
        let wholeAmount: number = 0;
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineEventStructure.forEach(vaccineEventStructure => {
                    vaccineEventStructure.freePlaces.forEach(bool => {
                        wholeAmount++;
                        if (bool == false)
                            bookedAmount++;
                        else
                            stillFreeAmount++;
                    });
                });
            });
            ConsoleHandling.printInput("Booked Vaccination: ".color_at_256(196) + ((bookedAmount / wholeAmount) * 100).toString().color_at_256(196) + "%".color_at_256(196) + "\n" + "Still free Vaccination Events: ".color_at_256(118) + ((stillFreeAmount / wholeAmount) * 100).toString().color_at_256(118) + "%".color_at_256(118));
            this.goBack();
        }
        else
            this.goBack();
    }
    public async getOnlyFreeEvents(): Promise<void> {
        if (this.getActualDatabase(this.vaccineDatabase, false)) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineEventStructure.forEach(vaccineEventStructure => {
                    vaccineEventStructure.freePlaces.forEach(bool => {
                        if (bool == true) {
                            ConsoleHandling.printInput(JSON.stringify(vaccineEventStructure, null, 2));
                            this.goBack();
                        }

                    });
                });
            });
        }
        else
            this.getSpecificDay();
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