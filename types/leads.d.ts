

import { Document } from mongoose;

export interface ILeads extends Document {
	salesRep?: any;
	algoliaUpdate?: boolean;
	realtime?: boolean;
	appointmentTime?: Date;
	city?: string;
	dateCreated?: Date;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	company_name?: string;
	locationId?: string;
	notes?: string;
	phone?: string;
	address?: string;
	proposal_path?: string;
	path?: string;
	rep?: string;
	setter?: any;
	M2Amount?: string;
	m1?: any;
	m2?: any;
	m1Paid?: boolean;
	m2Paid?: boolean;
	m2Amount?: any;
	cash_amount?: any
	repBonusAmount?: string;
    repBonusPaid?: boolean;
	repKWM1?: boolean;
    repKWM1Amount?: string;
    repKWM1Paid?: boolean;
	repKWM2?: boolean;
    repKWM2Amount?: string;
    repKWM2Paid?: boolean;
	setterKWM1?: boolean;
	setterKWM1Amount?: string;
	setterKWM1Paid?: boolean;
	setterKWM2?: boolean;
    setterKWM2Amount?: boolean;
    setterKWM2Paid?: boolean;
	setter_id?: string;
	companyOveride?: any;
	install_complete?: string;
	leadName?: string;
	managerOverRide?: string;
	modified?: Date;
	overRidePaid?: boolean;
    scheduled_install?: Date;
    setCommPaid?: boolean;
	customerData?: any;
	sitDate?: any;
	stateCode?: any;
	loanInfo?: any;
	kwh_sold?: number;
	setterBonusAmount?: string;
	setterBonusPaid?: boolean;
	utility_name?: string;
	utility_id?: number;
	lon?: number;
	proposalType?: string;
	proposalId?: number;
	proposalRequest?: any;
	setterName?: string;
	sitPaid?: boolean;
	is_roofing?: boolean;
	state?: string;
	status?: any;
	computedAdders?: any;
	firstNote?: any;
	utility_company?: any;
	value_questions?: any;
	docRequest?: any;
	date_sold?: any;
	generatedDate?: any;
	statusName?: string;
	customerId?: number;
	customer_name?: string;
	company_id?: number;
	street?: string;
	utilPic?: string;
	zip?: string;
	annualBill?: string;
	apptDay?: any;
	apptTime?: any;
	averageMonthlyBill?: any;
	email?: string;
	forceSend?: string;
	lat?: string;
	lng?: string;
	monthlyBill?: any;
	proposal_id?: string;
	rep_name?: string;
	adders_description?: string;
	financing_term?: string;
	install_partner?: string;
	financing_rate?: string;
	rep_email?: string;
	adders?: any;
	funding_source?: string;
	install_partner_id?: string;
	return_sales_date?: string;
	customer_city?: string;
	customer_address?: string;
	customer_address_2?: string;
	customer_signoff?: string;
	product?: string;
	customer_state?: string;
	created?: string;
	customer_phone?: string;
	kw?: number;
	customer_zip?: string;
	gross_account_value?: string;
	dealer_fee_percentage?: string;
	customer_email?: string;
	employee_id?: number;
	prospect_id?: string;
	homeowner_id?: string;
	proposalPath?: string;
	proposal?: string;
	date_cancelled?: string;
	sitCalculated?: boolean;
	createdAt?: Date;
}
