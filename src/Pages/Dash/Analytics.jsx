import { NavBar } from '../../components/NavBar'
import { ME_QUERY } from '../../Data/Me'
import { Header } from '../../components/Header'
import { useQuery } from '@apollo/client'
import Card from '../../components/Card'
import SimpleChart from '../../components/Graphs/AnalyricsGraph'
import { useState } from 'react'
import moment from 'moment'
import Group from '../../components/assets/Group'
export const Analytics = ({ className = "" }) => {

    const formattedDate = (item) => {
        const date = moment(item);  // Ensure `item` is a valid date or timestamp
        return date.fromNow();      // Returns the relative time like "X days ago"
    };

    const { data, error, loading } = useQuery(ME_QUERY)
    const [percentageWidth, setPercentage] = useState(0)

    if (error) return <div>{error.message}</div>
    if (loading) return <div class='h-full w-full flex flex-col flex-grow items-center justify-center'>
        <Group className='w-20 h-20' />
    </div>
    return (
        <div
            className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar home={false} pagesNav={false} pages={false} analytics={true} orders={false} bookings={false} products={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Analytics
                                </div>
                                <img
                                    className="h-4 w-4 flex-shrink-0"
                                    src="/assets/IconSet21.svg"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div class='w-full px-9'>
                            <div className="flex w-full self-stretch gap-x-7 gap-y-7 text-neutral-900" >
                                <Card
                                    container1="bg-sky-100"
                                    text="Clicks"
                                    container2="gap-x-8"
                                    text1="721K"
                                    attr1="/assets/IconSet22.svg"
                                    text2="+11.01%"
                                />
                                <Card
                                    container1="bg-slate-200"
                                    text="Orders"
                                    container2="gap-x-8"
                                    text1="367K"
                                    attr1="/assets/IconSet23.svg"
                                    text2="-0.03%"
                                />
                                <Card
                                    container1="bg-sky-100"
                                    text="Audience"
                                    container2="gap-x-7"
                                    text1="1,156"
                                    attr1="/assets/IconSet24.svg"
                                    text2="+15.03%"
                                />
                                <Card
                                    container1="bg-slate-200"
                                    text="Net"
                                    container2="gap-x-7"
                                    text1="239K"
                                    attr1="/assets/IconSet25.svg"
                                    text2="+6.08%"
                                />
                            </div>
                            <div class='flex mt-2 gap-5'>
                                <div class='w-full'>
                                    <label class='text-black font-["Semibold"] text-xs'>Earnings</label>
                                    <SimpleChart />
                                </div>

                            </div>
                            <div class='flex mt-3 gap-5'>
                                <div class='w-full flex flex-col'>
                                    <label class='text-black font-["Semibold"] text-xs'>Sales per Item(Products)</label>
                                    <div class='w-full mt-2 border px-3 rounded-xl'>
                                        <div class='w-full flex items-center'>

                                        </div>
                                        {data.me.OnlyProducts.map((item, index) => {
                                            const productTitle = item.title;
                                            const percentage = percentageWidth[productTitle] || 0;
                                            return (
                                                <div key={index}>
                                                    <div class='flex items-center w-full py-2'>
                                                        <div class='flex items-center w-[25%] gap-2'>
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
                                                        <div class='w-[25%]'>
                                                            <div class='px-3 py-1 rounded-full gap-1 inline-flex justify-center items-center border font-["Semibold"] text-[10px]'>
                                                                ${item.price}
                                                                <img class='w-3 h-3' src='/assets/Tag.svg' />
                                                            </div>
                                                        </div>

                                                        <div class='w-[25%] flex items-center gap-1'>
                                                            <img class='w-4 h-4' src='/assets/CalendarBlank.svg' />
                                                            <div class='font-["Semibold"] line-clamp-1 text-[11px]'>{formattedDate(item.createdAt)}</div>
                                                        </div>


                                                        <div class='w-[25%] flex items-center gap-2'>
                                                            <div class='text-xs text-black font-["Semibold"]'>{percentage.toFixed(0)}%</div>
                                                            <div className="w-full bg-gray-100 h-1.5 overflow-hidden rounded-full relative">
                                                                <div className="bg-black h-1.5" style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    {index !== data.me.OnlyProducts.length - 1 && (
                                                        <hr class="border-t" />
                                                    )}
                                                </div>

                                            )
                                        })}
                                    </div>
                                </div>
                                <div class='w-full flex flex-col'>
                                    <label class='text-black font-["Semibold"] text-xs'>Sales per Item(Services)</label>
                                    <div class='w-full mt-2 border px-3 rounded-xl'>
                                        <div>

                                        </div>
                                        {data.me.Services.map((item, index) => {
                                            const productTitle = item.title;
                                            const percentage = percentageWidth[productTitle] || 0;
                                            return (
                                                <div key={index}>
                                                <div class='flex items-center w-full py-2'>
                                                    <div class='flex items-center w-[25%] gap-2'>
                                                        {!item.thumbnail ? (
                                                            <div class='bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-["Semibold"]'>
                                                                {item?.title?.charAt(0)}
                                                            </div>
                                                        ) : (
                                                            <img />
                                                        )}
                                                        <div>
                                                            <label class='text-[10px] line-clamp-1 font-["Semibold"]'>{item.title}</label>
                                                        </div>
                                                    </div>
                                                    <div class='w-[25%]'>
                                                        <div class='px-3 py-1 rounded-full gap-1 inline-flex justify-center items-center border font-["Semibold"] text-[10px]'>
                                                            ${item.price}
                                                            <img class='w-3 h-3' src='/assets/Tag.svg' />
                                                        </div>
                                                    </div>

                                                    <div class='w-[25%] flex items-center gap-1'>
                                                        <img class='w-4 h-4' src='/assets/CalendarBlank.svg' />
                                                        <div class='font-["Semibold"] line-clamp-1 text-[11px]'>{formattedDate(item.createdAt)}</div>
                                                    </div>


                                                    <div class='w-[25%] flex items-center gap-2'>
                                                        <div class='text-xs text-black font-["Semibold"]'>{percentage.toFixed(0)}%</div>
                                                        <div className="w-full bg-gray-100 h-1.5 overflow-hidden rounded-full relative">
                                                            <div className="bg-black h-1.5" style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                    </div>

                                                </div>
                                                {index !== data.me.Services.length - 1 && (
                                                    <hr class="border-t" />
                                                )}
                                            </div>

                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}