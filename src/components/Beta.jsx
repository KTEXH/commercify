import React from 'react'
import { Header } from './LandingHeader'

export const Beta = () => {
    return(
        <div class='lg:max-w-screen-lg lg:mx-auto mx-5 flex items-center justify-center flex-col'>
            <Header />
            <div class='mt-32 flex justify-center flex-col'>
                 <div class='text-6xl font-["Semibold"]'>Beta</div>
                 <div class=''>Get used to beta and sign up early</div>
            </div>
        </div>
    )
}