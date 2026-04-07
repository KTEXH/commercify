import Group from '../../components/assets/Group'
import Group3 from '../../components/assets/Group3'
import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ArrowRightIcon } from "@heroicons/react/20/solid";

const SIGNIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const SignIn = () => {
  const navigate = useNavigate();
  const [login, { error, loading }] = useMutation(SIGNIN);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      try {
        const response = await login({ variables: { email: values.email, password: values.password } });
        localStorage.setItem('token', response.data.login.token);
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
      }
    },
  });

  return (
    <div className='min-h-screen flex'>
      {/* Left — dark brand panel */}
      <div className='hidden md:flex md:w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden'>
        {/* grid texture */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]' />
        <div className='absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2' />

        <div className='relative z-10'>
          <div className='flex items-center gap-2.5'>
            <Group3 className='w-7 h-7' />
            <span className='font-["Semibold"] text-white text-sm'>Commercify HQ</span>
          </div>
        </div>

        <div className='relative z-10'>
          <h2 className='font-["Semibold"] text-4xl text-white leading-tight mb-4'>
            Your store,<br />your rules.
          </h2>
          <p className='font-["Medium"] text-zinc-400 text-sm leading-relaxed max-w-sm'>
            Storefronts, link-in-bios, workshops, and payment forms — everything you need to run your business online.
          </p>
          <div className='mt-10 flex flex-col gap-3'>
            {['Digital storefronts', 'Link-in-bio pages', 'Booking & payments', 'Custom forms'].map(item => (
              <div key={item} className='flex items-center gap-3'>
                <div className='w-1.5 h-1.5 rounded-full bg-white/40' />
                <span className='font-["Medium"] text-zinc-400 text-sm'>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='relative z-10'>
          <div className='border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-sm'>
            <p className='font-["Medium"] text-zinc-300 text-sm leading-relaxed mb-4'>
              "Setting up my salon was effortless — within minutes I was already receiving bookings."
            </p>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-["Semibold"] text-white'>S</div>
              <div>
                <div className='text-white font-["Semibold"] text-xs'>Sarah Johnson</div>
                <div className='text-zinc-500 font-["Medium"] text-xs'>Owner of Salon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 bg-white'>
        <div className='w-full max-w-sm'>
          <div className='md:hidden flex items-center gap-2 mb-10'>
            <Group className='w-6 h-6' />
            <span className='font-["Semibold"] text-zinc-900 text-sm'>Commercify HQ</span>
          </div>

          <h1 className='font-["Semibold"] text-2xl text-zinc-950 mb-1'>Welcome back</h1>
          <p className='font-["Medium"] text-zinc-500 text-sm mb-8'>Sign in to your account to continue.</p>

          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Email</label>
              <input
                id="email" name="email" type="email"
                placeholder='you@example.com'
                onChange={formik.handleChange} value={formik.values.email}
                required autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Password</label>
              <input
                id="password" name="password" type="password"
                placeholder='••••••••'
                onChange={formik.handleChange} value={formik.values.password}
                required autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
                <p className='text-red-600 text-xs font-["Medium"]'>{error.graphQLErrors?.[0]?.message || error.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-['Semibold'] text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : <>Sign in <ArrowRightIcon className='w-4 h-4' /></>}
            </button>

            <a
              href='/beta'
              className="w-full flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Semibold'] text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              Create an account
            </a>
          </form>

          <p className='text-zinc-400 text-center text-xs font-["Medium"] mt-8'>
            By signing in you agree to our{' '}
            <span className='text-zinc-700 font-["Semibold"] cursor-pointer hover:underline'>terms of use</span>
          </p>
        </div>
      </div>
    </div>
  )
}
