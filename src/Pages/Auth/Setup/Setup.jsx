import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import Group from '../../../components/assets/Group'
import Group3 from '../../../components/assets/Group3'
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/20/solid'
import { CREATE_LINK_IN_BIO } from '../../../Pages/Pages/Mutations/Mutations'
import { createClient } from '@supabase/supabase-js'

const PAGE_TYPES = ['storefront', 'workshop', 'linkinbio', 'form']
const PAGE_LABELS = { storefront: 'Storefront', workshop: 'Workshop', linkinbio: 'Link-in-bio', form: 'Form' }
const PAGE_DESC = { storefront: 'Sell products & downloads', workshop: 'Offer bookable services', linkinbio: 'Centralize your links', form: 'Collect leads & feedback' }

export const Setup = () => {
  const supabase = createClient(
    'https://hrvpmllpyogxsgxcwrcq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydnBtbGxweW9neHNneGN3cmNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjM5OTgwNywiZXhwIjoyMDU3OTc1ODA3fQ.Li3A-TLcPvQukSagJilD1D9rGuioodkursddKkYufYk'
  )
  const navigate = useNavigate()
  const [create] = useMutation(CREATE_LINK_IN_BIO)
  const [formData, setFormData] = useState({ name: '', headerImage: '', storefront: true, workshop: false, linkinbio: false, form: false })

  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, storefront: type === 'storefront', workshop: type === 'workshop', linkinbio: type === 'linkinbio', form: type === 'form' }))
  }

  const handleImageUpload = async (e) => {
    if (!e?.target?.files?.length) return
    const file = e.target.files[0]
    const fileName = Date.now() + '-' + file.name
    try {
      const { error } = await supabase.storage.from('bubble').upload('uploads/' + fileName, file)
      if (error) throw error
      const { data: pub } = supabase.storage.from('bubble').getPublicUrl('uploads/' + fileName)
      setFormData(prev => ({ ...prev, headerImage: pub.publicUrl }))
    } catch (err) { console.error('Upload failed:', err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await create({ variables: { name: formData.name, headerImage: formData.headerImage, storefront: formData.storefront, workshop: formData.workshop, linkinbio: formData.linkinbio, form: formData.form } })
    navigate('/dashboard')
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
          <h2 className='font-["Semibold"] text-4xl text-white leading-tight mb-4'>Create your<br />first page.</h2>
          <p className='font-["Medium"] text-zinc-400 text-sm leading-relaxed max-w-sm mb-10'>Pick a type and give it a name. You can add more pages later.</p>
          <div className='flex flex-col gap-4'>
            {PAGE_TYPES.map(t => (
              <div key={t} className='flex items-start gap-3'>
                <div className={'w-1.5 h-1.5 rounded-full mt-1.5 ' + (formData[t] ? 'bg-white' : 'bg-white/20')} />
                <div>
                  <div className={'font-["Semibold"] text-sm ' + (formData[t] ? 'text-white' : 'text-zinc-500')}>{PAGE_LABELS[t]}</div>
                  <div className='font-["Medium"] text-zinc-600 text-xs'>{PAGE_DESC[t]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='relative z-10'><div className='font-["Medium"] text-zinc-600 text-xs'>Step 1 of 3</div></div>
      </div>

      {/* Right form panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 bg-white'>
        <div className='w-full max-w-sm'>
          <div className='md:hidden flex items-center gap-2 mb-10'>
            <Group className='w-6 h-6' />
            <span className='font-["Semibold"] text-zinc-900 text-sm'>Commercify HQ</span>
          </div>
          <div className='font-["Semibold"] text-xs text-zinc-400 uppercase tracking-widest mb-1'>Step 1 of 3</div>
          <h1 className='font-["Semibold"] text-2xl text-zinc-950 mb-1'>Create your first page</h1>
          <p className='font-["Medium"] text-zinc-500 text-sm mb-8'>Name it and choose a type to get started.</p>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Page name</label>
              <input
                name='name' value={formData.name}
                onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                placeholder='e.g. My Hair Salon'
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Page type</label>
              <div className='grid grid-cols-2 gap-2'>
                {PAGE_TYPES.map(t => (
                  <button
                    type='button' key={t} onClick={() => handleTypeChange(t)}
                    className={'text-left px-4 py-3 rounded-xl border text-sm font-["Semibold"] transition-all ' + (formData[t] ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white')}
                  >
                    <div>{PAGE_LABELS[t]}</div>
                    <div className='text-xs font-["Medium"] mt-0.5 text-zinc-400'>{PAGE_DESC[t]}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Page image</label>
              {formData.headerImage ? (
                <div className='flex items-center gap-4'>
                  <img src={formData.headerImage} className='w-16 h-16 rounded-2xl object-cover border border-zinc-200' />
                  <label htmlFor='file' className='cursor-pointer text-sm font-["Semibold"] text-zinc-600 hover:text-zinc-900 transition-colors'>
                    Change image
                    <input id='file' type='file' onChange={handleImageUpload} className='hidden' />
                  </label>
                </div>
              ) : (
                <label htmlFor='file' className='flex flex-col items-center justify-center w-full h-28 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 cursor-pointer transition-colors bg-zinc-50'>
                  <PlusIcon className='w-5 h-5 text-zinc-400 mb-1' />
                  <span className='text-xs font-["Semibold"] text-zinc-400'>Upload image</span>
                  <input id='file' type='file' onChange={handleImageUpload} className='hidden' />
                </label>
              )}
            </div>
            <button type='submit' className='w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-["Semibold"] text-white hover:bg-zinc-800 transition-colors'>
              Create page <ArrowRightIcon className='w-4 h-4' />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
