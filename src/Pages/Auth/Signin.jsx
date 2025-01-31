import Group from '../../components/assets/Group'
import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

const SIGNIN = gql`
  mutation login(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
    ) {
      token
    }
  }
`;

export const SignIn = () => {

    const navigate = useNavigate();

    // Mutation for signup
    const [login, { error }] = useMutation(SIGNIN);

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
     
        onSubmit: async (values) => {
          try {
            const response = await login({
              variables: {
                email: values.email,
                password: values.password,
              },
            });
            const token = response.data.login.token;
            localStorage.setItem('token', token);
            navigate('/dashboard');
          } catch (err) {
            console.error('Login error:', err);
          }
        },
      });


    return (
        <div class='md:grid md:grid-cols-2  gap-10 md:h-screen relative'>
         
            <div className="flex min-h-full flex-1 flex-col md:justify-center px-6 py-12 lg:px-8">
                <div className="flex items-center justify-center flex-col">
                  <Group className='w-10 h-10' />

                    <h2 className="mt-10 text-center font-['Semibold'] text-3xl leading-9 tracking-tight text-black">
                        Welcome Back
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-['Semibold'] leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    placeholder='Johndoe@gmail.com'
                                    type="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    required
                                    autoComplete="email"
                                    className="block w-full px-5 border font-['Medium'] rounded-full py-2.5 text-gray-900 shadow-sm placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    placeholder='*********'
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-full border px-5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                     {error && (<div>{error.message}</div>)}


                        <div>
                            <button
                                type="submit"
                                className="flex w-full rounded-full justify-center bg-black px-3 py-2.5 text-sm font-['Semibold'] leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                           <div class='mt-3 text-xs text-center text-gray-400 font-["Medium"]'>Create a account <a class='font-["Semibold"] text-black'>Here</a></div>
                        </div>
                    </form>


                </div>
            </div>
            <div class='bg-black hidden md:flex rounded-tl-3xl rounded-bl-3xl h-full w-full '>

            </div>
        </div>
    )
}