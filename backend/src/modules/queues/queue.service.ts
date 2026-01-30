import { Queue } from "bullmq";
import { redis } from "../../config/redis";
import { getCompanyQueueName } from './queue.utils';

export function getCompanyQueue() {
  return new Queue(getCompanyQueueName(), {
    connection: redis,
  });
}

