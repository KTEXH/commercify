import React from "react";
import { NavBar } from "../../components/NavBar";
import { Header } from "../../components/Header";

export const Form = ({ }) => {

    return(
        <div
            className='flex w-full items-start h-full self-stretch flex-col rounded-3xl'
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar pagesNav={true} products={false} builder={false} pages={true} home={false} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Forms
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
                                <div class='font-["Semibold"]'>You have no forms</div>
                                <img src='/assets/95.svg' class='w-32 h-32 p-5 border-b' />
                                <a href='/builder/form' class='bg-black text-white px-4 py-2 rounded-xl text-sm font-["Semibold"]'>Build a form</a>
                            </div>
                            <div class='w-full mt-3'>
                                <div class='font-["Semibold"] text-xs'>Overview</div>

                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>

        </div>
    )
}