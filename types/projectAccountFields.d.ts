import { Document } from "mongoose";

export interface IProjectAccountFields extends Document {
	fields?: IProjectAccountFieldsItems;
}
export interface IProjectAccountFieldsItems extends Document {
	delimiter?: Date;
	points?: number;
	cxFields?: Array<ICxDataFields>;
	cxDataFields?:  Array<ICxDataFields>;
}
export interface ICxDataFields {
	fieldName?: string;
	split?: boolean;
}

