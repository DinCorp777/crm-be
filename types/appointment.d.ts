import { Document } from "mongoose";

export interface IAppointment extends Document {
	isSit?: boolean;
	name?: string;
	notesRequired?: boolean;
	paymentTrigger?: boolean;
	reschedule?: boolean;
	createdAt?: Date
}
