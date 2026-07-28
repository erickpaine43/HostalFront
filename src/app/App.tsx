import React, { useState } from 'react';
import { Sidebar } from '../widgets/sidebar/Sidebar';
import type { PageView } from '../widgets/sidebar/Sidebar';
import { ReservasPage } from '../pages/ReservasPage';
import { HabitacionesPage } from '../pages/HabitacionesPage';
import { ClientesPage } from '../pages/ClientesPage';
import { ReportesPage } from '../pages/ReportesPage';
import { AmasDeLlavesPage } from '../pages/AmasDeLlavesPage';
import { AuditoriaPage } from '../pages/AuditoriaPage';
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px 40px' }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;