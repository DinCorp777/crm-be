import { Document } from "mongoose";

export interface IBackups extends Document {
	expires_at?: Date;
	
}
