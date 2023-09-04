import { Schema, model } from "mongoose";
import { INotification } from '../../types/notification';

export const NotificationModelName = 'Notification';

const { Types } = Schema;

const NotificationSchema = new Schema<INotification>({
    message: { type: Types.String },
	type: { type: Types.String },
	link: { type: Types.String },
	recep: { type: Types.String },
	leadId: { type: Types.String },
	frequency: { type: Types.String },
	sendTo: { type: Types.String },
	sender: { type: Types.Mixed },
	dismissed: { type: Types.Boolean },
	startDate: { type: Types.Date },
	endDate: { type: Types.Date },
    createdAt: { type: Types.Date, default: Date.now() }
});

export const Notification = model<INotification>(NotificationModelName, NotificationSchema);