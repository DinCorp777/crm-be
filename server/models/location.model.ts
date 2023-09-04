import { Schema, model } from "mongoose";
import { ILocation } from '../../types/location';

export const LocationModelName = 'Location';

const { Types } = Schema;

const LocationSchema = new Schema<ILocation>({
    calId: { type: Types.String },
	name: { type: Types.String },
	state: { type: Types.String },
    createdAt: { type: Types.Date, default: Date.now() }
});

export const Location = model<ILocation>(LocationModelName, LocationSchema);