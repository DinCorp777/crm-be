import { Document } from "mongoose";

export interface IExpenses extends Document {
	to?: any;
	lead?: any;
	amount?: number;
	isPaid?: boolean
	description?: string;
	category?: string;
	createdAt?: Date;
}

export interface IExpensesCategory {
	name?: string;
	createdAt?: Date;
}