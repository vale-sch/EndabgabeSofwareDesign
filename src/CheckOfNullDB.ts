
import FileHandler from "./FileHandler";
import { CalculatedVaccineDay } from "./CalculatedVaccineDay";
import { VaccineeInformation } from "./VaccineeInformation";

export class CheckOfNullDB {
    private static _instance: CheckOfNullDB = new CheckOfNullDB();

    constructor() {
        if (CheckOfNullDB._instance)
            throw new Error("Use Vaccinee.getInstance() instead new Vaccinee()");
        CheckOfNullDB._instance = this;
    }

    public static getInstance(): CheckOfNullDB {
        return CheckOfNullDB._instance;
    }
    public getWaitList(): VaccineeInformation[] {
        try {
            FileHandler.readArrayFile("/data/waitListVaccinees.json");
        } catch (error) {
            FileHandler.writeFile("/data/waitListVaccinees.json", []);
        }
        return FileHandler.readArrayFile("/data/waitListVaccinees.json");
    }

    public getVaccineDays(): CalculatedVaccineDay[] {
        try {
            FileHandler.readArrayFile("/data/vaccineDays.json");
        } catch (error) {
            FileHandler.writeFile("/data/vaccineDays.json", []);
        }
        return FileHandler.readArrayFile("/data/vaccineDays.json");
    }
}
export default CheckOfNullDB.getInstance();