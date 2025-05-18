import React, { useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { NavBar } from '../../../components/NavBar';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ME_QUERY } from '../../../Data/Me';
import logo from '../../../components/assets/logo.svg'
import { Bell, User } from 'lucide-react';
import { Banner } from '../Home';

const GET_ORDER_DETAILS = gql`
  query Order($id: Int!) {
    Order(id: $id) {
      id
      amount
      Product {
        id
        title
        serviceOrProduct
      }
    }
  }
`;

export const Order = () => {
  const { id } = useParams();
  const numericId = parseInt(id, 10); // Convert to integer



  const { loading: mLoading, error: mError, data: mData } = useQuery(ME_QUERY)

  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    if (mData?.me?.Pages?.length > 0 && !selectedPage) {
      setSelectedPage(mData.me.Pages[0]); // Set first page as default
    }
  }, [mData, selectedPage]);


  const { loading, error, data } = useQuery(GET_ORDER_DETAILS, {
    variables: { id: numericId },
  });

  const product = data?.Order?.Product

  if (loading || mLoading) return <div>loading...</div>
  if (error || mError) return <div>{error.message || mError.message}</div>

  return (
    <div>
      <Banner />
      <div className="flex h-screen bg-gray-50 rounded-t-3xl -mt-5 relative z-20">
        <div class='w-16 mt-5 flex flex-col space-y-3 items-center'>
          {mData.me.Pages.map(item => (
            <div key={item.id} className="relative flex items-center">
              {/* Left curved indicator */}
              {selectedPage?.id === item.id && (
                <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-3 h-5 bg-white border-l border-t border-b rounded-l-lg"
                ></div>
              )}
              <img key={item.id} onClick={() => setSelectedPage(item)} class='h-8 rounded-lg' src={!item?.headerImage ? logo : item?.headerImage} />
            </div>
          ))}
          <div class='flex items-center h-8 w-8 shadow-sm rounded-lg border justify-center'>
            <PlusIcon class='w-4 h-4 text-black' />
          </div>
        </div>
        <NavBar home={false} storefront={selectedPage?.storefront} workshop={selectedPage?.workshop} orders={true} />
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="flex justify-between border-b items-center px-6 py-4 bg-white">
            <div class='flex items-center gap-2'>
              <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
              <span className="text-lg font-['Semibold'] text-sm">{selectedPage?.name} • commercifyhq.com/{selectedPage?.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="text-gray-600" />
              <User className="text-gray-600" />
            </div>
          </header>

          <main class={`p-6 px-16 w-full relative flex h-full flex-col`}>
            <div class='flex justify-between'>
              <div class={`text-2xl ${product?.serviceOrProduct === 'Service' && `hidden`} font-["Semibold"]`}>{product?.serviceOrProduct === 'Product' && `Order #${numericId}`}</div>
              <div class={`text-2xl ${product?.serviceOrProduct === 'Product' && `hidden`} font-["Semibold"]`}>{product?.serviceOrProduct === 'Service' && `Booking Request`}</div>

              <div class='flex items-center'>
                <div class='h-8 w-8 rounded-full bg-black' />
                <div>
                  <div>{product?.title}</div>
                </div>
              </div>
            </div>
            <div class='w-full gap-10 flex mt-7'>
              <div class='w-1/3 rounded-xl flex bg-white h-64'>

              </div>
              <div class='w-2/3 rounded-xl flex bg-white h-64'>

              </div>
            </div>
            <div class='absolute px-5 bottom-0 py-5 w-full justify-start border-t right-0 flex items-center'>
              {product?.serviceOrProduct === 'Product' && (<button class='bg-black text-xl text-white font-["Semibold"] w-full py-3 rounded-full'>Fullfill</button>)}
              {product?.serviceOrProduct === 'Service' && (<button class='bg-black text-xl text-white font-["Semibold"] w-full py-3 rounded-full'>Confirm Booking</button>)}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
