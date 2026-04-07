import React from 'react';
import { useFormik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import Group from '../../components/assets/Group';
import Group3 from '../../components/assets/Group3';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from "@heroicons/react/20/solid";

const Signup = gql`
  mutation signup(
    $email: String! $password: String! $name: String!
    $stripe_id: String! $stripe_email: String $stripe_name: String
  ) {
    signup(email: $email password: $password name: $name
      stripe_id: $stripe_id stripe_email: $stripe_email stripe_name: $stripe_name
    ) { token }
  }
`;

export const Register = () => {
  const navigate = useNavigate();
  const [register, { error, loading }] = useMutation(Signup);

  const formik = useFormik({
    initialValues: { email: '', username: '', password: '', confirmPassword: '', stripe_id: '', stripe_email: '', stripe_name: '' },
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const response = await register({
          variables: {
            email: values.email, password: values.password, name: values.username,
            stripe_id: values.stripe_id, stripe_email: values.stripe_email, stripe_name: values.stripe_name,
          },
        });
        localStorage.setItem('token', response.data.signup.token);
        navigate('/setup');
      } catch (err) {
        console.error('Error during signup:', err);
      }
    },
  });

  return (
    <div className='min-h-screen flex'>
      {/* Left — dark brand panel */}
      <div className='hidden md:flex md:w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden'>
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
            Build your<br />business page.
          </h2>
          <p className='font-["Medium"] text-zinc-400 text-sm leading-relaxed max-w-sm'>
            Join thousands of creators and business owners who use Commercify to sell, book, and grow.
          </p>
          <div className='mt-10 grid grid-cols-2 gap-4'>
            {[
              { label: 'Free to start', sub: 'No credit card required' },
              { label: 'Custom domains', sub: 'On paid plans' },
              { label: 'Stripe payments', sub: 'Secure & instant' },
              { label: 'No platform fees', sub: 'On Plus plan' },
            ].map(item => (
              <div key={item.label} className='border border-white/10 rounded-xl p-4 bg-white/5'>
                <div className='font-["Semibold"] text-white text-sm mb-0.5'>{item.label}</div>
                <div className='font-["Medium"] text-zinc-500 text-xs'>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='relative z-10'>
          <p className='font-["Medium"] text-zinc-600 text-xs'>
            Already have an account?{' '}
            <a href='/login' className='text-zinc-300 hover:text-white transition-colors font-["Semibold"]'>Sign in →</a>
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto'>
        <div className='w-full max-w-sm'>
          <div className='md:hidden flex items-center gap-2 mb-10'>
            <Group className='w-6 h-6' />
            <span className='font-["Semibold"] text-zinc-900 text-sm'>Commercify HQ</span>
          </div>

          <h1 className='font-["Semibold"] text-2xl text-zinc-950 mb-1'>Create your account</h1>
          <p className='font-["Medium"] text-zinc-500 text-sm mb-8'>Get started free — no credit card required.</p>

          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Email</label>
                <input
                  id="email" name="email" type="email"
                  placeholder='you@example.com'
                  onChange={formik.handleChange} value={formik.values.email}
                  required autoComplete="email"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Username</label>
                <input
                  id="username" name="username" type="text"
                  placeholder='johndoe'
                  onChange={formik.handleChange} value={formik.values.username}
                  required autoComplete="username"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Password</label>
              <input
                id="password" name="password" type="password"
                placeholder='••••••••'
                onChange={formik.handleChange} value={formik.values.password}
                required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Confirm password</label>
              <input
                id="confirmPassword" name="confirmPassword" type="password"
                placeholder='••••••••'
                onChange={formik.handleChange} value={formik.values.confirmPassword}
                required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
                <p className='text-red-600 text-xs font-["Medium"]'>{error.graphQLErrors?.[0]?.message || error.message || 'Something went wrong. Try again.'}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-['Semibold'] text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account…' : <>Create account <ArrowRightIcon className='w-4 h-4' /></>}
            </button>

            <a
              href='/login'
              className="w-full flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Semibold'] text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              Already have an account? Sign in
            </a>
          </form>

          <p className='text-zinc-400 text-center text-xs font-["Medium"] mt-6'>
            By creating an account you agree to our{' '}
            <span className='text-zinc-700 font-["Semibold"] cursor-pointer hover:underline'>terms of use</span>
          </p>
        </div>
      </div>
    </div>
  );
};
