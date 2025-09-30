import { Outlet } from 'react-router-dom';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';

const LayoutApp = () => {
  return (
    <div className='grid grid-cols-[260px_1fr] grid-rows-[auto_1fr] h-screen max-w-[1440px] mx-auto'>
      <Sidebar />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutApp;
