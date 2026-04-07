import { useState, useEffect } from "react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Banner, Add } from "./Home";

export const Settings = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [selectedPage, setSelectedPage] = useState(null);

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
    }, [data, selectedPage]);

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>

    const SettingRow = ({ label, description, action, last = false }) => (
        <div className={`flex items-center justify-between px-5 py-4 ${!last ? 'border-b border-zinc-100' : ''}`}>
            <div>
                <div className='text-sm font-["Semibold"] text-zinc-900'>{label}</div>
                {description && <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>{description}</div>}
            </div>
            {action}
        </div>
    );

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <Banner />
            <div className="flex flex-1 bg-[#F2F2F7] overflow-hidden">
                <div className='w-12 flex flex-col pt-3 pb-3 items-center gap-2.5 bg-white border-r border-zinc-100'>
                    {data.me.Pages.map(item => (
                        <div key={item.id} className="relative flex items-center">
                            {selectedPage?.id === item.id && (
                                <div className="absolute left-[40px] top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-950 rounded-full" />
                            )}
                            <img
                                onClick={() => setSelectedPage(item)}
                                className={`h-7 w-7 rounded-lg cursor-pointer transition-all object-cover ${selectedPage?.id === item.id ? 'ring-2 ring-zinc-950 ring-offset-1 ring-offset-white' : 'opacity-30 hover:opacity-80'}`}
                                src={!item?.headerImage ? logo : item?.headerImage}
                            />
                        </div>
                    ))}
                    <Add />
                </div>

                <NavBar home={false} settings={true} workshop={selectedPage?.workshop} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center px-5 shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">{selectedPage?.name}</span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6">
                        <div className='mb-5'>
                            <h1 className='font-["Semibold"] text-xl text-zinc-950 tracking-tight'>Settings</h1>
                            <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>Manage your page preferences.</p>
                        </div>

                        <div className='flex flex-col gap-4 max-w-xl'>
                            {/* General */}
                            <div>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2 px-1'>General</div>
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    <div className='px-5 py-4 border-b border-zinc-100'>
                                        <label className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest block mb-2'>Page name</label>
                                        <input
                                            defaultValue={selectedPage?.name}
                                            className='w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-["Medium"] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all'
                                        />
                                    </div>
                                    <div className='px-5 py-4'>
                                        <label className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest block mb-2'>Subdomain</label>
                                        <div className='flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 focus-within:ring-2 focus-within:ring-zinc-900 transition-all'>
                                            <span className='px-3 py-2.5 text-xs font-["Semibold"] text-zinc-400 border-r border-zinc-200 shrink-0 bg-zinc-100'>cmhq.me/</span>
                                            <input defaultValue={selectedPage?.subdomain}
                                                className='flex-1 px-3 py-2.5 text-sm font-["Medium"] text-zinc-900 bg-transparent focus:outline-none' />
                                        </div>
                                    </div>
                                </div>
                                <button className='mt-3 w-full bg-zinc-950 text-white py-3 rounded-2xl font-["Semibold"] text-sm hover:bg-zinc-800 transition-colors'>
                                    Save changes
                                </button>
                            </div>

                            {/* Custom domain */}
                            <div>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2 px-1'>Domain</div>
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    <SettingRow
                                        label={<span className='flex items-center gap-2'>Custom domain <span className='text-[9px] font-["Semibold"] text-violet-600 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5 uppercase tracking-wide'>Plus</span></span>}
                                        description="Use your own domain (e.g. yourstore.com)"
                                        last
                                        action={
                                            <button className='bg-zinc-950 text-white px-4 py-2 rounded-xl font-["Semibold"] text-xs hover:bg-zinc-800 transition-colors shrink-0'>
                                                Upgrade
                                            </button>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Danger zone */}
                            <div>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2 px-1'>Danger zone</div>
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    <SettingRow
                                        label="Take page offline"
                                        description="Temporarily hide your page from visitors."
                                        action={
                                            <button className='text-xs font-["Semibold"] text-zinc-600 bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors shrink-0'>
                                                Disable
                                            </button>
                                        }
                                    />
                                    <SettingRow
                                        label={<span className='text-red-500'>Delete page</span>}
                                        description="Permanently remove this page and all its data."
                                        last
                                        action={
                                            <button className='text-xs font-["Semibold"] text-white bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition-colors shrink-0'>
                                                Delete
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
