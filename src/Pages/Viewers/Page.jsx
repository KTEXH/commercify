import { useQuery, gql } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg'
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { BackdropSimple, Button, Description, Simple } from '../../Pages/Pages/Builder';
import { EllipsisVertical } from 'lucide-react';
import logo from '../../components/assets/logo.png'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import verified from '../../components/assets/twitterverified.png'
const GET_LINK_BY_SUBDOMAIN = gql`
  query storeBySubdomain($subdomain: String!) {
    storeBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      name
      headerText
      description
      subText
      backdrop
      simple
      desc 
      button
      headerImage
      user{
      id
      verified
      Links{
      id
      linkText
      link
      image
      }
      Products{
      id
      title
      description
      thumbnail
      }
      }
    }
  }
`;

export const Linkinbio = () => {

    const [isSeen, setIsSeen] = useState(false)

    const { subdomain } = useParams()
    const { loading, error, data } = useQuery(GET_LINK_BY_SUBDOMAIN, {
        variables: { subdomain }
    })

    const [store, setStore] = useState(null);

    useEffect(() => {
        if (data) {
            setStore(data.storeBySubdomain);
        }
    }, [data])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    if (!data) {
        return <div>No store found</div>;
    }

    return (
        <div class='flex flex-col min-h-screen px-5 mb-20 relative max-w-xl mx-auto h-full w-full'>
           
            <div class='absolute top-5 right-5 rounded-full flex items-center justify-center w-10 h-10 bg-black bg-opacity-10'>
                 <EllipsisHorizontalIcon class='w-4 h-4 text-white' />
            </div>
            <div class='max-w-md flex items-center justify-center flex w-full mt-20 flex-col mx-auto'>
                <img src={store?.headerImage} class={`w-28 h-28 rounded-full`} />

                <div class='text-center mt-6'>
                    <div class='text-xl text-black flex items-center gap-1 font-["Semibold"]' style={{}}>{store?.headerText} <img src={verified} class={`${store?.user?.verified === true ? 'w-5 h-5' : 'hidden'}`} /></div>
                    <div class='text-gray-400 text-center max-w-sm mt-1'>{store?.description}</div>
                </div>
                <div class='mt-5 w-full'>
                    <div class={`${store?.storefront === true ? 'flex' : 'hidden'}`}>
                        {store?.user?.Products?.map(item => (
                            <div class='w-full flex'>
                                {store?.simple === true && (<div>{store?.backdrop === true ? (<BackdropSimple item={item} />) : (<Simple item={item} />)} </div>)}
                                {store?.description === true && (<Description item={item} />)}
                                {store?.button === true && (<Button item={item} />)}
                            </div>
                        ))}
                    </div>

                    {store?.user?.Links?.map(item => (
                        <div class='w-full flex'>
                                {store?.simple === true && (<div class='w-full'>{store?.backdrop === true ? (<BackdropSimple item={item} />) : (<Simple item={item} />)} </div>)}
                                {store?.description === true && (<Description item={item} />)}
                            {store?.button === true && (<Button item={item} />)}
                        </div>
                    ))}
                    
                </div>
                {isSeen === false && (
                    <div className="fixed space-x-1 w-full h-48 bottom-0 flex justify-center items-center bg-gradient-to-t from-black via-transparent to-transparent shadow-lg">
                        <div className='bottom-6 fixed justify-center items-center flex flex-col'>
                            <div className="bg-black px-3 py-3 rounded-full space-x-2 justify-center items-center inline-flex">
                                <img src={logo} className='h-4 w-4' />
                                <div className="font-['Semibold'] text-white text-xs">commercifyhq.com</div>
                                <XMarkIcon className='w-4 h-4 ml-3 cursor-pointer text-gray-500' />
                            </div>
                            <div className='text-xs text-white mt-3 font-["Semibold"]'>
                                Get started with Commercify today!
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    )
}