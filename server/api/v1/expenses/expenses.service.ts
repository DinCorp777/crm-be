import { IExpenses } from "../../../../types/expenses";
import { Appointment, Expenses, Leads, PayrollRuns, User } from "../../../models";
import ExpensesHelperService from '../../../services/expensesHelper.service';
import PayrollService from "../../../services/payroll.service";

export class ExpensesService {

	constructor() { }

	async get(): Promise<Array<IExpenses>> {
		return new Promise(async (resolve, reject) => {
			try {
				return resolve(Expenses.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getPayroll(payload): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				let exp = await Expenses.find({ isPaid: false, category: '64290093cdf3bd24ec49dc2d' })
				return resolve(ExpensesHelperService.assignToPayrollName(payload.date, exp));
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getPayrollCalculate(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				PayrollService.calculatePayroll().then((res) => {
					return resolve(res);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}
	async payToPayroll(payload): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				let promises = [];
				payload.forEach((item) => {
					let update = Expenses.findOneAndUpdate({ _id: item }, { isPaid: true });
					promises.push(update)
				})

				Promise.all(promises).then((res) => {
					return resolve(res);
				}).catch((err) => {
					return reject(err);
				})

			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(payload): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}
				let [user] = await User.find({ _id: payload.user });
				let [lead] = await Leads.find({ _id: payload.lead });
				let [status] = await Appointment.find({ _id: payload.statusId });

				if (status.paymentTrigger) {
					let reqPayload = {
						description: payload?.description,
						to: ExpensesHelperService.transformUserPayload(user),
						lead: ExpensesHelperService.transformLeadPayload(lead),
						isPaid: payload?.paid,
						amount: user?.sitPayAmount || 100
					}
					Leads.findOneAndUpdate({ _id: payload?.lead }, {
						sitCalculated: true
					}).then(async (res) => {
						const post = new Expenses(reqPayload);
						return resolve({ data: await post.save(), message: "Lead updated and sit Successfully" });
					}).catch((err) => {
						return reject(err);
					})
				} else {
					return resolve({ message: "Lead updated Successfully" });
				}
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IExpenses> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await Expenses.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<IExpenses> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await Expenses.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<IExpenses> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await Expenses.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new ExpensesService();
