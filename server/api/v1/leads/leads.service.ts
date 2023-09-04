import { ILeads } from "../../../../types/leads";
import { Appointment, Expenses, Leads, Location, Roles, User } from "../../../models";
import LeadsHelperService from "../../../services/leads-helper.service";
import GoogleDriveService from "../../../services/google-drive.service";
import LeadsFilterService from "../../../services/leads-filter.service";
import moment from "moment";
import "moment-timezone";

export class LeadsService {
    constructor() { }

    async reconsile(payload): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!payload) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                let promise = [];
                payload.forEach((item) => {
                    let ld = new Leads(item).save();
                    promise.push(ld);
                });

                Promise.all(promise)
                    .then((res) => {
                        return resolve(res);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async get(query, user): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                Roles.find({ _id: user.roleId }).then(async ([role]) => {
                    let leadRole = role.access.find((e) => e._id === '45948d08-948e-4cee-ba9d-61f8b3595a39');
                    let accessValue = leadRole.permissions[2]?.accessValue;
                    let offset = +query?.offset || 0, limit = +query?.limit || 50;
                    offset = offset * limit;
                    let hash = {}
                    if (accessValue === 1) return resolve([]);
                    if (query) {
                        if (query?.q) {
                            hash = {
                                ...hash,
                                $or: [
                                    { firstName: { $regex: query.q, $options: "i" } },
                                    { lastName: { $regex: query.q, $options: "i" } },
                                    { address: { $regex: query.q, $options: "i" } },
                                    { street: { $regex: query.q, $options: "i" } },
                                    { city: { $regex: query.q, $options: "i" } }
                                ]
                            }
                        }
                        if (query?.status && query?.status.length) {
                            hash = {
                                ...hash,
                                status: { $in: query.status }
                            }
                        }
                        if (query?.user && query?.user.length) {
                            hash = {
                                ...hash,
                                rep: { $in: query.user }
                            }
                        }
                    }
                    if (accessValue === 2) {
                        hash = {
                            ...hash,
                            $or: [
                                { rep: String(user._id) },
                                { setter: String(user._id) }
                            ]
                        }
                    }
                    if (accessValue === 3) {
                        hash = {
                            ...hash,
                            locationId: user.locationId
                        }
                    }
                    let hits;
                    if (query?.sort) {
                        let sortable: any = {}
                        for (let u in query?.sort) {
                            sortable[u] = +query?.sort[u]
                        }
                        if (sortable?.setter) {
                            const pipeline = [
                                {
                                    $addFields: {
                                      'setterId': {
                                        '$toObjectId': '$setter'
                                      }
                                    }
                                  },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'setterId',
                                        foreignField: '_id',
                                        as: 'user',
                                    },
                                },
                                {
                                    $sort: {
                                        'user.username': sortable?.setter,
                                    },
                                },
                                {
                                    $match: {
                                        ...hash
                                    },
                                },
                                {
                                    $skip: offset,
                                },
                                {
                                    $limit: limit,
                                },
                            ];
                            
                            hits = await Leads.aggregate(pipeline).exec();
                        } else {
                            hits = await Leads.find({ ...hash }).sort(sortable).skip(offset).limit(limit);
                        }
                    } else {
                        hits = await Leads.find(hash).sort({ createdAt: -1 }).skip(offset).limit(limit);
                    }

                    if (query?.appointment) {
                        hits = LeadsFilterService.filterAppiontmentTime(hits, query?.appointment);
                    }
                    if (query?.created) {
                        hits = LeadsFilterService.filterAppiontmentTime(hits, query?.created);
                    }
                    if (query?.btnFilter) {
                        if (query?.date) {
                            hits = LeadsFilterService.filterLeadsWithDateFilter(hits, query?.date, query?.btnFilter);
                        } else {
                            hits = LeadsFilterService.filterLeadsWithoutDateFilter(hits, query?.btnFilter);
                        }
                    }
                    if (query?.date) {
                        hits = LeadsFilterService.filterCreatedDateAfterRecords(hits, query?.date);
                    }
                    let isFiltered = Object.keys(hash).length || query?.appointment || query?.created || query?.btnFilter || query?.date;
                    return resolve({
                        hits,
                        page: {
                            total: isFiltered ? hits.length : (await Leads.find(hash)).length,
                            offset: query?.offset || 0,
                            limit: query?.limit || 10
                        }
                    });
                }).catch((err) => {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getUtilityCompanies(id): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                Location.find({ _id: id })
                    .then(async (locations) => {
                        let [location] = locations;
                        let companies = await LeadsHelperService.getCompanies(location);
                        return resolve(companies);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async formCalenderEvent(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve({});
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getRepLeads(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let users = await User.find({ roleId: { $ne: "6425796a73e386a02cb01199" }, active: true, available: true });
                return resolve(users);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getSetterLeads(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let users = await User.find({ active: true });
                return resolve(users);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async leadsPayHistory(id): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ code: 400, message: "Invaild id" });
                }
                Expenses.find({ "lead.id": id })
                    .then((res) => {
                        return resolve(res);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async leadsPayExpenses(id): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ code: 400, message: "Invaild id" });
                }
                let monthName;
                let month = [];
                Expenses.find({ "lead.id": id })
                    .then((expense) => {
                        for (let i = 11; i >= 0; i--) {
                            let lastYear = moment(new Date()).subtract(i, "months").startOf("month").format("YYYY/MM/DD");
                            let endOfMonth = moment(new Date(lastYear)).endOf("month").format("YYYY/MM/DD");
                            let monthAmounts = [];
                            for (let j = 0; j < expense.length; j++) {
                                var invoiceDate = moment(new Date(expense[j].createdAt)).format("YYYY/MM/DD");
                                if (invoiceDate > lastYear && invoiceDate < endOfMonth) {
                                    monthAmounts.push(expense[j].amount);
                                }
                            }
                            monthName = moment(new Date(endOfMonth)).format("MMM");
                            let totalMonthAmount = monthAmounts.reduce((a, b) => {
                                return a + b;
                            }, 0);
                            month.push({
                                monthName: monthName,
                                total: totalMonthAmount,
                            });
                        }
                        return resolve(month);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getAppointmentDate(user, date): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!date) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                LeadsHelperService.getAppointmentDates(user, new Date(date))
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async create(user, payload): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!payload) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const address = `${payload?.street}, ${payload?.city}, ${payload?.state}, ${payload?.zip}`;
                let [status] = await Appointment.find({ name: { $regex: "new", $options: "i" } });
                let date = `${payload?.apptDay} ${payload?.apptTime}`;
                let fullname = `${payload?.first_name} ${payload?.last_name}`;
                let repId = await LeadsHelperService.assign(date, fullname, address, user, payload?.notes);
                let setter: any = await LeadsHelperService.getSetterById(user?._id);
                const currDate = new Date();
                let lead: any = {
                    firstName: payload?.first_name,
                    lastName: payload?.last_name,
                    email: payload?.email,
                    phone: payload?.phone,
                    notes: payload?.notes,
                    street: payload?.street,
                    city: payload?.city,
                    state: payload?.state,
                    zip: payload?.zip,
                    utilPic: payload?.file || "",
                    dateCreated: currDate.toISOString(),
                    locationId: user?.locationId,
                    rep: repId,
                    setter: setter?._id?.toString(),
                    appointmentTime: new Date(date).toString(),
                    status: status?._id,
                    statusName: status?.name,
                    apptDay: payload?.apptDay,
                    apptTime: payload?.apptTime,
                    forceSend: payload?.forceSend ? payload?.forceSend : false,
                    lat: parseFloat(payload?.lat) || 0,
                    lng: parseFloat(payload?.lng) || 0,
                    utility_id: parseFloat(payload?.utility_id) || 0,
                    utility_name: payload?.utility_company || "",
                    company_id: 9146,
                    createdAt: currDate.toISOString()
                };
                lead.monthlyBill = [
                    parseFloat(payload?.jan) || 0,
                    parseFloat(payload?.feb) || 0,
                    parseFloat(payload?.mar) || 0,
                    parseFloat(payload?.apr) || 0,
                    parseFloat(payload?.may) || 0,
                    parseFloat(payload?.jun) || 0,
                    parseFloat(payload?.jul) || 0,
                    parseFloat(payload?.aug) || 0,
                    parseFloat(payload?.sep) || 0,
                    parseFloat(payload?.oct) || 0,
                    parseFloat(payload?.nov) || 0,
                    parseFloat(payload?.dec) || 0,
                ];
                if (payload?.averageMonthlyBill != 0) {
                    lead.averageMonthlyBill = parseFloat(payload?.averageMonthlyBill);
                }
                if (payload?.yearlyUsage != 0) {
                    lead.annualBill = parseFloat(payload?.yearlyUsage);
                }
                if (lead.rep) {
                    new Leads(lead)
                        .save()
                        .then(async (ld) => {
                            let notificationData = {
                                message: `New Lead was Added  ${lead.firstName} ${lead.lastName}`,
                                setterRecep: lead.setter,
                                recep: lead.rep,
                                leadid: ld._id,
                                link: `ownourenergy.web.app/lead/${ld._id}`,
                                sender: "system",
                                type: "Notification",
                                isDismissed: false,
                                sendTo: "user",
                            };
                            LeadsHelperService.sendNotification(notificationData, user)
                                .then(() => {
                                    LeadsHelperService.getFilteredUser(lead.setter)
                                        .then((res) => {
                                            ld.setter = res;
                                            ld.address = address;
                                            LeadsHelperService.sendEmailLeadCreation(ld)
                                                .then((res) => {
                                                    if (lead.forceSend === true || lead.forceSend === "true") {
                                                        LeadsHelperService.sendProposal(ld)
                                                            .then((resp) => {
                                                                return resolve(ld);
                                                            })
                                                            .catch((err) => {
                                                                return reject(err);
                                                            });
                                                    } else {
                                                        return resolve(ld);
                                                    }
                                                })
                                                .catch((err) => {
                                                    return reject(err);
                                                });
                                        })
                                        .catch((err) => {
                                            return reject(err);
                                        });
                                })
                                .catch((err) => {
                                    return reject(err);
                                });
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                } else {
                    return reject({ message: "Couldn't generate a new Lead", code: 400 });
                }

                // // Steps to create Appointment
                // // #1 Check for setter and non setter
                // if (setter) {
                //     // #2 Logic here, to check the user on his/her priority && available time
                //     // if available , set appointment and minus count ( numerator )
                //     // else, iterate the list and find the other user
                // } else {
                //     // for non setter, book own
                // }
            } catch (err) {
                return reject(err);
            }
        });
    }
    async updoadImageFile(file) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!file) {
                    return reject({ message: "Invalid file, please upload again.", code: 400 });
                }
                GoogleDriveService.uploadFile(file)
                    .then(async (res: any) => {
                        return resolve({
                            link: res.webContentLink,
                        });
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getLeadsEventsByDate(user, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let key = payload?.methodInput;
                let date = moment(new Date(payload?.dateInput));
                let leads = await Leads.find({ locationId: user?.locationId });
                let records = []
                leads.forEach((lead) => {
                    let leadDate = moment(lead?.[key])
                    console.log()
                    if (leadDate.format('DD/MM/YYYY') === date.format('DD/MM/YYYY')) {
                        let obj = lead;
                        obj.apptTime = leadDate.tz('Canada/Eastern').format('hh:mm A');
                        records.push(obj);
                    }
                })
                return resolve(records);
            } catch (err) {
                return reject(err);
            }
        })
    }
    async requestLeadProposalFromSolo(payload) {
        return new Promise((resolve, reject) => {
            try {
                if (!payload) {
                    return reject({ message: 'Invalid Request type', code: 400 })
                }
                LeadsHelperService.sendProposal(payload).then((res) => {
                    return resolve(res);
                }).catch((err) => {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        })
    }
    async getById(id): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const [get] = await Leads.find({ _id: id });
                return resolve(get);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async update(id, payload): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                if (!payload) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const updateQuery = await Leads.findOneAndUpdate({ _id: id }, payload);
                return resolve(updateQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async delete(id): Promise<ILeads> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const deleteQuery = await Leads.findOneAndDelete({ _id: id });
                return resolve(deleteQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }
}

export default new LeadsService();
