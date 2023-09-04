import { Leads } from '../models';
import axios from 'axios';

export class ProjectHelperService {

    async projectReconciliationUpdate() {
        return new Promise(async (resolve, reject) => {
            try {
                axios.post('https://lgcy-analytics.com/api/api-token-auth', {
                    username: "own_energy",
                    password: "8z0R%74LGLn!",
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    let tokenInt = response.data.token;
                    axios.get('https://api.lgcypower.com/sales_partners/accounts', {
                        headers: {
                            "content-type": "application/json",
                            Authorization: "Bearer " + tokenInt,
                        }
                    }).then((projectsData) => {
                        let projects = projectsData.data;
                        let promise = [];
                        for (let i = 1; i <= projects.total_pages; i++) {
                            let f = axios.get(`https://api.lgcypower.com/sales_partners/accounts?page=${i}`, {
                                headers: {
                                    "content-type": "application/json",
                                    Authorization: "Bearer " + tokenInt,
                                }
                            })
                            promise.push(f);
                        }
                        Promise.all(promise).then((resp) => {
                            let records = [];
                            resp.forEach((item) => {
                                records.push(...item.data.results)
                            });
                            this.syncProjectWithLeads(records).then((res) => {
                                return resolve(res)
                            }).catch((err) => {
                                return reject(err);
                            })
                        }).catch((err) => {
                            return reject(err);
                        })
                    }).catch((err) => {
                        return reject(err);
                    })
                }).catch((err) => {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        })
    }
    async handleCustomerAccountWeekhook(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data) {
                    return reject({ code: 400, message: "Data not found." })
                }
                const leads = await Leads.find({ path: data?.path });
                if (leads.length) {
                    let promise = [];
                    leads.forEach((lead) => {
                        let payload = { ...data, customerData: { merge: true } }
                        let save = Leads.findOneAndUpdate({ _id: lead._id }, payload);
                        promise.push(save);
                    });
                    Promise.all(promise).then((resp) => {
                        return resolve(resp);
                    }).catch((err) => {
                        return reject(err);
                    });
                } else {
                    return resolve({})
                }
            } catch (err) {
                return reject(err);
            }
        })
    }
    private async syncProjectWithLeads(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let promsie = [];
                let leads = await Leads.find({});
                data.forEach((d) => {
                    if (d?.proposal_id) {
                        leads.forEach((lead) => {
                            if (lead?.proposalId && parseInt(d?.proposal_id, 10) === lead?.proposalId) {
                                let payload = {
                                    ...d,
                                    status: '642692d6c24c0eada28b4da2',
                                    statusName: 'Sold'
                                }                                
                                let request = Leads.findOneAndUpdate({ _id: lead._id }, payload);
                                promsie.push(request);
                            }
                        })
                    }
                });
                Promise.all(promsie).then((res) => {
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

export default new ProjectHelperService();
