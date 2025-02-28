import React, { useState } from 'react'
import { Header } from './LandingHeader'
import Group from './assets/Group'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { DialogPanel, Dialog } from '@headlessui/react'

export const Beta = () => {


    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div class='bg-[#111111] flex flex-col h-screen'>
            <div class='lg:max-w-screen-lg lg:mx-auto h-full mx-5 flex  flex-col'>
                <div class="bg-gray-600  overflow-hidden z-10 bg-opacity-65 backdrop-blur-md md:w-full w-96 sm:max-w-xl fixed top-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 mx-2 sm:mx-auto flex items-center justify-between rounded-full px-4 sm:px-6 p-4 overflow-x-auto">
                    <div class='flex items-center gap-2'>
                        <Group className='w-7 h-7' />
                        <div class='font-["Semibold"] text-white'>Commercify HQ</div>
                    </div>
                    <div class='items-center gap-7 md:flex hidden text-white font-["Semibold"] text-sm'>
                        <a href='/pricing'>Pricing</a>
                        <a href='/login'>Login</a>
                    </div>
                    <div class='sm:flex md:hidden'>
                        <Bars3Icon onClick={() => setMobileMenuOpen(true)} class='text-black h-5' />
                        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                            <div className="fixed inset-0 z-10" />
                            <DialogPanel className="fixed inset-y-0 top-10 rounded-t-2xl flex flex-col justify-center items-center right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                                <div class='flex flex-col relative items-center ustify-center'>
                                    <div className="fixed items-center justify-center flex flex-col top-16">
                                        <Group className='w-7 h-7' />

                                    </div>
                                    <div className="mt-6 flow-root">
                                        <div className="-my-6">


                                            <a
                                                href="/pricing"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-center text-3xl font-['Semibold'] text-gray-900 hover:bg-gray-50"
                                            >
                                                Pricing
                                            </a>

                                            <a
                                                href="/socials"
                                                className="-mx-3 mb-5 block rounded-lg px-3 py-2 text-center text-3xl font-['Semibold'] text-gray-900 hover:bg-gray-50"
                                            >
                                                Socials
                                            </a>
                                            <div className="pb-3 flex flex-col gap-2">

                                                <a
                                                    href="/beta"
                                                    className="-mx-3 inline-block rounded-full text-white bg-black px-5 py-4 text-xl font-['Semibold']"
                                                >
                                                    Get started with beta
                                                </a>
                                                <a
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    href="#"
                                                    className="-mx-3 inline-block rounded-full text-black bg-gray-100 text-center px-5 py-4 text-xl font-['Semibold']"
                                                >
                                                    Close
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </Dialog>
                    </div>
                </div>
                <div class='mt-32 flex justify-center text-white flex-col'>
                    <div class='text-6xl font-["Semibold"]'>Get started with Beta</div>
                </div>
            </div>
        </div>
    )
}