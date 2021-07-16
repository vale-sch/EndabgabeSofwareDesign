import * as nodemailer from "nodemailer";
export class GMailService {

    private _transporter: nodemailer.Transporter;

    constructor() {
        this._transporter = nodemailer.createTransport(
            `smtps://softwaredesignva%40gmail.com:absdfeg12345@smtp.gmail.com`
        );
    }

    public sendMail(to: string, subject: string, content: string): Promise<void> {
        // tslint:disable-next-line: no-any
        let options: any = {
            from: "softwaredesignva@gmail.com",
            to: to,
            subject: subject,
            text: content
        };

        return new Promise<void>(
            // tslint:disable-next-line: no-any
            (resolve: (msg: any) => void,
                reject: (err: Error) => void) => {
                this._transporter.sendMail(
                    options, (error, info) => {
                        if (error)
                            reject(error);
                        else
                            resolve(`Message Sent ${info.response}`);
                    });
            }
        );
    }
}