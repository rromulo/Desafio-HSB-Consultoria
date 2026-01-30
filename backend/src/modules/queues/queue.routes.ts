// queue.routes.ts
import { Router } from "express";
import { QueueController } from "./queue.controller";

const router = Router();
const queueController = new QueueController();

router.get("/companies/:companyId/jobs", queueController.listJobs);
router.post("/companies/:companyId", queueController.addJob);

export default router;