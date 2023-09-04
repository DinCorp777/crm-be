import moment from "moment";
import { Expenses, Leads, User } from "../models";
import ExpensesHelperService from "./expensesHelper.service";
import RepCommissionHelperService from "./repcommission.service";
import UserService from "./user.service";
import { IUser } from "../../types/user";

export class PayrollService {
    constructor() { }

    public calculatePayroll() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.calcSitPay1();
                await this.calculateSetterKWM11();
                await this.calculateSetterKWM21(); //done
                await this.calculateRepKWPayM11(); // pending
                await this.calculateRepKWPayM21();
                // await this.calcSetterBonus1();
                // await this.managerOverRide1();
                // await this.calcRepBonus1();
                // await this.calcRepIncentive1();
                // await this.calcManagerSitpay1();
                // await this.calcCompanyComission1();
                return resolve("---------------------Payroll Calculated---------------------");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Below are the functions, responsible for calculating the payroll

    // Function ===> 1
    private async calcSitPay1() {
        return new Promise(async (resolve, reject) => {
            try {
                let leads = await Leads.find({ sitPaid: false });
                let lastSunday = moment().startOf("week");
                let promise = [];
                for (let i = 0; i < leads.length; i++) {
                    let LeadDate = leads[i].appointmentTime;
                    let appointmentTime = moment(LeadDate);
                    let user: any = await UserService?.getUsers(leads[i]?.setter);
                    if (user?.roleId === "6425796a73e386a02cb01199" && appointmentTime < lastSunday) {
                        const payload = {
                            to: ExpensesHelperService.transformUserPayload(user),
                            lead: ExpensesHelperService.transformLeadPayload(leads[i]),
                            amount: parseInt(user?.sitPayAmount || 0),
                            isPaid: false,
                            category:'64290093cdf3bd24ec49dc2d',
                            description: "Sit Pay",
                        };
                        new Expenses(payload)
                            .save()
                            .then(async (res) => {
                                let update = await Leads.findOneAndUpdate({ _id: leads[i]?._id }, { sitPaid: true })
                                console.log("response",update,leads[i]?._id)
                                promise.push(update);
                            })
                            .catch((err) => {
                                return reject(err);
                            });
                    }
                }
                Promise.all(promise).then(() => {
                    return resolve(true);
                }).catch((err) => {
                    return reject(err);
                });
            } catch (err) {
                return reject(err);
            }
        });
    }

