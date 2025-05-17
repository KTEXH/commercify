import React, { useEffect } from 'react'
import { NavBar } from '../../components/NavBar'
import { Header } from '../../components/Header'
import { ME_QUERY } from '../../Data/Me'
import { useQuery } from '@apollo/client'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BookingsCalendar from '../../components/BookingCalendar'
import CustomCalendar from '../../components/CustomerCalendar'
import { Loading } from '../../components/Loading'

export const Bookings = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY);
    const [activeTab, setActiveTab] = React.useState("Calendar");
    
    // Map bookings data to events for the calendar
    const events = data?.me?.Bookings?.map(booking => {
        const bookedDate = new Date(booking.formattedDate); // Just use the date

        return {
            start: bookedDate,
            end: bookedDate, // Mark the same date
            title: `${booking.time}`, // Show booking time
            allDay: true, // If you want it to be an all-day event
        };
    }) || [];

  



    if (loading) return <div><Loading /></div>
    if (error) return <div>{error.message}</div>

    return (
        <div className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}>
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white">
                <div className="font-general-sans flex flex flex-shrink-0 tracking-[0px]">
                    <NavBar home={true} products={false} />
                    <div className="flex flex-col w-full self-stretch">
                        <Header />
                        
                        <div class='flex items-center h-full  w-full'>
                            <div class='w-96 h-full p-5 border-r'>
                                <div class='font-["Semibold"] text-xs'>Services</div>
                                <div class='mt-5 space-y-2'>
                                    {data.me.Services.map(item => (
                                        <div className='flex justify-between items-center p-3 rounded-xl border'>
                                            <div>
                                                <div class='text-xs font-["Semibold"]'>{item.title}</div>
                                                <div></div>
                                            </div>
                                            <div>
                                                <div class='w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-sm font-["Semibold"]'>{item.title.charAt(0)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex p-5 flex-col w-full self-stretch">

                                <div className="flex items-center gap-x-1">
                                    <div className="text-xs font-semibold leading-5 text-neutral-900">
                                        Products Dashboard
                                    </div>
                                    <img
                                        className="h-3 w-3 flex-shrink-0"
                                        src="/assets/IconSet21.svg"
                                        loading="lazy"
                                    />
                                    <div className='w-[1px] h-4 bg-gray-200 mx-3' />
                                    <div className='flex gap-3'>
                                        <label onClick={() => setActiveTab('Calendar')} className={`${activeTab === 'Calendar' ? 'text-black font-["Semibold"]' : 'text-gray-300 font-["Medium"]'} text-xs`}>Calendar</label>
                                        <label onClick={() => setActiveTab('List')} className={`${activeTab === 'List' ? 'text-black font-["Semibold"]' : 'text-gray-300 font-["Medium"]'} text-xs`}>List</label>
                                    </div>
                                </div>

                                {activeTab === 'Calendar' ? (
                                    <div className='w-full mt-5'>
                                        <CustomCalendar />
                                    </div>
                                ) : (
                                    <div class='w-full mt-5'>
                                        <div class='font-["Semibold"] text-sm'>List</div>
                                        <div>

                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}
