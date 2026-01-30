import { Request, Response } from "express";
import { createCompanyService, listCompaniesService } from "./companies.service";
import { getCompanyQueue } from '../queues/queue.service';

export async function createCompany(req: Request, res: Response) {
  const data = req.body;

  const company = await createCompanyService(data);

  return res.status(201).json(company);
}

export async function listCompanies(req: Request, res: Response) {
  const companies = await listCompaniesService();

  return res.json(companies);
}

export async function enqueueJob(req: Request, res: Response) {
  const { companyId } = req.params;
  const data = req.body;

  const queue = getCompanyQueue();

  await queue.add("task", {
    companyId,
    data
  });

  return res.json({
    message: "Job enviado para fila",
  });
}
