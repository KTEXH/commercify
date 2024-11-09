import { Header } from '../../components/Header'
import { NavBar } from '../../components/NavBar'
import React, {useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'



export const Builder = ({ className = "" }) => {

  
    return (
        <div
            className='flex w-full items-start h-full self-stretch flex-col rounded-3xl'
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar pagesNav={true} products={false} builder={true} pages={false} home={false} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Builder
                                </div>
                                <img
                                    className="h-4 w-4 flex-shrink-0"
                                    src="/assets/IconSet21.svg"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div class='px-9 pt-2'>
                            <div class='grid grid-cols-4 gap-3'>
                                <a href='/builder/form' class='p-3 rounded-xl border'>
                                    <div class='text-xs font-["Semibold"]'>Forms</div>
                                    <div class='text-gray-400 text-xs font-["Medium"]'>
                                        Create and customize forms like Contact Forms, Surveys, Registration Forms, and Feedback Forms.
                                    </div>
                                </a>
                                <a href='/builder/linkhandler' class='p-3 rounded-xl border'>
                                    <div class='text-xs font-["Semibold"]'>Link handler</div>
                                    <div class='text-gray-400 text-xs font-["Medium"]'>
                                        Manage and customize links like Bio Links, Shortened URLs, and Product/Service Links.
                                    </div>
                                </a>
                                <a href='/builder/storefront' class='p-3 rounded-xl border'>
                                    <div class='text-xs font-["Semibold"]'>Storefront</div>
                                    <div class='text-gray-400 text-xs font-["Medium"]'>
                                        Create and customize your online storefront to sell products, digital downloads, merchandise, and more.
                                    </div>
                                </a>
                                <a href='/builder/workshop' class='p-3 rounded-xl border'>
                                    <div class='text-xs font-["Semibold"]'>Workshop</div>
                                    <div class='text-gray-400 text-xs font-["Medium"]'>
                                        Create and sell services, catering, barber, and hair services for your audience.
                                    </div>
                                </a>
                            </div>
                            <div className="flex mt-4 gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Pages
                                </div>
                            </div>
                            <div class='w-full h-full flex items-center justify-center flex flex-col'>
                                <div class='font-["Semibold"]'>You have no pages</div>
                                <img src='/assets/95.svg' className='mt-4 w-28 h-28' />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}