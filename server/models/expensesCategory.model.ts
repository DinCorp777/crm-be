import { Schema, model } from "mongoose";
import { IExpensesCategory } from '../../types/expenses';

export const ExpensesCategoryModelName = 'ExpensesCategory';

const { Types } = Schema;

const ExpensesCategorySchema = new Schema<IExpensesCategory>({
    name: { type: Types.String },
    createdAt: { type: Types.Date, default: Date.now() }
});

export const ExpensesCategory = model<IExpensesCategory>(ExpensesCategoryModelName, ExpensesCategorySchema);