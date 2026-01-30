import { Router } from "express";
import { createCompany, listCompanies } from "./companies.controller";
import { enqueueJob } from './companies.controller';

const router = Router();

router.post("/companies", createCompany);
router.get("/companies", listCompanies);
router.post("/companies/:companyId/jobs", enqueueJob);

export default router;
