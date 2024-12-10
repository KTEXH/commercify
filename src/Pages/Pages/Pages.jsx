import React, { useState } from 'react'
import { Header } from "../../components/Header";
import { NavBar } from "../../components/NavBar";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ME_QUERY } from '../../Data/Me';
import { useQuery } from '@apollo/client';

export const Pages = ({ }) => {

    const { data, error, loading } = useQuery(ME_QUERY)

    const otherTabs = [
        { name: 'Forms' },
        { name: 'Storefronts' },
        { name: 'Link-in-bios' },
        { name: 'Workshops' }
    ]


    const allStorefronts = data?.me?.allStorefronts
    const linkInBios = data?.me?.Linkinbios

    const combinedArrays = allStorefronts?.concat(linkInBios);

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    return (
        <div
            className='flex w-full items-start h-full self-stretch flex-col rounded-3xl'
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar pagesNav={true} products={false} builder={false} pages={false} home={true} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        
                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Pages
                                </div>
                                <img
                                    className="h-4 w-4 flex-shrink-0"
                                    src="/assets/IconSet21.svg"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div class='w-full flex flex-col px-9 p-2'>
                            <div class='w-full border p-10 rounded-xl flex-col flex items-center justify-center'>
                        
                                <img src='/assets/95.svg' class='w-32 h-32 p-5 border-b' />
                                <a href='/builder' class='bg-black text-white px-4 py-2 rounded-xl text-sm font-["Semibold"]'>Build a Page</a>
                            </div>
                            <div class='w-full mt-4'>
                                <div class='font-["Semibold"] text-sm'>Overview</div>
                                <TabGroup>
                                    <TabList class='inline-flex items-center bg-gray-100 mt-2 p-1 space-x-2 rounded-lg '>
                                        {otherTabs.map(item => (
                                            <Tab
                                                key={item}
                                                className="rounded-full py-1 px-3 text-xs font-['Semibold'] text-black focus:outline-none data-[selected]:bg-white data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                            >
                                                {item.name}
                                            </Tab>
                                        ))}
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel class='grid grid-cols-4 gap-3 py-5'>
                                            {data.me.Forms.map(item => (
                                                <div class='h-52 w-full rounded-xl border'>
                                                    <div>{item.title}</div>
                                                </div>
                                            ))}
                                        </TabPanel>
                                        <TabPanel class='grid grid-cols-4 gap-3 py-5'>
                                            {data.me.Storefront.map(item => (
                                                <div class='h-52 w-full border rounded-xl'>
                                                    <div class='font-["Semibold"] text-xs'>{item.name}</div>
                                                </div>
                                            ))}
                                        </TabPanel>
                                        <TabPanel class='grid grid-cols-4 gap-3 py-5'>
                                            {data.me.Linkinbios.map(item => (
                                                <div class='h-52 w-full border rounded-xl'>
                                                    <div class='font-["Semibold"] text-xs'>{item.name}</div>
                                                </div>
                                            ))}
                                        </TabPanel>
                                        <TabPanel class='grid grid-cols-4 gap-3 py-5'>
                                            {data.me.Workshops.map(item => (
                                                <div class='h-52 w-full'>
                                                    <div class='border w-full h-40 rounded-xl'>

                                                    </div>
                                                    <div class='font-["Semibold"] mt-2 text-xs'>{item.name}</div>
                                                </div>
                                            ))}
                                        </TabPanel>
                                    </TabPanels>
                                </TabGroup>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}