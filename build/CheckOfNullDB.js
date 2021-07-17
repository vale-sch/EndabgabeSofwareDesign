"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckOfNullDB = void 0;
const FileHandler_1 = require("./FileHandler");
class CheckOfNullDB {
    static _instance = new CheckOfNullDB();
    constructor() {
        if (CheckOfNullDB._instance)
            throw new Error("Use Vaccinee.getInstance() instead new Vaccinee()");
        CheckOfNullDB._instance = this;
    }
    static getInstance() {
        return CheckOfNullDB._instance;
    }
    getWaitList() {
        try {
            FileHandler_1.default.readArrayFile("/data/waitListVaccinees.json");
        }
        catch (error) {
            FileHandler_1.default.writeFile("/data/waitListVaccinees.json", []);
        }
        return FileHandler_1.default.readArrayFile("/data/waitListVaccinees.json");
    }
    getVaccineDays() {
        try {
            FileHandler_1.default.readArrayFile("/data/vaccineDays.json");
        }
        catch (error) {
            FileHandler_1.default.writeFile("/data/vaccineDays.json", []);
        }
        return FileHandler_1.default.readArrayFile("/data/vaccineDays.json");
    }
}
exports.CheckOfNullDB = CheckOfNullDB;
exports.default = CheckOfNullDB.getInstance();
//# sourceMappingURL=CheckOfNullDB.js.map