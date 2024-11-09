import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../../Data/Me';
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const SimpleChart = () => {
    const { data, loading, error } = useQuery(ME_QUERY);
    const [payoutsOverTime, setPayoutsOverTime] = useState([]);

    useEffect(() => {
        if (!loading && !error && data && data.me && data.me.createdAt && data.me.Payouts) {
            const accountCreationDate = new Date(data.me.createdAt); // Account creation date
            const payouts = [...data.me.Payouts]; // Copy payouts array
            const payoutData = [];

            // Get today's date
            const currentDate = new Date();

            // Generate a date range from the account creation to today
            const dateRange = [];
            for (let d = new Date(accountCreationDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
                dateRange.push(new Date(d));
            }

            // Sort payouts by date
            const sortedPayouts = payouts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            // Create a map of payouts by date
            const payoutMap = sortedPayouts.reduce((acc, payout) => {
                const payoutDate = new Date(payout.createdAt).toLocaleDateString();
                if (!acc[payoutDate]) {
                    acc[payoutDate] = 0;
                }
                acc[payoutDate] += payout.amount;
                return acc;
            }, {});

            // Build data for each day in the range, showing 0 if no payout was made that day
            dateRange.forEach((date) => {
                const dateString = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                const amountForDay = payoutMap[date.toLocaleDateString()] || 0; // Default to 0 if no payout on that day
                payoutData.push({
                    date: dateString,
                    amount: amountForDay,
                });
            });

            setPayoutsOverTime(payoutData);
        }
    }, [loading, error, data]);

    // Custom tooltip content without the arrow
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <p className="label">{`Date: ${payload[0].payload.date}`}</p>
                    <p className="amount">{`Amount: $${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full border rounded-lg mt-3 p-3 font-sans">
            <div className='w-full flex items-center p-4'>
                <label className='font-["Semibold"] text-xs'>Revenue</label>
                <div className='h-5 w-[2px] rounded-xl mx-5 bg-gray-200' />
                <div className='flex items-center gap-2'>
                    <div className='w-1 h-1 rounded-full bg-black' />
                    <div className='text-xs font-["Medium"] flex gap-1'>Current Month <div className='text-xs font-["Semibold"]'>${}</div></div>
                </div>
                <div className='flex items-center gap-2 ml-10'>
                    <div className='w-2 h-2 rounded-full bg-sky-100' />
                    <div className='text-xs font-["Medium"] flex gap-1'>Last 10 Months <div className='text-xs font-["Semibold"]'>${}</div></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={payoutsOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis fontFamily='Semibold' fontSize={12} dataKey="date" stroke="none" tick={{ fill: '#000' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="amount"
                        radius={[10, 10, 0, 0]}
                        minPointSize={20}
                        barSize={60}
                    >
                        {payoutsOverTime.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.amount > 0 ? '#000' : '#ccc'} // Set bar color based on amount
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
};

export default SimpleChart;
