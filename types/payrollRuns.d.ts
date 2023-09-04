import { Document } from "mongoose";

export interface IPayrollRuns extends Document {
    start: Date;
    end: Date;
    isRuning: boolean;
}