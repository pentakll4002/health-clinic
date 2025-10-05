import { Outlet } from 'react-router-dom';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';

const LayoutApp = () => {
  return (
    <div className='h-screen w-full grid grid-cols-[300px_1fr]'>
      <aside>
        <Sidebar />
      </aside>

      <div className='flex flex-col h-full'>
        <Header />

        <main className='flex-1 p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutApp;
