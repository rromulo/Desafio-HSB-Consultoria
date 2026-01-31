// companies.controller.ts
import { Request, Response } from "express";
import { CompaniesService } from "./companies.service";
import { CompanyQueueService } from '../queues/queue.service';

export class CompaniesController {

  constructor(private readonly companiesService: CompaniesService) {}

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

  listCompanyById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { companyId } = req.params
      
      const company = await this.companiesService.listCompanyById(companyId as string);
      if(!company) {
        res.status(404).json({error: 'Empresa não encontrada'})
      }

      res.json(company)
    } catch (error) {
      res.status(500).json({error: 'Erro interno do servidor'})
    }
  }

  enqueueJob = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const data = req.body;

      const queue = new CompanyQueueService(companyId as string);

      await queue.enqueue("task", {
        companyId,
        data
      });

      return res.json({ message: "Job enviado para fila" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao enviar para fila" });
    }
  }
}