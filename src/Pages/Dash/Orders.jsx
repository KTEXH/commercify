import { Header } from "../../components/Header";
import { NavBar } from "../../components/NavBar";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { ME_QUERY } from "../../Data/Me";
import moment from "moment";
import Group from "../../components/assets/Group";

export const Orders = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)

    const formattedDate = (item) => {
        const date = moment(item);
        return date.fromNow();
    };

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <div
            className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar products={false} pagesNav={false} analytics={false} pages={false} bookings={false} orders={true} home={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />

                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Orders
                                </div>
                                <img
                                    className="h-4 w-4 flex-shrink-0"
                                    src="/assets/IconSet21.svg"
                                    loading="lazy"
                                />

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
                        <div class='w-full flex flex-col px-9'>
                            <div class='w-full flex jutify-between text-[11px] px-5 font-["Semibold"] items-center'>
                                <div class='w-[10%]'>Order ID</div>
                                <div class='w-[15%] '>Product</div>
                                <div class='w-[15%]'>Amount</div>
                                <div class='w-[10%]'>Ordered</div>
                                <div class='w-[15%]'>Fulfilled</div>
                                <div class='w-[15%]'>Customer</div>
                                <div class='w-[15%]'>Payout status</div>
                                <div class='w-[5%]' />
                            </div>
                            <div class={`w-full mt-4 flex border ${data.me.Orders.length === 0 && 'h-96 flex w-full flex-col items-center justify-center'} flex-col rounded-xl`}>
                                {data.me.Orders.length === 0 && (
                                    <div class='flex flex-col'>
                                    
                                        </div>
                                )}
                                {data.me.Orders.map((item, index) => {

                                    return (
                                        <div key={index}>
                                            {/* Product Item */}
                                            <div class='w-full p-2 py-3 items-center flex'>
                                                <div class='w-[10%] flex items-center gap-2'>
                                                    <div class='w-4 h-4 rounded-md border' />
                                                    <div class='text-xs font-["Semibold"]'>#{item.id * 10 + 20 - 11}CO</div>
                                                </div>
                                                <div class='flex items-center w-[15%] gap-2'>
                                                    {!item.Product.thumbnail ? (
                                                        <div class='bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-["Semibold"]'>
                                                            {item.Product.title.charAt(0)}
                                                        </div>
                                                    ) : (
                                                        <img />
                                                    )}
                                                    <div>
                                                        <label class='text-[10px] font-["Semibold"]'>{item.Product.title}</label>
                                                    </div>
                                                </div>
                                                <div class='w-[15%]'>
                                                    <div class='px-3 py-1 rounded-full gap-1 inline-flex items-center border font-["Semibold"] text-[10px]'>
                                                        ${item.amount} - Succesfully Paid
                                                    </div>
                                                </div>

                                                <div class='w-[10%] flex items-center gap-1'>
                                                    <img class='w-4 h-4' src='/assets/CalendarBlank.svg' />
                                                    <div class='font-["Semibold"] line-clamp-1 capitalize text-[10px]'>{formattedDate(item.createdAt)}</div>
                                                </div>
                                                <div class='w-[15%]'>
                                                    <div class='text-[10px] px-2 py-1 rounded-full border font-["Semibold"] line-clamp-1 inline-block'>
                                                        {item.fulfilled === true ? 'Fulfilled' : 'Needs to be fulfilled'}
                                                    </div>
                                                </div>
                                                <div class='w-[15%]'>
                                                    <div class='flex items-center gap-2'>
                                                        <div class='w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center txt-[10px] font-["Semibold"]'>
                                                            {item.name ? item.name.charAt(0) : 'C'}
                                                        </div>
                                                        <div class='flex flex-col font-["Semibold"] capitalize text-[10px]'>
                                                            <label>{item.name || 'Customer'}</label>
                                                            <label>{item.email}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='w-[15%] flex items-center gap-2'>
                                                    <div class='text-[10px] font-["Semibold]'>
                                                        {item.payoutStatus === 'Awaiting Fulfillment' && <div class='flex items-center gap-2 font-["Medium"] text-red-300'> <div class='w-1 h-1 rounded-full bg-red-300' />{item.payoutStatus}</div>}
                                                    </div>
                                                </div>
                                                <div class='w-[5%]'>
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

                    </div>
                </div>
            </div>
        </div>
    )
}