import { Router } from "express";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from './companies.service';
// import { enqueueJob } from './companies.controller';

const router = Router();
const companiesService = new CompaniesService
const companiesController = new CompaniesController(companiesService);

router.post("/companies", companiesController.createCompany);
router.get("/companies", companiesController.listCompanies);
router.post("/companies/:companyId/jobs", companiesController.enqueueJob);

export default router;
