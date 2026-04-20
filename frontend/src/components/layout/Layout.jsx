import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from 'react-toastify';

export const Layout = () => (
  <div className="flex min-h-screen page-bg">
    <Sidebar />
    <div className="ml-72 flex-1 flex flex-col min-w-0">
      <Header />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop theme="colored" />
  </div>
);
