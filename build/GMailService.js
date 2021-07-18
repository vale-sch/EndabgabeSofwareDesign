"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMailService = void 0;
const nodemailer = require("nodemailer");
class GMailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport(`smtps://softwaredesignva%40gmail.com:absdfeg12345@smtp.gmail.com`);
    }
    sendMail(_to, _subject, _content) {
        // tslint:disable-next-line: no-any
        let options = {
            from: "softwaredesignva@gmail.com",
            to: _to,
            subject: _subject,
            text: _content
        };
        return new Promise(
        // tslint:disable-next-line: no-any
        (resolve, reject) => {
            this.transporter.sendMail(options, (error, info) => {
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