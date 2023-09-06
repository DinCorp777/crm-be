import { ILeads } from "../../../../types/leads";
import { Leads } from "../../../models";
import LeadsHelperService from "../../../services/leads-helper.service";
import GoogleDriveService from "../../../services/google-drive.service";

export class LeadsService {
    constructor() { }

    async get(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let get = await Leads.find({});
                return resolve(get);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async create(file, payload): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!payload) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                let fileAvailable;
                if (file) {
                    const fileLink: any = await GoogleDriveService.uploadFile(file)
                    fileAvailable = fileLink;
                }

                const requestPayload = {
                    name: payload.name,
                    company: payload.company,
                    email: payload.email,
                    phone: payload.phone,
                    assintance: payload.assintance,
                    excelVersion: payload.excelVersion,
                    description: payload.description,
                    file: fileAvailable?.webContentLink || "",
                }

                new Leads(requestPayload).save().then((ld) => {
                    LeadsHelperService.sendEmailLeadCreation(ld)
                        .then((res) => {
                            return resolve(ld);
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                }).catch((err) => {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        });
    }
    async updoadImageFile(file) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!file) {
                    return reject({ message: "Invalid file, please upload again.", code: 400 });
                }
                GoogleDriveService.uploadFile(file)
                    .then(async (res: any) => {
                        return resolve({
                            link: res.webContentLink,
                        });
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getById(id): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const [get] = await Leads.find({ _id: id });
                return resolve(get);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async update(id, payload): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                if (!payload) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const updateQuery = await Leads.findOneAndUpdate({ _id: id }, payload);
                return resolve(updateQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async delete(id): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const deleteQuery = await Leads.findOneAndDelete({ _id: id });
                return resolve(deleteQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }
}

export default new LeadsService();
