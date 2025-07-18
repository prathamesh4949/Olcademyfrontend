// components/SignupModal.jsx
import React, { useState } from 'react';
import perfumeImage from '../../../public/images/Rectangle 58.png'; // update path as needed
import { USER_API_END_POINT } from '@/api/constant';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
const SignupModal = ({ isOpen, onClose, openLogin, openVerify, setEmail }) => {
  if (!isOpen) return null;


  const [input, setInput] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);

  const changeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/signup`, {
        email: input.email,
        password: input.password
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      if (res.data.success) {
        setEmail(input.email)
        openVerify()
      }
    } catch (error) {
      console.log(error.message)
    }
    finally {
      setLoading(false);
    }

  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl h-[500px] rounded-lg overflow-hidden flex shadow-lg">
        {/* Left Side Image */}
        <div className="w-1/2 h-full">
          <img
            src={perfumeImage}
            alt="Perfume"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-1/2 bg-[#f8f5f1] px-10 py-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#79300f] mb-2">Vesarii</h2>
          <h3 className="text-xl font-semibold text-[#79300f] mb-4">Join Our Scented World</h3>
          <p className="text-sm text-gray-700 mb-6">
            Enjoy early access to new collections, exclusive offers, and a welcome treat of 10% off your first order when you sign up to receive our emails and texts.
          </p>


          <form action="" onSubmit={submitHandler}>

            <div className='flex flex-col gap-4'>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeInputHandler}
                placeholder='Email'
                className='h-10 placeholder-gray-400 px-4 py-1 rounded border border-gray-400 outline-none'
              />

              <input
                type="password"
                name="password"
                placeholder='Password'
                value={input.password}
                onChange={changeInputHandler}
                className='h-10 placeholder-gray-400 px-4 py-1 rounded border border-gray-400 outline-none'
              />


              {loading ?
                <button
                  className='py-2 rounded text-white flex items-center justify-center bg-[#62270d]'>
                  <Loader2 className="mr-2 h-6 w-4 animate-spin" />
                  Loading
                </button>
                :
                <button
                  className='py-2 rounded text-white bg-[#62270d]'>
                  Sign Up
                </button>
              }
            </div>

          </form>

          <div className="text-center  mt-2 text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <span className='text-blue-600 cursor-pointer' onClick={openLogin}>
              Login
            </span>
          </div>

          <button
            className="mt-4 text-sm text-gray-500 hover:text-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default SignupModal;
