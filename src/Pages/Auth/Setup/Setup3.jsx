import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import Group from '../../../components/assets/Group'
import Group3 from '../../../components/assets/Group3'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

const Addition = gql`
  mutation updateProfile($more: String, $website: String){
    updateProfile(more: $more, website: $website){ id }
  }`

export const Setup3 = () => {
  const navigate = useNavigate()
  const [profile] = useMutation(Addition)
  const [website, setWebsite] = useState('')
  const [more, setMore] = useState('')

  const handleSubmit = async () => {
    try {
      await profile({ variables: { moreinfo: more, website } })
      navigate('/dashboard')
    } catch (err) { console.error(err) }
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left dark panel */}
      <div className='hidden md:flex md:w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]' />
        <div className='relative z-10 flex items-center gap-2.5'>
          <Group3 className='w-7 h-7' />
          <span className='font-["Semibold"] text-white text-sm'>Commercify HQ</span>
        </div>
        <div className='relative z-10'>
          <h2 className='font-["Semibold"] text-4xl text-white leading-tight mb-4'>Almost<br />there.</h2>
          <p className='font-["Medium"] text-zinc-400 text-sm leading-relaxed max-w-sm'>Add your website and any extra info so customers can find and trust you.</p>
        </div>
        <div className='relative z-10'><div className='font-["Medium"] text-zinc-600 text-xs'>Step 3 of 3</div></div>
      </div>

      {/* Right form panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 bg-white'>
        <div className='w-full max-w-sm'>
          <div className='md:hidden flex items-center gap-2 mb-10'>
            <Group className='w-6 h-6' />
            <span className='font-["Semibold"] text-zinc-900 text-sm'>Commercify HQ</span>
          </div>
          <div className='font-["Semibold"] text-xs text-zinc-400 uppercase tracking-widest mb-1'>Step 3 of 3</div>
          <h1 className='font-["Semibold"] text-2xl text-zinc-950 mb-1'>Almost there</h1>
          <p className='font-["Medium"] text-zinc-500 text-sm mb-8'>Add a website and additional info.</p>
          <div className='space-y-4'>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Website</label>
              <input
                value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder='https://yourwebsite.com'
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>More info</label>
              <input
                value={more} onChange={(e) => setMore(e.target.value)}
                placeholder='Tell us about yourself...'
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
            <button onClick={handleSubmit} className='w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-["Semibold"] text-white hover:bg-zinc-800 transition-colors mt-2'>
              Go to dashboard <ArrowRightIcon className='w-4 h-4' />
            </button>
            <button onClick={() => navigate('/dashboard')} className='w-full flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-["Semibold"] text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all'>
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
