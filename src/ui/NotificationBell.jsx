import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { useBusinessNotifications } from '../hooks/useBusinessNotifications';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    isRead,
    markRead,
    markAllRead,
    refresh,
  } = useBusinessNotifications({ refetchIntervalMs: 60000 });

  useEffect(() => {
    function handlePointerDown(event) {
      if (!open) return;
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  function handleItemClick(item) {
    markRead(item.id);
    setOpen(false);
    if (item?.action?.to) {
      navigate(item.action.to);
    }
  }

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) refresh();
        }}
        className='relative p-[8px] rounded-[20px] shadow-1 bg-white border border-grey-transparent'
      >
        <BellIcon className='w-6 h-6' />
        {unreadCount > 0 && (
          <span className='absolute -top-[2px] -right-[2px] w-3 h-3 rounded-full bg-red-500 border-2 border-white' />
        )}
      </button>

      {open && (
        <div className='absolute right-0 top-full mt-2 w-[360px] bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold text-grey-900'>Thông báo nghiệp vụ</span>
              <span className='text-xs text-grey-500'>Những việc cần xử lý theo vai trò của bạn</span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='text-xs font-semibold text-grey-700 hover:text-grey-900'
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                Đã xem hết
              </button>
            </div>
          </div>

          <div className='max-h-[360px] overflow-y-auto'>
            {isLoading ? (
              <div className='px-4 py-6 text-sm text-grey-500'>Đang tải...</div>
            ) : error ? (
              <div className='px-4 py-6 text-sm text-red-500'>Không thể tải thông báo.</div>
            ) : notifications.length === 0 ? (
              <div className='px-4 py-6 text-sm text-grey-500'>Không có việc cần xử lý.</div>
            ) : (
              notifications.map((item) => {
                const isUnread = !isRead(item.id);
                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleItemClick(item)}
                    className='w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-grey-50'
                  >
                    <div className='flex items-start gap-3'>
                      <div className={`mt-1 w-2 h-2 rounded-full ${isUnread ? 'bg-primary' : 'bg-grey-300'}`} />
                      <div className='flex flex-col gap-1'>
                        <div className='text-xs uppercase text-primary'>{item.title}</div>
                        <div className='text-sm font-semibold text-grey-900'>{item.message}</div>
                        {item.createdAt ? (
                          <div className='text-xs text-grey-500'>{new Date(item.createdAt).toLocaleString()}</div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
