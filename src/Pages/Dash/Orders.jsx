import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
export const Orders = ({ className = "" }) => {
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
            <NavBar home={false} storefront={selectedPage?.storefront} orders={true} />

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
                    <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>{selectedPage?.storefront ? 'Orders' : 'Bookings'}</div>
                    {selectedPage?.storefront ? (
                        <div class='mt-5 border bg-white rounded-lg'>
                            <div class='flex items-center px-5 py-3 font-["Semibold"] text-sm justify-between'>
                                <div class='w-full'>Product</div>
                                <div class='w-full justify-center flex'>Customer</div>
                                <div class='w-full justify-center flex'>Status</div>
                                <div class='w-full justify-end flex'>Options</div>
                            </div>
                            <div class={`p-5 ${data?.me?.Orders.length === 0 ? 'p-0' : 'p-5 border-t'} items-center space-y-3 w-full justify-between`}>
                                {data?.me?.Orders?.map(item => (
                                    <div class='flex items-center w-full justify-between'>
                                        <div class='flex items-center gap-2 w-full'>
                                            <img src={!item.Product.thumbnail ? logo : item.Product.thumbnail} className='w-10 h-10 rounded-md' />
                                            <div>
                                                <div class='font-["Semibold"] text-sm'>{item?.Product?.title}</div>
                                            </div>
                                        </div>

                                        <div class='flex items-center w-full flex gap-2 items-center justify-center'>
                                            <div class='bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center font-["Semibold"] text-sm'>
                                                {item.name.charAt(0)}
                                            </div>
                                            <div class='w-2/3'>
                                                <div class='text-xs font-["Semibold"]'>{item.name}</div>
                                                <div class='text-xs font-["Medium"] text-gray-400'>{item.email}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center w-full justify-center'>
                                            <div class='text-green-600 bg-green-100 font-["Semibold"] text-xs px-4 py-2 rounded-full'>{item.fulfilled === true ? 'Fulfilled' : 'Unfulfilled'}</div>
                                        </div>
                                        <div class='w-full justify-end flex items-center'>
                                            <button class='bg-black px-4 py-2 rounded-full text-white text-xs font-["Semibold"]'>Fulfill</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div class='mt-5 border bg-white rounded-lg'>
                            <div class='flex items-center px-5 py-3 font-["Semibold"] text-sm justify-between'>
                                <div class='w-full'>Service</div>
                                <div class='w-full justify-center flex'>Customer</div>
                                <div class='w-full justify-center flex'>Status</div>
                                <div class='w-full justify-end flex'>Options</div>
                            </div>
                            <div class={`p-5 ${data?.me?.Orders.length === 0 ? 'p-0' : 'p-5 border-t'} items-center space-y-3 w-full justify-between`}>
                                {data?.me?.Bookings?.map(item => (
                                    <div class='flex items-center w-full justify-between'>
                                        <div class='flex items-center gap-2 w-full'>
                                            <img src={!item.Product.thumbnail ? logo : item.Product.thumbnail} className='w-10 h-10 rounded-md' />
                                            <div>
                                                <div class='font-["Semibold"] text-sm'>{item?.Product?.title}</div>
                                            </div>
                                        </div>

                                        <div class='flex items-center w-full flex gap-2 items-center justify-center'>
                                            <div class='bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center font-["Semibold"] text-sm'>
                                                {item.name.charAt(0)}
                                            </div>
                                            <div class='w-2/3'>
                                                <div class='text-xs font-["Semibold"]'>{item.name}</div>
                                                <div class='text-xs font-["Medium"] text-gray-400'>{item.email}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center w-full justify-center'>
                                            <div class='text-green-600 bg-green-100 font-["Semibold"] text-xs px-4 py-2 rounded-full'>{item.fulfilled === true ? 'Fulfilled' : 'Unfulfilled'}</div>
                                        </div>
                                        <div class='w-full justify-end flex items-center'>
                                            <button class='bg-black px-4 py-2 rounded-full text-white text-xs font-["Semibold"]'>Fulfill</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                   

                </main>

                {/* Cookie Policy Notice */}

            </div>
        </div>
    );
}
