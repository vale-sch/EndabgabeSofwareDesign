import * as nodemailer from "nodemailer";
export class GMailService {

    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport(
            `smtps://softwaredesignva%40gmail.com:absdfeg12345@smtp.gmail.com`
        );
    }

    public sendMail(_to: string, _subject: string, _content: string): Promise<void> {
        // tslint:disable-next-line: no-any
        let options: any = {
            from: "softwaredesignva@gmail.com",
            to: _to,
            subject: _subject,
            text: _content
        };

        return new Promise<void>(
            // tslint:disable-next-line: no-any
            (resolve: (msg: any) => void,
                reject: (err: Error) => void) => {
                this.transporter.sendMail(
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