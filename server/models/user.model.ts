import { Schema, model } from "mongoose";
import { IUser } from '../../types/user';

export const UserModelName = 'User';

const { Types } = Schema;

const UserSchema = new Schema<IUser>({
	firstName: { type: Types.String },
	lastName: { type: Types.String },
	username: { type: Types.String },
	name: { type: Types.String },
	email: { type: Types.String },
	password: { type: Types.String },
	roleId: { type: Types.ObjectId },
	profilePicture: { type: Types.String },
	resetPasswordToken: { type: Types.String },
	totalRepLeads: { type: Types.String },
	totalRepProjectKw: { type: Types.String },
	active: { type: Types.Boolean },
	algoliaUpdate: { type: Types.Boolean },
	allotCount: { type: Types.Number },
	available: { type: Types.Boolean },
	calId: { type: Types.String },
	count: { type: Types.Number },
	hasCalId: { type: Types.Boolean },
	kwPay: { type: Types.String },
	companyKW: { type: Types.String },
	method: { type: Types.String },
	soldAccount: { type: Types.Number },
	locationId: { type: Types.ObjectId },
	override: { type: Types.Number },
	redline: { type: Types.String },
	totalSetterLeads: { type: Types.String },
	totalSetterProjectKw: { type: Types.Number },
	referrals: { type: Types.Mixed },
	repCloserCommissionTier: { type: Types.String },
	repWithSetterCommissionTier: { type: Types.String },
	permissions: { type: Types.Mixed },
	sitPay: { type: Types.Number },
	locationName: { type: Types.Mixed },
	sitPayAmount: { type: Types.Number },
	perSitAmount: { type: Types.Number },
	totalAmount: { type: Types.Number },
	path: { type: Types.String },
	eventsToday: { type: Types.Mixed },
	basePPWAvg: { type: Types.Mixed },
	companyCommission: { type: Types.Mixed },
	priority: { type: Types.Number },
	createdAt: {
		type: Types.Date,
		default: new Date()
	}
});
UserSchema.index({
	roleId: 1
})
UserSchema.index({
	type: 1
})
UserSchema.index({
	type: 1,
	roleId: 1
})
UserSchema.index({
	email: 1
})
export const User = model<IUser>(UserModelName, UserSchema);