import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={isMapPage ? 'flex-1' : 'flex-1 pt-16'}>
        <Outlet />
      </main>
      {!isMapPage && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a2332',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#1B6B3A', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}
