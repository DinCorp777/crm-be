import { Schema, model } from "mongoose";
import { IAppointment } from '../../types/appointment';

export const AppointmentModelName = 'Appointment';

const { Types } = Schema;

const AppointmentSchema = new Schema<IAppointment>({
    isSit: { type: Types.Boolean },
    name: { type: Types.String },
    notesRequired: { type: Types.Boolean },
    paymentTrigger: { type: Types.Boolean },
    reschedule: { type: Types.Boolean },
    createdAt: { type: Types.Date, default: Date.now() }
});

export const Appointment = model<IAppointment>(AppointmentModelName, AppointmentSchema);