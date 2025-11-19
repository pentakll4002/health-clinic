import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance.js";

const User = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      // Hoàn toàn im lặng, không log gì cho mọi lỗi (kể cả 401)
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/sign-in');
    }
  };

  return (
    <div className='relative flex items-center gap-2'>
      <div
        className='relative w-8 h-8 cursor-pointer'
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className='rounded-full h-9 w-9 aspect-square bg-user' />

        <div className='absolute -bottom-[6px] -right-[6px] bg-white rounded-full p-[2px]'>
          <div className='w-3 h-3 rounded-full bg-success-900' />
        </div>
      </div>

      {isDropdownOpen && (
        <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
          <button
            onClick={handleLogout}
            className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
