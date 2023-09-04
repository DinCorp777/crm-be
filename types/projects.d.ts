
import { Document } from "mongoose";

export interface IProjects extends Document {
    M2Amount?: string;
	adders?: string;
	adders_description?: string;
	cash_amount?: string;
	companyOveride?: boolean;
	created?:Date;
	customer_address?: string;
	customer_address_2?: string;
	customer_city?: string;
	customer_email?: string;
	customer_name?: string;
	customer_phone?: string;
	customer_signoff?: string;
	customer_state?: string;
	customer_zip?: string;
	date_cancelled?: Date;
	dealer_fee_percentage?: string;
	employee_id?: string;
	financing_rate?: string;
	financing_term?: string;
	funding_source?: string;
	gross_account_value?: string;
	homeowner_id?: string;
	install_complete?: string;
	install_partner?: string;
	install_partner_id?: string;
	kw?: string;
	leadId?: string;
	leadName?: string;
	loan_amount?: string;
	m1?: Date;
	m2?: Date;
	m1Paid?: boolean;
	m2Amount?: string;
	m2Paid?: boolean;
	managerOverRide?: string;
	modified?: Date;
	overRidePaid?: boolean;
	product?: string;
	proposal_id?: string;
	prospect_id?: string;
	repBonusAmount?: string;
    repBonusPaid?: boolean;
    repKWM1?: boolean;
    repKWM1Paid?: boolean;
    repKWM2?: boolean;
    repKWM2Amount?: string;
    repKWM2Paid?: boolean;
    rep_email?: string;
    rep_name?: string;
    return_sales_date?: Date;
    scheduled_install?: Date;
    setCommPaid?: boolean;
    setterBonusAmount?: string;
    setterBonusPaid?: boolean;
    setterKWM1?: boolean;
    setterKWM2?: boolean;
    setter_id?: string;
	createdAt?: Date;
}
 
export interface IProjectAccounts extends Document {
	end?: Date;
	start?: Date;
}