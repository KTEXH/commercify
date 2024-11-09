import React from 'react'
import { Header } from "../../components/Header";
import { NavBar } from "../../components/NavBar";

export const Storefronts = ({ }) => {
    return (
        <div
            className='flex w-full items-start h-full self-stretch flex-col rounded-3xl'
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar pagesNav={true} products={true} pages={false} home={false} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div class='h-full with full flex'>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}