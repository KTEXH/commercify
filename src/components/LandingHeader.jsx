import React, { useState } from "react";
import Group from "./assets/Group";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogPanel } from '@headlessui/react'

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 z-50 fixed top-5 left-1/2 -translate-x-1/2 flex items-center justify-between rounded-2xl px-5 py-3 w-[calc(100%-2rem)] max-w-xl shadow-[0_1px_12px_rgba(0,0,0,0.08)]">
            <div className='flex items-center gap-2.5'>
                <Group className='w-6 h-6' />
                <a href='/' className='font-["Semibold"] text-zinc-900 text-sm tracking-tight'>Commercify HQ</a>
            </div>
            <div className='items-center gap-6 md:flex hidden'>
                <a href='/pricing' className='font-["Semibold"] text-zinc-500 hover:text-zinc-900 transition-colors text-sm'>Pricing</a>
                <a href='/login' className='font-["Semibold"] text-zinc-500 hover:text-zinc-900 transition-colors text-sm'>Login</a>
                <a href='/beta' className='font-["Semibold"] bg-zinc-950 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-zinc-800 transition-colors'>Get started</a>
            </div>
            <button className='md:hidden text-zinc-500 hover:text-zinc-900' onClick={() => setMobileMenuOpen(true)}>
                <Bars3Icon className='h-5 w-5' />
            </button>

            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white px-8 py-10 flex flex-col border-l border-zinc-100">
                    <div className="flex items-center justify-between mb-12">
                        <div className='flex items-center gap-2'>
                            <Group className='w-6 h-6' />
                            <span className='font-["Semibold"] text-zinc-900 text-sm'>Commercify HQ</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)} className='text-zinc-400 hover:text-zinc-900'>
                            <XMarkIcon className='w-5 h-5' />
                        </button>
                    </div>
                    <nav className='flex flex-col gap-1'>
                        <a href="/pricing" className='font-["Semibold"] text-zinc-500 hover:text-zinc-900 text-lg py-3 border-b border-zinc-100 transition-colors'>Pricing</a>
                        <a href="/login" className='font-["Semibold"] text-zinc-500 hover:text-zinc-900 text-lg py-3 border-b border-zinc-100 transition-colors'>Login</a>
                        <a href="/beta" className='font-["Semibold"] text-zinc-500 hover:text-zinc-900 text-lg py-3 transition-colors'>Beta</a>
                    </nav>
                    <div className="mt-auto">
                        <a href='/beta' className='font-["Semibold"] w-full bg-zinc-950 text-white text-sm px-4 py-3 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors'>
                            Get started free
                        </a>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
