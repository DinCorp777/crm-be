import { IExpensesCategory } from "../../../../types/expenses";
import { ExpensesCategory } from "../../../models";

export class ExpensesCategoryService {

	constructor() { }

	async get(): Promise<Array<IExpensesCategory>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(ExpensesCategory.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload: IExpensesCategory): Promise<IExpensesCategory> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				const post = new ExpensesCategory(payload);
				return resolve(await post.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IExpensesCategory> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await ExpensesCategory.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<IExpensesCategory> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await ExpensesCategory.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<IExpensesCategory> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await ExpensesCategory.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new ExpensesCategoryService();
