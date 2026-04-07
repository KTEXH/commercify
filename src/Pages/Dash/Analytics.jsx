import { useState, useEffect } from "react";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import DailiyChart from "../../components/Graphs/DailyPayout";
import { Banner, Add } from "./Home";

export const Analytics = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [selectedPage, setSelectedPage] = useState(null)
    const getDateString = (date) => date.toISOString().split('T')[0];

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const todayStr = getDateString(today);
    const yesterdayStr = getDateString(yesterday);

    const revenueToday = data?.me?.Orders?.reduce((acc, o) =>
        getDateString(new Date(o.createdAt)) === todayStr ? acc + o.amount : acc, 0) || 0;
    const revenueYesterday = data?.me?.Orders?.reduce((acc, o) =>
        getDateString(new Date(o.createdAt)) === yesterdayStr ? acc + o.amount : acc, 0) || 0;
    const revenueChange = revenueYesterday === 0 ? 0 : ((revenueToday - revenueYesterday) / revenueYesterday) * 100;
    const revenueDirection = revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'flat';

    const ordersToday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === todayStr).length || 0;
    const ordersYesterday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === yesterdayStr).length || 0;
    const orderChange = ordersYesterday === 0 ? 0 : ((ordersToday - ordersYesterday) / ordersYesterday) * 100;
    const orderDirection = orderChange > 0 ? 'up' : orderChange < 0 ? 'down' : 'flat';

    const revenueAll = data?.me?.Payouts?.reduce((total, payout) => total + payout.amount, 0) || 0;

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
    }, [data, selectedPage]);

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>

    const Trend = ({ dir, val }) => (
        <div className='flex items-center gap-1 mt-2'>
            {dir === 'up' && <TrendingUp className='text-emerald-500 w-3 h-3' />}
            {dir === 'down' && <TrendingDown className='text-red-400 w-3 h-3' />}
            {dir === 'flat' && <Minus className='text-zinc-300 w-3 h-3' />}
            <span className={`text-[11px] font-["Semibold"] ${dir === 'up' ? 'text-emerald-600' : dir === 'down' ? 'text-red-400' : 'text-zinc-400'}`}>{val.toFixed(1)}%</span>
            <span className='text-[11px] font-["Medium"] text-zinc-400'>vs yesterday</span>
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

                <NavBar home={false} analytics={true} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} workshop={selectedPage?.workshop} storefront={selectedPage?.storefront} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center px-5 shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6">
                        <div className='mb-5'>
                            <h1 className='font-["Semibold"] text-xl text-zinc-950 tracking-tight'>Analytics</h1>
                            <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>Revenue, orders, and bookings.</p>
                        </div>

                        <div className='grid grid-cols-3 gap-3 mb-3'>
                            <div className='bg-white rounded-2xl p-5 border border-zinc-200/60'>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-3'>Total bookings</div>
                                <div className='text-5xl font-["Semibold"] text-zinc-950 tabular-nums tracking-tight'>{data?.me?.Bookings?.length ?? 0}</div>
                            </div>
                            <div className='bg-white rounded-2xl p-5 border border-zinc-200/60'>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-3'>Revenue today</div>
                                <div className='text-5xl font-["Semibold"] text-zinc-950 tabular-nums tracking-tight'>${revenueToday.toFixed(0)}</div>
                                <Trend dir={revenueDirection} val={revenueChange} />
                            </div>
                            <div className='bg-white rounded-2xl p-5 border border-zinc-200/60'>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-3'>Orders today</div>
                                <div className='text-5xl font-["Semibold"] text-zinc-950 tabular-nums tracking-tight'>{ordersToday}</div>
                                <Trend dir={orderDirection} val={orderChange} />
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-6'>
                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Payout history</div>
                            <DailiyChart total={revenueAll} payouts={data?.me?.Payouts} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
