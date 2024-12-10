import { useState } from 'react'
import { NavBar } from '../../components/NavBar'
import { Header } from '../../components/Header'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react'
import { ME_QUERY } from '../../Data/Me'
import { useQuery } from '@apollo/client'

export const Pages = ({ className = "" }) => {

    const { data, error, loading } = useQuery(ME_QUERY)

    const Tabs = [
        'Forms',
        'Storefronts',
        'Link-in-bios',
        'Workshops'
    ]

    const allStorefronts = data?.me?.allStorefronts
    const linkInBios = data?.me?.Linkinbios

    const combinedArrays = allStorefronts?.concat(linkInBios);

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    return (
        <div
            className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar products={false} pagesNav={false} pages={true} home={false} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        {combinedArrays === 0 ? (
                            <div class='h-full with full flex'>
                                <div class='w-full flex flex-col justify-center items-center h-full'>
                                    <div class='font-["Semibold"] mb-2'>No Pages Created</div>
                                    <img src='/assets/74.svg' class='w-40 p-5 border-b' />
                                    <div class='text-black my-4 font-["Medium"] '>
                                        You should create one
                                    </div>
                                    <a href='/builder' class='px-4 py-2 rounded-md bg-black text-white font-["Semibold"] gap-2 text-sm flex items-center'>
                                        Create a page
                                        <img src='/assets/Plus2.svg' class='w-4 h-4' />
                                    </a>

                                </div>
                            </div>
                        ) : (
                            <TabGroup className='px-7 py-3'>
                                <div class='text-2xl font-["Semibold"] mb-4'>Pages</div>
                                <TabList class='inline-flex items-center bg-gray-100 mt-2 p-1 space-x-2 rounded-lg '>
                                    {Tabs.map(item => (
                                        <Tab
                                            key={item}
                                            className="rounded-full py-1 px-3 text-xs font-['Semibold'] text-black focus:outline-none data-[selected]:bg-white data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                        >
                                            {item}
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
                        )}




                    </div>
                </div>
            </div>
        </div>
    )
}