import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import WebhookService from "./webhook.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {
    
    async accountCreation(req: Request, res: Response): Promise<void> {
        try {
            const response = await WebhookService.accountCreation(req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Webhook, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
