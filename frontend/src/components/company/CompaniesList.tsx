import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  getAllCompanies, addJobToQueue } from '../../services/Company.service';
import type { ICompany } from '../../types/company';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// import { ptBR } from 'date-fns/locale';
import { 
  Building2, 
  Calendar, 
  FileText, 
  Clock,
  PlusCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Modal from '../Modal';
import CompanyForm from './CompanyForm';

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await getAllCompanies();
      setCompanies(data);
      setError(null);
    } catch (err: any) {
      setError('Erro ao carregar empresas. Verifique a conexão com o servidor.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCompanies();
  };

  const handleSuccess = () => {
    loadCompanies();
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddJob = async (companyId: string) => {
    const task = prompt('Digite o nome da tarefa:');
    if (!task) return;

    try {
      await addJobToQueue(companyId, task, {
        message: `Tarefa ${task} enviada via frontend`,
        timestamp: new Date().toISOString()
      });
      alert('Tarefa adicionada à fila com sucesso!');
    } catch (err) {
      alert('Erro ao adicionar tarefa. Verifique se o servidor está rodando.');
    }
  };

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return '-';
    const date = new Date(dateValue)
    console.log(dateValue, 'DATE', date);
      
    return date.toLocaleDateString("pt-BR")
  };

  // const formatCNPJ = (cnpj: string) => {
  //   const numbers = cnpj.replace(/\D/g, '');
  //   if (numbers.length === 14) {
  //     return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  //   }
  //   return cnpj;
  // };

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Carregando empresas...</p>
      </div>
    );
  }

  if (error && companies.length === 0) {
    return (
      <div className="card text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro ao carregar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="btn-primary inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Building2 className="h-6 w-6 mr-2 text-blue-600" />
            Empresas Cadastradas
          </h2>
          <p className="text-gray-600 mt-1">
            Total: {companies.length} empresa{companies.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center text-yellow-800">
            {/* <AlertCircle className="h-5 w-5 mr-2" /> */}
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {company.razaoSocial}
                </h3>
                <p className="text-sm text-gray-500 font-mono mt-1">
                  {company.cnpj}
                </p>
              </div>
              <Link
                to={`/companies/${company.id}`}
                className="ml-2 text-blue-600 hover:text-blue-800"
                title="Ver detalhes"
              >
                <FileText className="h-5 w-5" />
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Início: {formatDate(company.dataInicio)}
                </span>
              </div>
              
              {company.dataFim && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Fim: {formatDate(company.dataFim)}
                  </span>
                </div>
              )}
              
              {company.createdAt && (
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-xs">
                    Cadastrada em {formatDate(company.createdAt)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-4 gap-2">
              <Link
                to={`/companies/${company.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" />
                Detalhes
              </Link>
              
              <button
                onClick={() => handleAddJob(company.id!)}
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Adicionar Tarefa
              </button>
            </div>
          </div>
        ))}
      </div>
      {companies.length === 0 && !loading && (
        <div className="card text-center py-12">
          {/* <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" /> */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Nenhuma empresa cadastrada
          </h3>
          <p className="text-gray-600 mb-6">
            Cadastre sua primeira empresa para começar a usar o sistema.
          </p>
          <button
            onClick={openModal}
            className="btn-primary flex items-center m-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Cadastrar Primeira Empresa
          </button>
        </div>
      )}
       <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Cadastrar Primeira Empresa"
        size="lg"
      >
        <CompanyForm onSuccess={handleSuccess} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default CompanyList;