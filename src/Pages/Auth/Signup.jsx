import React from 'react';
import { useFormik } from 'formik';
import { gql, useMutation } from '@apollo/client';  // Ensure you're using Apollo's useMutation hook
import Group from '../../components/assets/Group';
import { useNavigate } from 'react-router-dom';

const Signup = gql`
  mutation signup(
    $email: String!
    $password: String!
    $name: String!
    $stripe_id: String!
    $stripe_email: String
    $stripe_name: String
  ) {
    signup(
      email: $email
      password: $password
      name: $name
      stripe_id: $stripe_id
      stripe_email: $stripe_email
      stripe_name: $stripe_name
    ) {
      token
    }
  }
`;

export const Register = () => {
    const navigate = useNavigate();

    // Mutation for signup
    const [register, { error }] = useMutation(Signup);

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            stripe_id: '', // Stripe fields
            stripe_email: '',
            stripe_name: '',
        },
        onSubmit: async (values) => {
            // Check if passwords match
            if (values.password === values.confirmPassword) {
                try {
                    const response = await register({
                        variables: {
                            email: values.email,
                            password: values.password,
                            name: values.username,
                            stripe_id: values.stripe_id,
                            stripe_email: values.stripe_email,
                            stripe_name: values.stripe_name,
                        },
                    });

                    const token = response.data.signup.token;
                    // Store the token in localStorage
                    localStorage.setItem('token', token);

                    // Navigate to dashboard or another page after successful signup
                    navigate('/setup');
                } catch (err) {
                    console.error('Error during signup:', err);
                }
            } else {
                alert('Passwords do not match');
            }
        },
    });

    return (
        <div class='grid grid-cols-2 gap-10 relative'>
            <div class='absolute flex items-center font-["Semibold"] gap-3 top-5 left-5'>
                <Group className='h-7 w-7' />
                <div>Commercify</div>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="flex items-center justify-center flex-col">
                    <h2 className="mt-10 text-center font-['Bold'] text-2xl leading-9 tracking-tight text-black">
                        Create Commercify Account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-['Semibold'] leading-6 text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="johndoe@gmail.com"
                                    required
                                    autoComplete="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    className="block w-full px-3 rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-['Semibold'] leading-6 text-gray-900"
                            >
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    autoComplete="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    className="block w-full px-3 rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-['Semibold'] leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="*********"
                                    required
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    className="block w-full px-3 rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-['Semibold'] leading-6 text-gray-900"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="*********"
                                    required
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmPassword}
                                    className="block w-full px-3 rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div class='gap-2 flex flex-col'>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-black px-3 py-2.5 text-sm font-['Semibold'] leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Create Account
                            </button>
                            <a
                                href='/login'
                                className="flex w-full justify-center rounded-lg bg-white px-3 py-2.5 border text-sm font-['Semibold'] leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Login
                            </a>
                        </div>
                    </form>

                    {error && <p className="text-red-500">Error during registration</p>}
                </div>
            </div>
            <div class='w-full h-full bg-black'>

            </div>
        </div>
    );
};
