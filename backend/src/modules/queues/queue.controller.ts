// queue.controller.ts
import { Request, Response } from "express";
import { CompanyQueueService } from "./queue.service";

export class QueueController {
  listJobs = async (req: Request, res: Response) => {
    try {
      
      const { companyId } = req.params;

      if (!companyId) {
        return res.status(400).json({ error: "O parâmetro companyId é obrigatório." });
      }
      const queue = new CompanyQueueService(companyId as string);
      
      const jobs = await queue.getCompanyQueueJobs();

      return res.json(jobs);
    } catch (error) {
      console.error("Erro ao buscar jobs:", error);
      return res.status(500).json({ error: "Erro interno ao buscar jobs da fila." });
    }
  };

  addJob = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const { name, data } = req.body;
      const queue = new CompanyQueueService(companyId as string);

      const job = await queue.enqueue(name || "manual-task", data);

      return res.status(201).json({
        message: "Job adicionado com sucesso",
        jobId: job.id
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao adicionar job." });
    }
  };
}