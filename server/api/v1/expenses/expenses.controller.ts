import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import ExpensesService from "./expenses.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {

    async get(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.get();
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getPayroll(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.getPayroll(req.body);
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getPayrollCalculate(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.getPayrollCalculate();
            super.response(res, response, 200, "All Record Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.create(req.body);
            super.response(res, response, 200, "Record Created Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async payToPayroll(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.payToPayroll(req.body);
            super.response(res, response, 200, "Paied Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getByID(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.getById(req.params.id);
            super.response(res, response, 200, "Record fetched by id Successfully.");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in fetching Expenses by id, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const response = await ExpensesService.update(req.params.id, req.body);
            super.response(res, response, 200, "Record Updated Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in updating Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const user = await ExpensesService.delete(req.params.id);
            super.response(res, user, 200, "Record Deleted Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in deleting Expenses, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
