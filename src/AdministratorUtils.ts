
import ConsoleHandling from "./ConsoleHandling";
import CheckOfNullDB from "./CheckOfNullDB";
import CheckRegex from "./CheckRegex";
import { VaccineDayWriter } from "./VaccineDayWriter";
import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import { Administrator } from "./Administrator";

export class AdministratorUtils {

    public vaccineDatabase: CalculatedVaccineDay[];
    private admin: Administrator;

    constructor(_admin: Administrator) {
        this.admin = _admin;
    }

    public async getInputForNewDayInformation(): Promise<void> {
        let day: string = await ConsoleHandling.question("what is the " + "date".color_at_256(226) + " of the new vaccine day? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        //check valid information with regex
        if (!CheckRegex.date(day)) {
            ConsoleHandling.printInput("unvalid date format".color_at_256(196));
            this.getInputForNewDayInformation();
        }


        if (this.vaccineDatabase.length > 0) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (vaccineDay.date == day) {
                    ConsoleHandling.printInput("date already in database".color_at_256(196));
                    this.getInputForNewDayInformation();
                }
            });
        }

        let period: string = await ConsoleHandling.question("when is the " + "start and end time (24h-format)".color_at_256(226) +
            " of the new vaccine Day? " + "(" + "hh:mm-hh:mm".color_at_256(196) + ")" + ": ");
        if (!CheckRegex.timeAndPeriod(period, true)) {
            ConsoleHandling.printInput("unvalid period format".color_at_256(196));
            this.getInputForNewDayInformation();
        }


        let parallelyVaccine: string = await ConsoleHandling.question("how many " + "parallely".color_at_256(226) +
            " vaccines are possible? " + "(" + "amount".color_at_256(196) + ")" + ": ");
        let intervalsInMinutes: string = await ConsoleHandling.question("how " + "long".color_at_256(226) +
            " takes one vaccination? " + "(" + "min".color_at_256(196) + ")" + ": ");

        this.convertStringsAndWriteDay(day, period, parallelyVaccine, intervalsInMinutes);
    }



    public async getSpecificDay(): Promise<void> {
        let specificDayRequest: string = await ConsoleHandling.question("which " + "date".color_at_256(226) + " are you looking for? " + "(" + "yyyy-mm-dd".color_at_256(196) + ")" + ": ");
        if (!CheckRegex.date(specificDayRequest)) {
            ConsoleHandling.printInput("unvalid date format".color_at_256(196));
            this.getSpecificDay();
            return;
        }
        let specificVaccineDay: CalculatedVaccineDay;
        this.vaccineDatabase.forEach(vaccineDay => {
            if (vaccineDay.date == specificDayRequest)
                specificVaccineDay = vaccineDay;

        });
        if (!specificVaccineDay) {
            ConsoleHandling.printInput("no data for this day".color_at_256(196));
            this.admin.goBack();
            return;
        } else {
            let answer: string = await ConsoleHandling.showPossibilities(["1. show percantage of day statistics", "2. show free appointments on this day", "3. go back"],
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
                    this.admin.goBack();
                    break;
            }
        }
        specificDayRequest = null;
    }

    public async showPercantageOfDay(_specificDay: CalculatedVaccineDay): Promise<void> {
        let openAmount: number = 0;
        _specificDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    openAmount++;
            });
        });
        let bookedAmount: number = _specificDay.totalAmountOfVaccines - openAmount;
        ConsoleHandling.printInput("booked vaccination: ".color_at_256(196) + ((bookedAmount / _specificDay.totalAmountOfVaccines) * 100).toFixed(2).toString().color_at_256(196) +
            "%".color_at_256(196));
        ConsoleHandling.printInput("");
        ConsoleHandling.printInput("still free vaccination appointments: ".color_at_256(118) +
            ((openAmount / _specificDay.totalAmountOfVaccines) * 100).toFixed(2).toString().color_at_256(118) + "%".color_at_256(118));
        let answer: string = await ConsoleHandling.showPossibilities(["1. show free appointments on this day" + "(" + _specificDay.date.color_at_256(196) + ")", "2. go back"],
            // tslint:disable-next-line: align
            "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.showFreeAppointmentsOfDay(_specificDay);
                break;
            case "2":
                this.admin.goBack();
                break;
        }
    }

    public async showFreeAppointmentsOfDay(_specificDay: CalculatedVaccineDay): Promise<void> {
        ConsoleHandling.printInput("date: ".color_at_256(226) + _specificDay.date.color_at_256(51) + ", ".color_at_256(226) +
            "  time between vaccines on this day: ".color_at_256(226) + _specificDay.timeBetweenVaccines.toString().color_at_256(51) + ", ".color_at_256(226));
        ConsoleHandling.printInput("verification number: ".color_at_256(226) + _specificDay.verficationDayNumber.toString().color_at_256(51) +
            ", ".color_at_256(226) + "  total amount of vaccinations on this day: ".color_at_256(226) + _specificDay.totalAmountOfVaccines.toString().color_at_256(51));
        ConsoleHandling.printInput("");
        ConsoleHandling.printInput("times ".color_at_256(226) + "  (amounts)".color_at_256(118));
        _specificDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
            let counterOfOpenAppointments: number = 0;
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    counterOfOpenAppointments++;
            });
            if (counterOfOpenAppointments > 0)
                ConsoleHandling.printInput(vaccineAppointmentRound.startTime.color_at_256(226) + "     (".color_at_256(118) + counterOfOpenAppointments.toString().color_at_256(118) + ")".color_at_256(118));
            else
                ConsoleHandling.printInput(vaccineAppointmentRound.startTime.color_at_256(226) + "     (".color_at_256(196) + counterOfOpenAppointments.toString().color_at_256(196) + ")".color_at_256(196));
        });
        let answer: String = await ConsoleHandling.showPossibilities(["1. show percantage of day" + "(" + _specificDay.date.color_at_256(196) + ")" + " statistics", "2. go back"],
            // tslint:disable-next-line: align
            "which " + "function".color_at_256(226) + " do you want me to run? (" + "1".color_at_256(226) + "): ");
        switch (answer) {
            default:
            case "1":
                this.showPercantageOfDay(_specificDay);
                break;
            case "2":
                this.admin.goBack();
                break;
        }
    }

    public async showStatisticsMenu(): Promise<void> {
        let answer: string = await ConsoleHandling.showPossibilities(["1. show statistics for all days and how many appointments are still open",
            "2. show free appointments in the past", "3. show free appointments in the future", "4. go back"],
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
                this.admin.showAdminMethods();
                break;
        }
    }

    public getPercantageOverAll(): void {
        let bookedAmount: number = 0;
        let stillFreeAmount: number = 0;
        let wholeAmount: number = 0;
        if (this.vaccineDatabase.length > 0) {
            this.vaccineDatabase.forEach(vaccineDay => {
                vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
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
            ConsoleHandling.printInput("All Vaccinations in Database : " + wholeAmount.toString().color_at_256(226));
            ConsoleHandling.printInput("");
            ConsoleHandling.printInput("Booked Vaccination: " + ((bookedAmount / wholeAmount) * 100).toFixed(2).toString().color_at_256(196) +
                "%".color_at_256(196));
            ConsoleHandling.printInput("");
            ConsoleHandling.printInput("Still free Vaccination Events: " + ((stillFreeAmount / wholeAmount) * 100).toFixed(2).toString().color_at_256(118) +
                "%".color_at_256(118));
            ConsoleHandling.printInput("");
            this.showStatisticsMenu();
        }
    }

    public getFreeEvents(_isPast: boolean): void {
        let date: string = new Date().toJSON();
        let neededPart: string = date.substring(0, 10);
        let todayInNumbers: number[] = new Array(parseInt(neededPart.substring(0, 4)), parseInt(neededPart.substring(5, 7)), parseInt(neededPart.substring(8, 10)));
        let openAppointmentsInPast: number = 0;
        let openAppointmentsInFuture: number = 0;
        if (this.vaccineDatabase.length > 0) {
            this.vaccineDatabase.forEach(vaccineDay => {
                if (_isPast) {
                    if (vaccineDay.dateInNumbers[0] < todayInNumbers[0])
                        openAppointmentsInPast = this.calculateOpenAppointments(vaccineDay, openAppointmentsInPast);
                    if (vaccineDay.dateInNumbers[0] == todayInNumbers[0]) {
                        if (vaccineDay.dateInNumbers[1] < todayInNumbers[1])
                            openAppointmentsInPast = this.calculateOpenAppointments(vaccineDay, openAppointmentsInPast);
                        if (vaccineDay.dateInNumbers[1] == todayInNumbers[1])
                            if (vaccineDay.dateInNumbers[2] < todayInNumbers[2])
                                openAppointmentsInPast = this.calculateOpenAppointments(vaccineDay, openAppointmentsInPast);
                    }
                } else {
                    if (vaccineDay.dateInNumbers[0] > todayInNumbers[0])
                        openAppointmentsInFuture = this.calculateOpenAppointments(vaccineDay, openAppointmentsInFuture);
                    if (vaccineDay.dateInNumbers[0] == todayInNumbers[0]) {
                        if (vaccineDay.dateInNumbers[1] > todayInNumbers[1])
                            openAppointmentsInFuture = this.calculateOpenAppointments(vaccineDay, openAppointmentsInFuture);
                        if (vaccineDay.dateInNumbers[1] == todayInNumbers[1])
                            if (vaccineDay.dateInNumbers[2] > todayInNumbers[2])
                                openAppointmentsInFuture = this.calculateOpenAppointments(vaccineDay, openAppointmentsInFuture);
                    }
                }
            });
            if (_isPast)
                ConsoleHandling.printInput(openAppointmentsInPast.toString().color_at_256(196) + " appointments which " + "werent booked".color_at_256(196) + " and therefore " + "wasted".color_at_256(196));
            else
                ConsoleHandling.printInput(openAppointmentsInFuture.toString().color_at_256(118) + " appointments which are " + "open ".color_at_256(118) + "for" + " next vaccinations".color_at_256(118));
            this.showStatisticsMenu();
        }
    }

    private convertStringsAndWriteDay(_day: string, _period: string, _parallelyVaccines: string, _intervalsInMinutes: string): void {
        //convert input to numbers
        let dayInNumber: number[] = new Array(parseInt(_day.substring(0, 4)), parseInt(_day.substring(5, 7)), parseInt(_day.substring(8, 10)));
        let periodFromNumber: number[] = new Array(parseInt("" + parseInt(_period[0]) + parseInt(_period[1])), parseInt("" + parseInt(_period[3]) + parseInt(_period[4])));
        let periodToNumber: number[] = new Array(parseInt("" + parseInt(_period[6]) + parseInt(_period[7])), parseInt("" + parseInt(_period[9]) + parseInt(_period[10])));

        let parallelyVacccineNumber: number = parseInt(_parallelyVaccines.substring(0, _parallelyVaccines.length));
        let intervalsInMinutesNumber: number = parseInt(_intervalsInMinutes.substring(0, _intervalsInMinutes.length));
        if (_intervalsInMinutes == "" || _parallelyVaccines == "" || intervalsInMinutesNumber >= 61) {
            ConsoleHandling.printInput("you typed in some bad value, i will bring you back".color_at_256(196));
            this.admin.goBack();
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        new VaccineDayWriter(_day, dayInNumber, periodFromNumber, periodToNumber, parallelyVacccineNumber, intervalsInMinutesNumber, this.admin);
        this.vaccineDatabase = CheckOfNullDB.getVaccineDays();
    }

    private calculateOpenAppointments(_vaccineDay: CalculatedVaccineDay, _increment: number): number {
        _vaccineDay.vaccineAppointments.forEach(vaccineAppointmentRound => {
            vaccineAppointmentRound.freePlaces.forEach(bool => {
                if (bool == true)
                    _increment++;
            });
        });
        return _increment;
    }
}
