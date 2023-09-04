import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import NotificationService from "./notifications.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {
    
    async get(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.get();
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async singleMessageObjById(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.singleMessageObjById(req.params.id);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getAllNotifications(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.getAllNotifications(req?.user);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getAllMessages(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.getAllMessages(req?.user);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getAllTasks(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.getAllTasks(req?.user);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async addLeadNote(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.addLeadNote(req.body, req.user);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.create(req.body, req.user);
            super.response(res, response, 200, "Record Created Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getByID(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.getById(req.params.id);
            super.response(res, response, 200, "Record fetched by id Successfully.");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in fetching Notification by id, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const response = await NotificationService.update(req.params.id, req.body);
            super.response(res, response, 200, "Record Updated Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in updating Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const user = await NotificationService.delete(req.params.id);
            super.response(res, user, 200, "Record Deleted Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in deleting Notification, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
