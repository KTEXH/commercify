import React from 'react'
import { Radio, RadioGroup, RadioGroupOption } from '@headlessui/react'
import { gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import Group from '../../../components/assets/Group'

const Influencer = gql`
   mutation Influencer($type: String){
            Influencer(type: $type){
                id
            }
   }`

export const Setup = () => {
    const navigate = useNavigate()
    const Types = [
        {
            name: "Musician",
            desc: "",

        },
        {
            name: "Artist",
            desc: "",

        },
        {
            name: "Digital Creator",
            desc: "",

        },
        {
            name: "Blogger",
            desc: "",

        },
        {
            name: "Author",
            desc: "",

        },
        {
            name: 'Educator',
            desc: "",

        },
        {
            name: "Journalist",
            desc: "",

        },
        {
            name: "Podcaster",
            desc: "",

        },
        {
            name: "Livestreamer",
            desc: "",

        },
        {
            name: 'Brand',
            desc: "",

        },
        {
            name: "Business",
            desc: "",

        },
        {
            name: "Non-Profit",
            desc: "",

        },
        {
            name: 'Other',
            desc: "",

        }
    ]
    const [influence] = useMutation(Influencer)
    return (
        <div class='w-full grid grid-cols-2 relative gap-10 h-screen'>
            <div class='absolute flex items-center font-["Semibold"] gap-3 top-5 left-5'>
                <Group className='h-7 w-7' />
                <div>Commercify</div>
            </div>

            <div class='flex flex-fol items-center justify-center'>

                <div class='max-w-lg mx-auto my-20'>
                    <div class='flex items-start justify-start flex-col'>
                        <div class='text-gray-500 text-sm font-["Medium"]'>1/3</div>
                        <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2 text-center'>Let's setup your workspace</div>
                        <div class='font-["Medium"] text-gray-500 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
                    </div>

                    <Formik

                        initialValues={{ type: "" }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true)
                            await influence({
                                variables: { ...values, },
                            })
                            navigate('/setup2')
                            setSubmitting(false)
                        }}
                    >
                        {({ setFieldValue, handleSubmit, values }) => (
                            <div class='mt-5'>
                                <div class='mb-2 font-["Semibold"]'>Occupation</div>
                                <RadioGroup class='gap-2 flex flex-row flex-wrap items-start justify-start'>
                                    {Types.map(item => (
                                        <Radio class='block' onClick={() => { setFieldValue("type", item.name) }} value={item.name}>
                                            {({ checked }) => (
                                                <div onClick={() => { setFieldValue("type", item.name) }} className={checked ? 'border-[1px] border-solid border-royalblue text-sm text-black bg-[#fff] px-5 py-3.5 rounded-lg' : 'bg-black text-[#fff] flex text-sm rounded-lg px-5 py-3.5'}>
                                                    <div style={{ fontFamily: 'Semibold' }} class='text-sm'>{item.name}</div>
                                                </div>
                                            )}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                                <button
                                    style={{ fontFamily: 'Semibold' }}
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="bg-black p-4 text-[#fff] mt-10 w-full border-0 rounded-lg"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </Formik>
                </div>

            </div>

            <div class='h-full bg-black w-full'>

            </div>


        </div>
    )
}