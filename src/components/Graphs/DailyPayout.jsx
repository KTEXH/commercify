import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../../Data/Me';
import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const SimpleChart = () => {
    const { data, loading, error } = useQuery(ME_QUERY);
    const [cumulativePayouts, setCumulativePayouts] = useState([]);
    const [view, setView] = useState('day');

    useEffect(() => {
        if (!loading && !error && data?.me?.createdAt && data.me.Payouts) {
            const accountCreationDate = new Date(data.me.createdAt);
            const payouts = data.me.Payouts;
            const grouped = groupPayouts(payouts, view, accountCreationDate);
            setCumulativePayouts(grouped);
        }
    }, [loading, error, data, view]);

    const groupPayouts = (payouts, view, accountCreationDate) => {
        const grouped = {};

        payouts.forEach(payout => {
            const date = new Date(payout.createdAt);
            if (date < accountCreationDate) return;

            let key = '';
            switch (view) {
                case 'year':
                    key = date.getFullYear().toString();
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'week': {
                    const startOfYear = new Date(date.getFullYear(), 0, 1);
                    const dayDiff = (date - startOfYear) / 86400000;
                    const weekNum = Math.ceil((dayDiff + startOfYear.getDay() + 1) / 7);
                    key = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                    break;
                }
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                default:
                    break;
            }

            if (!grouped[key]) grouped[key] = 0;
            grouped[key] += payout.amount;
        });

        return Object.entries(grouped)
            .map(([label, amount]) => ({ label, amount }))
            .sort((a, b) => new Date(a.label) - new Date(b.label));
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <p className="label">{`Period: ${payload[0].payload.label}`}</p>
                    <p className="amount">{`Amount: $${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full border bg-white rounded-lg mt-3 p-3 font-sans">
            <div className='w-full flex justify-between items-center p-4'>
                <div className="flex items-center gap-2">
                    <label className='font-["Semibold"] text-sm'>View:</label>
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                    >
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                    </select>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center border px-3 p-1 rounded-full gap-2'>
                        <div className='w-3 h-2 rounded-full bg-black' />
                        <div className='text-xs font-["Semibold"]'>Money made</div>
                    </div>
                    <div className='flex items-center border px-3 p-1 rounded-full gap-2'>
                        <div className='w-3 h-2 rounded-full bg-sky-100' />
                        <div className='text-xs font-["Semibold"]'>No money made</div>
                    </div>
                </div>
            </div>
            {cumulativePayouts.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium mb-4">No Payout Data Available</p>
            ) : (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={cumulativePayouts} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                        <XAxis dataKey="label" fontSize={12} tick={{ fill: '#000' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type='natural'
                            dataKey="amount"
                            stroke="#000"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SimpleChart;
