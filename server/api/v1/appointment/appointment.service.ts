import { IAppointment } from "../../../../types/appointment";
import { Appointment, Leads } from "../../../models";

export class AppointmentService {

	constructor() { }

	async get(): Promise<Array<IAppointment>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Appointment.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload: IAppointment): Promise<IAppointment> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				const post = new Appointment(payload);
				return resolve(await post.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IAppointment> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await Appointment.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<IAppointment> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await Appointment.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const checkLeads = await Leads.find({ status: id });

				if (checkLeads.length) {
					return resolve({
						isDeleted: false,
						count: checkLeads.length
					})
				} else {
					const deleteQuery = await Appointment.findOneAndDelete({ _id: id });
					return resolve({
						isDeleted: true,
						data: deleteQuery
					});
				}
			} catch (err) {
				return reject(err);
			}
		})
	}
	async updateLeadAndDelete(id, uId): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id || !uId) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const getLeads = await Leads.find({ status: id });
				let promises = [];
				getLeads.forEach((lead) => {
					let obj = lead;
					obj.status = uId;
					let update = Leads.findOneAndUpdate({ _id: lead._id }, obj);
					promises.push(update);
				});
				Promise.all(promises).then(async () => {
					const deleteQuery = await Appointment.findOneAndDelete({ _id: id });
					return resolve(deleteQuery);
				}).catch((err) => {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new AppointmentService();
