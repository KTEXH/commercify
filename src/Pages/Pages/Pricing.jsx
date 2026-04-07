import React from 'react'
import { Header } from '../../components/LandingHeader'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import initials from '../../components/assets/initial.svg'
import Group3 from '../../components/assets/Group3'

const tiers = [
    {
        name: 'Starter',
        id: 'tier-starter',
        href: '/beta',
        price: 'Free',
        description: "Perfect if you're just getting started.",
        features: [
            '5 products', '5 services', '1 Storefront', '1 Workshop',
            '1 Link-in-bio', '1 Form', '7.5% transaction fee', 'Link-in-bio tools',
        ],
        featured: false,
    },
    {
        name: 'Plus',
        id: 'tier-plus',
        href: '/beta',
        price: '$9',
        period: '/mo',
        description: 'Perfect for creators and businesses of any size.',
        features: [
            '10 products', '10 services', 'No transaction fees',
            '1 Storefront', '1 Workshop', '1 Link-in-bio', '1 Form',
            'Advanced analytics', 'Passcoded storefronts',
            'Custom domains', 'Branding options',
        ],
        featured: true,
    },
]

export function Pricing() {
    const navigate = useNavigate()

    return (
        <div className='bg-white min-h-screen'>
            <div className='bg-zinc-950 pb-32 relative overflow-hidden'>
                <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]' />
                <Header />
                <div className='relative z-10 pt-40 pb-4 px-6 text-center max-w-3xl mx-auto'>
                    <div className='inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-6'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
                        <span className='text-xs font-["Semibold"] text-zinc-300'>Simple, transparent pricing</span>
                    </div>
                    <h1 className='text-5xl md:text-6xl font-["Semibold"] text-white tracking-tight mb-4'>
                        Start free,<br />scale when ready.
                    </h1>
                    <p className='text-zinc-400 font-["Medium"] text-base max-w-md mx-auto'>
                        Choose a plan that fits your business. No hidden fees, no surprises.
                    </p>
                </div>
            </div>

            {/* Pricing cards — pulled up over dark section */}
            <div className='max-w-4xl mx-auto px-6 -mt-16 relative z-20'>
                <div className='grid md:grid-cols-2 gap-5'>
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-2xl p-8 border transition-all ${
                                tier.featured
                                    ? 'bg-zinc-950 border-zinc-800 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.4)]'
                                    : 'bg-white border-zinc-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                            }`}
                        >
                            <div className='flex items-start justify-between mb-6'>
                                <div>
                                    <div className={`text-xs font-["Semibold"] uppercase tracking-widest mb-2 ${tier.featured ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                        {tier.name}
                                    </div>
                                    <div className='flex items-baseline gap-1'>
                                        <span className={`text-4xl font-["Semibold"] ${tier.featured ? 'text-white' : 'text-zinc-950'}`}>
                                            {tier.price}
                                        </span>
                                        {tier.period && (
                                            <span className={`text-sm font-["Medium"] ${tier.featured ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                {tier.period}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {tier.featured && (
                                    <span className='bg-white/10 text-white text-xs font-["Semibold"] px-3 py-1 rounded-full border border-white/10'>
                                        Most popular
                                    </span>
                                )}
                            </div>

                            <p className={`text-sm font-["Medium"] mb-7 ${tier.featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {tier.description}
                            </p>

                            <ul className='space-y-3 mb-8'>
                                {tier.features.map((feature) => (
                                    <li key={feature} className='flex items-center gap-3'>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tier.featured ? 'bg-white/10' : 'bg-emerald-50'}`}>
                                            <CheckIcon className={`h-3 w-3 ${tier.featured ? 'text-white' : 'text-emerald-500'}`} />
                                        </div>
                                        <span className={`text-sm font-["Medium"] ${tier.featured ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={tier.href}
                                className={`w-full flex items-center justify-center py-3 rounded-xl text-sm font-["Semibold"] transition-colors ${
                                    tier.featured
                                        ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                                        : 'bg-zinc-950 text-white hover:bg-zinc-800'
                                }`}
                            >
                                Get started
                            </a>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className='mt-24 mb-20'>
                    <h2 className='font-["Semibold"] text-2xl text-zinc-950 mb-10'>Frequently asked questions</h2>
                    <div className='grid md:grid-cols-2 gap-8'>
                        {[
                            { q: 'Do you offer a free trial?', a: "We don't offer a free trial, but our beta stage product includes the majority of paid features." },
                            { q: 'Do I need a credit card for the free plan?', a: "No — we won't ask for payment information until you decide to upgrade." },
                            { q: 'Are payments secure?', a: 'All payments are handled by Stripe, one of the most trusted payment processors in the world.' },
                            { q: 'Is there an annual payment plan?', a: 'Being in beta, we do not currently offer an annual plan. Check back soon.' },
                        ].map(({ q, a }) => (
                            <div key={q} className='border border-zinc-100 rounded-2xl p-6'>
                                <div className='font-["Semibold"] text-zinc-900 text-sm mb-2'>{q}</div>
                                <div className='font-["Medium"] text-zinc-500 text-sm leading-relaxed'>{a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonial */}
                <div className='bg-zinc-50 border border-zinc-100 rounded-2xl p-10 mb-24'>
                    <div className='max-w-xl'>
                        <div className='text-zinc-400 font-["Semibold"] text-xs uppercase tracking-widest mb-4'>What our users say</div>
                        <blockquote className='text-xl font-["Semibold"] text-zinc-950 leading-snug mb-6'>
                            "Setting up my salon was effortless — within minutes I was already receiving bookings!"
                        </blockquote>
                        <div className='flex items-center gap-3'>
                            <img src={initials} className='w-9 h-9 rounded-full bg-zinc-200' />
                            <div>
                                <div className='text-sm font-["Semibold"] text-zinc-900'>Sarah Johnson</div>
                                <div className='text-xs font-["Medium"] text-zinc-500'>Owner of Salon</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='bg-zinc-950 px-6 py-14'>
                <div className='max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8'>
                    <div className='flex items-center gap-2.5'>
                        <Group3 className='w-6 h-6' />
                        <span className='font-["Semibold"] text-white text-sm'>Commercify HQ</span>
                    </div>
                    <div className='flex gap-8'>
                        <a href='/register' className='text-zinc-500 font-["Semibold"] text-sm hover:text-white transition-colors'>Create account</a>
                        <a href='/login' className='text-zinc-500 font-["Semibold"] text-sm hover:text-white transition-colors'>Login</a>
                        <a href='/pricing' className='text-zinc-500 font-["Semibold"] text-sm hover:text-white transition-colors'>Pricing</a>
                    </div>
                    <span className='text-zinc-600 font-["Medium"] text-xs'>© 2025 Commercify HQ</span>
                </div>
            </footer>
        </div>
    )
}
