import { Schema, model } from "mongoose";
import { IExpenses } from '../../types/expenses';

export const ExpensesModelName = 'Expenses';

const { Types } = Schema;

const ExpensesSchema = new Schema<IExpenses>({
    to: { type: Types.Mixed },
	lead: { type: Types.Mixed },
	amount: { type: Types.Number },
	isPaid: { type: Types.Boolean },
	description: { type: Types.String },
	category: { type: Types.String },
    createdAt: { type: Types.Date, default: Date.now() }
});

export const Expenses = model<IExpenses>(ExpensesModelName, ExpensesSchema);