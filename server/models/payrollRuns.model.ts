import { Schema, model } from "mongoose";
import { IPayrollRuns } from '../../types/payrollRuns';

export const PayrollRunsModelName = 'PayrollRuns';

const { Types } = Schema;

const PayrollRunsSchema = new Schema<IPayrollRuns>({
    start: { type: Types.Date },
    end: { type: Types.Date },
    isRuning: { type: Types.Boolean }
});

export const PayrollRuns = model<IPayrollRuns>(PayrollRunsModelName, PayrollRunsSchema);