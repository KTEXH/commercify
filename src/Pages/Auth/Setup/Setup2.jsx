import React from "react";
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { ME_QUERY } from '../../../Data/Me'
import { useNavigate } from 'react-router-dom'
import Group from "../../../components/assets/Group";

const Profile = gql`
 mutation updateProfile($bio: String, $avatar: String, $secondary: String){
    updateProfile(bio: $bio, avatar: $avatar, secondary: $secondary){
        id
    }
 }`

export const Setup2 = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [profile] = useMutation(Profile, {
        refetchQueries: [{ query: ME_QUERY }],
    })
    const navigate = useNavigate()
    const avatarFile = React.useRef(null)


    const [avatar, setAvatar] = React.useState()
    const [avatarLoading, setAvatarLoading] = React.useState(false)


    const [bio, setBio] = React.useState("");

    const handleBio = (event) => {
        setBio(event.target.value);
    };
    const [warning, setWarning] = React.useState(null)

    const handleSubmit = async () => {
        // Check if both secondary and avatar are null
        if (!avatar) {
            setWarning("Must select an avatar to continue.")
            return;
        }

        // Mutation logic here
        try {
            await profile({
                variables: {
                    bio: bio,
                    avatar: avatar,
                },
            })

            // Navigate or perform other actions upon successful submission
            navigate('/setup3') // Update with the desired navigation
        } catch (error) {
            console.error("Error submitting profile:", error)
            // Handle error as needed
        }
    }

    const skipPage = () => {
        navigate('/setup3')
    }

    const uploadAvatar = async (e) => {
        const files = e.target.files
        const data = new FormData()
        data.append("file", files[0])
        data.append("upload_preset", "kyroapp")
        setAvatarLoading(true)
        const res = await fetch("https://api.cloudinary.com/v1_1/dapcizjsz/image/upload", {
            method: "POST",
            body: data,
        })
        const file = await res.json()

        setAvatar(file.secure_url)
        setAvatarLoading(false)
    }

    const name = data?.me?.name;
    const firstLetter = name ? name[0] : null;

    if (error) return <div>{error.message}</div>
    if (loading) return <div>Loading...</div>
    return (
        <div class='w-full grid grid-cols-2 relative gap-10 h-screen'>
            <div class='absolute flex items-center font-["Semibold"] gap-3 top-5 left-5'>
                <Group className='h-7 w-7' />
                <div>Commercify</div>
            </div>


            <div class='flex flex-fol items-center justify-center'>

                <div class='max-w-lg mx-auto my-20'>
                    <div class='flex items-start justify-start flex-col'>
                        <div class='text-gray-500 text-sm font-["Medium"]'>2/3</div>
                        <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2 text-center'>Let's setup your workspace</div>
                        <div class='font-["Medium"] text-gray-500 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
                    </div>


                    <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-sm leading-6 mb-3 mt-6 text-black">
                        Workspace avatar
                    </label>
                    <div className="flex gap-3 items-center">
                        <div className={`${avatar ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-sky-100 justify-center flex"}`} aria-hidden="true" >
                            {firstLetter}
                        </div>
                        {avatarLoading ? (
                            <h3>Loading...</h3>
                        ) : (
                            <>
                                {avatar ? (
                                    <span onClick={() => avatarFile.current.click()}>
                                        <img
                                            src={avatar}
                                            class='h-12 w-12 rounded-full '
                                            alt="avatar"
                                            onClick={() => avatarFile.current.click()}

                                        />

                                    </span>
                                ) : (
                                    <span onClick={() => avatarFile.current.click()}>
                                        <i
                                            className="fa fa-user fa-5x"
                                            aria-hidden="true"
                                            onClick={() => avatarFile.current.click()}
                                        ></i>
                                    </span>
                                )}
                            </>
                        )}

                        <div class='gap-y-2 flex flex-col'>
                            <div>
                                <label
                                    style={{ fontFamily: 'Semibold' }}
                                    htmlFor="file-upload"
                                    className="cursor-pointer inline-block flex-none grow-0 rounded-lg px-6 bg-white border text-xs text-black py-2.5"
                                >
                                    <span>Upload avatar</span>
                                    <input id="file-upload" name="file-upload" type="file"
                                        placeholder="Upload an image"
                                        onChange={uploadAvatar}
                                        ref={avatarFile}
                                        style={{ display: "none" }} className="sr-only" />

                                </label>
                            </div>
                            <div class='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
                        </div>
                    </div>

                    <Formik
                        initialValues={{ bio: "" }}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="w-full flex flex-col mt-4">
                                <label htmlFor="description" style={{ fontFamily: 'Semibold' }} className="block text-sm leading-6 mb-3 text-black">
                                    Description
                                </label>
                                <input
                                    id="bio"
                                    name="bio"
                                    value={bio}
                                    onChange={handleBio}
                                    placeholder="Tell us about yourself..."
                                    className="block self-stretch px-3 rounded-xl border border-solid text-sm border-gainsboro font-['Normal'] py-3 text-gray-900 placeholder:text-gray-400 "

                                />

                            </div>
                            {warning && (
                                <div style={{ fontFamily: 'Medium' }} className="bg-red-500 text-white p-3 mt-5 rounded-xl">
                                    {warning}
                                </div>
                            )}
                            <button
                                style={{ fontFamily: 'Semibold' }}
                                type="submit"

                                className="gap-4 mt-5 w-full text-sm border-0 justify-center rounded-lg px-8 py-4 leading-6 bg-black text-[#fff]"
                            >
                                Next
                            </button>

                            <button
                                style={{ fontFamily: 'Semibold' }}
                                onClick={skipPage}
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