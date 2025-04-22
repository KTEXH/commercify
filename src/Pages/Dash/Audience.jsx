import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import SimpleChart from "../../components/Graphs/AnalyricsGraph";
import { NavBar } from "../../components/NavBar";

export const Audience = ({ className = "" }) => {
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
            <NavBar home={false} analytics={false} audience={true} />

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
                    <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Customers</div>
                    {selectedPage?.storefront ? (
                        <div class='flex w-full bg-white border flex-col rounded-xl'>
                            <div class='flex items-center justify-between px-5 py-3 text-sm font-["Semibold"] border-b'>
                                <div>Name</div>
                                <div>Email</div>
                                <div>Ordered</div>
                                <div>More</div>
                            </div>
                            {data.me.Orders.map(item => (
                                <div class='flex items-center justify-between px-5 py-2 text-sm font-["Semibold"]'>
                                    <div class='flex items-center gap-2'>
                                        <div class='rounded-xl bg-black w-8 text-white font-["Medium"] flex items-center justify-center h-8'>
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>{item.name}</div>
                                    </div>
                                    <div>{item.email}</div>
                                    <div class='flex items-center justify-center'>
                                        <div class='p-2 rounded-xl flex items-center gap-2 border'>
                                            <div class='w-7 h-7 rounded-lg bg-black' />
                                            <div>
                                                <div class='text-xs'>{item.Product.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button class='flex bg-black text-white text-xs font-["Semibold"] px-4 py-2 rounded-full'>More</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div class='flex w-full bg-white border flex-col rounded-xl'>
                            <div class='flex items-center justify-between px-5 py-3 text-sm font-["Semibold"] border-b'>
                                <div class='w-full'>Name</div>
                                <div class='w-full text-center'>Email</div>
                                <div class='w-full text-center'>Ordered</div>
                                <div class='w-full text-end'>More</div>
                            </div>
                            {data.me.Bookings.map(item => (
                                <div class='flex items-center justify-between px-5 py-2 text-sm font-["Semibold"]'>
                                    <div class='flex items-center w-full gap-2'>
                                        <div class='rounded-xl bg-black w-8 text-white font-["Medium"] flex items-center justify-center h-8'>
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>{item.name}</div>
                                    </div>
                                    <div class='text-center w-full'>{item.email ? item.email : 'No Email'}</div>
                                    <div class='flex w-full items-center justify-center'>
                                        <div class='p-2 rounded-xl flex items-center gap-2 border'>
                                            <div class='w-7 h-7 rounded-lg bg-black' />
                                            <div>
                                                <div class='text-xs'>{item.Product.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='w-full items-end justify-end flex'>
                                        <button class='flex bg-black text-white text-xs font-["Semibold"] px-4 py-2 rounded-full'>More</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </main>

                {/* Cookie Policy Notice */}

            </div>
        </div>
    );
}
