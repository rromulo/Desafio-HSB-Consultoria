import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompanyById } from '../services/Company.service';
import type { ICompany } from '../types/company';
import QueueJobs from '../components/Queue/QueueJobs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Building2,
  FileText,
  Calendar,
  Hash,
  Clock,
  AlertCircle,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [company, setCompany] = useState<ICompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const data = await getCompanyById(id!);
      setCompany(data);
      setError(null);
    } catch (err: any) {
      setError('Empresa não encontrada ou erro de conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length === 14) {
      return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Carregando empresa..." />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para empresas
        </Link>
        
        <ErrorAlert
          message={error || 'Empresa não encontrada'}
          onRetry={loadCompany}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para empresas
          </Link>
          
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.razaoSocial}
              </h1>
              <p className="text-gray-600">
                Detalhes da empresa e fila de processamento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações da Empresa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Informações da Empresa
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Hash className="h-4 w-4 mr-2" />
                Identificação
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">ID da Empresa</p>
                  <p className="font-mono text-gray-800 bg-gray-50 p-2 rounded mt-1">
                    {company.id}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">CNPJ</p>
                  <p className="font-mono text-gray-800 bg-gray-50 p-2 rounded mt-1">
                    {formatCNPJ(company.cnpj)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Período de Operação
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Data de Início</p>
                  <p className="text-gray-800 p-2 bg-blue-50 rounded mt-1">
                    {formatDate(company.dataInicio)}
                  </p>
                </div>
                
                {company.dataFim && (
                  <div>
                    <p className="text-sm text-gray-500">Data de Fim</p>
                    <p className="text-gray-800 p-2 bg-blue-50 rounded mt-1">
                      {formatDate(company.dataFim)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Metadados
              </h3>
              <div className="space-y-3">
                {company.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">Cadastrado em</p>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded mt-1">
                      {formatDate(company.createdAt)}
                    </p>
                  </div>
                )}
                
                {company.updatedAt && company.updatedAt !== company.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">Última atualização</p>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded mt-1">
                      {formatDate(company.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fila de Processamento */}
        <div>
          <QueueJobs companyId={company.id!} />
          
          <div className="card mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
              Sobre a Fila de Processamento
            </h3>
            
            <div className="space-y-3 text-gray-600">
              <p>
                Cada empresa possui uma fila exclusiva no Redis para processamento
                assíncrono de tarefas.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium text-blue-800 mb-2">Nome da Fila:</p>
                <code className="font-mono text-sm bg-white px-3 py-2 rounded block">
                  company:{company.id}
                </code>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Tarefas são processadas na ordem de chegada</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Processamento em background não bloqueia a interface</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Status atualizado automaticamente a cada 3 segundos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;