import React, { useState, useEffect } from "react";
import { getRequestHost } from '../../Utils/getRequestedHost';
import { useQuery, gql, useMutation } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg'
import Group from "../../components/assets/Group";
const GET_STORE_BY_SUBDOMAIN = gql`
  query GetStoreBySubdomain($subdomain: String!) {
    storeBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      storefrontPass
      storefrontIsPasscode
    backgroundColor
    newsletterSection
    font
    description
    componentColor
    headingColor
    subTextColor
    embeddedLink
    featuredSection
    socialsSection
    actionButton
    actionButtonText
    headerText
    secondaryText
    instagramShown
    tiktokShown
    facebookShown
    twitterShown
    instagram
    newsletterImage
    facebook
    tiktok
    twitter
    subscribeText
    subscribeSubText
    headerImage
    secondaryImage
    subText
    linksSection
    template
    user{
    id
    Services{
    id 
    thumbnail
    title
    price
    description
    }
    OnlyProducts{
    id
    thumbnail
    title
    price
    description
    }
}
    }
  }
`;

export const Storefront = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { type, host } = getRequestHost();

  const { data, loading: queryLoading, error: queryError } = useQuery(
    type === 'subdomain' && GET_STORE_BY_SUBDOMAIN,
    { variables: { subdomain: host } }
  );

  useEffect(() => {
    if (data) {
      setStore(type === 'subdomain' && data.storeBySubdomain);
      setLoading(false);
    }
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    }
    console.log(data)
  }, [data, queryError, type]);

  if (loading || queryLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (queryError) {
    return <di>{queryError.message}</di>
  }

  if (!store) {
    return <div>No store found</div>;
  }

  return (
    <div class='flex flex-col min-h-screen h-full'>
      <div class={`${store?.storefrontIsPasscode === true && 'hidden'} min-h-full flex flex-col px-7 py-10 pt-20 min-h-screen`} style={{ backgroundColor: store?.backgroundColor }}>
        <div class='mx-auto w-full max-w-md items-center flex flex-col'>
          {store?.headerImage ? (
            <img src={store?.headerImage} class='rounded-full mx-auto w-24 h-24' />
          ) : (
            <div className="bg-sky-100 flex text-xl items-center justify-center font-['Semibold'] capitalize rounded-full w-24 h-24">
              {store?.subdomain.charAt(0)}
            </div>
          )}
          <div class='text-center mt-3'>
            <div class='text-lg font-["Bold"]' style={{ color: store?.headingColor }}>{store?.headerText}</div>
            <div class='font-["Medium"] px-3 text-sm pb-2' style={{ color: store?.subTextColor }}>{store?.subText || store?.secondaryText}</div>
          </div>
          <div class='w-full my-3 space-y-2'>
            {store?.storefront === true ? store?.user?.OnlyProducts?.map : store?.user?.Services?.map(item => (
              <div class='border p-3 flex w-full flex-col gap-2 w-full rounded-2xl'>
                <div class='flex flex-row items-center w-full gap-2'>
                  {!item.thumbnail ? (
                    <div class='w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-sm font-["Semibold"] bg-sky-100'>
                      {item.title.charAt(0)}
                    </div>
                  ) : (
                    <img />
                  )}
                  <div class=''>
                    <div class='font-["Semibold"] text-xs'>{item.title}</div>
                    <div class='font-["Medium"] text-xs mt-[2px] text-gray-400 line-clamp-3'>{item.description}</div>
                    

                  </div>
                </div>
                <button class='bg-black w-full text-center py-2 rounded-full text-[11px] text-white font-["Semibold"]'>Buy</button>
              </div>
            ))}
          </div>
          <div class='bg-gray-100 px-4 py-2 flex items-center gap-2 rounded-full'>
            <Group className='w-4 h-4' />
            <div className="font-['Semibold'] text-[10px] text-black">Commercify</div>
          </div>
        </div>

      </div>
    </div>
  )
}