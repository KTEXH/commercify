import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Form, Formik } from 'formik'
import { ME_QUERY } from '../../../Data/Me'
import { useNavigate } from 'react-router-dom'
import Group from '../../../components/assets/Group'
import Group3 from '../../../components/assets/Group3'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

const Profile = gql`
  mutation updateProfile($bio: String, $avatar: String, $secondary: String){
    updateProfile(bio: $bio, avatar: $avatar, secondary: $secondary){ id }
  }`

export const Setup2 = () => {
  const { data, error, loading } = useQuery(ME_QUERY)
  const [profile] = useMutation(Profile, { refetchQueries: [{ query: ME_QUERY }] })
  const navigate = useNavigate()
  const avatarFile = React.useRef(null)
  const [avatar, setAvatar] = React.useState()
  const [avatarLoading, setAvatarLoading] = React.useState(false)
  const [bio, setBio] = React.useState('')
  const [warning, setWarning] = React.useState(null)

  const handleSubmit = async () => {
    if (!avatar) { setWarning('Please upload an avatar to continue.'); return }
    try {
      await profile({ variables: { bio, avatar } })
      navigate('/setup3')
    } catch (err) { console.error(err) }
  }

  const uploadAvatar = async (e) => {
    const files = e.target.files
    const fd = new FormData()
    fd.append('file', files[0])
    fd.append('upload_preset', 'kyroapp')
    setAvatarLoading(true)
    const res = await fetch('https://api.cloudinary.com/v1_1/dapcizjsz/image/upload', { method: 'POST', body: fd })
    const file = await res.json()
    setAvatar(file.secure_url)
    setAvatarLoading(false)
  }

  const name = data?.me?.name
  const firstLetter = name ? name[0].toUpperCase() : '?'

  if (error) return <div>{error.message}</div>
  if (loading) return <div>Loading...</div>

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
          <h2 className='font-["Semibold"] text-4xl text-white leading-tight mb-4'>Set up your<br />workspace.</h2>
          <p className='font-["Medium"] text-zinc-400 text-sm leading-relaxed max-w-sm'>Add a photo and bio so your customers know who they are buying from.</p>
        </div>
        <div className='relative z-10'><div className='font-["Medium"] text-zinc-600 text-xs'>Step 2 of 3</div></div>
      </div>

      {/* Right form panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto'>
        <div className='w-full max-w-sm'>
          <div className='md:hidden flex items-center gap-2 mb-10'>
            <Group className='w-6 h-6' />
            <span className='font-["Semibold"] text-zinc-900 text-sm'>Commercify HQ</span>
          </div>
          <div className='font-["Semibold"] text-xs text-zinc-400 uppercase tracking-widest mb-1'>Step 2 of 3</div>
          <h1 className='font-["Semibold"] text-2xl text-zinc-950 mb-1'>Set up your workspace</h1>
          <p className='font-["Medium"] text-zinc-500 text-sm mb-8'>Add a photo and bio to personalize your page.</p>
          <div className='space-y-5'>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-3'>Profile photo</label>
              <div className='flex items-center gap-4'>
                {avatar ? (
                  <img src={avatar} className='w-16 h-16 rounded-2xl object-cover border border-zinc-200' alt='avatar' />
                ) : (
                  <div className='w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-["Semibold"] text-xl text-zinc-600'>
                    {avatarLoading ? '...' : firstLetter}
                  </div>
                )}
                <div>
                  <label htmlFor='file-upload' className='cursor-pointer inline-flex items-center gap-1.5 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-["Semibold"] text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all'>
                    {avatarLoading ? 'Uploading...' : 'Upload photo'}
                    <input id='file-upload' type='file' onChange={uploadAvatar} ref={avatarFile} className='hidden' />
                  </label>
                  <div className='text-xs font-["Medium"] text-zinc-400 mt-1.5'>PNG, JPEG up to 8MB</div>
                </div>
              </div>
            </div>
            <div>
              <label className='font-["Semibold"] text-zinc-700 text-xs uppercase tracking-wide block mb-2'>Bio</label>
              <input
                value={bio} onChange={(e) => setBio(e.target.value)}
                placeholder='Tell us about yourself...'
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-['Medium'] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
            {warning && (
              <div className='bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
                <p className='text-red-600 text-xs font-["Medium"]'>{warning}</p>
              </div>
            )}
            <button onClick={handleSubmit} className='w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-["Semibold"] text-white hover:bg-zinc-800 transition-colors'>
              Continue <ArrowRightIcon className='w-4 h-4' />
            </button>
            <button onClick={() => navigate('/setup3')} className='w-full flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-["Semibold"] text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all'>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
