import { IRepCommission } from "../../../../types/repCommission";
import { RepCommission } from "../../../models";

export class RepCommissionService {

	constructor() { }

	async get(): Promise<Array<IRepCommission>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(RepCommission.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload: IRepCommission): Promise<IRepCommission> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				const post = new RepCommission(payload);
				return resolve(await post.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IRepCommission> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await RepCommission.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<IRepCommission> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await RepCommission.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<IRepCommission> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await RepCommission.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new RepCommissionService();
