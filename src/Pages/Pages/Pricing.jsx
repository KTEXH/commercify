import React from 'react'
import { Header } from '../../components/LandingHeader'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Tab, TabGroup, TabList, TabPanel } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import initials from '../../components/assets/initial.svg'
import Group3 from '../../components/assets/Group3'
const tiers = [
    {
        name: 'Starter',
        id: 'tier-hobby',
        href: '/beta',
        priceMonthly: 'Free',
        priceYearly: 'Free',
        description: "The perfect plan if you're just getting started with our product.",
        features: [
            '5 products',
            '5 services',
            '1 Storefront',
            '1 Workshop',
            '1 Link-in-bio',
            '1 Form',
            '7.5% Transaction Fee',
            'Link-in-bio tools'],
        featured: false,
    },
    {
        name: 'Plus',
        id: 'tier-enterprise',
        href: '/beta',
        priceMonthly: '$9',
        priceYearly: '$76',
        description: 'Perfect for creators and businesses any size.',
        features: [
            '10 products',
            '10 services',
            'No transaction fees',
            '1 Storefront',
            '1 Workshop',
            '1 Link-in-bio',
            '1 Form',
            'Advanced analytics',
            'Passcoded storefronts',
            'Custom Domains',
            'Branding options'
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
        <div>
            <div class='lg:max-w-screen-lg lg:mx-auto mx-5 flex items-center justify-center flex-col'>
                <Header />
                <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
                 
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="md:mt-2 mt-8 text-5xl font-['Semibold'] tracking-tight text-balance text-black sm:text-6xl">
                            Simple Pricing
                        </p>
                        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-['Medium'] text-gray-500">
                            Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
                            loyalty, and driving sales.
                        </p>
                    </div>
                    <div>


                        <div className="mx-auto grid max-w-lg grid-cols-1 gap-y-5 gap-x-6 mt-7 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
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
                                            className={classNames('font-["Bold"] text-2xl')}
                                        >
                                            {tier.priceMonthly}
                                        </span>
                                        <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-400', 'font-["Medium"]')}>/mo</span>
                                    </p>
                                    <p className={classNames('mt-3 font-["Medium"] text-gray-400 text-sm mb-4')}>
                                        {tier.description}
                                    </p>
                                    <div
                                        className={classNames('space-y-2')}
                                    >
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex font-['Semibold'] text-sm gap-x-3">
                                                <div class='bg-[#00b600] w-7 h-7 rounded-full flex items-center justify-center'>
                                                    <CheckIcon
                                                        aria-hidden="true"
                                                        className={classNames('h-5 w-4 text-white flex-none')}
                                                    />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </div>
                                    <div
                                        href={tier.href}
                                        aria-describedby={tier.id}
                                        className={classNames('bg-black font-["Semibold"] text-white', 'w-full rounded-full mt-4 text-sm flex items-center justify-center py-3')}
                                    >
                                        Join Today
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                    <div class='mt-20'>
                        <div class='font-["Semibold"] text-2xl'>Frequently asked questions</div>
                        <div class='grid md:grid-cols-2 mt-10 gap-20'>
                            <div>
                                <div class='font-["Semibold"]'>Do you offer a free trial?</div>
                                <div class='font-["Medium"] mt-1 text-gray-400'>We dont offer a free trial although our beta stage product will have the majority off paid features within it.</div>
                            </div>
                            <div>
                                <div class='font-["Semibold"]'>Do I need a credit card for the free plan?</div>
                                <div class='font-["Medium"] mt-1 text-gray-400'>No, we wont ask for any payment information. If you were to upgrade would be the only time we ask for payment info.</div>
                            </div>
                            <div>
                                <div class='font-["Semibold"]'>Are payments secure?</div>
                                <div class='font-["Medium"] mt-1 text-gray-400'>All payments are secure, we use stripe as our payment gateway. Learn more about stripe here.</div>
                            </div>
                            <div>
                                <div class='font-["Semibold"]'>Is there a anual payment plan?</div>
                                <div class='font-["Medium"] mt-1 text-gray-400'>Being this early with only a beta stage, we do not offer a annual plan as of yet.</div>

                            </div>
                        </div>
                    </div>
                    <div class='mt-20 w-full'>
                        <div class='bg-gray-100 flex items-center justify-center rounded-2xl md:py-24 py-14 md:p-14 p-8'>
                            <div class='md:w-2/3'>
                                <div class='text-gray-400 font-["Semibold"]'>What our users say about us</div>
                                <div class='md:text-3xl text-xl mt-1 font-["Semibold"]'>Setting up my salon was effortless—within minutes, I was already receiving bookings!</div>
                                <div class='flex items-center mt-3 gap-2'>
                                    <img src={initials} class='w-10 h-10 rounded-full' />
                                    <div>
                                        <div class='text-sm font-["Semibold"]'>Sarah Johnson</div>
                                        <div class='text-sm font-["Medium"] text-gray-400'>Owner of Salon</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative w-full">
                <div class="absolute h-16 w-full bg-white rounded-b-[50px] z-10"></div>
                <img src='/Browser.svg' />
                <div class="bg-black relative h-96 w-full z-0">
                    <div class='md:flex items-center w-full justify-between p-8 max-w-screen-xl mx-auto'>
                        <div class='mt-16'>
                            <Group3 className='w-10 h-10' />
                            <div clas>
                                <div class='text-md font-["Medium"] mt-5 text-white'>Simplify your ecommerce expirence</div>

                            </div>
                        </div>
                        <div class='flex gap-8 xs:justify-between w-full md:justify-center'>
                            <div class='text-white text-sm mt-16 font-["Semibold"] flex flex-col gap-2'>
                                <div>Instagram</div>
                                <div>Twitter</div>
                                <div>Get started with beta</div>
                            </div>
                            <div class='text-white text-sm mt-16 font-["Semibold"] flex flex-col gap-2'>
                                <div>Create account</div>
                                <div>Login</div>
                                <div>Pricing</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}