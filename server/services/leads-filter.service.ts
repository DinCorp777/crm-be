import moment from "moment";

class LeadsFilterService {

    public filterAppiontmentTime(data, filter) {
        if (filter === 'All') return data;
        const array = data?.filter((item) => {
            let start, end;
            if (filter === 'Today') {
                start = (moment() as any)._d.toLocaleDateString();
                end = (moment() as any)._d.toLocaleDateString();
            }
            if (filter === 'Week') {
                start = (moment() as any).startOf("week")._d.toLocaleDateString();
                end = (moment() as any)._d.toLocaleDateString();
            }
            const checkDate = new Date(item?.appointmentTime).toLocaleDateString();
            var d1 = start.split("/");
            var d2 = end.split("/");
            var c: any = checkDate.split("/");
            var from = new Date(d1);
            var to = new Date(d2);
            var check = new Date(c);
            if (check >= from && check <= to) {
                return item;
            } else {
                return;
            }
        });
        return array
    }
    public filterCreatedDate(data, filter) {
        if (filter === 'All') return data;
        const array = data?.filter((item) => {
            let start, end;
            if (filter === 'Day') {
                start = (moment() as any)._d.toLocaleDateString();
                end = (moment() as any)._d.toLocaleDateString();
            }
            if (filter === 'Week') {
                start = (moment() as any).startOf("week")._d.toLocaleDateString();
                end = (moment() as any)._d.toLocaleDateString();
            }
            if (filter === 'Month') {
                start = (moment() as any).startOf("month")._d.toLocaleDateString();
                end = (moment() as any)._d.toLocaleDateString();
            }
            if (filter === 'Quarter') {
                start = (moment() as any).subtract(3, "months").startOf("month")._d.toLocaleDateString();
                end = (moment() as any)._d.toLocaleDateString();
            }
            const checkDate = new Date(item.dateCreated).toLocaleDateString();
            var d1 = start.split("/");
            var d2 = end.split("/");
            var c: any = checkDate.split("/");
            var from = new Date(d1);
            var to = new Date(d2);
            var check = new Date(c);
            if (check >= from && check <= to) {
                return item;
            } else {
                return;
            }
        });
        return array
    }
    public filterLeadsWithDateFilter(data, date, filter) {
        let dateDate = data.filter((item) => moment(item.createdAt).isSameOrAfter(moment(date)));
        return this.filterLeadsWithoutDateFilter(dateDate, filter)
    }
    public filterLeadsWithoutDateFilter(data, filter) {
        if (filter === 'AC') {
            return data;
        }
        else if (filter === 'CON') {
            return data.filter((el) => el?.created && el?.created !== "" && el?.created !== null)
        }
        else if (filter === 'SS') {
            return data.filter((el) => el?.m1 && el?.m1 !== "" && el?.m1 !== null);
        }
        else if (filter === 'Install') {
            return data.filter((el) => el?.m2 && el?.m2 !== "" && el?.m2 !== null);
        }
        else if (filter === 'PTO') {
            return data.filter((el) => el?.ptoDate && el?.ptoDate !== "" && el?.ptoDate !== null)
        }
        else {
            return data.filter((el) => el?.date_cancelled && el?.date_cancelled !== "" && el?.date_cancelled !== null)
        }
    }
    public filterCreatedDateAfterRecords(data, date) {
        return data.filter((item) => moment(item.createdAt).isSameOrAfter(moment(date)));
    }
}

export default new LeadsFilterService();