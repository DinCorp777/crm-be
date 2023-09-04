import ProjectHelperService from "../../../services/projects-helper.service";

export class WebhookService {

	constructor() { }

	async accountCreation(payload: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				ProjectHelperService.handleCustomerAccountWeekhook(payload?.data).then((res) => {
					return resolve(res);
				}).catch((err) => {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new WebhookService();
