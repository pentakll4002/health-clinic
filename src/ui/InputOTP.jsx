import { useEffect, useRef, useState } from 'react';

const InputOTP = ({ length = 4, onOTPSubmit = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRef = useRef([]);

  useEffect(() => {
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);

  function handleChange(index, e) {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOTP = [...otp];

    //allow only one input
    newOTP[index] = value.substring(value.length - 1);
    setOtp(newOTP);

    //submit trigger
    const combineOtp = newOTP.join('');
    if (combineOtp.length === length) onOTPSubmit(combineOtp);

    //Move to next input if current field is filled
    if (value && index < length - 1 && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }
  }
  function handleClick(index) {
    inputRef.current[index].setSelectionRange(1, 1);
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        inputRef.current[index - 1].focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  }

  return (
    <div className='flex items-center justify-center'>
      {otp.map((value, index) => {
        return (
          <input
            name='OTP'
            ref={(input) => (inputRef.current[index] = input)}
            key={index}
            value={value}
            type='text'
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className='otpInput'
          />
        );
      })}
    </div>
  );
};


export default InputOTP;
