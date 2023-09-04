import { IProjectAccountFields } from "../../../../types/projectAccountFields";
import { ProjectAccountFields } from "../../../models";

export class ProjectAccountFieldsService {

	constructor() { }

	async get(): Promise<Array<IProjectAccountFields>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(ProjectAccountFields.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload: IProjectAccountFields): Promise<IProjectAccountFields> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				const post = new ProjectAccountFields(payload);
				return resolve(await post.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IProjectAccountFields> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await ProjectAccountFields.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<IProjectAccountFields> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await ProjectAccountFields.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<IProjectAccountFields> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await ProjectAccountFields.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new ProjectAccountFieldsService();
