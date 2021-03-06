"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandler = void 0;
const fs_1 = require("fs");
const fs_2 = require("fs");
const path_1 = require("path");
class FileHandler {
    static _instance = new FileHandler();
    constructor() {
        if (FileHandler._instance)
            throw new Error("Use FileHandler.getInstance() instead new FileHandler()");
        FileHandler._instance = this;
    }
    static getInstance() {
        return FileHandler._instance;
    }
    readArrayFile(_pathToFile) {
        return this.readFile(_pathToFile);
    }
    readObjectFile(_pathToFile) {
        return this.readFile(_pathToFile);
    }
    writeFile(_pathToFile, _dataToWrite) {
        fs_2.writeFileSync(path_1.resolve(__dirname, "../" + _pathToFile), JSON.stringify(_dataToWrite, null, 6));
    }
    readFile(_pathToFile) {
        let jsonRaw = fs_1.readFileSync(path_1.resolve(__dirname, "../" + _pathToFile));
        let json = JSON.parse(jsonRaw.toString());
        return json;
    }
}
exports.FileHandler = FileHandler;
exports.default = FileHandler.getInstance();
//# sourceMappingURL=FileHandler.js.map