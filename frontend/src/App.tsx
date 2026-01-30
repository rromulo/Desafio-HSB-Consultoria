import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import CompanyList from './components/company/CompaniesList';
import Layout from './components/Layout';
import CompaniesPage from './pages/companies';
import CompanyDetailPage from './pages/CompanyDetailPage';

// Supondo que você tenha um componente para a Home
// const Dashboard = () => <div className="p-4">Bem-vindo ao Dashboard!</div>;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CompaniesPage />} />          
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;