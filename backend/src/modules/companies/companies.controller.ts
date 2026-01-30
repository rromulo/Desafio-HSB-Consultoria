// companies.controller.ts
import { Request, Response } from "express";
import { CompaniesService } from "./companies.service";
import { CompanyQueueService } from '../queues/queue.service';

export class CompaniesController {
  private companyQueue: CompanyQueueService;

  constructor(private readonly companiesService: CompaniesService) {
    this.companyQueue = new CompanyQueueService();
  }

  createCompany = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const company = await this.companiesService.createCompany(data);
      return res.status(201).json(company);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar empresa" });
    }
  }

  listCompanies = async (req: Request, res: Response) => {
    try {
      const companies = await this.companiesService.listCompanies();
      return res.json(companies);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar empresas" });
    }
  }

  enqueueJob = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const data = req.body;

      await this.companyQueue.enqueue("task", {
        companyId,
        data
      });

      return res.json({ message: "Job enviado para fila" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao enviar para fila" });
    }
  }
}