import { Document } from "mongoose";

export interface IPayment extends Document {
	CAPPayment?: string;
	clawbackBONUS?: string;
    datePaid?: Date;
	installCommission?: string;
	prevPaid?: string;
	projectId?: string;
	totalProjectCommission?: string;
	totalinPeriod?: string;
    end?: Date;
    start?: Date;
    date?: Date;
    fileId?: string;
    userId?: string;
	
	
}