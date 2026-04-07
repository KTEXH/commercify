import { useQuery, gql, useMutation } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg';
import { useParams } from "react-router-dom";
import React, { useMemo, useState } from 'react';
import { Button, Description, Simple } from '../../Pages/Pages/Builder';
import { ArrowRightIcon, EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { BellAlertIcon } from '@heroicons/react/24/outline'
import logo from '../../components/assets/logo.png';
import verified from '../../components/assets/twitterverified.png';
import clsx from 'clsx';
import flag from '../../components/assets/united-states.png'
import { HashLoader } from 'react-spinners'

const GET_LINK_BY_SUBDOMAIN = gql`
  query storeBySubdomain($subdomain: String!) {
    storeBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      name
      headerText
      backgroundColor
      baseText
      textColor
      formType
      description
      secondaryImage
      subText
      style
      font
      form
      storefront
      linkinbio
      grid
      workshop
      styleColor
      base
      verified
      rounded
      headerImage
         links {
          id
          linkText
          link
          image
        }
      user {
        id
        verified
        OnlyProducts {
          id
          title
          price
          description
          file
          sizes
          serviceOrProduct
          colors
          type
          author{
          id
          }
          thumbnail
        }
           Services {
          id
          title
          serviceOrProduct
          price
          author{
          id
          }
          availablityDays
          availablityHours
          description
          thumbnail
        }
      }
    }
  }
`;

const CREATE_FORM_ANSWER = gql`
  mutation CreateFormAnswer(
    $name: String
    $email: String
    $mobileNumber: String
    $feedback: String
    $uploadedFile: String
    $pageId: Int!
  ) {
    createFormAnswer(
      name: $name
      email: $email
      mobileNumber: $mobileNumber
      feedback: $feedback
      uploadedFile: $uploadedFile
      pageId: $pageId
    ) {
      id
    }
  }
`


export const Linkinbio = () => {

  const [isSeen, setIsSeen] = useState(false);
  const { subdomain } = useParams();
  const { loading, error, data } = useQuery(GET_LINK_BY_SUBDOMAIN, {
    variables: { subdomain },
  });
  const store = useMemo(() => data?.storeBySubdomain, [data]);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [feedback, setFeedback] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')

  const [createFormAnswer] = useMutation(CREATE_FORM_ANSWER)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createFormAnswer({
        variables: {
          name,
          email,
          mobileNumber,
          feedback,
          uploadedFile,
          pageId: store?.id,
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  if(loading) return <div className='flex h-screen w-full items-center justify-center'><HashLoader color={'#999'} loading={true} size={50} /></div>
  if (error) return <div>Error: {error.message}</div>;
  if (!store) return <div>No Store</div>;

  const style = store?.style
  const base = store?.base
  const font = store?.font
  const rounded = store?.rounded
  const styleColor = store?.styleColor
  const baseText = store?.baseText
  const grid = store?.grid

  const inputCls = `w-full bg-transparent px-4 py-3.5 text-sm font-["Medium"] focus:outline-none placeholder:text-zinc-400`
  const fontCls = font === 'Cascadia' ? 'font-["CSemibold"]' : font === 'Rubrik' ? 'font-["RSemibold"]' : 'font-["Semibold"]'
  const fontMedCls = font === 'Cascadia' ? 'font-["CMedium"]' : font === 'Rubrik' ? 'font-["RMedium"]' : 'font-["Medium"]'

  return (
    <div style={{ backgroundColor: store?.backgroundColor }} className='w-full min-h-screen'>
      <div className={`flex flex-col min-h-screen px-5 pb-28 relative max-w-xl mx-auto w-full`}>
        {/* Top action buttons */}
        <div className="absolute top-5 right-5 w-9 h-9 rounded-2xl flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <EllipsisHorizontalIcon className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-5 left-5 w-9 h-9 rounded-2xl flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <BellAlertIcon className="w-4 h-4 text-white" />
        </div>

        {/* Profile section */}
        <div className={`max-w-md w-full mt-20 flex flex-col items-center mx-auto`}>
          <img
            src={store?.secondaryImage}
            loading="lazy"
            className="w-24 h-24 rounded-3xl object-cover shadow-sm"
            alt="Store header"
          />

          <div className="text-center mt-5">
            <div
              style={{ color: store?.textColor }}
              className={`text-xl justify-center ${fontCls} flex items-center gap-1.5`}
            >
              <div>{store.headerText}</div>
              <img
                src={verified}
                className={`${store?.verified ? 'w-5 h-5' : 'hidden'}`}
                alt="Verified"
              />
            </div>
            <div
              style={{ color: store?.textColor }}
              className={`mt-1 max-w-sm ${fontMedCls} text-sm text-center opacity-70`}
            >
              {store.description}
            </div>
          </div>

          <div className="w-full mt-7">
            {/* Storefront products */}
            {store?.user?.OnlyProducts?.length > 0 && (
              <div className={clsx(store?.storefront ? 'flex flex-col' : 'hidden')}>
                <div className={`space-y-2 ${base === 'description' && 'hidden'} w-full`}>
                  {store?.user?.OnlyProducts?.map(item => (
                    <div className='w-full flex' key={item.id}>
                      {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                      {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                    </div>
                  ))}
                </div>
                <div className={`${grid === false ? 'flex flex-col' : 'grid grid-cols-2'} ${base === 'button' && 'hidden'} gap-2 w-full`}>
                  {store?.user?.OnlyProducts?.map(item => (
                    <div className='w-full' key={item.id}>
                      {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workshop services */}
            {store.user?.Services?.length > 0 && (
              <div className={clsx(store.workshop ? 'flex flex-col' : 'hidden')}>
                <div className={`space-y-2 ${base === 'description' && 'hidden'} w-full`}>
                  {store?.user?.Services?.map(item => (
                    <div className='w-full flex' key={item.id}>
                      {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                      {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                    </div>
                  ))}
                </div>
                <div className={`${grid === false ? 'flex flex-col' : 'grid grid-cols-2'} ${base === 'button' && 'hidden'} gap-2 w-full`}>
                  {store?.user?.Services?.map(item => (
                    <div className='w-full' key={item.id}>
                      {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <div className={`${store?.form === false && 'hidden'}`}>
              {store?.formType === 'Contact' && (
                <form onSubmit={handleSubmit} className='w-full mt-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='border border-zinc-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm'>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Full name' className={inputCls} />
                    </div>
                    <div className='border border-zinc-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm'>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className={inputCls} />
                    </div>
                  </div>
                  <div className='flex items-center border border-zinc-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm mt-3'>
                    <div className='pl-4 pr-3 flex items-center gap-2 border-r border-zinc-200 py-3.5'>
                      <img src={flag} className='h-4 w-4' />
                      <span className='text-sm font-["Semibold"] text-zinc-500'>+1</span>
                    </div>
                    <input
                      value={mobileNumber}
                      type='number'
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder='(123) 456-7890'
                      className={`flex-1 ${inputCls}`}
                    />
                  </div>
                  <button type='submit' className={`w-full py-3.5 flex justify-center items-center gap-2 rounded-2xl bg-zinc-950 mt-4 text-white ${fontCls} text-sm transition-all hover:bg-zinc-800 active:scale-[0.98]`}>
                    Submit
                    <ArrowRightIcon className='w-4 h-4' />
                  </button>
                </form>
              )}
              {store?.formType === 'Upload' && (
                <div className='w-full mt-4'>
                  <div className={`${fontCls} text-sm mb-3`}>Upload files</div>
                  <div className='h-48 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-300 bg-white/50 backdrop-blur-sm'>
                    <div className='flex flex-col items-center gap-2'>
                      <div className={`border border-zinc-200 bg-white rounded-xl shadow-sm ${fontCls} px-4 py-2 text-sm cursor-pointer hover:bg-zinc-50 transition-colors`}>
                        Choose file
                      </div>
                      <div className='text-xs font-["Medium"] text-zinc-400'>or drag and drop</div>
                    </div>
                  </div>
                  <button type='button' className={`w-full py-3.5 flex justify-center items-center gap-2 rounded-2xl bg-zinc-950 mt-4 text-white ${fontCls} text-sm transition-all hover:bg-zinc-800 active:scale-[0.98]`}>
                    Submit
                    <ArrowRightIcon className='w-4 h-4' />
                  </button>
                </div>
              )}
              {store?.formType === 'Feedback' && (
                <form onSubmit={handleSubmit} className='w-full mt-4'>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder='Share your thoughts...'
                    rows={5}
                    className={`w-full border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-3.5 text-sm font-["Medium"] focus:outline-none resize-none placeholder:text-zinc-400`}
                  />
                  <button type='submit' className={`w-full py-3.5 flex justify-center items-center gap-2 rounded-2xl bg-zinc-950 mt-3 text-white ${fontCls} text-sm transition-all hover:bg-zinc-800 active:scale-[0.98]`}>
                    Submit
                    <ArrowRightIcon className='w-4 h-4' />
                  </button>
                </form>
              )}
            </div>

            {/* Link-in-bio links */}
            <div className={`${store?.linkinbio === false && 'hidden'} space-y-2`}>
              {store?.links?.map((item) => (
                <div className="w-full flex" key={item.id}>
                  {base === 'simple' && (
                    <Simple textColor={store?.baseText} font={store?.font} link={item.link} item={item} color={store?.styleColor} style={store?.style} round={store?.rounded} />
                  )}
                  {base === 'button' && (
                    <Button textColor={store?.baseText} font={store?.font} link={item.link} item={item} color={store?.styleColor} style={store?.style} round={store?.rounded} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commercify badge */}
      {!isSeen && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pointer-events-none">
          <a
            href='https://www.commercifyhq.com'
            className="pointer-events-auto flex items-center gap-2 bg-zinc-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-white/10"
          >
            <img src={logo} className="h-4 w-4 rounded-md" alt="Commercify logo" />
            <span className="font-['Semibold'] text-white text-xs">commercifyhq.com</span>
            <button
              onClick={(e) => { e.preventDefault(); setIsSeen(true); }}
              className="ml-1 text-white/40 hover:text-white/80 transition-colors"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </a>
        </div>
      )}
    </div>
  );
};
