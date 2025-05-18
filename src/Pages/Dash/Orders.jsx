import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import CustomCalendar from "../../components/CustomerCalendar";
import { Banner } from "./Home";
export const Orders = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);

    const [selectedPage, setSelectedPage] = useState(null);
    const navigate = useNavigate();
    const [tab, setTab] = useState('home')

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <div >
            <Banner />
            {/* Curved panel overlapping the banner */}
            <div className="flex h-screen bg-gray-50 rounded-t-3xl -mt-5 relative z-20">
                <div class='w-16 mt-5 flex flex-col space-y-3 items-center'>
                    {data.me.Pages.map(item => (
                        <div key={item.id} className="relative flex items-center">
                            {/* Left curved indicator */}
                            {selectedPage?.id === item.id && (
                                <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-3 h-5 bg-white border-l border-t border-b rounded-l-lg"
                                ></div>
                            )}
                            <img key={item.id} onClick={() => setSelectedPage(item)} class='h-8 rounded-full' src={!item?.headerImage ? logo : item?.headerImage} />
                        </div>
                    ))}
                    <div class='flex items-center h-8 w-8 shadow-sm rounded-lg border justify-center'>
                        <PlusIcon class='w-4 h-4 text-black' />
                    </div>
                </div>
                <NavBar home={false} storefront={selectedPage?.storefront} workshop={selectedPage?.workshop} orders={true} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b items-center px-6 py-4">
                        <div class='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                        <div className="flex items-center gap-4">

                        </div>
                    </div>


                    <main class={`px-16 w-full flex justify-center ${(selectedPage?.storefront || selectedPage?.workshop) === true && 'hidden'} h-full flex-col  items-center`}>
                        <div class='font-["Semibold"]'>Bookings or Orders dont exist with forms or link-in-bio pages</div>
                        <button class='bg-black text-white mt-5 rounded-full px-5 py-3 font-["Semibold"]'>Go home</button>
                    </main>
                    <main className={`px-16 ${(selectedPage?.form || selectedPage?.linkinbio) === true && 'hidden'} overflow-y-auto flex-1`}>
                        <div>
                            {selectedPage?.storefront ? (
                                <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Orders</div>
                            ) : (
                                <div class='flex items-center gap-4'>
                                    <div onClick={() => setTab('home')} class={`mt-7 ${tab === 'calendar' && 'text-gray-300'} font-["Semibold"] mb-3 text-3xl`}>Bookings</div>
                                    <div onClick={() => setTab('calendar')} class={`mt-7 font-["Semibold"] ${tab === 'home' && 'text-gray-300'} mb-3 text-3xl`}>Calendars</div>
                                </div>
                            )}
                        </div>
                        {selectedPage?.storefront ? (
                            <div class='mt-5'>
                                <div class={`p-5 items-center space-y-3 w-full justify-between`}>
                                    {data?.me?.Orders?.length === 0 && (
                                        <div class='h-64 w-full flex justify-center items-center'>

                                            <div class='bg-white border rounded-full px-5 py-2 font-["Semibold"] shadow-sm text-sm'>You have no bookings</div>
                                        </div>
                                    )}
                                    <div class='grid grid-cols-2 gap-5'>
                                        {data?.me?.Orders?.map(item => (
                                            <div onClick={() => navigate(`/orders/${item.id}`)} class='flex border bg-white py-5 justify-between shadow-sm rounded-3xl items-center w-full'>
                                                <div class='flex items-center'>
                                                    <div class='px-2 text-xl w-40 text-center font-["Semibold"]'>
                                                        ${item?.amount} Made
                                                    </div>
                                                    <div class='h-10 w-1 border-l' />
                                                    <div class='px-5'>
                                                        <div class='text-sm font-["Semibold"] '>{item?.Product?.title}</div>
                                                        <div class='mt-1 flex items-center gap-[-3px]'>
                                                            <img src={selectedPage?.headerImage} class='w-5 h-5 border-2 border-white rounded-full' />
                                                            <img
                                                                src={
                                                                    !item?.Product?.thumbnail ? logo : item?.Product?.thumbnail
                                                                }
                                                                className="w-5 h-5 ml-[-6px] border-2 border-white rounded-full"
                                                            />
                                                            <div class='h-5 w-5 ml-[-6px] rounded-full border-2 border-white flex items-center font-["Semibold"] justify-center text-[8px] bg-pink-200'>{item?.name?.charAt(0)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='pr-5'>
                                                    <button class='px-5 rounded-full text-white bg-black text-sm py-3 font-["Semibold"] '>Details</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div class='flex w-full'>
                                {tab === 'calendar' && (
                                    <div class='w-full'>
                                        <CustomCalendar />
                                    </div>
                                )}
                                {tab === 'home' && (
                                    <div class='mt-5 w-full'>

                                        <div class={`p-5 items-center space-y-3 w-full justify-between`}>
                                            {data?.me?.Bookings?.length === 0 && (
                                                <div class='h-64 w-full flex justify-center items-center'>

                                                    <div class='bg-white border rounded-full px-5 py-2 font-["Semibold"] shadow-sm text-sm'>You have no bookings</div>
                                                </div>
                                            )}
                                            {data?.me?.Bookings?.map(item => {
                                                const date = new Date(item.date);
                                                const monthDay = date.toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                }); // "May 26"
                                                return (
                                                    <div onClick={() => navigate(`/orders/${item.id}`)} class='flex border bg-white py-5 justify-between shadow-sm rounded-3xl items-center w-full'>
                                                        <div class='flex items-center'>
                                                            <div class='px-3 text-2xl w-40 text-center font-["Semibold"]'>
                                                                {monthDay}
                                                            </div>
                                                            <div class='h-10 w-1  border-l' />
                                                            <div class='px-4 gap-1 flex flex-col'>
                                                                <div class='flex items-center text-xs font-["Semibold"] gap-2'>{item?.bookingTime}</div>
                                                                <div class='flex items-center text-xs font-["Semibold"] gap-2'>{item?.type}</div>
                                                            </div>
                                                            <div class='px-5'>
                                                                <div class='text-sm font-["Semibold"] '>{item?.Product?.title}</div>
                                                                <div class='mt-1 flex items-center gap-[-3px]'>
                                                                    <img src={selectedPage?.headerImage} class='w-5 h-5 border-2 border-white rounded-full' />
                                                                    <img
                                                                        src={
                                                                            !item?.Product?.thumbnail ? logo : item?.Product?.thumbnail
                                                                        }
                                                                        className="w-5 h-5 ml-[-6px] border-2 border-white rounded-full"
                                                                    />
                                                                    <div class='h-5 w-5 ml-[-6px] rounded-full border-2 border-white flex items-center font-["Semibold"] justify-center text-[8px] bg-pink-200'>{item?.name?.charAt(0)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class='pr-5'>
                                                            <button class='px-5 rounded-full text-white bg-black text-sm py-3 font-["Semibold"] '>Details</button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}


                    </main>

                    {/* Cookie Policy Notice */}

                </div>
            </div>
        </div>
    );
}
