import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import ProjectsService from "./projects.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {
    
    async get(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.get();
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Projects, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getProjectAccounts(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.getProjectAccounts();            
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Projects, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.create(req.body);
            super.response(res, response, 200, "Record Created Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating Projects, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getByID(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.getById(req.params.id);
            super.response(res, response, 200, "Record fetched by id Successfully.");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in fetching Projects by id, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.update(req.params.id, req.body);
            super.response(res, response, 200, "Record Updated Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in updating Projects, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async leadProjects(req: Request, res: Response): Promise<void> {
        try {
            const response = await ProjectsService.leadProjects(req.params.id, req.body);
            super.response(res, response, 200, "Record Updated Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in updating Projects, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const user = await ProjectsService.delete(req.params.id);
            super.response(res, user, 200, "Record Deleted Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in deleting Projects, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
