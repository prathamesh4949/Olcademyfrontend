import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { USER_API_END_POINT } from '@/api/constant';

const VerifyEmail = ({ isOpen, onClose, openLogin, email }) => {
  if (!isOpen) return null;
  const [otp, setOTP] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(false);


  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${USER_API_END_POINT}/signup/verify-email`,
        {
          email,
          emailOtp: otp
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
      if (res.data.success) {
        openLogin()
        // onClose()
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    setTimeLeft(600)
    try {
      const res = await axios.post(`${USER_API_END_POINT}/signup/resend-otp`,
        {
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
      if (!res.data.success) {
        setTimeLeft(0)
      }
    } catch (error) {
      console.log(error)
      setTimeLeft(0)
    }
  }

  const changeInputHandler = (e) => {
    setOTP(e.target.value)

  }
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const otpExpiry = () => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };



  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl md:max-w-2xl h-[470px] rounded-xl p-8 md:p-10 flex justify-center items-center overflow-hidden shadow-2xl">
        <div className='flex flex-col items-center'>
          <h1 className='text-4xl align-middle font-medium text-[#62270d]'>Verify Your Email Address</h1>
          <div className='mt-3 text-gray-600'>
            <p>Please enter the 6-digit code we’ve sent to your email to verify your address.</p>
          </div>

          <form action="" onSubmit={submitHandler} className='mt-10 flex flex-col gap-4'>

            <input type="text"
              maxLength={6}
              name="otp"
              value={otp}
              onChange={changeInputHandler}
              className="bg-gray-200 tracking-widest text-xl text-center outline-none py-2 text-black border rounded "
            />
            <p className='text-gray-600 text-center'>OTP expires in : <span>{otpExpiry()}</span> </p>
            {loading ?
              <button className='bg-accent-dark flex items-center justify-center  text-white px-2 py-2 mt-5 rounded-xl text-lg font-bold '>
                <Loader2 className="mr-2 h-6 w-4 animate-spin" />
                Loading
              </button>
              : <button className='bg-accent-dark text-white px-2 py-2 mt-5 rounded-xl text-lg font-bold '>
                Verify Email
              </button>
            }
            
          </form>
          <div className='text-gray-600 mt-3'>
            <p>Didn't Receive OTP ? <span className='text-blue-500 cursor-pointer underline' onClick={() => resendOTP()}>Resend OTP</span></p>
          </div>
        </div>

      </div>

    </div>



  )
}

export default VerifyEmail
