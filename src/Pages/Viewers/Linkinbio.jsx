import { useQuery, gql } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg'
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
const GET_LINK_BY_SUBDOMAIN = gql`
  query linkBySubdomain($subdomain: String!) {
    linkBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      headerText
      subText
      User{
      id
      Links{
        id
        linkText
        link
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
            setStore(data.linkBySubdomain);
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
        <div class='flex flex-col min-h-screen h-full w-full'>
            <div class='max-w-md flex items-center justify-center flex-col mx-auto'>
                {store?.headerImage ? (
                    <img src={store?.headerImage} class='rounded-full mx-auto w-24 h-24' />
                ) : (
                    <div className="bg-sky-100 flex text-xl items-center justify-center font-['Semibold'] capitalize rounded-full w-24 h-24">
                        {store?.subdomain.charAt(0)}
                    </div>
                )}
                <div class='text-center mt-3'>
                    <div class='text-lg font-["Bold"]' style={{ color: store?.headingColor }}>{store?.headerText}</div>
                    <div class='font-["Medium"] px-3 text-sm pb-2' style={{ color: store?.subTextColor }}>{store?.subText}</div>
                </div>
                <div class='bg-black px-4 py-2 flex items-center gap-2 rounded-full'>
                    <img src={group2} className='w-5 h-5' />
                    <div className="font-['Semibold'] text-[10px] text-white">Commercify</div>
                </div>
            </div>
        </div>
    )
}