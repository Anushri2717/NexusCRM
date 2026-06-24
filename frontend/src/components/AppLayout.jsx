import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastProvider } from './Toast';

export default function AppLayout() {
  return (
    <ToastProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <div className="page-content page-enter">
            <Outlet />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
