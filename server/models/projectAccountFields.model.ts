import { Schema, model } from "mongoose";
import { IProjectAccountFields } from '../../types/projectAccountFields';

export const ProjectAccountFieldsModelName = 'ProjectAccountFields';

const { Types } = Schema;

const ProjectAccountFieldsSchema = new Schema<IProjectAccountFields>({
	fields: { type: Types.Mixed },
});

export const ProjectAccountFields = model<IProjectAccountFields>(ProjectAccountFieldsModelName, ProjectAccountFieldsSchema);