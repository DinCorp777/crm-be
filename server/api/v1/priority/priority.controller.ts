import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import PriorityService from "./priority.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {
    
    async getAllClosers(req: Request, res: Response): Promise<void> {
        try {
            const response = await PriorityService.getAllClosers(req.params.id);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Priority, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async updateCloserCount(req: Request, res: Response): Promise<void> {
        try {
            const response = await PriorityService.updateCloserCount(req.params.id, req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Priority, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async updatePriorityList(req: Request, res: Response): Promise<void> {
        try {
            const response = await PriorityService.updatePriorityList(req.body.data);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Priority, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async updatePriorityUserLocation(req: Request, res: Response): Promise<void> {
        try {
            const response = await PriorityService.updatePriorityUserLocation(req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Priority, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async removeUserFromTheRotationList(req: Request, res: Response): Promise<void> {
        try {
            const response = await PriorityService.removeUserFromTheRotationList(req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Priority, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async resetCount(req: Request, res: Response): Promise<void> {
        try {
            const response = await PriorityService.resetCount();
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Priority, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
