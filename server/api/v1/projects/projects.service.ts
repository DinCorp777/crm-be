import { IProjects } from "../../../../types/projects";
import { ProjectAccounts, Projects } from "../../../models";
import moment from "moment";
import ProjectHelperService from "../../../services/projects-helper.service";

export class ProjectsService {

	constructor() { }

	async get(): Promise<Array<IProjects>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(Projects.find({}))
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getProjectAccounts(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const [account] = await ProjectAccounts.find({ _id: '6428d538e98f66ee248e2844' });
				let startMome = moment(account?.start).add(1, 'hour');
				if (startMome && startMome.isSameOrAfter(moment(new Date()))) {
					ProjectAccounts.findByIdAndUpdate({ _id: account._id }, {
						start: new Date(),
						end: null
					}).then(() => {
						ProjectHelperService.projectReconciliationUpdate().then(async (res) => {
							await ProjectAccounts.findOneAndUpdate({ _id: account._id }, {
								end: new Date()
							});
							return resolve("Project Reconciliation Completed");
						}).catch((err) => {
							return reject(err);
						})
					}).catch((err) => {
						return reject(err);
					})
				} else {
					return resolve("Project Reconciliation Running")
				}
			} catch (err) {
				return reject(err);
			}
		});
	}
	async create(payload): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!payload) {
					return reject({ code: 400, message: "Invalid Request Object." })
				}

				let request = new Projects(payload);
				return resolve(request.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IProjects> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await Projects.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, payload): Promise<IProjects> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await Projects.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async leadProjects(id, payload): Promise<IProjects> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!payload) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const project = await this.getById(id)
				let updatedProject = {
					...project,
					leadId: payload.leadId
				}
				if (project.setCommPaid == null) {
					updatedProject.setCommPaid = false;
				}
				if (project.m1Paid == null) {
					updatedProject.m1Paid = false;
				}
				if (project.m2Paid == null) {
					updatedProject.m2Paid = false;
				}
				const updateQuery = await Projects.findOneAndUpdate({ _id: id }, payload);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<IProjects> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await Projects.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new ProjectsService();
