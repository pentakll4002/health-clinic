import { Outlet } from 'react-router-dom';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import ChatbotWidget from '../ui/ChatbotWidget';

const LayoutApp = () => {
  return (
    <div className='h-screen w-full grid grid-cols-[300px_1fr]'>
      <aside className='h-full overflow-y-hidden'>
        <Sidebar />
      </aside>

      <div className='flex flex-col h-full'>
        <Header />

        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default LayoutApp;
