export function getCompanyQueueName(companyId: string) {
  return `company-jobs_${companyId}`;
}