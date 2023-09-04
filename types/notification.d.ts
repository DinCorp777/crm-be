import { Document } from "mongoose";

export interface INotification extends Document {
	message?: string;
	type?: string;
	link?: string;
	recep?: string;
	leadId?: string;
	frequency?: string;
	sendTo?: string;
	sender?: any;
	dismissed?: boolean;
	startDate?: Date;
	endDate?: Date;
    createdAt?: Date;
}
