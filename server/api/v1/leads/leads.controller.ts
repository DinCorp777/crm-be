import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import LeadsService from "./leads.service";
import HelperService from "./../../../services/helper.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {

    async reconsile(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.reconsile(req?.body);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async get(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.get(req?.body, req?.user);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async formCalenderEvent(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.formCalenderEvent();
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getUtilityCompanies(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.getUtilityCompanies(req.params.locationId);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getRepLeads(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.getRepLeads();
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getSetterLeads(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.getSetterLeads();
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async leadsPayHistory(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.leadsPayHistory(req.params.id);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async leadsPayExpenses(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.leadsPayExpenses(req.params.id);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getAppointmentDate(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.getAppointmentDate(req.user, req.query.date);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async create(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.create(req.user, req.body);
            super.response(res, leads, 200, "Leads created Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async updoadImageFile(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.updoadImageFile(HelperService.handleFileDetails(req.file));
            super.response(res, leads, 200, "Leads created Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getLeadsEventsByDate(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.getLeadsEventsByDate(req.user, req.body);
            super.response(res, leads, 200, "Leads Events Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async requestLeadProposalFromSolo(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.requestLeadProposalFromSolo(req.body);
            super.response(res, leads, 200, "Leads Events Fetched Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getByID(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.getById(req.params.id);
            super.response(res, leads, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.update(req.params.id, req.body);
            super.response(res, leads, 200, "Leads Update Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const leads = await LeadsService.delete(req.params.id);
            super.response(res, leads, 200, "Leads delete Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating leads, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
