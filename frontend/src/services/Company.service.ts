import { api } from '../config/api';
import type { ICompany } from '../types/company';

export async function  createCompany(companyData: Omit<ICompany, 'id'>) {
  const response = await api.post('/companies', companyData);
  return response.data;
}

export async function getAllCompanies() {
  const response = await api.get('/companies');
  return response.data;
}

export async function  getCompanyById(id: string) {
  const response = await api.get(`/companies/${id}`);
  return response.data;
}

export async function  addJobToQueue(companyId: string, task: string, data: any = {}) {
  const response = await api.post(`/companies/${companyId}/jobs`, {
    task,
    data
  });
  return response.data;
}

export async function  getCompanyQueueJobs(companyId: string) {
  const response = await api.get(`/companies/${companyId}/jobs`);
  return response.data;
}