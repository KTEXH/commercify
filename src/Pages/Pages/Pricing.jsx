import React from 'react'
import { Header } from '../../components/LandingHeader'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Tab, TabGroup, TabList, TabPanel } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
const tiers = [
    {
        name: 'Starter',
        id: 'tier-hobby',
        href: '#',
        priceMonthly: 'Free',
        description: "The perfect plan if you're just getting started with our product.",
        features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-enterprise',
        href: '#',
        priceMonthly: '$8',
        description: 'Dedicated support and infrastructure for your company.',
        features: [
            'Unlimited products',
            'Unlimited subscribers',
            'Advanced analytics',
            'Dedicated support representative',
        ],
        featured: true,
    },
]

const time = ['Monthly', 'Yearly']

export function Pricing() {

    const navigate = useNavigate()

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div class='lg:max-w-screen-lg lg:mx-auto mx-5 flex items-center justify-center flex-col'>
            <Header />
            <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="mx-auto aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    />
                </div>
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base/7 font-['Semibold']">Pricing</h2>
                    <p className="mt-2 text-5xl font-['Semibold'] tracking-tight text-balance text-black sm:text-6xl">
                        Choose the right plan for you
                    </p>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-['Medium'] text-gray-500">
                        Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
                        loyalty, and driving sales.
                    </p>
                </div>
                <div>
                    <TabGroup class='flex flex-col w-full justify-center items-center mt-5'>
                        <TabList class='bg-gray-100 rounded-full px-2 py-1'>
                            {time.map(time => {
                                return (
                                    <Tab
                                        className='data-[selected]:bg-white rounded-full px-3 text-gray-400 py-1 data-[selected]:text-md text-sm outline-0 data-[selected]:text-black font-["Medium"] data-[selected]:font-["Semibold"]'
                                    >
                                        {time}
                                    </Tab>
                                )
                            })}
                        </TabList>
                        <TabPanel>

                            <div className="mx-auto grid max-w-lg grid-cols-1 items-center gap-x-6 mt-7 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                                {tiers.map((tier) => (
                                    <div
                                        key={tier.id}
                                        className={classNames(
                                            'border rounded-xl p-7'
                                        )}
                                    >
                                        <h3
                                            id={tier.id}
                                            className={classNames('font-["Semibold"] text-2xl')}
                                        >
                                            {tier.name}
                                        </h3>
                                        <p className="mt-4 flex items-baseline gap-x-2">
                                            <span
                                                className={classNames('font-["Semibold"] text-2xl')}
                                            >
                                                {tier.priceMonthly}
                                            </span>
                                            <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'font-["Medium"]')}>/month</span>
                                        </p>
                                        <p className={classNames('mt-6 font-["Medium"] text-sm mb-4 text-base/7')}>
                                            {tier.description}
                                        </p>
                                        <div
                                            className={classNames('space-y-2')}
                                        >
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex font-['Medium'] text-sm gap-x-3">
                                                    <CheckIcon
                                                        aria-hidden="true"
                                                        className={classNames('h-5 w-4 text-gray-400 flex-none')}
                                                    />
                                                    {feature}
                                                </li>
                                            ))}
                                        </div>
                                        <div
                                            href={tier.href}
                                            aria-describedby={tier.id}
                                            className={classNames(tier.featured === false ? 'border text-black font-["Semibold"]' : 'bg-black font-["Semibold"] text-white', 'w-full rounded-full mt-4 text-sm flex items-center justify-center py-3')}
                                        >
                                            Get started today
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                    </TabGroup>
                </div>

            </div>
        </div>
    )
}