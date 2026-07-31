import React, { useState } from 'react';
import { Sidebar } from '../widgets/sidebar/Sidebar';
import type { PageView } from '../widgets/sidebar/Sidebar';
import { ReservasPage } from '../pages/ReservasPage';
import { HabitacionesPage } from '../pages/HabitacionesPage';
import { ClientesPage } from '../pages/ClientesPage';
import { ReportesPage } from '../pages/ReportesPage';
import { AmasDeLlavesPage } from '../pages/AmasDeLlavesPage';
import { AuditoriaPage } from '../pages/AuditoriaPage';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageView>('reservas');

  const renderContent = () => {
    switch (activePage) {
      case 'reservas':
        return <ReservasPage />;
      case 'habitaciones':
        return <HabitacionesPage />;
      case 'clientes':
        return <ClientesPage />;
      case 'reportes':
        return <ReportesPage />;
      case 'amas-de-llaves':
        return <AmasDeLlavesPage />;
      case 'auditoria':
        return <AuditoriaPage />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;