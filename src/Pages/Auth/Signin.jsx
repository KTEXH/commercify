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
    <div class='w-full'>
      <div class='w-full h-7  bg-black'>

      </div>
    <div class='md:grid md:grid-cols-2  gap-10 md:h-screen relative'>
      
      <div className="flex min-h-full flex-1 flex-col md:justify-center px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center flex-col">
          <Group className='w-10 h-10' />
          <h2 className="mt-7 text-center font-['Semibold'] text-3xl leading-9 tracking-tight text-black">
            Welcome Back to Commercify
          </h2>
          <div class='font-["Medium"] mt-2 text-sm text-gray-400'>Login to Commercify</div>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  placeholder='Email'
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                  autoComplete="email"
                  className="block w-full px-3 border text-sm font-['Medium'] rounded-xl py-3 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder='Password'
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-xl text-sm font-['Medium'] border px-3 py-3 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {error && (<div>{error.message}</div>)}


            <div>
              <button
                type="submit"
                className="flex w-full rounded-full justify-center bg-black px-3 py-3 font-['Semibold'] leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
        
              <button
                type="submit"
                className="flex w-full rounded-full mt-2 justify-center border px-3 py-3 font-['Semibold'] leading-6 text-black hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </button>
            </div>
          </form>


        </div>
      </div>
      <div class='bg-black hidden md:flex rounded-tl-3xl rounded-bl-3xl h-full w-full '>

      </div>
    </div>
    </div>
  )
}