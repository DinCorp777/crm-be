import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import ProjectsService from "./resports.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {
    
    async getSetter(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.getSetter(req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Reports, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getCloser(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.getCloser(req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Reports, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
