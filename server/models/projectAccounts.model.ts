import { Schema, model } from "mongoose";
import { IProjectAccounts } from '../../types/projects';

export const ProjectAccountsModelName = 'ProjectAccounts';

const { Types } = Schema;

const ProjectAccountsSchema = new Schema<IProjectAccounts>({
	end: { type: Types.Date },
	start: { type: Types.Date }
});

export const ProjectAccounts = model<IProjectAccounts>(ProjectAccountsModelName, ProjectAccountsSchema);