import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../../Data/Me';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const getStartOfISOWeek = (year, weekNum) => {
    const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = new Date(simple);
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
};

const VIEWS = ['Day', 'Week', 'Month', 'Year'];

const SimpleChart = ({ total, payouts: payoutsProp }) => {
    const { data, loading, error } = useQuery(ME_QUERY, { skip: !!payoutsProp });
    const [cumulativePayouts, setCumulativePayouts] = useState([]);
    const [view, setView] = useState('month');

    useEffect(() => {
        const payouts = payoutsProp ?? data?.me?.Payouts;
        if (payouts) setCumulativePayouts(groupPayouts(payouts, view));
    }, [loading, data, view, payoutsProp]);

    const getTimeIntervals = (v) => {
        const now = new Date();
        const intervals = [];
        switch (v) {
            case 'day':
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now); d.setDate(now.getDate() - i);
                    intervals.push(d.toISOString().split('T')[0]);
                } break;
            case 'week':
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now); d.setDate(now.getDate() - i * 7);
                    const soy = new Date(d.getFullYear(), 0, 1);
                    const wn = Math.ceil(((d - soy) / 86400000 + soy.getDay() + 1) / 7);
                    intervals.push(`${d.getFullYear()}-W${String(wn).padStart(2, '0')}`);
                } break;
            case 'month':
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now); d.setMonth(now.getMonth() - i);
                    intervals.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                } break;
            case 'year':
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(now); d.setMonth(now.getMonth() - i);
                    intervals.push(d.toLocaleString('default', { month: 'short' }));
                } break;
        }
        return intervals;
    };

    const groupPayouts = (payouts, v) => {
        const intervals = getTimeIntervals(v);
        const grouped = {};
        payouts.forEach(p => {
            const date = new Date(p.createdAt);
            let key = '';
            switch (v) {
                case 'day': key = date.toISOString().split('T')[0]; break;
                case 'week': {
                    const soy = new Date(date.getFullYear(), 0, 1);
                    const wn = Math.ceil(((date - soy) / 86400000 + soy.getDay() + 1) / 7);
                    key = `${date.getFullYear()}-W${String(wn).padStart(2, '0')}`; break;
                }
                case 'month': key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; break;
                case 'year': key = date.toLocaleString('default', { month: 'short' }); break;
            }
            if (!grouped[key]) grouped[key] = 0;
            grouped[key] += p.amount;
        });
        return intervals.map(label => ({ label, amount: grouped[label] || 0 }));
    };

    const formatLabel = (label) => {
        switch (view) {
            case 'day': return new Date(label).toLocaleDateString('default', { weekday: 'short' });
            case 'week': {
                const [year, week] = label.split('-W');
                return getStartOfISOWeek(year, parseInt(week)).toLocaleDateString('default', { month: 'short', day: 'numeric' });
            }
            case 'month': {
                const [year, month] = label.split('-');
                return new Date(`${year}-${month}-01`).toLocaleDateString('default', { month: 'short' });
            }
            default: return label;
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            return (
                <div className='bg-zinc-950 text-white rounded-xl px-3 py-2 shadow-xl border border-white/10'>
                    <p className='text-[10px] font-["Semibold"] text-zinc-400 mb-0.5'>{formatLabel(payload[0].payload.label)}</p>
                    <p className='text-sm font-["Semibold"]'>${payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='w-full'>
            {/* View tabs */}
            <div className='flex items-center gap-1 mb-4'>
                {VIEWS.map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v.toLowerCase())}
                        className={`px-3 py-1 rounded-lg text-xs font-["Semibold"] transition-all ${
                            view === v.toLowerCase()
                                ? 'bg-zinc-950 text-white'
                                : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                        }`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {cumulativePayouts.length === 0 ? (
                <div className='h-40 flex items-center justify-center text-zinc-400 text-sm font-["Medium"]'>
                    No payout data yet
                </div>
            ) : (
                <ResponsiveContainer width='100%' height={180}>
                    <AreaChart data={cumulativePayouts} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
                                <stop offset='0%' stopColor='#10B981' stopOpacity={0.15} />
                                <stop offset='100%' stopColor='#10B981' stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke='#F4F4F5' strokeDasharray='0' />
                        <XAxis
                            dataKey='label'
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatLabel}
                            tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'Semibold' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'Semibold' }}
                            tickFormatter={v => v === 0 ? '0' : `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E4E4E7', strokeWidth: 1 }} />
                        <Area
                            type='monotone'
                            dataKey='amount'
                            stroke='#10B981'
                            strokeWidth={2}
                            fill='url(#areaGrad)'
                            dot={false}
                            activeDot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SimpleChart;
