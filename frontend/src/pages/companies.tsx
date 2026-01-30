import React, { useState } from 'react';
import CompanyList from '../components/company/CompaniesList';
import CompanyForm from '../components/company/CompanyForm';
import Modal from '../components/Modal';
import { PlusCircle } from 'lucide-react';

const CompaniesPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600 mt-2">
            Gerencie empresas e suas filas de processamento assíncrono
          </p>
        </div>
        
        <button
          onClick={openModal}
          className="btn-primary flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Nova Empresa
        </button>
      </div>

      <div key={refreshKey} className="animate-fadeIn">
        <CompanyList />
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Cadastrar Nova Empresa"
        size="lg"
      >
        <CompanyForm onSuccess={handleSuccess} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default CompaniesPage;