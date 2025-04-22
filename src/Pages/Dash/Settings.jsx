import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";

export const Settings = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);

    const [selectedPage, setSelectedPage] = useState(null);

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <div className="flex h-screen bg-gray-50">
            <div class='w-16 mt-5 flex flex-col space-y-3 items-center'>
                {data.me.Pages.map(item => (
                    <div key={item.id} className="relative flex items-center">
                        {/* Left curved indicator */}
                        {selectedPage?.id === item.id && (
                            <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-3 h-5 bg-white border-l border-t border-b rounded-l-lg"
                            ></div>
                        )}
                        <img key={item.id} onClick={() => setSelectedPage(item)} class='h-8 rounded-lg' src={!item?.headerImage ? logo : item?.headerImage} />
                    </div>
                ))}
                <div class='flex items-center h-8 w-8 shadow-sm rounded-lg border justify-center'>
                    <PlusIcon class='w-4 h-4 text-black' />
                </div>
            </div>
            <NavBar home={false} settings={true} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="flex justify-between border-b items-center px-6 py-4 bg-white">
                    <div class='flex items-center gap-2'>
            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                        <span className="text-lg font-['Semibold'] text-sm">{selectedPage?.name} • commercifyhq.com/{selectedPage?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell className="text-gray-600" />
                        <User className="text-gray-600" />
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6 px-32 flex-1">
                    <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Settings</div>
                    <div class='rounded-xl bg-white w-full mt-5 p-10 border'>
                        <div class='font-["Semibold"] text-black text-sm'>Account settings</div>
                        <div class='font-["Medium"] text-sm text-gray-400'>Default settings and info for you account.</div>
                        <div class='mt-7 flex w-full items-center gap-5'>
                            <div class='w-full'>
                                <div class='font-["Medium"]'>Page name</div>
                                <input value={selectedPage?.name} class='px-4 mt-3 font-["Medium"] w-full text-sm py-2 border rounded-md' />
                            </div>
                            <div class='w-full'>
                                <div class='font-["Medium"]'>Website URL</div>
                                <input value={selectedPage?.name} class='px-4 mt-3 font-["Medium"] w-full text-sm py-2 border rounded-md' />
                            </div>
                        </div>
                        <div class='mt-14 space-y-2'>
                          <div class='font-["Semibold"] flex gap-2 items-center'>
                            Custom domain
                             <div class='px-2 py-1 text-[10px] text-green-600 bg-green-100 rounded-lg border border-green-400'>Pro</div>
                            </div>
                          <div class='font-["Medium"] text-gray-400 text-sm'>You can use your own domain for your landing page.</div>
                            <div class='px-5 py-3 text-white inline-block font-["Semibold"] text-sm bg-black rounded-full'>Upgrade to Pro</div>
                        </div>
                        <div class='mt-14 space-y-2'>
                          <div class='font-["Semibold"]'>Take page offline</div>
                          <div class='font-["Medium"] text-gray-400 text-sm'>You can use your own domain for your landing page.</div>
                            <div class='px-5 py-3 text-white inline-block font-["Semibold"] text-sm bg-black rounded-full'>Disable your page</div>
                        </div>
                        <div class='mt-14 space-y-2'>
                          <div class='font-["Semibold"]'>Delete page</div>
                          <div class='font-["Medium"] text-gray-400 text-sm'>You can use your own domain for your landing page.</div>
                            <div class='px-5 py-2 text-white inline-block font-["Semibold"] text-sm bg-red-500 rounded-full'>Delete your page</div>
                        </div>
                    </div>

                </main>

                {/* Cookie Policy Notice */}

            </div>
        </div>
    );
}
