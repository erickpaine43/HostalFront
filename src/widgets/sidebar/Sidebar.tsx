import React from 'react';
import styles from './Sidebar.module.css';

export type PageView = 'reservas' | 'habitaciones' | 'clientes' | 'reportes' | 'amas-de-llaves' | 'auditoria';

interface SidebarProps {
  activePage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems: { id: PageView; label: string; icon: string }[] = [
    { id: 'reservas', label: 'Reservaciones', icon: '📅' },
    { id: 'habitaciones', label: 'Habitaciones', icon: '🔑' },
    { id: 'clientes', label: 'Clientes', icon: '👤' },
    { id: 'reportes', label: 'Reportes y Trazas', icon: '📊' },
    {id: 'amas-de-llaves', label: 'Personal', icon: '🧹'},
    {id: 'auditoria', label: 'Auditoria', icon: '🔒'}
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logoIcon}>🏝️</span>
        <div>
          <h1 className={styles.title}>Isla Azul</h1>
          <span className={styles.subtitle}>Gestión Hostalera</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${
              activePage === item.id ? styles.active : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};