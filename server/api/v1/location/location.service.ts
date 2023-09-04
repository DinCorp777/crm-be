import { ILocation } from "../../../../types/location";
import { Location } from "../../../models";

export class LocationService {

	constructor() { }

	async get(): Promise<Array<ILocation>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Location.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload: ILocation): Promise<ILocation> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				const post = new Location(payload);
				return resolve(await post.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<ILocation> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await Location.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<ILocation> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await Location.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<ILocation> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await Location.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new LocationService();
