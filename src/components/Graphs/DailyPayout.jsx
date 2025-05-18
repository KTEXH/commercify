import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../../Data/Me';
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const getStartOfISOWeek = (year, weekNum) => {
    const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = new Date(simple);
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
};

const SimpleChart = ({ total }) => {
    const { data, loading, error } = useQuery(ME_QUERY);
    const [cumulativePayouts, setCumulativePayouts] = useState([]);
    const [view, setView] = useState('day');

    useEffect(() => {
        if (!loading && !error && data?.me?.createdAt && data.me.Payouts) {
            const payouts = data.me.Payouts;
            const grouped = groupPayouts(payouts, view);
            setCumulativePayouts(grouped);
        }
    }, [loading, error, data, view]);

    const getTimeIntervals = (view) => {
        const now = new Date();
        const intervals = [];

        switch (view) {
            case 'day':
                for (let i = 3; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(now.getDate() - i);
                    intervals.push(date.toISOString().split('T')[0]);
                }
                break;
            case 'week':
                for (let i = 3; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(now.getDate() - i * 7);
                    const startOfYear = new Date(date.getFullYear(), 0, 1);
                    const dayDiff = (date - startOfYear) / 86400000;
                    const weekNum = Math.ceil((dayDiff + startOfYear.getDay() + 1) / 7);
                    intervals.push(`${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`);
                }
                break;
            case 'month':
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(now.getMonth() - i);
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    intervals.push(key);
                }
                break;
            case 'year':
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(now.getMonth() - i);
                    const label = date.toLocaleString('default', { month: 'short' });
                    intervals.push(label);
                }
                break;
            default:
                break;
        }

        return intervals;
    };

    const groupPayouts = (payouts, view) => {
        const intervals = getTimeIntervals(view);
        const grouped = {};

        payouts.forEach(payout => {
            const date = new Date(payout.createdAt);
            let key = '';

            switch (view) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week': {
                    const startOfYear = new Date(date.getFullYear(), 0, 1);
                    const dayDiff = (date - startOfYear) / 86400000;
                    const weekNum = Math.ceil((dayDiff + startOfYear.getDay() + 1) / 7);
                    key = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                    break;
                }
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = date.toLocaleString('default', { month: 'short' });
                    break;
                default:
                    break;
            }

            if (!grouped[key]) grouped[key] = 0;
            grouped[key] += payout.amount;
        });

        return intervals.map(label => ({
            label,
            amount: grouped[label] || 0,
        }));
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
        <div className="w-full shadow-sm flex flex-col border bg-white rounded-3xl mt-3 h-72 p-3 font-sans">
            <div className='w-full flex justify-between items-center p-4'>
                <div className="flex items-center gap-4">
                    <div class='text-3xl font-["Semibold"]'>${total}</div>
                    <div class='h-8 border-l' />

                    <div class='px-4 py-1 text-xs font-["Semibold"] border rounded-full shadow-sm' onClick={() => setView('year')} >Year</div>
                    <div class='px-4 py-1 text-xs font-["Semibold"] border rounded-full shadow-sm' onClick={() => setView('month')} >Month</div>
                    <div class='px-4 py-1 text-xs font-["Semibold"] border rounded-full shadow-sm' onClick={() => setView('week')} >Week</div>
                    <div class='px-4 py-1 text-xs font-["Semibold"] border rounded-full shadow-sm' onClick={() => setView('day')} >Days</div>

                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center shadow-sm border px-3 p-2 rounded-full gap-2'>
                        <div className='w-2 h-2 rounded-full bg-black' />
                        <div className='text-xs font-["Semibold"]'>Money made</div>
                    </div>
                    <div className='flex items-center border shadow-sm px-3 p-2 rounded-full gap-2'>
                        <div className='w-2 h-2 rounded-full bg-gray-200' />
                        <div className='text-xs font-["Semibold"]'>No money made</div>
                    </div>
                </div>
            </div>
            {cumulativePayouts.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium mb-4">No Payout Data Available</p>
            ) : (
                <ResponsiveContainer width="100%">
                    <BarChart data={cumulativePayouts} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(label) => {
                                switch (view) {
                                    case 'day': {
                                        const date = new Date(label);
                                        return date.toLocaleDateString('default', { weekday: 'short' });
                                    }
                                    case 'week': {
                                        const [year, week] = label.split('-W');
                                        const weekStart = getStartOfISOWeek(year, parseInt(week));
                                        return weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                                    }
                                    case 'month': {
                                        const [year, month] = label.split('-');
                                        return new Date(`${year}-${month}-01`).toLocaleDateString('default', { month: 'short' });
                                    }
                                    case 'year':
                                        return label;
                                    default:
                                        return label;
                                }
                            }}
                            tick={{
                                fill: '#000', // text color
                                fontSize: 12,
                                fontFamily: 'Semibold',
                                textAnchor: 'middle',
                                dy: 10 // adjust vertical alignment if needed
                            }}
                        />


                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="amount"
                            shape={(props) => {
                                const { x, y, width, height, payload } = props;
                                const radius = 12;
                                const minHeight = 40;
                                const isZero = payload.amount === 0;
                                const adjustedHeight = isZero ? minHeight : height;
                                const adjustedY = isZero ? y + (height - minHeight) : y;
                                const fill = isZero ? '#ccc' : '#000';

                                const path = `
        M${x},${adjustedY + adjustedHeight}
        V${adjustedY + radius}
        Q${x},${adjustedY} ${x + radius},${adjustedY}
        H${x + width - radius}
        Q${x + width},${adjustedY} ${x + width},${adjustedY + radius}
        V${adjustedY + adjustedHeight}
        Z
    `;

                                return <path d={path} fill={fill} />;
                            }}

                            minPointSize={70}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SimpleChart;
