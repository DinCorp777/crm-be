import { Schema, model } from "mongoose";
import { ILeadArrays, ILeads } from '../../types/leads';

export const LeadsModelName = 'Leads';

const { Types } = Schema;

const LeadsSchema = new Schema<ILeads>({
	name: { type: Types.String },
	company: { type: Types.String },
	email: { type: Types.String },
	phone: { type: Types.String },
	assintance: { type: []  },
	excelVersion: { type: [] },
	description: { type: Types.String },
	file: { type: Types.String },
	createdAt: { type: Types.Date, default: new Date() }
});

export const Leads = model<ILeads>(LeadsModelName, LeadsSchema);