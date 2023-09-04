import moment from "moment";
import { Appointment, Leads, User } from "../../../models";
import * as _ from 'lodash';

export class ProjectsService {

	constructor() { }

	async getSetter(payload): Promise<Array<any>> {
		return new Promise(async (resolve, reject) => {
			try {
				let setterRoleId = '6425796a73e386a02cb01199';
				let results = [];
				let status = await Appointment.find({ paymentTrigger: true });
				let statuses = status.map((e) => e._id.toString());
				let users = await User.find({ roleId: setterRoleId });
				let promiseLeads = []
				users.forEach((user) => {
					let leads = Leads.find({ setter: user._id.toString(), status: { $in: statuses } });
					promiseLeads.push(leads);
				})
				Promise.all(promiseLeads).then((leads) => {
					users.forEach((user) => {
						leads.forEach((lead) => {
							if (lead.length && lead[0].setter === user._id.toString()) {
								let closer = user;
								let kws = lead.map((e) => e?.kw);
								closer.totalSetterLeads = lead.length;
								closer.totalSetterProjectKw = kws?.reduce((a, b) => a + b)
								results.push(closer);
							}
						})
					})
					return resolve(results.sort((a, b) => b.totalSetterLeads - a.totalSetterLeads));
				}).catch((err) => {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getCloser(payload): Promise<Array<any>> {
		return new Promise(async (resolve, reject) => {
			try {
				let statusSoldId = '642692d6c24c0eada28b4da2', setterRoleId = '6425796a73e386a02cb01199';
				let results = [];
				let users = await User.find({ roleId: { $ne: setterRoleId } });
				let promiseLeads = []
				users.forEach((user) => {
					let leads = Leads.find({ rep: user._id, status: statusSoldId });
					promiseLeads.push(leads);
				})
				Promise.all(promiseLeads).then((leads) => {
					users.forEach((user) => {
						leads.forEach((lead) => {
							if (lead.length && lead[0].rep === user._id.toString()) {
								let closer = user;
								let kws = lead.map((e) => e?.kw);
								closer.totalRepLeads = lead.length;
								closer.totalRepProjectKw = kws?.reduce((a, b) => a + b)
								results.push(closer);
							}
						})
					})
					return resolve(results.sort((a, b) => parseInt(b.totalRepLeads) - parseInt(a.totalRepLeads)));
				}).catch((err) => {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new ProjectsService();
