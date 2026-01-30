import React, { useState, useEffect } from 'react';
import { getCompanyQueueJobs, addJobToQueue } from '../../services/Company.service';
import type { IueueJob } from '../../types/company';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PlayCircle,
  CheckCircle,
  XCircle,
  Clock,
  PlusCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface QueueJobsProps {
  companyId: string;
}

const QueueJobs: React.FC<QueueJobsProps> = ({ companyId }) => {
  const [jobs, setJobs] = useState<IueueJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingJob, setAddingJob] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
    // const interval = setInterval(loadJobs, 3000);
    // return () => clearInterval(interval);
  }, [companyId]);

  const loadJobs = async () => {
    try {
      const data = await getCompanyQueueJobs(companyId);
      setJobs(data);
      setError(null);
    } catch (err: any) {
      if (!error) {
        setError('Erro ao carregar jobs. Verifique a conexão.');
      }
      console.error('Erro ao carregar jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async () => {
    const task = prompt('Digite o nome da nova tarefa:');
    if (!task) return;

    setAddingJob(true);
    try {
      await addJobToQueue(companyId, task, {
        message: `Tarefa manual: ${task}`,
        addedAt: new Date().toISOString(),
        source: 'frontend'
      });
      await loadJobs();
    } catch (err) {
      alert('Erro ao adicionar tarefa. Verifique se o servidor está rodando.');
    } finally {
      setAddingJob(false);
    }
  };

  const getStateConfig = (state: string) => {
    switch (state) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          label: 'Concluído'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600 bg-red-100',
          label: 'Falhou'
        };
      case 'active':
        return {
          icon: PlayCircle,
          color: 'text-blue-600 bg-blue-100',
          label: 'Em processamento'
        };
      case 'waiting':
        return {
          icon: Clock,
          color: 'text-yellow-600 bg-yellow-100',
          label: 'Na fila'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 bg-gray-100',
          label: state
        };
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
  };

  const handleManualRefresh = () => {
    setLoading(true);
    loadJobs();
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando fila de processamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <PlayCircle className="h-5 w-5 mr-2 text-blue-600" />
            Fila de Processamento
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Total de jobs: {jobs.length}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="btn-secondary flex items-center text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          
          <button
            onClick={handleAddJob}
            disabled={addingJob}
            className="btn-primary flex items-center text-sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {addingJob ? 'Adicionando...' : 'Novo Job'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Fila vazia
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Não há jobs na fila de processamento. 
            Adicione um job para começar o processamento assíncrono.
          </p>
          <button
            onClick={handleAddJob}
            disabled={addingJob}
            className="btn-primary inline-flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Primeiro Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const StateIcon = getStateConfig(job.state).icon;
            
            return (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium text-gray-900 mr-3">
                        {job.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateConfig(job.state).color}`}>
                        <StateIcon className="h-3 w-3 inline mr-1" />
                        {getStateConfig(job.state).label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-mono">
                      ID: {job.id}
                    </p>
                  </div>
                  
                  {job.progress > 0 && job.progress < 100 && (
                    <div className="ml-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block text-center">
                        {job.progress}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p className="flex items-center">
                    <Clock className="h-3 w-3 mr-2" />
                    Enviado em: {formatTimestamp(job.timestamp)}
                  </p>
                </div>

                {job.data && (
                  <div className="mt-3">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">
                        Detalhes do Job
                      </summary>
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(job.data, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-3">Legenda dos Status:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-yellow-100 border border-yellow-300 mr-2"></span>
            <span className="text-sm text-gray-600">Na fila</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></span>
            <span className="text-sm text-gray-600">Processando</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-100 border border-green-300 mr-2"></span>
            <span className="text-sm text-gray-600">Concluído</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-100 border border-red-300 mr-2"></span>
            <span className="text-sm text-gray-600">Falhou</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueJobs;