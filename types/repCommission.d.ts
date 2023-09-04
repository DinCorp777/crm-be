import { Document } from "mongoose";

export interface IRepCommission extends Document {
	b?: string;
	lowAmount?: string;
	lowLimit?: string;
	m?: string;
	name?: string;
	zero?: string;
    createdAt?: Date;
}
