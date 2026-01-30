// queue.controller.ts
import { Request, Response } from "express";
import { CompanyQueueService } from "./queue.service";

export class QueueController {
  private companyQueue: CompanyQueueService;

  constructor() {
    this.companyQueue = new CompanyQueueService();
  }

  listJobs = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;

      if (!companyId) {
        return res.status(400).json({ error: "O parâmetro companyId é obrigatório." });
      }

      const jobs = await this.companyQueue.getCompanyQueueJobs();
      
      const filteredJobs = jobs.filter(job => job.data?.companyId === companyId);

      return res.json(filteredJobs);
    } catch (error) {
      console.error("Erro ao buscar jobs:", error);
      return res.status(500).json({ error: "Erro interno ao buscar jobs da fila." });
    }
  };

  /**
   * Adiciona um novo job manualmente via rota de queue (se necessário)
   */
  addJob = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const { name, data } = req.body;

      const job = await this.companyQueue.enqueue(name || "manual-task", {
        companyId,
        ...data
      });

      return res.status(201).json({
        message: "Job adicionado com sucesso",
        jobId: job.id
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao adicionar job." });
    }
  };
}