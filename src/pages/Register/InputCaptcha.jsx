import React, { useState } from 'react';

const InputCaptcha = ({ onCaptchaSubmit }) => {
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaText, setCaptchaText] = useState(generateCaptchaText());

  function generateCaptchaText() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onCaptchaSubmit(captchaValue, captchaText);
  };

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptchaText());
    setCaptchaValue('');
  };

  return (
    <div className='flex flex-col items-center justify-center p-4 bg-gray-100 rounded-md'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='px-4 py-2 text-2xl font-bold tracking-widest bg-white border rounded-md select-none'>{captchaText}</span>
        <button
          type='button'
          onClick={refreshCaptcha}
          className='px-3 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600'
        >
          Refresh
        </button>
      </div>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
          placeholder='Enter CAPTCHA'
          className='px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          type='submit'
          className='px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600'
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default InputCaptcha;








