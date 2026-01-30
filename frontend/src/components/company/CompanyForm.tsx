'use client';

import { useState } from 'react';
import { createCompany } from '../../services/Company.service';

interface CompanyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}


const initialFormState = {
  razaoSocial: '',
  cnpj: '',
  dataInicio: new Date().toISOString().split('T')[0],
  dataFim: '',
};

export default function CompanyForm({ onSuccess }: CompanyFormProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (formData.razaoSocial.length < 3) errors.razaoSocial = 'Razão Social muito curta';
    if (!formData.cnpj || formData.cnpj.length < 14) errors.cnpj = 'CNPJ inválido';
    if (!formData.dataInicio) errors.dataInicio = 'Data de início é obrigatória';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createCompany(formData);
      setFormData(initialFormState);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar empresa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Nova Empresa</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razão Social *
          </label>
          <input
            type="text"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.razaoSocial ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite a razão social"
          />
          {fieldErrors.razaoSocial && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.razaoSocial}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CNPJ *
          </label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.cnpj ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="00.000.000/0000-00"
          />
          {fieldErrors.cnpj && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.cnpj}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Início *
            </label>
            <input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.dataInicio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.dataInicio && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.dataInicio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Fim
            </label>
            <input
              type="date"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Empresa'}
        </button>
      </form>
    </div>
  );
}