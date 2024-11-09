import Group from '../../components/assets/Group'
import React from 'react'

export const SignIn = () => {
    return (
        <div class='grid grid-cols-2 gap-10 h-screen relative'>
            <div class='absolute flex items-center font-["Semibold"] gap-3 top-5 left-5'>
                <Group className='h-7 w-7' />
                <div>Commercify</div>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="flex items-center justify-center flex-col">

                    <h2 className="mt-10 text-center font-['Bold'] text-2xl leading-9 tracking-tight text-black">
                        Login to Commercify
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-['Semibold'] leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    placeholder='johndoe@gmail.com'
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full px-3 rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-['Semibold'] leading-6 text-gray-900">
                                    Password
                                </label>

                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder='*********'
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-lg px-3 border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>




                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-black px-3 py-2.5 text-sm font-['Semibold'] leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                            <a
                                href='/register'
                                className="flex w-full justify-center rounded-lg border text-black px-3 py-2.5 text-sm font-['Semibold'] leading-6 mt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Create Account
                            </a>
                        </div>
                    </form>


                </div>
            </div>
            <div class='bg-black h-full w-full '>

            </div>
        </div>
    )
}