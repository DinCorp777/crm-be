import { INotification } from "../../../../types/notification";
import { Notification } from "../../../models";
import NotificationHelperService from "../../../services/notification-helper.service";

export class NotificationService {

	constructor() { }

	async get(): Promise<Array<INotification>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Notification.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async singleMessageObjById(id): Promise<Array<INotification>> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				resolve(Notification.find({ leadId: id }))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getAllNotifications(user): Promise<Array<INotification>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Notification.find({ type: 'Notification', $or: [{ "sender.userId": user._id }, { sendTo: 'all' }] }))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getAllMessages(user): Promise<Array<INotification>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Notification.find({ type: 'Message', $or: [{ "sender.userId": user._id }, { sendTo: 'all' }] }))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getAllTasks(user): Promise<Array<INotification>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Notification.find({ type: 'Task', $or: [{ "sender.userId": user._id }, { sendTo: 'all' }] }))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async addLeadNote(payload, user): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				let notify = {
					sendTo: 'user',
					message: payload.message,
					recep: "",
					link: "",
					leadId: payload.leadId,
					sender: `${user._id}`,
					type: "Notification",
					isDismissed: true,
					user: user,
				}
				NotificationHelperService.createNotification(notify, user).then((res) => {
					return resolve(res);
				}).catch((err) => {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload, user): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				NotificationHelperService.createNotification(payload, user).then((res) => {
					return resolve(res);
				}).catch((err) => {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<INotification> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await Notification.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<INotification> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await Notification.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<INotification> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await Notification.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new NotificationService();
