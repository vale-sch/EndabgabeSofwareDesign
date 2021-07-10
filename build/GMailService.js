"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMailService = void 0;
const nodemailer = require("nodemailer");
class GMailService {
    _transporter;
    constructor() {
        this._transporter = nodemailer.createTransport(`smtps://softwaredesignva%40gmail.com:absdfeg12345@smtp.gmail.com`);
    }
    sendMail(to, subject, content) {
        // tslint:disable-next-line: no-any
        let options = {
            from: "softwaredesignva@gmail.com",
            to: to,
            subject: subject,
            text: content
        };
        return new Promise(
        // tslint:disable-next-line: no-any
        (resolve, reject) => {
            this._transporter.sendMail(options, (error, info) => {
                if (error)
                    reject(error);
                else
                    resolve(`Message Sent ${info.response}`);
            });
        });
    }
}
exports.GMailService = GMailService;
//# sourceMappingURL=GMailService.js.map