import { Document } from mongoose;

export type ILeadArrays = string;

export interface ILeads extends Document {
	name: string;
	company: string;
	email: string;
	phone: string;
	assintance?: Array<ILeadArrays>;
	excelVersion?: Array<ILeadArrays>;
	description?: string;
	file?: string;
	subject?: string;
	budget?: string;
	createdAt?: Date;
}
