import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { ArrowRightIcon, CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Tab, TabGroup, TabList, TabPanel } from "@headlessui/react";

export const Products = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);

    const categories = [
        { name: 'Products' },
        { name: 'Services' }
    ]

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
            <NavBar home={false} products={true} storefront={selectedPage?.storefront} />

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
                <main className="p-6 px-16 flex-1">
                    <div class='flex items-center mt-7 justify-between w-full'>
                        <div class='font-["Semibold"] mb-3 text-3xl'>{selectedPage?.storefront === true ? 'Products' : 'Services'}</div>
                        <div>
                            <button class='bg-black flex items-center gap-2 px-4 p-2 rounded-full text-white font-["Semibold"]'>Create Product
                                <ArrowRightIcon class='w-5 h-5' />
                            </button>

                        </div>
                    </div>
                    <div>
                        {selectedPage?.storefront === true ? (
                    <div class='mt-5 grid grid-cols-2 gap-7'>
                                {data.me.OnlyProducts.map(item => (
                                    <div class='w-full rounded-xl flex items-center bg-white justify-between border p-4'>
                                        <div class='flex items-center gap-5'>
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} />
                                            ) : (
                                                <div class='w-16 h-16 rounded-2xl bg-black' />
                                            )}

                                            <div class='w-2/3'>
                                                <div class='font-["Semibold"]'>{item.title}</div>
                                                <div class='line-clamp-1 font-["Medium"] text-gray-400 text-sm'>{item.description}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center gap-3'>
                                            <button class='text-sm bg-gray-200 text-black font-["Semibold"] px-5 py-2 rounded-full'>Options</button>
                                            <button class='px-5 py-2 rounded-full text-white font-["Semibold"] bg-black text-sm'>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div class='mt-5 grid grid-cols-2 gap-7'>
                                {data.me.Services.map(item => (
                                    <div class='w-full rounded-xl flex items-center justify-between border p-4'>
                                        <div class='flex items-center gap-5'>
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} />
                                            ) : (
                                                <div class='w-16 h-16 rounded-2xl bg-black' />
                                            )}

                                            <div class='w-2/3'>
                                                <div class='font-["Semibold"]'>{item.title}</div>
                                                <div class='line-clamp-1 font-["Medium"] text-gray-400 text-sm'>{item.description}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center gap-3'>
                                            <button class='text-sm bg-gray-200 text-black font-["Semibold"] px-5 py-2 rounded-full'>Options</button>
                                            <button class='px-5 py-2 rounded-full text-white font-["Semibold"] bg-black text-sm'>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
