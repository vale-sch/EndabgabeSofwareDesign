import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import { resolve } from "path";

export class FileHandler {
    private static _instance: FileHandler = new FileHandler();

    private constructor() {
        if (FileHandler._instance)
            throw new Error("Use FileHandler.getInstance() instead new FileHandler()");
        FileHandler._instance = this;
    }

    public static getInstance(): FileHandler {
        return FileHandler._instance;
    }
    public readArrayFile(_pathToFile: string): Array<any> {
        return this.readFile(_pathToFile);
    }

    public readObjectFile(_pathToFile: string): any {
        return this.readFile(_pathToFile);
    }

    public writeFile(_pathToFile: string, _dataToWrite: any): void {
        writeFileSync(resolve(__dirname, "../" + _pathToFile), JSON.stringify(_dataToWrite, null, 6));
    }

    private readFile(_pathToFile: string): any {
        let jsonRaw = readFileSync(resolve(__dirname, "../" + _pathToFile));
        let json: any = JSON.parse(jsonRaw.toString());
        return json;
    }


}

export default FileHandler.getInstance();