import { useQuery, gql } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg'
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Button, Description, Simple } from '../../Pages/Pages/Builder';
const GET_LINK_BY_SUBDOMAIN = gql`
  query storeBySubdomain($subdomain: String!) {
    storeBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      name
      headerText
      description
      subText
      simple
      desc 
      button
      headerImage
      user{
      id
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
        <div class='flex flex-col min-h-screen px-5 h-full w-full'>
            <div class='max-w-md flex items-center justify-center flex w-full mt-20 flex-col mx-auto'>
                <img src={store?.headerImage} class='w-28 h-28 rounded-full' />

                <div class='text-center mt-6'>
                    <div class='text-xl text-black font-["Semibold"]' style={{}}>{store?.headerText}</div>
                    <div class='text-gray-400'>{store?.description}</div>
                </div>
                <div class='mt-5 w-full'>
                    <div class={`${store?.storefront === true ? 'flex' : 'hidden'}`}>
                        {store?.user?.Products?.map(item => (
                            <div class='w-full flex'>
                                {store?.simple === true && (<Simple item={item} />)}
                                {store?.description === true && (<Description item={item} />)}
                                {store?.button === true && (<Button item={item} />)}
                            </div>
                        ))}
                    </div>

                    {store?.user?.Links?.map(item => (
                        <div class='w-full flex'>
                            {store?.simple === true && (<Simple item={item} />)}
                            {store?.description === true && (<Description item={item} />)}
                            {store?.button === true && (<Button item={item} />)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}