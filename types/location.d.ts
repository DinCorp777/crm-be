import { Document } from "mongoose";

export interface ILocation extends Document {
	calId?: string;
	name?: string;
	state?: string;
    createdAt?: Date;
}

