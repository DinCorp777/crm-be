import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export class ExpensesHelperService {

    public assignToPayrollName(date, payees) {
        const getWeeks = this.getWeeksInYear(date);
        getWeeks.forEach((week) => {
            payees.forEach((paye) => {
                if (moment(paye.createdAt).isSameOrAfter(week.dates.start) && moment(paye.createdAt).isSameOrBefore(week.dates.end)) {
                    week.payees.push(paye);
                }
            });
        });
        return this.payrollWeekSortByUser(getWeeks);
    }
    public payrollWeekSortByUser(weeks) {
        let weeksFinal = [];
        weeks.forEach((week) => {
            let obj = week;
            obj.payees = this.getSortedPayess(obj.payees)
            weeksFinal.push(obj);
        })
        return weeksFinal;
    }
    public getSortedPayess(payees) {
        let payrolling = {};
        payees.forEach((paye) => {
            if (payrolling[paye.to.id]) {
                payrolling[paye.to.id] = {
                    name: payrolling[paye.to.id].name,
                    payroll: [...payrolling[paye.to.id].payroll, paye],
                };
            } else {
                payrolling[paye.to.id] = {
                    name: paye.to.name,
                    payroll: [paye],
                };
            }
        });
        return this.transformSortedPayees(Object.values(payrolling))
    }
    public transformSortedPayees(payees) {
        const payeeList = []
        const payeeNameList = []
        payees.forEach((paye) => {
            let obj = { id: uuidv4(), name: paye.name }
            payeeNameList.push(obj);
            payeeList.push({ ...obj, payroll: paye.payroll });
        })
        return { availablePayee: payeeNameList, payeePayrols: this.categoryPayeesPayTypes(payeeList) }
    }
    public categoryPayeesPayTypes(paylist) {
        let list = [];
        paylist.forEach((pay) => {
            let hash = {};
            let obj = {
                id: pay.id,
                name: pay.name,
                payroll: hash
            }
            pay.payroll.forEach((rol) => {
                if (hash[String(rol.description)]) {
                    hash[String(rol.description)] = [
                        ...hash[String(rol.description)],
                        rol
                    ]
                } else {
                    hash[String(rol.description)] = [rol]
                }
            })
            list.push(obj);
        })
        return list;
    }
    public getWeeksInYear(date) {
        let year = moment(date).year();
        let mon = moment(date).month();
        const years = [];
        for (let month = 0; month < 12; month++) {
            const monthName = moment().month(month).format("MMMM");
            const startOfMonth = moment([year, month, 1]);
            const endOfMonth = moment(startOfMonth).endOf("month");
            const weeks = [];
            let date = moment(startOfMonth).startOf("week");
            while (date.isBefore(endOfMonth)) {
                let d = date.toDate();
                date.add(1, "week");
                weeks.push({
                    id: uuidv4(),
                    dates: { start: d, end: date.subtract(1, "day").toDate() },
                    payees: [],
                });
                date.add(1, "day");
            }
            weeks.pop();
            years.push({
                name: monthName,
                weeks,
            });
        }
        return years[mon].weeks;
    }
    public transformUserPayload(user) {
        return {
            id: `${user?._id}`,
            name: user?.username,
            email: user?.email,
            sitPayAmount: user?.sitPayAmount,
        };
    }
    public transformLeadPayload(lead) {
        return {
            id: `${lead?._id}`,
            name: lead?.firstName ? lead?.firstName + " " + lead?.lastName : lead?.customer_name,
            statusName: lead?.statusName,
        };
    }
}

export default new ExpensesHelperService();
