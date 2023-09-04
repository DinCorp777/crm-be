import { Types } from "mongoose";
export interface IloginResponse {
    accessToken: string;
    id: string;
    email: string;
    username: string;
    locationId: Types.ObjectId;
    roleId: Types.ObjectId;
    calId: string;
    profilePicture: string;
    role: string;
    permissions: any;
    createdAt: Date,
}