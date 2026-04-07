import { useState, useEffect } from "react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Banner, Add } from "./Home";

export const Audience = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [selectedPage, setSelectedPage] = useState(null);

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
    }, [data, selectedPage]);

    const groupedOrders = data?.me?.Orders?.reduce((acc, order) => {
        if (!order?.email) return acc;
        if (!acc[order.email]) acc[order.email] = { email: order.email, name: order.name, count: 1 };
        else acc[order.email].count++;
        return acc;
    }, {});
    const customerList = Object.values(groupedOrders || {});

    const groupedBookings = data?.me?.Bookings?.reduce((acc, b) => {
        if (!b?.email) return acc;
        if (!acc[b.email]) acc[b.email] = { email: b.email, name: b.name, count: 1 };
        else acc[b.email].count++;
        return acc;
    }, {});
    const clientsList = Object.values(groupedBookings || {});

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>

    const Empty = ({ label }) => (
        <div className='flex items-center justify-center h-48'>
            <div className='text-center'>
                <div className='text-3xl mb-2'>—</div>
                <p className='font-["Medium"] text-zinc-400 text-sm'>No {label} yet</p>
            </div>
        </div>
    );

    const PersonRow = ({ person, countLabel, index, total }) => (
        <div className={`flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors ${index < total - 1 ? 'border-b border-zinc-100' : ''}`}>
            <div className='flex items-center gap-4'>
                <div className='w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-["Semibold"] text-zinc-500 shrink-0'>
                    {person.name?.charAt(0) || person.email?.charAt(0)}
                </div>
                <div>
                    <div className='text-sm font-["Semibold"] text-zinc-900'>{person.email}</div>
                    {person.name && <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>{person.name}</div>}
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <div className='text-right'>
                    <div className='text-base font-["Semibold"] text-zinc-950 tabular-nums'>{person.count}</div>
                    <div className='text-[10px] font-["Medium"] text-zinc-400'>{countLabel}</div>
                </div>
                <span className='text-xs font-["Semibold"] text-zinc-400'>Details →</span>
            </div>
        </div>
    );

    const showStorefront = selectedPage?.storefront;
    const showWorkshopOrLink = selectedPage?.workshop || selectedPage?.linkinbio;
    const list = showStorefront ? customerList : clientsList;
    const countLabel = showStorefront ? 'orders' : 'bookings';

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

                <NavBar home={false} audience={true} workshop={selectedPage?.workshop} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center px-5 shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6">
                        <div className='mb-5'>
                            <h1 className='font-["Semibold"] text-xl text-zinc-950 tracking-tight'>Audience</h1>
                            <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>
                                {list.length} {showStorefront ? 'customer' : 'client'}{list.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {(showStorefront || showWorkshopOrLink) && (
                            list.length === 0 ? <Empty label={showStorefront ? 'customers' : 'clients'} /> : (
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    {list.map((person, i) => (
                                        <PersonRow key={person.email} person={person} countLabel={countLabel} index={i} total={list.length} />
                                    ))}
                                </div>
                            )
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
