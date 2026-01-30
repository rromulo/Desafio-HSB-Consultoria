import { Queue } from "bullmq";
import { redis } from "../../config/redis";
import { getCompanyQueueName } from './queue.utils';

export class CompanyQueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue(getCompanyQueueName(), {
      connection: redis,
    });
  }

  async enqueue(name: string, data: any) {
    return await this.queue.add(name, data);
  }

  async getCompanyQueueJobs(): Promise<any[]> {
    const jobs = await this.queue.getJobs(['waiting', 'active', 'completed', 'failed']);
    return Promise.all(jobs.map(async job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      state: await job.getState(),
      progress: job.progress,
      timestamp: job.timestamp
    })));
  }
}