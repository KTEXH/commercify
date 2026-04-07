import { useState, useEffect } from "react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import CustomCalendar from "../../components/CustomerCalendar";
import { Banner, Add } from "./Home";

export const Orders = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [selectedPage, setSelectedPage] = useState(null);
    const navigate = useNavigate();
    const [tab, setTab] = useState('list')

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
    }, [data, selectedPage]);

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>

    const isFormOrLink = selectedPage?.form === true || selectedPage?.linkinbio === true;
    const isStorefront = selectedPage?.storefront === true;

    const Empty = ({ label }) => (
        <div className='flex items-center justify-center h-48'>
            <div className='text-center'>
                <div className='text-3xl mb-2'>—</div>
                <p className='font-["Medium"] text-zinc-400 text-sm'>No {label} yet</p>
            </div>
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

                <NavBar home={false} storefront={selectedPage?.storefront} workshop={selectedPage?.workshop} orders={true} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center px-5 shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                    </header>

                    {isFormOrLink ? (
                        <main className="flex-1 flex flex-col items-center justify-center gap-3">
                            <p className='font-["Medium"] text-zinc-400 text-sm'>Not available for this page type.</p>
                            <button onClick={() => navigate('/dashboard')} className='bg-zinc-950 text-white px-4 py-2 rounded-xl font-["Semibold"] text-sm hover:bg-zinc-800 transition-colors'>
                                Go home
                            </button>
                        </main>
                    ) : (
                        <main className="flex-1 overflow-y-auto p-6">
                            <div className='mb-5 flex items-center justify-between'>
                                <div>
                                    <h1 className='font-["Semibold"] text-xl text-zinc-950 tracking-tight'>
                                        {isStorefront ? 'Orders' : tab === 'list' ? 'Bookings' : 'Calendar'}
                                    </h1>
                                    <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>
                                        {isStorefront ? 'Orders from your storefront.' : 'Upcoming and past bookings.'}
                                    </p>
                                </div>
                                {!isStorefront && (
                                    <div className='flex items-center gap-0.5 bg-white border border-zinc-200/60 rounded-xl p-1'>
                                        {[['list', 'List'], ['calendar', 'Calendar']].map(([t, label]) => (
                                            <button key={t} onClick={() => setTab(t)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-["Semibold"] transition-all ${tab === t ? 'bg-zinc-950 text-white' : 'text-zinc-400 hover:text-zinc-700'}`}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isStorefront ? (
                                data?.me?.Orders?.length === 0 ? <Empty label="orders" /> : (
                                    <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                        {data?.me?.Orders?.map((item, i) => (
                                            <div
                                                key={item.id}
                                                onClick={() => navigate(`/orders/${item.id}`)}
                                                className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-zinc-50 transition-colors ${i < data.me.Orders.length - 1 ? 'border-b border-zinc-100' : ''}`}
                                            >
                                                <div className='flex items-center gap-4'>
                                                    <div className='text-right shrink-0 w-16'>
                                                        <div className='text-lg font-["Semibold"] text-zinc-950 tabular-nums'>${item?.amount}</div>
                                                    </div>
                                                    <div className='w-px h-6 bg-zinc-100' />
                                                    <div>
                                                        <div className='text-sm font-["Semibold"] text-zinc-900'>{item?.Product?.title}</div>
                                                        <div className='flex items-center mt-1'>
                                                            <img src={selectedPage?.headerImage} className='w-4 h-4 border-2 border-white rounded-full object-cover' />
                                                            <img src={!item?.Product?.thumbnail ? logo : item?.Product?.thumbnail} className="w-4 h-4 -ml-1 border-2 border-white rounded-full object-cover" />
                                                            <div className='w-4 h-4 -ml-1 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-["Semibold"] bg-violet-100 text-violet-600'>{item?.name?.charAt(0)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className='text-xs font-["Semibold"] text-zinc-400'>Details →</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : tab === 'calendar' ? (
                                <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                    <CustomCalendar />
                                </div>
                            ) : (
                                data?.me?.Bookings?.length === 0 ? <Empty label="bookings" /> : (
                                    <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                        {data?.me?.Bookings?.map((item, i) => {
                                            const date = new Date(item.date);
                                            const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => navigate(`/orders/${item.id}`)}
                                                    className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-zinc-50 transition-colors ${i < data.me.Bookings.length - 1 ? 'border-b border-zinc-100' : ''}`}
                                                >
                                                    <div className='flex items-center gap-4'>
                                                        <div className='shrink-0 w-16'>
                                                            <div className='text-sm font-["Semibold"] text-zinc-950'>{monthDay}</div>
                                                        </div>
                                                        <div className='w-px h-6 bg-zinc-100' />
                                                        <div>
                                                            <div className='text-sm font-["Semibold"] text-zinc-900'>{item?.Product?.title}</div>
                                                            <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>{item?.bookingTime} · {item?.type}</div>
                                                        </div>
                                                    </div>
                                                    <span className='text-xs font-["Semibold"] text-zinc-400'>Details →</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            )}
                        </main>
                    )}
                </div>
            </div>
        </div>
    );
}
