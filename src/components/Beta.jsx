import Group from '../components/assets/Group'
import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

export const Beta = () => {

    const dont = [
        'Musician', 'Barber', 'Ecom', 'Stylist', 'Brand', 'Artist', 'Other'
    ]

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div class='w-full'>
      <div class=' md:flex items-center md:justify-center relative'>

        <div className="flex min-h-full flex-1 flex-col md:justify-center px-6 py-12 lg:px-8">
          <div className="md:flex items-center sm:justify-center flex-col">
            <Group className='w-8 h-8' />
            <h2 className="mt-7 md:text-center font-['Semibold'] text-3xl leading-9 tracking-tight text-black">
              Get access to beta
            </h2>
          </div>

          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>

                <div className="mt-2 gap-2 flex flex-col">
                  <label class='font-["Semibold"] text-sm'>Name</label>
                  <input
                    id="name"
                    name="name"
                    placeholder='John'
                    type="name"
                    required
                    autoComplete="name"
                    className="block w-full rounded-xl text-sm font-['Medium'] border px-3 py-3 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>

                <div className="mt-2 gap-2 flex flex-col">
                  <label class='font-["Semibold"] text-sm'>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='email@example.com'
                    required
                    autoComplete="email"
                    className="block w-full rounded-xl text-sm font-['Medium'] border px-3 py-3 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
               
              </div>



              <div>
                <button
                  type="submit"
                  className="flex w-full rounded-full justify-center bg-black px-3 py-3 font-['Semibold'] leading-6 text-white shadow-sm hover:border hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get access
                </button>

                <a
                  href='/login'
                  className="flex mt-2 w-full rounded-full justify-center border px-3 py-3 font-['Semibold'] leading-6 text-black hover:bg-indigo-500 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </a>
              </div>

              <div class='text-gray-400 text-center text-xs font-["Medium"]'>By signing up you are agreeing to our <div class='text-black font-["Semibold"]'>terms of use</div></div>
                <div class='rounded-lg mt-10 text-gray-400 border text-center p-2 bottom-5 text-xs font-["Medium"]'>
                  <div>  By continuing to browse our site you are accepting our <a class='font-["Semibold"] text-black'>cookie policy</a></div>
                </div>
            </form>


          </div>
        </div>
      </div>

    </div>
    )
}