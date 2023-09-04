import { Schema, model } from "mongoose";
import { IRepCommission } from '../../types/repCommission';

export const RepCommissionModelName = 'RepCommission';

const { Types } = Schema;

const RepCommissionSchema = new Schema<IRepCommission>({
    b: { type: Types.String },
	lowAmount: { type: Types.String },
	lowLimit: { type: Types.String },
	m: { type: Types.String },
	name: { type: Types.String },
	zero: { type: Types.String },
    createdAt: { type: Types.Date, default: Date.now() }
});

export const RepCommission = model<IRepCommission>(RepCommissionModelName, RepCommissionSchema);

