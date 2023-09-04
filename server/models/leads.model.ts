import { Schema, model } from "mongoose";
import { ILeads } from '../../types/leads';

export const LeadsModelName = 'Leads';

const { Types } = Schema;

const LeadsSchema = new Schema<ILeads>({
	salesRep: { type: Types.Mixed },
	algoliaUpdate: { type: Types.Boolean },
	realtime: { type: Types.Boolean },
	appointmentTime: { type: Types.Date },
	city: { type: Types.String },
	dateCreated: { type: Types.Date },
	firstName: { type: Types.String },
	lastName: { type: Types.String },
	fullName: { type: Types.String },
	company_name: { type: Types.String },
	locationId: { type: Types.String },
	notes: { type: Types.String },
	phone: { type: Types.String },
	address: { type: Types.String },
	proposal_path: { type: Types.String },
	path: { type: Types.String },
	rep: { type: Types.String },
	setter: { type: Types.Mixed },
	M2Amount: { type: Types.String },
	m1: { type: Types.Mixed },
	m2: { type: Types.Mixed },
	m1Paid: { type: Types.Boolean },
	m2Paid: { type: Types.Boolean },
	m2Amount: { type: Types.Mixed },
	cash_amount: { type: Types.Mixed },
	repBonusAmount: { type: Types.String },
    repBonusPaid: { type: Types.Boolean },
	repKWM1: { type: Types.Boolean },
    repKWM1Amount: { type: Types.String },
    repKWM1Paid: { type: Types.Boolean },
	repKWM2: { type: Types.Boolean },
    repKWM2Amount: { type: Types.String },
    repKWM2Paid: { type: Types.Boolean },
	setterKWM1: { type: Types.Boolean },
	setterKWM1Amount: { type: Types.String },
	setterKWM1Paid: { type: Types.Boolean },
	setterKWM2: { type: Types.Boolean },
    setterKWM2Amount: { type: Types.Boolean },
    setterKWM2Paid: { type: Types.Boolean },
	setter_id: { type: Types.String },
	companyOveride: { type: Types.Mixed },
	install_complete: { type: Types.String },
	leadName: { type: Types.String },
	managerOverRide: { type: Types.String },
	modified: { type: Types.Date },
	overRidePaid: { type: Types.Boolean },
    scheduled_install: { type: Types.Date },
    setCommPaid: { type: Types.Boolean },
	customerData: { type: Types.Mixed },
	sitDate: { type: Types.Mixed },
	stateCode: { type: Types.Mixed },
	loanInfo: { type: Types.Mixed },
	kwh_sold: { type: Types.Number },
	setterBonusAmount: { type: Types.String },
	setterBonusPaid: { type: Types.Boolean },
	utility_name: { type: Types.String },
	utility_id: { type: Types.Number },
	lon: { type: Types.Number },
	proposalType: { type: Types.String },
	proposalId: { type: Types.Number },
	proposalRequest: { type: Types.Mixed },
	setterName: { type: Types.String },
	sitPaid: { type: Types.Boolean },
	is_roofing: { type: Types.Boolean },
	state: { type: Types.String },
	status: { type: Types.Mixed },
	computedAdders: { type: Types.Mixed },
	firstNote: { type: Types.Mixed },
	utility_company: { type: Types.Mixed },
	value_questions: { type: Types.Mixed },
	docRequest: { type: Types.Mixed },
	date_sold: { type: Types.Mixed },
	generatedDate: { type: Types.Mixed },
	statusName: { type: Types.String },
	customerId: { type: Types.Number },
	customer_name: { type: Types.String },
	company_id: { type: Types.Number },
	street: { type: Types.String },
	utilPic: { type: Types.String },
	zip: { type: Types.String },
	annualBill: { type: Types.String },
	apptDay: { type: Types.Mixed },
	apptTime: { type: Types.Mixed },
	averageMonthlyBill: { type: Types.Mixed },
	email: { type: Types.String },
	forceSend: { type: Types.String },
	lat: { type: Types.String },
	lng: { type: Types.String },
	monthlyBill: { type: Types.Mixed },
	proposal_id: { type: Types.String },
	rep_name: { type: Types.String },
	adders_description: { type: Types.String },
	financing_term: { type: Types.String },
	install_partner: { type: Types.String },
	financing_rate: { type: Types.String },
	rep_email: { type: Types.String },
	adders: { type: Types.Mixed },
	funding_source: { type: Types.String },
	install_partner_id: { type: Types.String },
	return_sales_date: { type: Types.String },
	customer_city: { type: Types.String },
	customer_address: { type: Types.String },
	customer_address_2: { type: Types.String },
	customer_signoff: { type: Types.String },
	product: { type: Types.String },
	customer_state: { type: Types.String },
	created: { type: Types.String },
	customer_phone: { type: Types.String },
	kw: { type: Types.Number },
	customer_zip: { type: Types.String },
	gross_account_value: { type: Types.String },
	dealer_fee_percentage: { type: Types.String },
	customer_email: { type: Types.String },
	employee_id: { type: Types.Number },
	prospect_id: { type: Types.String },
	homeowner_id: { type: Types.String },
	proposalPath: { type: Types.String },
	proposal: { type: Types.String },
	date_cancelled: { type: Types.String },
	sitCalculated: { type: Types.Boolean },
	createdAt: { type: Types.Date, default: new Date() }
});

export const Leads = model<ILeads>(LeadsModelName, LeadsSchema);