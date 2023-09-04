import { config } from "../../environment/environment";
import ejs from "ejs";
import { google } from "googleapis";
import OAuthService from "./oAuth.service";
const MailComposer = require('nodemailer/lib/mail-composer');
import moment from 'moment'

export class MailService {

    public sendForgetPasswordEmail(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let email = await ejs.renderFile("./templates/MailTemplate/passwordReset.ejs", {
                    userName: data.username,
                    link: `${config.APP_HOST}/reset-password/${data.resetPasswordToken}`,
                    reset: true,
                });
                const options = {
                    to: data?.email,
                    subject: "Password Reset",
                    template: "index",
                    html: email,
                    textEncoding: "base64",
                };
                this.sendMail(options).then((e) => {
                    return resolve(e);
                });
            } catch (err) {
                return reject(err);
            }
        })
    }
    public sendSetupPasswordEmail(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let email = await ejs.renderFile("./templates/MailTemplate/userCreated.ejs", {
                    userName: data.username,
                    link: `${config.APP_HOST}/reset-password/${data.resetPasswordToken}`
                });
                const options = {
                    to: data?.email,
                    subject: `Setup Password for New User with email ${data?.email}`,
                    template: "index",
                    html: email,
                    textEncoding: "base64",
                };
                this.sendMail(options).then((e) => {
                    return resolve(e);
                });
            } catch (err) {
                return reject(err);
            }
        })
    }
    public sendPasswordRestEmail(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let email = await ejs.renderFile(
                    "./templates/MailTemplate/successPassword.ejs",
                    { userName: data.username }
                );

                const options = {
                    to: data.email,
                    subject: "Password Change Successful",
                    template: "index",
                    html: email,
                    textEncoding: "base64",
                };
                this.sendMail(options).then((e) => {
                    return resolve(e);
                });
            } catch (err) {
                return reject(err);
            }
        })
    }
    public sendLeadCreationEmail(data, recep, includeSubmittedBy) {
        return new Promise(async (resolve, reject) => {
            try {
                let message = "";
                let encodedAddy = data.address.replace(" ", "+");
                if (data.setter == recep) {
                    message = `A lead for ${data?.firstName} ${data?.lastName} was successfully submitted.`;
                } else {
                    message = `A new lead was submitted for you, ${data?.firstName} ${data?.lastName}`;
                }
                let locals = {
                    cxName: data?.firstName + " " + data?.lastName,
                    cxAddress: data?.address,
                    address: encodedAddy,
                    apptDate: data?.apptDay,
                    apptTime: moment(data?.apptTime, "hh:mm A").subtract(4, 'hours').format("hh:mm A"),
                    utilPic: data?.utilPic,
                    recepName: recep.name,
                    message: message,
                    cxPhone: data?.phone,
                    cxEmail: data?.email,
                    notes: data?.notes,
                    includeBy: includeSubmittedBy,
                    submittedBy: data?.setter?.name,
                };
                let email = await ejs.renderFile("./templates/MailTemplate/html.ejs", locals);
                const options = {
                    to: recep?.email,
                    subject: `New Lead Submitted: ${data?.firstName} ${data?.lastName} by ${data?.setter?.name}`,
                    template: "index",
                    html: email,
                    textEncoding: "base64",
                };
                this.sendMail(options).then((e) => {
                    return resolve(e);
                });
            } catch (err) {
                return reject(err);
            }
        })
    }
    private encodeMessage(message) {
        return Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    private async createMail(options) {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    };

    private sendMail(options) {
        return new Promise(async (resolve, reject) => {
            try {
                const gmail = google.gmail({ version: 'v1', auth: await OAuthService.getOAuthClient() });
                const rawMessage = await this.createMail(options);
                const { data: { id } = {} } = await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: rawMessage
                    }
                })
                return resolve(id);
            } catch (err) {
                return reject(err);
            }
        })
    }

}

export default new MailService();