import React, { useState } from 'react'
import { Radio, RadioGroup, RadioGroupOption } from '@headlessui/react'
import { gql, useMutation } from '@apollo/client'
import { Formik, useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import Group from '../../../components/assets/Group'
import { PlusIcon } from '@heroicons/react/20/solid'
import { CREATE_STORE } from '../../../Pages/Pages/Mutations/Mutations'
import { createClient } from '@supabase/supabase-js'
export const Setup = () => {

    const supabase = createClient(
        'https://hrvpmllpyogxsgxcwrcq.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydnBtbGxweW9neHNneGN3cmNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjM5OTgwNywiZXhwIjoyMDU3OTc1ODA3fQ.Li3A-TLcPvQukSagJilD1D9rGuioodkursddKkYufYk'
    );

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        headerImage: '',
        storefront: true,
        workshop: false,
        linkinbio: false,
        form: false
    })

    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,  // Update the name property in formData
        }));
    };

    const handleTypeChange = (selectedType) => {
        setFormData((prev) => ({
            ...prev,
            storefront: selectedType === 'storefront',
            workshop: selectedType === 'workshop',
            linkinbio: selectedType === 'linkinbio',
            form: selectedType === 'form',
        }));
    };
    const [uploading, setUploading] = useState(false);

    const [create] = useMutation(CREATE_STORE)
    const handleImageUpload = async (event) => {
        if (!event || !event.target.files || event.target.files.length === 0) return;
    
        const file = event.target.files[0];
        const fileName = `${Date.now()}-${file.name}`;
    
        try {
            // Upload to Supabase
            const { data, error } = await supabase.storage
                .from('bubble')
                .upload(`uploads/${fileName}`, file);
    
            if (error) throw error;
    
            // Get the public URL (or just use Supabase's create URL method)
            const { data: publicUrlData } = supabase.storage
                .from('bubble')
                .getPublicUrl(`uploads/${fileName}`);
    
            // Set form data with the image URL
            setFormData((prev) => ({
                ...prev,
                headerImage: publicUrlData.publicUrl, // Assuming public URL is correct
            }));
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
    




    const formik = useFormik({
        initialValues: {
            name: formData.name,
            headerImage: '',
            storefront: true,
            workshop: false,
            linkinbio: false,
            form: false
        },
        onSubmit: async (values) => {
            // Check if passwords match
            await create({
                variables: {
                    name: formData.name,
                    headerImage: formData.headerImage,
                    storefront: formData.storefront,
                    workshop: formData.workshop,
                    linkinbio: formData.linkinbio,
                    form: formData.form
                },
            });
            console.log(values)
            navigate('/dashboard');


        },
    });

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-400 to-indigo-400 opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] z-0"
                />
            </div>            <div class='flex flex-col max-w-sm mx-auto w-full h-full items-center justify-center'>
                <div class='text-2xl font-["Semibold"]'>Let’s get you up and running with your new page</div>
                <form onSubmit={formik.handleSubmit} class='mt-14 flex w-full flex-col'>
                    <div>
                        <div class='font-["Semibold"] text-sm'>Page name({formData.name})</div>
                        <input
                            id='name'
                            name='name'
                            onChange={handleNameChange}
                            value={formData.name}
                            class='border shadow font-["Medium"] bg-white rounded-xl p-2 px-4 text-sm w-full mt-2'
                            placeholder='Hair' />
                    </div>
                    <div>
                        <div class='font-["Semibold"] mt-5 text-sm'>Page type</div>

                        <div className="flex items-center gap-2 text-xs font-['Semibold'] mt-2">
                            {['storefront', 'workshop', 'linkinbio', 'form'].map((type) => (
                                <button
                                    type='button'
                                    key={type}
                                    onClick={() => handleTypeChange(type)}
                                    className={`border rounded-md px-3 py-2 shadow ${formData[type] ? 'bg-black text-white' : ''
                                        }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div class='font-["Semibold"] mt-5 text-sm'>Upload a thumbnail</div>
                        <div class='flex items-center gap-5 mt-2'>
                            {formData.headerImage === '' ? (
                                <label
                                    htmlFor="file"
                                    className="w-16 h-16 rounded-xl flex bg-white items-center justify-center shadow border"
                                >
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        onChange={handleImageUpload} // We don't need index here unless you are mapping over a list
                                        style={{ display: "none" }}
                                        className="sr-only"
                                    />
                                    <PlusIcon className="w-4 h-4" />
                                </label>
                            ) : (
                                <img src={formData.headerImage} className="w-16 h-16 rounded-xl" />
                            )}


                            <div>
                                <div class='font-["Semibold"]'>Upload your page image</div>
                            </div>
                        </div>
                        <button type='submit' class='w-full py-3 rounded-full text-white bg-black font-["Semibold"] mt-5'>Create page</button>
                    </div>
                </form>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-400 to-indigo-400 opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] z-0"
                    />
                </div>
            </div>
        </div>
    )
}