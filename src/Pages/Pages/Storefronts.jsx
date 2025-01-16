import React from 'react'
import { Header } from "../../components/Header";
import { NavBar } from "../../components/NavBar";
import { ME_QUERY } from '../../Data/Me';
import { useQuery } from '@apollo/client';

export const Storefronts = ({ }) => {
    const { data, error, loading } = useQuery(ME_QUERY)

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    return (
        <div
            className='flex w-full items-start h-full self-stretch flex-col rounded-3xl'
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar pagesNav={true} products={true} pages={false} builder={false} home={false} analytics={false} bookings={false} orders={false} />
                   
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div className="flex items-end self-stretch px-8 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Storefronts
                                </div>
                                <img
                                    className="h-4 w-4 flex-shrink-0"
                                    src="/assets/IconSet21.svg"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div class='h-full px-7 w-full flex-col flex'>
                            <div class='w-full border p-10 rounded-xl flex-col mt-3 flex items-center justify-center'>
                                <img src='/assets/95.svg' class='w-32 h-32 p-5 border-b' />
                                <a href='/builder/storefront' class='bg-black text-white px-4 py-2 rounded-xl text-sm font-["Semibold"]'>Build a Storefront</a>
                            </div>
                            <div class='flex flex-col mt-3'>
                                <div class='text-xs font-["Semibold"]'>Overview</div>
                                <div class='py-3'>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}