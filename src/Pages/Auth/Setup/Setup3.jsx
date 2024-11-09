import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { useNavigate } from 'react-router-dom'
import Group from '../../../components/assets/Group'


const Addition = gql`
   mutation updateProfile($more: String, $website: String){
              updateProfile(more: $more, website: $website){
                id
              }
   }`
export const Setup3 = () => {

    const navigate = useNavigate()
    const [profile] = useMutation(Addition)
    const [website, setWebsite] = useState("")

    const [more, setMore] = React.useState("");

    const handleWebsite = (event) => {
        setWebsite(event.target.value);
    };

    const handleMore = (event) => {
        setMore(event.target.value);
    };

    const handleSubmit = async () => {
        // Check if both secondary and avatar are null

        // Mutation logic here
        try {
            await profile({
                variables: {
                    moreinfo: more,
                    website: website,
                },
            })

            // Navigate or perform other actions upon successful submission
            navigate('/dashboard') // Update with the desired navigation
        } catch (error) {
            console.error("Error submitting profile:", error)
            // Handle error as needed
        }
    }


    return(
        <div class='w-full grid grid-cols-2 relative gap-10 h-screen'>
            <div class='absolute flex items-center font-["Semibold"] gap-3 top-5 left-5'>
                <Group className='h-7 w-7' />
                <div>Commercify</div>
            </div>


            <div class='flex flex-fol items-center justify-center'>

                <div class='max-w-lg mx-auto my-20'>
                    <div class='flex items-start justify-start flex-col'>
                        <div class='text-gray-500 text-sm font-["Medium"]'>3/3</div>
                        <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2 text-center'>Let's setup your workspace</div>
                        <div class='font-["Medium"] text-gray-500 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
                    </div>


                   

                    <Formik
                        initialValues={{ moreinfo: "", website: "" }}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="w-full flex flex-col mt-4">
                                <label htmlFor="description" style={{ fontFamily: 'Semibold' }} className="block text-sm leading-6 mb-3 text-black">
                                    Website
                                </label>
                                <input
                                    id="website"
                                    name="website"
                                    value={website}
                                    onChange={handleWebsite}
                                    placeholder="https://www.example.com/"
                                    className="block self-stretch px-3 rounded-xl border border-solid text-sm border-gainsboro font-['Normal'] py-3 text-gray-900 placeholder:text-gray-400 "

                                />

                            </div>
                            <div className="w-full flex flex-col mt-4">
                                <label htmlFor="description" style={{ fontFamily: 'Semibold' }} className="block text-sm leading-6 mb-3 text-black">
                                    More info
                                </label>
                                <input
                                    id="more"
                                    name="more"
                                    value={more}
                                    onChange={handleMore}
                                    placeholder="Tell us about yourself..."
                                    className="block self-stretch px-3 rounded-xl border border-solid text-sm border-gainsboro font-['Normal'] py-3 text-gray-900 placeholder:text-gray-400 "

                                />

                            </div>
                          
                            <button
                                style={{ fontFamily: 'Semibold' }}
                                type="submit"

                                className="gap-4 mt-5 w-full text-sm border-0 justify-center rounded-lg px-8 py-4 leading-6 bg-black text-[#fff]"
                            >
                                Next
                            </button>

                            <button
                                style={{ fontFamily: 'Semibold' }}
                                type="submit"

                                className="gap-4 mt-5 w-full text-sm justify-center rounded-lg px-8 py-4 leading-6 border text-black"
                            >
                                Skip
                            </button>
                        </Form>
                    </Formik>



                </div>
            </div>
            <div class='h-full bg-black w-full'>

            </div>
        </div>

    )
}