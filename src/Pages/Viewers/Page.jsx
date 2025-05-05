import { useQuery, gql } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg'
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { BackdropSimple, Button, Description, Simple } from '../../Pages/Pages/Builder';
import { EllipsisVertical } from 'lucide-react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
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
        <div class='flex flex-col min-h-screen px-5 relative max-w-md mx-auto h-full w-full'>
            <div class='absolute top-5 left-5 rounded-full text-white bg-black bg-opacity-10 text-sm px-5 py-2 font-["Semibold"]'>
                {store?.user?.verified === true ? 'Verified' : 'user'}
            </div>
            <div class='absolute top-5 right-5 rounded-full flex items-center justify-center w-10 h-10 bg-black bg-opacity-10'>
                 <EllipsisHorizontalIcon class='w-4 h-4 text-white' />
            </div>
            <div class='max-w-md flex items-center justify-center flex w-full mt-20 flex-col mx-auto'>
                <img src={store?.headerImage} style={{ boxShadow: store?.backdrop && '4px 4px 0px 0px'}} class={`w-28 h-28 ${store?.backdrop && ('border-2 border-black')} rounded-full`} />

                <div class='text-center mt-6'>
                    <div class='text-xl text-black flex items-center gap-1 font-["Semibold"]' style={{}}>{store?.headerText} <img src={verified} class={`${store?.user?.verified === true ? 'w-6 h-6' : 'hidden'}`} /></div>
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
            </div>
        </div>
    )
}