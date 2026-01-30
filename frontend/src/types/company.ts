export interface ICompany {
  id?: string;
  razaoSocial: string;
  cnpj: string;
  dataInicio: string;
  dataFim?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IueueJob {
  id: string;
  name: string;
  data: any;
  state: string;
  progress: number;
  timestamp: number;
}

export interface IAddJobRequest {
  task: string;
  data?: any;
}