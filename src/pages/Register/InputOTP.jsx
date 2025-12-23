import React, { useState } from 'react';

const InputOTP = ({ length = 6, onOTPSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === length) {
      onOTPSubmit(otpValue);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center p-4 bg-gray-100 rounded-md'>
      <h3 className='mb-4 text-lg font-semibold'>Nhập mã OTP</h3>
      
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4 w-full'>
        <div className='flex gap-2 justify-center'>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type='text'
              maxLength='1'
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className='w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            />
          ))}
        </div>
        
        <button
          type='submit'
          disabled={otp.join('').length !== length}
          className='w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition'
        >
          Xác nhận OTP
        </button>
      </form>

      <p className='mt-4 text-sm text-gray-600 text-center'>
        Mã OTP gồm 6 chữ số đã được gửi đến email của bạn
      </p>
    </div>
  );
};

export default InputOTP;
