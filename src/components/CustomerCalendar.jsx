import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../Data/Me';
import moment from 'moment';

const CustomCalendar = () => {
    const { data, error, loading } = useQuery(ME_QUERY);
    const [currentMonth, setCurrentMonth] = useState(moment());
    const today = moment(); // Get the current date

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const bookings = data?.me?.Bookings || [];
    const bookedDates = bookings.map(booking => moment(booking.formattedDate).format('YYYY-MM-DD'));

    // Start and end of the current month
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');

    // Start and end of the calendar view (might include previous/next month days)
    const startOfCalendar = startOfMonth.clone().startOf('week');  // Start from Sunday
    const endOfCalendar = endOfMonth.clone().endOf('week');        // End on Saturday

    // Generate days for the calendar
    const daysInCalendar = [];
    for (let day = startOfCalendar.clone(); day.isBefore(endOfCalendar); day.add(1, 'day')) {
        daysInCalendar.push(day.clone());
    }

    // Create a grid of weeks (each week has 7 days)
    const weeks = [];
    for (let i = 0; i < daysInCalendar.length; i += 7) {
        weeks.push(daysInCalendar.slice(i, i + 7));
    }

    return (
        <div className="p-4 bg-white rounded-lg">
            <div className="flex justify-between mb-4">
                <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))} className="p-2 rounded-full border">
                    <img class='w-4 h-4' src='/assets/CaretLeft.svg'/>
                </button>
                <h2 className="font-semibold text-md">{currentMonth.format('MMMM YYYY')}</h2>
                <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))} className="p-2 rounded-full border">
                <img class='w-4 h-4' src='/assets/CaretRight.svg'/>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-5">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-medium text-sm text-center">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
          
                {/* Calendar Days */}
                {weeks.map((week, index) => (
                    <React.Fragment key={index}>
                        {week.map((day) => (
                            <div
                                key={day.format('YYYY-MM-DD')}
                                className={`border rounded-md px-4 py-3 h-28
                                    ${bookedDates.includes(day.format('YYYY-MM-DD')) ? '' : ''} 
                                    ${day.isSame(today, 'day') ? ' font-bold' : ''}
                                    ${!day.isSame(currentMonth, 'month') ? 'text-gray-300' : ''}`} // Faded for previous/next month days
                            >
                                <div className="font-semibold text-sm mb-2 text-right ">{day.format('D')}</div>
                                {/* Display booked times for that day */}
                                {bookings
                                    .filter(booking => moment(booking.formattedDate).isSame(day, 'day'))
                                    .map(booking => (
                                        <div key={booking.id} className="flex gap-2 rounded-md py-1 text-xs line-clamp-1 bg-gray-100 font-['Medium'] items-center">
                                            <div class='h-5 w-1 bg-black rounded-xl' />
                                            <div class='line-clamp-1'>{booking.time}: {booking.Product.title} </div></div>
                                    ))}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CustomCalendar;
