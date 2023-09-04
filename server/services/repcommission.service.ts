import { RepCommission } from "../models";

export class RepCommissionHelperService {
    public async getRepCommissionTier(tId) {
        return await RepCommission.findById(tId);
    }
}

export default new RepCommissionHelperService();
