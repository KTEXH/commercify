import React, { useEffect, useState } from 'react'
import { Notifications } from '../../components/Notifications'
import { NavBar } from '../../components/NavBar'
import { ME_QUERY } from '../../Data/Me'
import { useQuery } from '@apollo/client'
import { Header } from '../../components/Header'
import moment from 'moment'
import Group from '../../components/assets/Group'

export const Products = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)

    const formattedDate = (item) => {
        const date = moment(item);
        return date.fromNow();
    };

    useEffect(() => {
        if (data) {
            const totalAmount2 = data.me.Payouts.reduce((acc, payout) => acc + payout.amount, 0);

            const productRevenue = data.me.Payouts.reduce((acc, payout) => {
                const product = payout.Product.title;
                const amount = payout.amount;
                acc[product] = (acc[product] || 0) + amount;
                return acc;
            }, {});

            const productPercentage = Object.keys(productRevenue).reduce((acc, product) => {
                acc[product] = (productRevenue[product] / totalAmount2) * 100;
                return acc;
            }, {});

            setPercentage(productPercentage);
        }
    }, [data]); // Add 'data' as a dependency


    const [activeTab, setActiveTab] = React.useState('Products')

    const [percentageWidth, setPercentage] = useState(0)

    if (loading) return <div class='w-full h-screen flex items-center justify-center'><Group className='w-16 h-16' /></div>
    if (error) return <div>{error.message}</div>
    return (
        <div
            className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar products={true} pagesNav={false} home={false} analytics={false} pages={false} bookings={false} orders={false}/>
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Products Dashboard
                                </div>
                                <img
                                    className="h-4 w-4 flex-shrink-0"
                                    src="/assets/IconSet21.svg"
                                    loading="lazy"
                                />
                                <div className='w-[1px] h-4 bg-gray-200 mx-3' />
                                <div class='flex gap-3'>
                                    <label onClick={() => setActiveTab('Products')} class={`${activeTab === 'Products' ? 'text-black font-["Semibold"]' : 'text-gray-300 font-["Medium"]'} text-xs`}>Products</label>
                                    <label onClick={() => setActiveTab('Services')} class={`${activeTab === 'Services' ? 'text-black font-["Semibold"]' : 'text-gray-300 font-["Medium"]'} text-xs`}>Services</label>
                                </div>
                            </div>
                        </div>
                        <div class='mx-9 p-3 rounded-lg flex items-center justify-between bg-gray-50'>
                            <div class='flex items-center gap-3'>
                                <img class='w-4 h-4' src='/assets/Plus.svg' />
                                <img class='w-4 h-4' src='/assets/FunnelSimple.svg' />
                                <img class='w-4 h-4' src='/assets/ArrowsDownUp.svg' />
                            </div>
                            <div>

                            </div>
                        </div>
                        {activeTab === 'Services' && <div class='px-9 text-sm font-["Semibold"]'>Services</div>}
                        {activeTab === 'Products' && (
                            <div class='w-full flex flex-col px-9'>
                                <div class='w-full flex jutify-between text-[11px] px-5 font-["Semibold"] items-center'>
                                    <div class='w-[15%] '>Product</div>
                                    <div class='w-[10%]'>Price</div>
                                    <div class='w-[10%]'>Tag</div>
                                    <div class='w-[15%]'>Posted</div>
                                    <div class='w-[15%]'>File</div>
                                    <div class='w-[15%]'>Type</div>
                                    <div class='w-[15%]'>Sales</div>
                                    <div class='w-[5%]'/>
                                </div>
                                <div class='w-full mt-4 flex border flex-col rounded-xl'>
                                    {data.me.OnlyProducts.map((item, index) => {
                                        const productTitle = item.title;
                                        const percentage = percentageWidth[productTitle] || 0;

                                        return (
                                            <div key={index}>
                                                {/* Product Item */}
                                                <div class='w-full p-3 items-center flex'>
                                                    <div class='flex items-center w-[15%] gap-2'>
                                                        <div class='w-4 h-4 rounded-md border' />
                                                        {!item.thumbnail ? (
                                                            <div class='bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-["Semibold"]'>
                                                                {item.title.charAt(0)}
                                                            </div>
                                                        ) : (
                                                            <img />
                                                        )}
                                                        <div>
                                                            <label class='text-[10px] line-clamp-1 font-["Semibold"]'>{item.title}</label>
                                                        </div>
                                                    </div>
                                                    <div class='w-[10%]'>
                                                        <div class='px-3 py-1 rounded-full gap-1 inline-flex items-center border font-["Semibold"] text-[10px]'>
                                                            ${item.price}
                                                            <img class='w-3 h-3' src='/assets/Tag.svg' />
                                                        </div>
                                                    </div>
                                                    <div class='w-[10%]'>
                                                        <div class='font-["Semibold"] capitalize text-[10px]'>{item.tag}</div>
                                                    </div>
                                                    <div class='w-[15%] flex items-center gap-1'>
                                                        <img class='w-4 h-4' src='/assets/CalendarBlank.svg' />
                                                        <div class='font-["Semibold"] line-clamp-1 text-[11px]'>{formattedDate(item.createdAt)}</div>
                                                    </div>
                                                    <div class='w-[15%]'>
                                                        <div class='text-[10px] px-2 py-1 rounded-full border font-["Semibold"] line-clamp-1 inline-block'>
                                                            {item.file ? item.file.split('/').pop() : 'No file available'}
                                                        </div>
                                                    </div>
                                                    <div class='w-[15%]'>
                                                        <div class='font-["Semibold"] px-3 py-1 bg-gray-100 inline-block text-gray-500 rounded-md capitalize text-[10px]'>{item.type}</div>
                                                    </div>
                                                    <div class='w-[15%] flex items-center gap-2'>
                                                        <div class='text-xs text-black font-["Semibold"]'>{percentage.toFixed(0)}%</div>
                                                        <div className="w-full bg-gray-100 h-1.5 overflow-hidden rounded-full relative">
                                                            <div className="bg-black h-1.5" style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div class='w-[5%] flex justify-end'>
                                                        <img src='/assets/DotsThree.svg' class='w-4 h-4' />
                                                        </div>
                                                </div>

                                                {/* Divider */}
                                                {index !== data.me.OnlyProducts.length - 1 && (
                                                    <hr class="border-t" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        )}

                        {activeTab === 'Services' && (
                            <div class='w-full grid px-10 grid-cols-4 gap-5'>

                                {data.me.Services.map(item => {
                                    const availabilityDays = item.availablityDays; // Array of strings (days)
                                    const firstTwoDays = availabilityDays.slice(0, 3); // Get first two days
                                    const remainingDaysCount = availabilityDays.length - firstTwoDays.length; // Calculate remaining days

                                    return (
                                        <div class='p-4 border rounded-xl'>
                                            <div>
                                                <div class='flex items-center justify-between'>
                                                    <div class='flex flex-col'>
                                                        <div class='text-[10px] font-["Medium"] px-2 py-1 rounded-md bg-gray-100 text-gray-500 w-fit'>
                                                            {item.type}
                                                        </div>
                                                        <div class='w-full'>
                                                            <div class='font-["Semibold"] mt-1 text-xs'>
                                                                {item.title}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class='w-10 text-sm capitalize font-["Semibold"] h-10 bg-cyan-100 rounded-full flex items-center justify-center'>
                                                        {item.title.charAt(0)}
                                                    </div>
                                                </div>
                                                <div class='w-full flex justify-between mt-2 items-center'>
                                                    <label class='text-xs font-["Semibold"]'>Availability</label>
                                                    <div class='flex items-center gap-1'>
                                                        {firstTwoDays.map(item => (
                                                            <div class='text-[10px] px-2 py-1 rounded-full border font-["Semibold"]'>{item.slice(0, 3)}</div>
                                                        ))}
                                                        <div class='px-2 py-1 rounded-full border text-[10px] font-["Semibold"]'>+{remainingDaysCount} More</div>
                                                    </div>
                                                </div>
                                                <div class='flex items-center mt-2 justify-between'>
                                                    <div>
                                                        {item.Payment === 0 ? (
                                                            <div>

                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {item.Payment.map(item => (
                                                                    <div class='w-8 h-8 font-["Semibold"] text-sm flex items-center justify-center rounded-full bg-orange-100'>
                                                                        {item.name.charAt(0)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div class='px-3 py-1 rounded-full text-[9px] font-["Semibold"] border'>
                                                          {item.Payment.length} Bookings
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    )
}