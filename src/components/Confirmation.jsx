import React from 'react'
import Group from './assets/Group'

export const Confirmation = () => {
    return(
        <div class='flex items-center justify-center p-8 max-w-lg mx-auto flex-col w-full h-screen'>
            <Group className='w-12 h-12'/>
            <div class='mt-4'>
                <div class='font-["Semibold"] text-3xl text-center'>Thanks for signing up for our beta product! 🎉</div>
                <div class='font-["Medium"] text-gray-400 mt-2 text-center'>Thanks for signing up, we will reach out to you with a activation link. Where you can setup your account and start experiencing Commercify. </div>
            </div>
                <a href='/' class='mt-5 border rounded-full text-center p-5 font-["Semibold"] text-sm'>Go back home</a>
        </div>
    )
}