import React, { useEffect, useState } from 'react'
import { NavBar } from '../../components/NavBar'
import { Header } from '../../components/Header'
import Group from '../../components/assets/Group'
import { DialogPanel, Dialog } from '@headlessui/react'

export const Pages = ({ className = "" }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [formOpen, setFormsOpen] = useState(false)

    const handleForms = () => {
        setFormsOpen(true)
        setIsOpen(false)
    }

    return (
        <div
            className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar products={false} pagesNav={false} pages={true} home={false} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
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
                       


                    </div>
                </div>
            </div>
        </div>
    )
}