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
    const [cumulativePayouts, setCumulativePayouts] = useState([]);
    const [currentMonthTotal, setCurrentMonthTotal] = useState(0); // State to store current month total

    useEffect(() => {
        if (!loading && !error && data && data.me && data.me.createdAt && data.me.Payouts) {
            const accountCreationDate = new Date(data.me.createdAt);
            const payouts = data.me.Payouts;

            // Get the current month and year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            // Initialize cumulative data for 12 months (last 11 months + current month)
            const cumulativeData = Array.from({ length: 12 }, (_, index) => {
                const monthIndex = (currentMonth - 11 + index + 12) % 12; // Adjust to get the last 12 months
                const year = currentYear + Math.floor((currentMonth - 11 + index) / 12); // Adjust the year if needed
                return {
                    month: new Date(year, monthIndex).toLocaleString('default', { month: 'short' }),
                    amount: 0,
                };
            });

            // Aggregate payouts by month
            let currentMonthAmount = 0; // Variable to hold the total for the current month
            payouts.forEach((payout) => {
                const payoutDate = new Date(payout.createdAt);
                if (payoutDate >= accountCreationDate) {
                    const payoutMonthIndex = payoutDate.getMonth();
                    const payoutYear = payoutDate.getFullYear();

                    // Calculate the difference in months
                    const monthsDifference = (currentYear - payoutYear) * 12 + (currentMonth - payoutMonthIndex);

                    if (monthsDifference <= 11 && monthsDifference >= 0) {
                        cumulativeData[11 - monthsDifference].amount += payout.amount;
                    }

                    // Check if it's the current month and add to the total
                    if (payoutYear === currentYear && payoutMonthIndex === currentMonth) {
                        currentMonthAmount += payout.amount;
                    }
                }
            });

            setCumulativePayouts(cumulativeData);
            setCurrentMonthTotal(currentMonthAmount); // Update state for current month total
        }
    }, [loading, error, data]);

    const totalPay = cumulativePayouts.reduce((acc, curr) => acc + curr.amount, 0);
    const minHeight = 20; // Set a fixed height for zero amounts

    // Custom tooltip content without the arrow
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <p className="label">{`Month: ${payload[0].payload.month}`}</p>
                    <p className="amount">{`Amount: $${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full border shadow-sm bg-white rounded-3xl h-full mt-3 p-3">
            <div className='w-full flex justify-between items-center p-4'>
                <div>
                <label className='font-["Semibold"] text-sm'>Year 2025</label>
                </div>
                <div className='flex items-center gap-2'>
                <div className='flex items-center border px-3 p-1 rounded-full gap-2'>
                    <div className='w-3 h-2 rounded-full bg-black' />
                    <div className='text-xs font-["Semibold"] flex gap-1'>Money made</div>
                </div>
                <div className='flex items-center border px-3 p-1 rounded-full gap-2'>
                    <div className='w-3 h-2 rounded-full bg-[#18181B]/10' />
                    <div className='text-xs font-["Semibold"] flex gap-1'>No money made</div>
                </div>
                </div>
            </div>
            {cumulativePayouts.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium mb-4">No Payout Data Available</p>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={cumulativePayouts} margin={{ top: 2, right: 2, left: 5, bottom: 5 }}>
                        <XAxis fontFamily='Semibold' fontSize={12} dataKey="month" stroke="none" tick={{ fill: '#000' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="amount"
                            radius={[10, 10, 0, 0]}
                            minPointSize={minHeight} // Set the minimum height for bars
                            barSize={40} // Set the width of the bars
                        >
                            {
                                cumulativePayouts.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.amount > 0 ? '#000' : '#ccc'} // Set bar color based on amount
                                    />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SimpleChart;
