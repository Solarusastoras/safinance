// src/App.js
import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Modal from './components/Modal/Modal';
import Dashboard from './views/Dashboard/Dashboard';
import Transactions from './views/Transactions/Transactions';
import Budgets from './views/Budgets/Budgets';
import Savings from './views/Savings/Savings';
import Subscriptions from './views/Subscriptions/Subscriptions';
import Settings from './views/Settings/Settings';
import { useFinance } from './context/FinanceContext';
import './scss/main.scss';

function AppShell() {
  const { activeTab } = useFinance();

  const views = {
    dashboard:     <Dashboard />,
    transactions:  <Transactions />,
    budgets:       <Budgets />,
    savings:       <Savings />,
    subscriptions: <Subscriptions />,
    settings:      <Settings />,
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          {views[activeTab] || <Dashboard />}
        </main>
        <Footer />
      </div>
      <Modal />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  );
}