    // Function ====> 2
    private async calculateSetterKWM11() {
        console.log("---------------------Calculating [calculateSetterKWM11] Setter KW Pay - M1---------------------");

        console.log("---------------------Looking for Leads that have M1 Dates---------------------");

        return new Promise(async (resolve, reject) => {
            try {
                // const leads = Leads.find({}).where("m1").ne(null)
                const leads = await Leads.find({ m1: { $ne: null }, m1Paid: { $ne: true } });

                console.log(leads.length + "--------------------Leads Found--------------------");

                // iterating over the leads data

                for (let i = 0; i < leads.length; i++) {
                    let leadCount = i + 1;

                    // if setter is not undefined
                    if (leads[i].setter !== undefined) {
                        // finding user of that _id
                        const user: any = await UserService?.getUsers(leads[i]?.setter);

                        console.log(user,"--------------------user--------------------");
                        if (user?.roleId === "6425796a73e386a02cb01199") {
                            console.log("--------------------conditionTrue--------------------");

                            console.log("Lead " + leadCount + ": " + leads[i].id + ". Setter: " + user?.username);

                            console.log("--------------------leadExist--------------------", leads[i]);

                            if (leads[i].kw != undefined && user.kwPay != undefined) {
                                // Calculating the commission here
                                let ttlCommission = leads[i].kw * parseInt(user?.kwPay);

                                console.log("Project KW", leads[i].kw);
                                console.log("User KW Pay", user?.kwPay);
                                console.log("Total Commission:", ttlCommission);

                                let m1Amount = ttlCommission / 2 > 500 ? 500 : ttlCommission / 2;
                                let m2Amount = ttlCommission - m1Amount;

                                console.log("M1 Amount: ", m1Amount);
                                console.log("M2 Amount: ", m2Amount);

                                // ========================= Generating the payload here ========================= //
                                const payload = {
                                    to: ExpensesHelperService.transformUserPayload(user),
                                    lead: ExpensesHelperService.transformLeadPayload(leads[i]),
                                    amount: m1Amount,
                                    isPaid: false,
                                    category:'64290093cdf3bd24ec49dc2d',
                                    description: "Setter KW Pay (M1)",
                                };

                                new Expenses(payload)
                                    .save()
                                    .then(() => {
                                        console.log("Setter KW Pay (M1) Expense created for Lead " + leads[i].id + " for " + user?.username);

                                        Leads.findOneAndUpdate({ _id: leads[i]?._id }, { m1Paid: true, m2Amount: m2Amount })
                                            .then(() => {
                                                console.log("--------------------M1 Marked Paid and M2 Amount Set--------------------");
                                                return resolve(true);
                                            })
                                            .catch((err) => {
                                                return reject(err);
                                            });
                                    })
                                    .catch((err) => {
                                        return reject(err);
                                    });
                            }
                        }
                    } else {
                        console.log("Lead " + leadCount + ": Setter Not Set for Lead " + leads[i].id + " - " + leads[i].customer_name);
                    }
                }
                console.log("--------------------Setter KW Pay - M1 Complete--------------------");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function ====> 3
    private async calculateSetterKWM21() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Calculating Setter KW Pay - M2---------------------");

                console.log("---------------------Looking for Leads that have M2 Amounts and Dates that have not yet been Paid---------------------");

                const leads = await Leads.find({ m2: { $ne: null }, m2Paid: { $ne: true }, m2Amount: { $ne: null } });

                console.log(leads.length + "---------------------Leads Found---------------------");

                for (let i = 0; i < leads.length; i++) {
                    // getting the user here
                    const user: any = await UserService?.getUsers(leads[i].setter);
                    let leadCount = i + 1;

                    if (user?.roleId === "6425796a73e386a02cb01199") {
                        console.log("Lead " + leadCount + ": " + leads[i].id + ". Setter: " + user?.username + " M2 Amount: " + leads[i].m2Amount);

                        // Generating the payload here
                        const payload = {
                            to: ExpensesHelperService.transformUserPayload(user),
                            lead: ExpensesHelperService.transformLeadPayload(leads[i]),
                            amount: leads[i].m2Amount,
                            category:'64290093cdf3bd24ec49dc2d',
                            isPaid: false,
                            description: "Setter KW Pay (M2)",
                        };

                        new Expenses(payload)
                            .save()
                            .then(async () => {
                                console.log("Setter KW Pay (M2) Expense created for Lead " + leads[i].id + " for " + user?.username);

                                Leads.findOneAndUpdate({ _id: leads[i]?._id }, { m2Paid: true })
                                    .then(() => {
                                        console.log("--------------------M2 Marked Paid--------------------");
                                        return resolve(true);
                                    })
                                    .catch((err) => {
                                        return reject(err);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                }
                console.log("---------------------Setter KW Pay - M2 Complete---------------------");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 4
    private async calculateRepKWPayM11() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Calculating Rep KW Pay - M1---------------------");

                console.log("---------------------Looking for Leads that have M1 Dates that have not yet been Paid---------------------");

                const leads = await Leads.find({ m1: { $ne: null }, repKWM1Paid: { $ne: true }, rep: { $ne: null } });

                console.log(leads.length + " --------------------- Leads Found ---------------------");

                for (let i = 0; i < leads.length; i++) {
                    let leadCount = i + 1;

                    console.log("Lead " + leadCount + ": " + leads[i].id);

                    const user: any = await UserService?.getUsers(leads[i].rep);
                    if (user?.roleId != "6425796a73e386a02cb01199" && leads[i].docRequest?.pricing?.ppw) {
                        console.log("Lead " + leadCount + ": " + leads[i].customer_name + ". Rep: " + user?.username);

                        // Parsing the amount value here
                        let gross = parseFloat(leads[i].gross_account_value).toFixed(2);
                        console.log("gross", gross);

                        // Parsing into 2 digit %
                        let dealerFee: number = Number(parseFloat(leads[i].dealer_fee_percentage).toFixed(2));
                        dealerFee = dealerFee / 100;
                        dealerFee = Number(dealerFee.toFixed(2));

                        let kw = leads[i]?.kw;

                        let basePPW;

                        // changing in this section
                        console.log("leads id ", leads[i].id);

                        if (leads[i].docRequest != undefined) {
                            console.log("defined", leads[i].docRequest);
                            basePPW = leads[i].docRequest.pricing.ppw;
                        } else {
                            basePPW = 0;
                        }

                        let rct: any = {};
                        let kwPay = 0;
                        console.log("true 2");
                        console.log("Gross:", gross);
                        // console.log("System Size:", sysSize);
                        console.log("Dealer Fee:", dealerFee);
                        // console.log("Net:", net);
                        console.log("Base ppw:", basePPW);

                        let maxAmount = 0;
                        if (leads[i].rep == leads[i].setter) {
                            rct = await RepCommissionHelperService.getRepCommissionTier(user.repCloserCommissionTier);
                            maxAmount = 1000;
                            console.log("Rep Only Deal", rct.name);
                        } else {
                            rct = await RepCommissionHelperService.getRepCommissionTier(user.repWithSetterCommissionTier);
                            maxAmount = 500;
                            console.log("Rep + Setter Deal", rct.name);
                        }
                        console.log("basePPW", parseFloat(basePPW));
                        console.log("rct.lowLimit", parseFloat(rct.lowLimit));
                        console.log("rct.zero", parseFloat(rct.zero));
                        console.log("basePPW >= rct.lowLimit", parseFloat(basePPW) >= parseFloat(rct.lowLimit));
                        console.log("basePPW >= rct.zero", parseFloat(basePPW) >= parseFloat(rct.zero));

                        if (basePPW >= rct.lowLimit) {
                            let calcAmount = rct.m * basePPW - rct.b;
                            kwPay = calcAmount;
                        } else {
                            kwPay = basePPW >= rct.zero ? rct.lowAmount : 0;
                        }

                        console.log("KW:", kw);
                        console.log("KW Pay:", kwPay);

                        let ttlCommission = kw * kwPay;

                        ttlCommission = ttlCommission;

                        console.log("Total Commission:", ttlCommission);

                        if (ttlCommission > 0) {
                            let m1Amount = ttlCommission / 2 > maxAmount ? maxAmount : ttlCommission / 2;
                            let m2Amount = ttlCommission - m1Amount;

                            console.log("M1 Amount: ", m1Amount);
                            console.log("M2 Amount: ", m2Amount);

                            // ============================== Generating the Payload here ===================================

                            const payload = {
                                to: ExpensesHelperService.transformUserPayload(user),
                                lead: ExpensesHelperService.transformLeadPayload(leads[i]),
                                amount: m1Amount,
                                isPaid: false,
                                category:'64290093cdf3bd24ec49dc2d',
                                description: "Rep KW Pay (M1)",
                            };

                            new Expenses(payload)
                                .save()
                                .then(() => {
                                    console.log("Rep KW Pay (M1) Expense created for Lead " + leads[i].customer_name + " for " + user?.username);

                                    Leads.findOneAndUpdate(
                                        { _id: leads[i]?._id },
                                        {
                                            repKWM1Paid: true,
                                            repKWM2Amount: m2Amount,
                                            repKWM2Paid: false,
                                        }
                                    )
                                        .then(() => {
                                            console.log("--------------------M1 Marked Paid and M2 Amount Set--------------------");
                                            return resolve(true);
                                        })
                                        .catch((err) => {
                                            return reject(err);
                                        });
                                })
                                .catch((error) => {
                                    return reject(error);
                                });
                        }
                    }
                }
                console.log("Rep KW Pay - M1 Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function ====> 5
    private async calculateRepKWPayM21() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Calculating Rep KW Pay - M2---------------------");

                console.log("Looking for Leads that have Rep M2 Amounts and Dates that have not yet been Paid");

                const leads = await Leads.find({ m2: { $ne: null }, repKWM2Amount: { $ne: null }, repKWM2Paid: { $ne: true }, rep: { $ne: false } });

                console.log(leads.length + " Leads Found");

                for (let i = 0; i < leads.length; i++) {
                    // getting the user
                    const user: any = await UserService?.getUsers(leads[i]?.rep);
                    let leadCount = i + 1;

                    if (user?.roleId != "6425796a73e386a02cb01199") {
                        console.log("Lead " + leadCount + ": " + leads[i].customer_name + ". Rep: " + user?.username + " M2 Amount: " + leads[i].m2Amount);

                        // Generating the Payload here
                        const payload = {
                            to: ExpensesHelperService.transformUserPayload(user),
                            lead: ExpensesHelperService.transformLeadPayload(leads[i]),
                            amount: leads[i].repKWM2Amount,
                            isPaid: false,
                            category:'64290093cdf3bd24ec49dc2d',
                            description: "Rep KW Pay (M2)",
                        };

                        new Expenses(payload)
                            .save()
                            .then(() => {
                                console.log("Rep KW Pay (M2) Expense created for Lead " + leads[i].customer_name + " for " + user?.username);

                                Leads.findOneAndUpdate({ _id: leads[i]?._id }, { repKWM2Paid: true })
                                    .then(() => {
                                        console.log("--------------------M2 Marked Paid--------------------");
                                        return resolve(true);
                                    })
                                    .catch((err) => {
                                        return reject(err);
                                    });
                            })
                            .catch((error) => {
                                return reject(error);
                            });
                    }
                }
                console.log("Rep KW Pay - M2 Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 6
    private async calcSetterBonus1() {
        return new Promise(async (resolve, reject) => {
            try {
                let getLeads = [];
                let soldAccountList = [];
                let currendate = moment().format("MM-DD-YYYY");
                console.log("---------------------currendate---------------------", currendate);

                let lastmonth = moment(currendate).subtract(1, "months").startOf("month").format("MM-DD-YYYY");

                console.log("---------------------lastmonth---------------------", lastmonth);

                let endOflastmonth = moment(currendate).subtract(1, "months").endOf("month").format("MM-DD-YYYY");

                console.log("---------------------endOflastmonth---------------------", endOflastmonth);

                //? data.status === "roWLcfnZvHBWpgGyu8qA" [what is status]

                const Users: IUser[] = await User.find({ roleId: "6425796a73e386a02cb01199" });

                console.log("users", Users[0]?._id);

                const leadData = await Leads.find({ setterBonusPaid: { $ne: true } });

                let dateCreated;
                if (typeof leadData[0].dateCreated == "object") {
                    dateCreated = moment(leadData[0].createdAt).format("MM-DD-YYYY");
                } else {
                    dateCreated = moment(leadData[0].createdAt).format("MM-DD-YYYY");
                }

                if (leadData[0].status === "roWLcfnZvHBWpgGyu8qA" && dateCreated >= lastmonth && dateCreated <= endOflastmonth) {
                    getLeads.push(leadData[0]);
                    console.log("leadData[0] id ", leadData[0]?._id);
                }

                console.log("---------------------length---------------------", getLeads.length);

                for (let i = 0; i < Users.length; i++) {
                    for (let j = 0; j < getLeads.length; j++) {
                        if (getLeads[j].setter == Users[i].id) {
                            console.log("Users", Users[i].id);
                            soldAccountList.push(getLeads[j]);
                        }
                    }
                }

                console.log("length sol", soldAccountList.length);

                let bonus;

                if (soldAccountList.length >= 20) {
                    console.log("16000 condition", soldAccountList.length);
                    bonus = 16000;
                }

                if (soldAccountList.length >= 17 && soldAccountList.length < 20) {
                    bonus = 11000;
                }
                if (soldAccountList.length >= 14 && soldAccountList.length < 17) {
                    //7000
                    bonus = 7000;
                }
                if (soldAccountList.length >= 11 && soldAccountList.length < 14) {
                    //4000
                    bonus = 4000;
                }
                if (soldAccountList.length >= 8 && soldAccountList.length < 11) {
                    //2000
                    bonus = 2000;
                }
                if (soldAccountList.length >= 5 && soldAccountList.length < 8) {
                    bonus = 1000;
                }

                // ------------------------ Updating the bonus data------------------------//

                // Generating the Payload here
                const payload = {
                    to: ExpensesHelperService.transformUserPayload(Users[0]?._id),
                    lead: null,
                    amount: bonus,
                    isPaid: false,
                    category:'64290093cdf3bd24ec49dc2d',
                    description: "Setter Bonus Pay",
                };

                new Expenses(payload)
                    .save()
                    .then(() => {
                        console.log(`data updated for ${bonus}`);

                        for (let k = 0; k < soldAccountList.length; k++) {
                            Leads.findOneAndUpdate(
                                { _id: soldAccountList[k]?._id },
                                { setterBonusPaid: true, setterBonusAmount: bonus / soldAccountList.length }
                            )
                                .then(() => {
                                    console.log("--------------------Lead Bonus Amounts Updated--------------------");
                                    return resolve(true);
                                })
                                .catch((err) => {
                                    return reject(err);
                                });
                        }

                        // ----------------------------------------------------------------------------------//

                        soldAccountList.length = 0;
                    })
                    .catch((error) => reject(error));
                console.log("Setter Bonus Paid Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 7
    private async managerOverRide1() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Manager Over Ride Start---------------------");

                const leadData = await Leads.find({ m2: { $ne: null }, overRidePaid: { $ne: true }, locationId: { $ne: null } });

                for (let i = 0; i < leadData.length; i++) {
                    let manager;

                    // getting the manager location id
                    manager = await UserService?.getManager(leadData[i].locationId);
                    console.log("manage location", manager.locationId);

                    if (leadData[i].locationId == manager.locationId) {
                        let amount = manager.override * leadData[i].kw;
                        console.log("amount", amount);

                        // ------------------------ Updating the data------------------------//

                        // Generating the Payload here
                        const payload = {
                            to: ExpensesHelperService.transformUserPayload(manager),
                            lead: ExpensesHelperService.transformLeadPayload(leadData[i]?.id),
                            amount: amount,
                            isPaid: false,
                            category:'64290093cdf3bd24ec49dc2d',
                            description: "Office Override Pay",
                        };

                        new Expenses(payload)
                            .save()
                            .then(() => {
                                Leads.findOneAndUpdate({ _id: leadData[i]?._id }, { overRidePaid: true })
                                    .then(() => {
                                        console.log("--------------------leadData over ride update--------------------");
                                        return resolve(true);
                                    })
                                    .catch((err) => {
                                        return reject(err);
                                    });

                                // ----------------------------------------------------------------------------------//
                            })
                            .catch((error) => reject(error));
                    }
                }
                console.log("Manager Over Ride Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 8
    private async calcRepBonus1() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Calc Rep Bonus Start---------------------");

                let newLead = [];
                let currendate = moment().format("MM-DD-YYYY");
                let bonusAmount = 0;
                let soldAccountList = [];

                let lastmonth = moment(currendate).subtract(1, "months").startOf("month").format("MM-DD-YYYY");

                let endOflastmonth = moment(currendate).subtract(1, "months").endOf("month").format("MM-DD-YYYY");

                //Getting the lead data here
                const leadData = await Leads.find({ repBonusPaid: { $ne: true } });

                for (let j = 0; j < leadData.length; j++) {
                    let dateCreated = moment(leadData[j].createdAt).format("MM-DD-YYYY");

                    console.log("date cre" + " " + dateCreated + " " + "end of last month" + "" + endOflastmonth + " " + "last month" + " " + lastmonth);

                    console.log("lead id before if", leadData[j]?._id);

                    if (dateCreated >= lastmonth && dateCreated <= endOflastmonth) {
                        console.log("lead id after if", leadData[j]?._id);
                        newLead.push(leadData[j]);
                    }
                }

                console.log("---------------------new Lead---------------------", newLead.length);

                // getting the user of the role "REP"
                const users: IUser[] = await User.find({ roleId: "6425797c73e386a02cb011a1" });

                for (let i = 0; i < users.length; i++) {
                    soldAccountList.length = 0;
                    users[i].basePPWAvg = 0;
                    console.log("user in for loop Id", users[i].id);
                    console.log("lead length in for loop", newLead.length);

                    for (let j = 0; j < newLead.length; j++) {
                        if (newLead[j].gross_account_value != undefined && newLead[j].dealer_fee_percentage != undefined && newLead[j].kw != undefined) {
                            if (newLead[j].rep == users[i].id) {
                                console.log("rep = leadid");
                                soldAccountList.push(newLead[j]);

                                let basePPW;
                                if (newLead[j].docRequest != undefined) {
                                    basePPW = newLead[j].docRequest.pricing.ppw;
                                } else {
                                    basePPW = 0; //(await net) / sysSize;
                                }
                                console.log("baseppw", basePPW);

                                users[i].basePPWAvg = (users[i].basePPWAvg * soldAccountList.length - 1 + basePPW) / soldAccountList.length;
                            }
                            console.log("avg", users[i].basePPWAvg);
                        }
                        console.log("---------------------forLoop finished---------------------");

                        if (soldAccountList.length > 0) {
                            console.log("sold acount list", soldAccountList.length);
                            if (users[i].basePPWAvg >= 2.3 && users[i].basePPWAvg < 2.7) {
                                if (soldAccountList.length >= 3 && soldAccountList.length < 6) {
                                    bonusAmount = 500;
                                } else {
                                    if (soldAccountList.length >= 6 && soldAccountList.length < 9) {
                                        bonusAmount = 1000;
                                    } else {
                                        if (soldAccountList.length >= 9 && soldAccountList.length < 11) {
                                            bonusAmount = 3000;
                                        } else {
                                            if (soldAccountList.length >= 11) {
                                                bonusAmount = 5000;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (users[i].basePPWAvg >= 2.7 && users[i].basePPWAvg < 3) {
                                    if (soldAccountList.length >= 3 && soldAccountList.length < 6) {
                                        bonusAmount = 1000;
                                    } else {
                                        if (soldAccountList.length >= 6 && soldAccountList.length < 9) {
                                            bonusAmount = 2000;
                                        } else {
                                            if (soldAccountList.length >= 9 && soldAccountList.length < 11) {
                                                bonusAmount = 4000;
                                            } else {
                                                if (soldAccountList.length >= 11) {
                                                    bonusAmount = 7000;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (users[i].basePPWAvg >= 3 && users[i].basePPWAvg < 3.3) {
                                        if (soldAccountList.length >= 3 && soldAccountList.length < 6) {
                                            bonusAmount = 1000;
                                        } else {
                                            if (soldAccountList.length >= 6 && soldAccountList.length < 9) {
                                                bonusAmount = 3000;
                                            } else {
                                                if (soldAccountList.length >= 9 && soldAccountList.length < 11) {
                                                    bonusAmount = 5000;
                                                } else {
                                                    if (soldAccountList.length >= 11) {
                                                        bonusAmount = 10000;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (users[i].basePPWAvg >= 3.3) {
                                            if (soldAccountList.length >= 3 && soldAccountList.length < 6) {
                                                bonusAmount = 1000;
                                            } else {
                                                if (soldAccountList.length >= 6 && soldAccountList.length < 9) {
                                                    bonusAmount = 3000;
                                                } else {
                                                    if (soldAccountList.length >= 9 && soldAccountList.length < 11) {
                                                        bonusAmount = 6000;
                                                    } else {
                                                        if (soldAccountList.length >= 11) {
                                                            bonusAmount = 11000;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            console.log("---------------------bonos amount---------------------", bonusAmount);

                            if (bonusAmount > 0) {
                                // Generating the Payload here
                                const payload = {
                                    to: ExpensesHelperService.transformUserPayload(users[i]),
                                    lead: null,
                                    amount: bonusAmount,
                                    isPaid: false,
                                    category:'64290093cdf3bd24ec49dc2d',
                                    description: "Rep Bonus",
                                };

                                new Expenses(payload)
                                    .save()
                                    .then(async () => {
                                        for (let k = 0; k < soldAccountList.length; k++) {
                                            Leads.findOneAndUpdate(
                                                { _id: soldAccountList[k]?.id },
                                                { repBonusPaid: true, repBonusAmount: bonusAmount / soldAccountList.length }
                                            )
                                                .then(() => {
                                                    console.log("--------------------Leads Updated--------------------");
                                                    return resolve(true);
                                                })
                                                .catch((err) => {
                                                    return reject(err);
                                                });
                                        }

                                        // ----------------------------------------------------------------------------------//
                                    })
                                    .catch((error) => reject(error));
                            }
                        }
                    }
                }
                console.log("---------------------Calc Rep Bonus Complete---------------------");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 9
    private async calcRepIncentive1() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Calc Rep Incentive Start---------------------");

                const leads: any = await Leads.find({ repKWM2Paid: true });

                console.log("---------------------Leads length---------------------", Leads.length);

                for (let i = 0; i < leads.length; i++) {
                    const expenses = await Expenses.findOne({ "lead._id": true });

                    console.log("amount", expenses.amount);

                    // Generating the Payload here
                    const payload = {
                        to: ExpensesHelperService.transformUserPayload(leads[i]?.rep),
                        lead: ExpensesHelperService.transformLeadPayload(leads[i]?.id),
                        amount: expenses.amount,
                        isPaid: false,
                        category:'64290093cdf3bd24ec49dc2d',
                        description: "Incentive Clawback",
                    };

                    new Expenses(payload)
                        .save()
                        .then(async () => {
                            Leads.findOneAndUpdate({ _id: expenses?._id }, { clawedBack: true })
                                .then(() => {
                                    return resolve(true);
                                })
                                .catch((err) => {
                                    return reject(err);
                                });

                            // ----------------------------------------------------------------------------------//
                        })
                        .catch((error) => reject(error));
                }

                console.log("Calc Rep Incentive Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 10
    private async calcManagerSitpay1() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Manager Sit Pay Start---------------------");
                let newLead = [];

                let currendate = moment().format("MM-DD-YYYY");
                console.log("cuurent date", currendate);

                let Lastsunday = moment(currendate).subtract(1, "weeks").format("MM-DD-YYYY");

                const leads = await Leads.find({ managerSitPay: false, appointmentTime: { $ne: false } });

                let appointment;

                for (let j = 0; j < leads.length; j++) {
                    if (typeof leads[j].appointmentTime == "object") {
                        appointment = moment(leads[j].appointmentTime).format("MM-DD-YYYY");
                    } else {
                        appointment = moment(leads[j].appointmentTime).format("MM-DD-YYYY");
                    }

                    if (new Date(appointment) <= new Date(Lastsunday)) {
                        console.log("lead id in for loop", leads[j].id);
                        newLead.push(leads[j]);
                    }
                }

                //Getting the user ( setter manager )
                const users = await User.find({ roleId: "6425799573e386a02cb011a9" });

                for (let j = 0; j < newLead.length; j++) {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].locationId == newLead[j].locationId) {
                            // Generating the Payload here
                            const payload = {
                                to: ExpensesHelperService.transformUserPayload(users[i]?._id),
                                lead: ExpensesHelperService.transformLeadPayload(newLead[i]?.id),
                                amount: users[i].perSitAmount,
                                isPaid: false,
                                category:'64290093cdf3bd24ec49dc2d',
                                description: "Setter Manager Sit Pay",
                            };

                            new Expenses(payload)
                                .save()
                                .then(() => {
                                    console.log("--------------------Successfull add PerSitAmount in Expense--------------------");
                                })
                                .catch((error) => reject(error));
                        }
                    }
                }
                console.log("Successfull run function");

                console.log("Manager Sit Pay Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Function =====> 11
    private async calcCompanyComission1() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("---------------------Company Comission Start---------------------");

                //   getting the user here
                const user = await User.find({ companyCommission: true, companyKW: { $ne: null } });

                console.log("---------------------User Length---------------------", user.length);

                //   getting the leads here
                const leads = await Leads.find({ m2: { $ne: null }, kw: { $ne: false } });

                console.log("---------------------Leads---------------------", leads.length);

                for (let i = 0; i < leads.length; i++) {
                    for (let j = 0; j < User.length; j++) {
                        let total = 0;
                        console.log("---------------------leadId after if---------------------", leads[i].id);

                        // calculating the total here
                        total = leads[i].kw * User[j].companyKW;

                        console.log("leadsId after if", leads[i]?.id);
                        console.log("user", User[j]?.id);
                        console.log("total", total);

                        // Generating the Payload here
                        const payload = {
                            to: ExpensesHelperService.transformUserPayload(User[j]?.id),
                            lead: ExpensesHelperService.transformLeadPayload(leads[i]?.id),
                            amount: total,
                            isPaid: false,
                            category:'64290093cdf3bd24ec49dc2d',
                            description: "Company Commisston pay",
                        };

                        new Expenses(payload)
                            .save()
                            .then(() => {
                                console.log("--------------------successfull add Expense--------------------");
                            })
                            .catch((error) => reject(error));
                    }

                    Leads.findOneAndUpdate({ _id: leads[i]?._id }, { companyOveride: true })
                        .then(() => {
                            console.log("--------------------successfull Company overRide True--------------------");
                            return resolve(true);
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                }
                console.log("Successfull True");

                console.log("Company Comission Complete");
            } catch (error) {
                return reject(error);
            }
        });
    }
}

export default new PayrollService();
