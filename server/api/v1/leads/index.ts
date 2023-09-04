import express from "express";
import * as auth from "../../../middlewares/authenticate";
import controller from "./leads.controller";
import { uploadMiddleware } from "../../../middlewares/file-upload";

const router = express.Router();

router.get('/details/rep/leads', controller.getRepLeads);
router.get('/form/calender/event', controller.formCalenderEvent);
router.get('/details/setter/leads', controller.getSetterLeads);
router.get('/details/pay/expenses/history/:id', controller.leadsPayHistory);
router.get('/details/lead/expenses/category/:id', controller.leadsPayExpenses);
router.get('/get/utility/phx/gosolo/companies/:locationId', controller.getUtilityCompanies);
router.get('/get/appointment/date', auth.isAuthenticated(), controller.getAppointmentDate);
router.post('/get', auth.isAuthenticated(), controller.get);
router.post('/reconsile', controller.reconsile);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/upload/image/file', uploadMiddleware().single('file'), controller.updoadImageFile);
router.post('/get/Leads/Event/by/date', auth.isAuthenticated(), controller.getLeadsEventsByDate);
router.post('/request/a/new/lead/proposal', controller.requestLeadProposalFromSolo);
router.get('/:id', controller.getByID);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
