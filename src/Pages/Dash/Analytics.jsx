import { useState, useEffect } from "react";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import { PlusIcon } from "@heroicons/react/20/solid";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import SimpleChart from "../../components/Graphs/PayoutGraph";
import DailiyChart from "../../components/Graphs/DailyPayout";
import { Banner } from "./Home";

export const Analytics = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [selectedPage, setSelectedPage] = useState(null)
    const getDateString = (date) => date.toISOString().split('T')[0];

    // Today & Yesterday dates
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = getDateString(today);
    const yesterdayStr = getDateString(yesterday);
    // Revenue from orders (assumes each order has `amount`)
    const revenueToday = data?.me?.Orders?.reduce((acc, o) => {
        return getDateString(new Date(o.createdAt)) === todayStr ? acc + o.amount : acc;
    }, 0) || 0;

    const revenueYesterday = data?.me?.Orders?.reduce((acc, o) => {
        return getDateString(new Date(o.createdAt)) === yesterdayStr ? acc + o.amount : acc;
    }, 0) || 0;

    const revenueChange = revenueYesterday === 0 ? 0 : ((revenueToday - revenueYesterday) / revenueYesterday) * 100;
    const revenueDirection = revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'flat';

    const ordersToday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === todayStr).length || 0;
    const ordersYesterday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === yesterdayStr).length || 0;

    const orderChange = ordersYesterday === 0 ? 0 : ((ordersToday - ordersYesterday) / ordersYesterday) * 100;
    const orderDirection = orderChange > 0 ? 'up' : orderChange < 0 ? 'down' : 'flat';




    // Revenue in All
    const revenueAll = data?.me?.Payouts?.reduce((total, payout) => total + payout.amount, 0) || 0;


    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <div>
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
                <NavBar home={false} analytics={true} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} workshop={selectedPage?.workshop} storefront={selectedPage?.storefront} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <header className="flex justify-between border-b items-center px-6 py-4">
                        <div class='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <main className="px-16 flex-1">
                        <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Stats</div>

                        <div className='mt-2 grid grid-cols-3 gap-5'>
                            <div className='border p-5 bg-white rounded-3xl shadow-sm'>
                                <div className='text-xs text-gray-400 font-["Medium"]'>All of bookings</div>
                                <div className='text-4xl font-["Semibold"]'>{data?.me?.Bookings.length}</div>

                            </div>

                            {/* Revenue Today */}
                            {/* Revenue Today */}
                            <div className='border p-5 bg-white rounded-3xl shadow-sm'>
                                <div className='text-xs text-gray-400 font-["Medium"]'>Revenue today</div>
                                <div className='text-4xl font-["Semibold"]'>${revenueToday.toFixed(2)}</div>
                                <div className='flex items-center text-sm mt-2 gap-2 font-["Medium"]'>
                                    {revenueDirection === 'up' && <TrendingUp className='text-green-500 w-4 h-4' />}
                                    {revenueDirection === 'down' && <TrendingDown className='text-red-500 w-4 h-4' />}
                                    {revenueDirection === 'flat' && <Minus className='text-gray-400 w-4 h-4' />}
                                    <div className={`flex font-["Semibold"] items-center gap-1 ${revenueDirection === 'up' ? 'text-green-500' : revenueDirection === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                                        {revenueChange.toFixed(1)}%
                                        <div className='text-gray-300'>from yesterday</div>
                                    </div>
                                </div>
                            </div>

                            {/* Number of Orders */}
                            <div className='border p-5 bg-white rounded-3xl shadow-sm'>
                                <div className='text-xs text-gray-400 font-["Medium"]'>Number of orders</div>
                                <div className='text-4xl font-["Semibold"]'>{ordersToday}</div>
                                <div className='flex items-center text-sm mt-2 gap-2 font-["Medium"]'>
                                    {orderDirection === 'up' && <TrendingUp className='text-green-500 w-4 h-4' />}
                                    {orderDirection === 'down' && <TrendingDown className='text-red-500 w-4 h-4' />}
                                    {orderDirection === 'flat' && <Minus className='text-gray-400 w-4 h-4' />}
                                    <div className={`flex  items-center gap-1 ${orderDirection === 'up' ? 'text-green-500' : orderDirection === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                                        {orderChange.toFixed(1)}%
                                        <div className='text-gray-300'>from yesterday</div>
                                    </div>
                                </div>
                            </div>


                    

                        </div>
                        <div class='mt-5 flex h-72 items-center gap-5'>
                            <DailiyChart total={revenueAll} />
                        </div>
                    </main>

                    {/* Cookie Policy Notice */}

                </div >
            </div>
        </div >
    );
}
