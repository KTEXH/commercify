import { useQuery, gql } from '@apollo/client';
import group2 from '../../../public/assets/Group2.svg';
import { useParams } from "react-router-dom";
import { useMemo, useState } from 'react';
import { BackdropSimple, Button, Description, Simple } from '../../Pages/Pages/Builder';
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import logo from '../../components/assets/logo.png';
import verified from '../../components/assets/twitterverified.png';
import clsx from 'clsx';

const GET_LINK_BY_SUBDOMAIN = gql`
  query storeBySubdomain($subdomain: String!) {
    storeBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      name
      headerText
      description
      subText
      style
      styleColor
      base
      rounded
      headerImage
      user {
        id
        verified
        Links {
          id
          linkText
          link
          image
        }
        Products {
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
  const [isSeen, setIsSeen] = useState(false);
  const { subdomain } = useParams();
  const { loading, error, data } = useQuery(GET_LINK_BY_SUBDOMAIN, {
    variables: { subdomain },
  });

const store = useMemo(() => data?.storeBySubdomain, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!store) return <div>No store found</div>;

  const style = store.style
  const base = store.base



  return (
    <div className="flex flex-col min-h-screen px-5 mb-20 relative max-w-xl mx-auto w-full">
      <div className="absolute top-5 right-5 rounded-full flex items-center justify-center w-10 h-10 bg-black bg-opacity-10">
        <EllipsisHorizontalIcon className="w-4 h-4 text-white" />
      </div>

      <div className="max-w-md w-full mt-20 flex flex-col items-center mx-auto">
        <img
          src={store.headerImage}
          loading="lazy"
          className={clsx(
            'w-28 h-28 rounded-full',
          )}
          alt="Store header"
        />

        <div className="text-center mt-6">
          <div className="text-xl text-black flex items-center gap-1 font-['Semibold']">
            {store.headerText}
            <img
              src={verified}
              className={clsx(store.user?.verified ? 'w-5 h-5' : 'hidden')}
              alt="Verified badge"
            />
          </div>
          <div className="text-gray-400 mt-1 max-w-sm text-center">
            {store.description}
          </div>
        </div>

        <div className="mt-5 w-full">
          {store.user?.Products?.length > 0 && (
            <div className={clsx(store.storefront ? 'flex flex-col gap-4' : 'hidden')}>
              {store.user.Products.map((item) => (
                <div className="w-full flex" key={item.id}>
                  {base === 'simple' && (<Simple item={item} color={store?.styleColor} style={store?.style} round={store?.rounded}/>)}
                  {base === 'desc' && <Description item={item} />}
                  {base === 'button' && <Button item={item}/>}
                </div>
              ))}
            </div>
          )}

          {store.user?.Links?.map((item) => (
            <div className="w-full flex" key={item.id}>
              {base === 'simple' && (
                <div className="w-full">
         
                   <Simple item={item} color={store?.styleColor} style={store?.style} round={store?.rounded}/>
        
                </div>
              )}
            </div>
          ))}
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
  );
};
