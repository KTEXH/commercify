import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import SimpleChart from "../../components/Graphs/AnalyricsGraph";
import { NavBar } from "../../components/NavBar";
import { useSearchParams } from "react-router-dom"; // NEW import
import { Add, Banner } from "./Home";

export const Audience = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);

    const [selectedPage, setSelectedPage] = useState(null);

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);
    const groupedOrders = data?.me?.Orders?.reduce((acc, order) => {
        if (!order?.email) return acc;
        if (!acc[order.email]) {
            acc[order.email] = { email: order.email, name: order.name, orders: [order] };
        } else {
            acc[order.email].orders.push(order);
        }
        return acc;
    }, {});
    const customerList = Object.values(groupedOrders || {});

    const groupedBookings = data?.me?.Bookings?.reduce((acc, order) => {
        if (!order?.email) return acc;
        if (!acc[order.email]) {
            acc[order.email] = { email: order.email, name: order.name, orders: [order] };
        } else {
            acc[order.email].orders.push(order);
        }
        return acc;
    }, {});
    const clientsList = Object.values(groupedBookings || {});

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <div>
            <Banner />
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
                    <Add />
                </div>
                <NavBar home={false} audience={true} workshop={selectedPage?.workshop} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <header className="flex justify-between border-b items-center px-6 py-4">
                        <div class='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">{selectedPage?.name} • commercifyhq.com/{selectedPage?.name}</span>
                        </div>

                    </header>

                    {/* Dashboard Content */}
                    <main className="px-16 flex-1">
                        <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Customer Profiles</div>
                        {selectedPage?.storefront ? (
                            <div class="flex flex-col w-full gap-4">
                                {data?.me?.Orders?.length === 0 && (
                                    <div class="h-72 w-full flex items-center justify-center">
                                        You have no customers
                                    </div>
                                )}
                                {customerList.map(customer => (
                                    <div key={customer.email} className="flex items-center justify-between p-3 py-5 rounded-3xl text-sm font-['Semibold'] border shadow-sm">
                                        <div class='flex items-center'>
                                            <div className="text-2xl w-40 text-center">{customer.orders.length} Orders</div>
                                            <div class='h-10 w-1 border-l' />
                                            <div class='px-5'>
                                                <div class='text-sm font-["Semibold"] '>{customer.email}</div>
                                                <div class='flex relative mt-1 items-center'>
                                                    <img class='w-7 border-white border-2 rounded-full h-7' src={selectedPage?.headerImage} />
                                                    <div class='h-7 w-7 ml-[-11px] rounded-full border-2 border-white flex items-center font-["Semibold"] justify-center text-[8px] bg-pink-200'>{customer?.name?.charAt(0)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class='px-5 rounded-full text-white bg-black text-sm py-3 font-["Semibold"] '>Details</button>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div class='flex w-full flex-col rounded-xl'>

                                {data?.me?.Bookings?.length === 0 && (
                                    <div class='h-72 w-full flex items-center justify-center'>
                                        You have no clients
                                    </div>
                                )}
                                {clientsList.map(customer => (
                                    <div key={customer.email} className="flex items-center justify-between p-3 py-5 rounded-3xl text-sm font-['Semibold'] border shadow-sm">
                                        <div class='flex items-center'>
                                            <div className="text-2xl w-40 text-center">{customer.orders.length} Orders</div>
                                            <div class='h-10 w-1 border-l' />
                                            <div class='px-5'>
                                                <div class='text-sm font-["Semibold"] '>{customer.email}</div>
                                                <div class='flex relative mt-1 items-center'>
                                                    <img class='w-7 border-white border-2 rounded-full h-7' src={selectedPage?.headerImage} />
                                                    <div class='h-7 w-7 ml-[-11px] rounded-full border-2 border-white flex items-center font-["Semibold"] justify-center text-[8px] bg-pink-200'>{customer?.name?.charAt(0)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class='px-5 rounded-full text-white bg-black text-sm py-3 font-["Semibold"] '>Details</button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </main>

                    {/* Cookie Policy Notice */}
                </div>
            </div>
        </div>
    );
}
