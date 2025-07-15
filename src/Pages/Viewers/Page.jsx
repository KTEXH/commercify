import { useQuery, gql, useMutation } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg';
import { useParams } from "react-router-dom";
import React, { useMemo, useState } from 'react';
import { Button, Description, Simple } from '../../Pages/Pages/Builder';
import { ArrowRightIcon, EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { BellAlertIcon, BellIcon } from '@heroicons/react/24/outline'
import logo from '../../components/assets/logo.png';
import verified from '../../components/assets/twitterverified.png';
import clsx from 'clsx';
import flag from '../../components/assets/united-states.png'

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
      // Optionally reset the form or show success message
    } catch (err) {
      console.error(err)
    }
  }

  const store = useMemo(() => data?.storeBySubdomain, [data]);

  if (loading) return <div></div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!store) return <div>No store found</div>;

  const style = store?.style
  const base = store?.base
  const font = store?.font
  const rounded = store?.rounded
  const styleColor = store?.styleColor
  const baseText = store?.baseText
  const grid = store?.grid


  return (
    <div style={{ backgroundColor: store?.backgroundColor }} class='w-full'>
      <div className={`flex flex-col min-h-screen px-5 mb-20 relative max-w-xl mx-auto w-full`}>
        <div className="absolute top-5 right-5 rounded-full flex items-center justify-center w-11 h-11 bg-black bg-opacity-10">
          <EllipsisHorizontalIcon className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-5 left-5 rounded-full flex items-center justify-center w-11 h-11 bg-black bg-opacity-10">
          <BellAlertIcon className="w-4 h-4 text-white" />
        </div>
        <div className={`max-w-md w-full mt-20 flex flex-col items-center mx-auto`}>
          <img
            src={store?.secondaryImage}
            loading="lazy"
            className={clsx(
              'w-28 h-28 rounded-full',
            )}
            alt="Store header"
          />

          <div className="text-center mt-6">
            <div style={{ color: store?.textColor }} className={`text-xl justify-center text-black ${font === 'Cascadia' && 'font-["CSemibold"]'} ${font === 'Rubrik' && 'font-["RSemibold"]'} ${font === 'General-Sans' && 'font-["Semibold"]'}  flex items-center gap-1`}>
              <div>{store.headerText}</div>
              <img
                src={verified}
                className={`${store?.verified ? 'w-5 h-5' : 'hidden'}`}
                alt="Verified badge"
              />
            </div>
            <div style={{ color: store?.textColor }} className={`mt-1 max-w-sm ${font === 'Cascadia' && 'font-["CMedium"]'} ${font === 'Rubrik' && 'font-["RMedium"]'} ${font === 'General-Sans' && 'font-["Medium"]'}  text-center`}>
              {store.description}
            </div>
          </div>

          <div className="w-full">
            {store?.user?.OnlyProducts?.length > 0 && (
              <div className={clsx(store?.storefront ? 'flex flex-col gap-4' : 'hidden')}>
                <div class='w-full'>
                  <div class={`mt-7 space-y-2 ${base === 'descripion' && 'hidden'}  w-full`}>
                    {store?.user?.OnlyProducts?.map(item => (
                      <div class='w-full flex'>
                        {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                        {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}

                      </div>
                    ))}
                  </div>
                  <div class={`${grid === false ? 'flex flex-col' : 'grid grid-cols-2'} ${base === 'button' && 'hidden'} gap-2 w-full`}>
                    {store?.user?.OnlyProducts?.map(item => (
                      <div class='w-full'>
                        {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 w-full">
              {store.user?.Services?.length > 0 && (
                <div className={clsx(store.workshop ? 'flex flex-col gap-4' : 'hidden')}>
                  <div class='w-full'>
                    <div class={`mt-7 space-y-2 ${base === 'descripion' && 'hidden'}  w-full`}>
                      {store?.user?.Services?.map(item => (
                        <div class='w-full flex'>
                          {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                          {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}

                        </div>
                      ))}
                    </div>
                    <div class={`${grid === false ? 'flex flex-col' : 'grid grid-cols-2'} ${base === 'button' && 'hidden'} gap-2 w-full`}>
                      {store?.user?.Services?.map(item => (
                        <div class='w-full'>
                          {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div class={`${store?.form === false && 'hidden'}`}>
              {store?.formType === 'Contact' && (
                <form onSubmit={handleSubmit} class='w-full px-3 mt-8'>
                  <div class='grid grid-cols-2 gap-3'>
                    <div class='w-full'>
                      <div class='text-sm font-["Semibold"]'>Name</div>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder='John Doe' class='px-4 py-3 shadow-sm mt-2 border font-["Medium"] rounded-full text-sm w-full rounded-full' />
                    </div>
                    <div class='w-full'>
                      <div class='text-sm font-["Semibold"]'>Email</div>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='John@gmail.com' class='px-4 py-3 shadow-sm mt-2 border font-["Medium"] rounded-full text-sm w-full rounded-full' />
                    </div>
                  </div>
                  <div class='w-full mt-5'>
                    <div class='text-sm font-["Semibold"]'>Mobile Number</div>
                    <div class='shadow-sm mt-2 border font-["Medium"] gap-2 rounded-full w-full px-3 flex items-center text-sm'>
                      <div class='py-2 px-3'>
                        <img src={flag} class='h-5 w-5' />
                      </div>
                      <div class='h-12 border-l' />
                      <input value={mobileNumber} type='number' onChange={(e) => setMobileNumber(e.target.value)} placeholder='(123)-456-7890' class='px-5' />
                    </div>
                  </div>
                  <button type='submit' class='w-full py-4 flex justify-center items-center gap-2 rounded-full bg-black mt-5 text-center text-white font-["Semibold"]'>
                    Submit
                    <ArrowRightIcon class='w-5 h-5' />
                  </button>
                </form>
              )}
              {store?.formType === 'Upload' && (
                <div class='w-full px-3'>
                  <div class='font-["Semibold"] mt-5 text-center'>Upload files</div>
                  <div class='h-64 rounded-3xl mt-5 flex items-center justify-center border-dashed border'>
                    <div class='flex text-center border rounded-full shadow-sm font-["Semibold"] px-4 py-2 text-sm'>Upload</div>
                  </div>
                  <div class='w-full py-4 flex justify-center items-center gap-2 rounded-full bg-black mt-5 text-center text-white font-["Semibold"]'>
                    Submit
                    <ArrowRightIcon class='w-5 h-5' />
                  </div>
                </div>
              )}
              {store?.formType === 'Feedback' && (
                <form onSubmit={handleSubmit} class='w-full px-4'>
                  <div class='font-["Semibold"] mt-5 text-center'>Feedback</div>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder='' class='mt-3 outline-0 text-sm p-4 rounded-3xl shadow-sm border w-full' />
                  <button type='submit' class='w-full py-4 flex justify-center items-center gap-2 rounded-full bg-black mt-5 text-center text-white font-["Semibold"]'>
                    Submit
                    <ArrowRightIcon class='w-5 h-5' />
                  </button>
                </form>
              )}
            </div>

            <div class={`${store?.linkinbio === false && 'hidden'} `}>
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

          {!isSeen && (
            <div className="fixed w-full h-48 bottom-0 flex justify-center items-center bg-gradient-to-t from-black via-transparent to-transparent shadow-lg">
              <div className="bottom-6 fixed justify-center items-center flex flex-col space-y-3">
                <div className="bg-black px-3 py-3 rounded-full flex items-center space-x-2">
                  <img src={logo} className="h-4 w-4" alt="Commercify logo" />
                  <div className="font-['Semibold'] text-white text-xs">
                    commercifyhq.com
                  </div>
                  <XMarkIcon
                    onClick={() => setIsSeen(false)}
                    className="w-4 h-4 ml-3 cursor-pointer text-gray-500"
                  />
                </div>
                <div className="text-xs text-white font-['Semibold']">
                  Get started with Commercify today!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
