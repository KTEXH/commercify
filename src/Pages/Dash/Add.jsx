import React, { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { All } from './Search'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useFormik } from 'formik'
import { createClient } from '@supabase/supabase-js'
import { ME_QUERY } from '../Data/Me'
import { ProductForm } from './HomeDash'
import { BoltIcon, PlusIcon } from '@heroicons/react/20/solid'
export const CREATE_PRODUCT_MUTATION = gql`
mutation CreateProduct($productData: ProductCreateInput!) {
  CreateProduct(productData: $productData) {
 id
  }
}
`;


export const CREATE = gql`
  mutation createPost(
    $title: String
    $description: String
    $link: String
    $thumbnail: String
    $file: String
    $price: Int
    $filename: String
    $isEbook: Boolean!
    $isDigitalDownload: Boolean!
    $isDonation: Boolean!
    $isAudio: Boolean!
    $isPhysical: Boolean!
    $isClothing: Boolean!
    $isMerchandise: Boolean!
    $isCourse: Boolean!
    $youtubeWebinar: Boolean!
    $zoomWebinar: Boolean!
    $twitchWebinar: Boolean!
    $isWebinar: Boolean!
    $isMembership: Boolean!
    $tagIds: [Int]!
  ) {
    createPost(
      title: $title
      description: $description
      isDonation: $isDonation
      isPhysical: $isPhysical
      thumbnail: $thumbnail
      link: $link
      file: $file
      isClothing: $isClothing
      isMerchandise: $isMerchandise
      filename: $filename
      price: $price
      isEbook: $isEbook
      isDigitalDownload: $isDigitalDownload
      isCourse: $isCourse
      isAudio: $isAudio
      isWebinar: $isWebinar
      youtubeWebinar: $youtubeWebinar
      zoomWebinar: $zoomWebinar
      twitchWebinar: $twitchWebinar
      isMembership: $isMembership
      tagIds: $tagIds
    ) {
      id
      price
      tags{
        id
        tag
      }
    }
  }
`;


const Add = ({ isShown, addSign }) => {

    const { data: aData, error: aError, loading: aLoading } = useQuery(All)
    const [image, setImage] = useState();
    const [imageLoading, setImageLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [publicFile, setFile] = useState(null);
    const [fileSource, setFilename] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        thumbnail: '',
        merchandiseColors: [],
        clothingSizes: [] // Use an array to store sizes
    });
    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'kyroapp');
        setImageLoading(true);
        const res = await fetch('https://api.cloudinary.com/v1_1/dapcizjsz/image/upload', {
            method: 'POST',
            body: data,
        });
        const file = await res.json();

        setImage(file.secure_url);
        setImageLoading(false);
    };

    async function uploadFile(event) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const supabase = createClient(
                'https://rbsteedexxccoqrnyczp.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic3RlZWRleHhjY29xcm55Y3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU5MzIwMTksImV4cCI6MjAwMTUwODAxOX0.FT3oCWVeAGjrMRhLTdCFBSOtIdMDeZj6ApuALkJ185A'
            );
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            setFilename(fileName)
            setFileUrl(filePath);
            let { error: uploadError } = await supabase.storage.from('conten').upload(filePath, file);
            let { data } = supabase.storage.from('conten').getPublicUrl(`${filePath}`);

            const publicFile = data.publicUrl;
            setFile(publicFile);
            console.log(data.publicUrl);
            if (uploadError) {
                throw uploadError;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }

    function handleChangeText(event) {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }
    const [price, setPrice] = useState('');

    // Function to handle changes in the input
    const handlePriceChange = (e) => {
        // Update the price state when the input changes
        setPrice(e.target.value);
    };
    const [create] = useMutation(CREATE, { refetchQueries: [ME_QUERY] });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    let [isOpen, setIsOpen] = useState(false)

    const actualPrice = parseInt(price, 10);
    const [form, setForm] = React.useState({
        title: '',
        description: '',
        link: '',
        tagIds: []
    });

    const [open, setOpen] = useState(false)

    function Submited() {

        setOpen(true)
        setIsOpen(false)
    }
    const [success, setSuccess] = useState(false)

    const formik = useFormik({
        initialValues: {
            form: [],
        },
        onSubmit: async (values) => {
            try {
                // Set form values and other logic as needed
                formik.values.form = form;
                console.log(values);
                console.log();
                await create({
                    variables: {
                        ...form,
                        file: publicFile,
                        thumbnail: image,
                        price: actualPrice,
                        isEbook: type.ebook,
                        isDigitalDownload: type.download,
                        isAudio: type.audio,
                        isCourse: type.course,
                        isWebinar: type.webinar,
                        isDonation: type.donation,
                        isMembership: false,
                        youtubeWebinar: false,
                        isMerchandise: false,
                        isClothing: false,
                        zoomWebinar: true,
                        twitchWebinar: false,
                        filename: fileSource,
                        isPhysical: type.product,

                    },
                });

                Submited()
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } catch (error) {
                console.error('Error creating post:', error);
                // Handle error if needed
            }
        },
    })
    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const createTabs = {
        ebook: false,
        audio: true,
        course: false,
        webinar: false,
        product: false,
        download: false,
        donation: false
    };

    const [type, setType] = useState(createTabs);

    const handleTabClick = (clickedType) => {
        setType((prevType) => {
            // Set the clicked type to true, and all others to false
            const updatedTabs = Object.fromEntries(
                Object.entries(prevType).map(([key]) => [key, key === clickedType])
            );
            return updatedTabs;
        });
    };

    if (aError) return <div>{aError.message}</div>
    if (aLoading) return <div>Loading...</div>

    return (
        <div class={`${isShown === false && 'hidden'}`}>
            {addSign === true ? (
    <div onClick={openModal} class='w-10 h-10 rounded-full flex pointer-cursor items-center justify-center bg-royalblue'>
    <img src='/Add.svg' class='w-6 h-6' />

</div>
            ) : (
                <div onClick={openModal} class='px-5 font-["Semi"] py-2.5 rounded-[10px] whitespace-nowrap border-[1px] border-gainsboro border-solid text-xs text-[#000] gap-2 flex items-center'>
                    <PlusIcon class='w-5 h-5 text-black' />
                    Add product</div>

            )}
        
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-6xl transform  overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                    <div class='flex flex-col items-center justify-center'>
                                        <img src='/union5.svg' class='h-14' />
                                        <div
                                            style={{ fontFamily: 'Bold' }}
                                            className="text-4xl my-5 text-center leading-6 "
                                        >
                                            Add Product
                                        </div>
                                        <div className="mt-5 inline-flex rounded-full items-center p-2 px-3 bg-royalblue space-x-4">

                                            <div onClick={() => handleTabClick('audio')} class={`overflow-hidden ${type.audio === true ? 'bg-white text-royalblue' : 'text-[#fff]'} px-3 py-2 rounded-xl flex items-center gap-x-2`}>
                                                <div class='text-sm' style={{ fontFamily: 'Semi' }}>
                                                    Audio
                                                </div>
                                            </div>
                                            <div onClick={() => handleTabClick('ebook')} class={`overflow-hidden ${type.ebook === true ? 'bg-white text-royalblue' : 'text-[#fff]'} px-3 py-2 rounded-xl flex items-center gap-x-2`}>
                                                <div class='text-sm' style={{ fontFamily: 'Semi' }}>
                                                    Ebook
                                                </div>
                                            </div>
                                            <div onClick={() => handleTabClick('product')} class={`overflow-hidden ${type.product === true ? 'bg-white text-royalblue' : 'text-[#fff]'} px-3 py-2 rounded-xl flex items-center gap-x-2`}>

                                                <div class='text-sm' style={{ fontFamily: 'Semi' }}>
                                                    Physical Product
                                                </div>
                                            </div>

                                            <div onClick={() => handleTabClick('download')} class={`overflow-hidden ${type.download === true ? 'bg-white text-royalblue' : 'text-[#fff]'} px-3 py-2 rounded-xl flex items-center gap-x-2`}>
                                                <div class='text-sm' style={{ fontFamily: 'Semi' }}>
                                                    Download
                                                </div>
                                            </div>
                                            <div onClick={() => handleTabClick('donation')} class={`overflow-hidden ${type.donation === true ? 'bg-white text-royalblue' : 'text-[#fff]'} px-3 py-2 rounded-xl flex items-center gap-x-2`}>

                                                <div class='text-sm' style={{ fontFamily: 'Semi' }}>
                                                    Donation
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='my-5'>

                                        {type.donation === true && (
                                            <form onSubmit={formik.handleSubmit}>
                                                  <div class='px-5 py-2 flex gap-10'>
                                                    <div class='flex w-1/3 h-full'>
                                                        <div class='w-full h-full border-[1px] rounded-2xl p-4 border-solid border-gainsboro'>
                                                            <div class='text-lg font-["Semi"]'>Thumbnail</div>
                                                            <div class='w-full border-dashed border-gainsboro border-[1px] h-32 mt-4 rounded-xl'>


                                                            </div>
                                                            <div class='text-gray-400 text-xs mt-3 px-2 text-center'>Set the product image thumbnail. Only *.png, *.jpeg, and *.jpg image files are accepted.</div>
                                                        </div>
                                                    </div>
                                                    <div class='w-full'>

                                       

                                                    <div class='flex items-center gap-x-5'>
                                                        <div class='w-full flex flex-col'>
                                                            <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Donation name</div>
                                                            <input name='title' onChange={(e) => handleChangeText(e)}
                                                                value={form.title} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                                                                                       <div class='text-xs mt-2 text-gray-500  font-["Face"]'>A donation name is required & recommended to be unique</div>

                                                        </div>

                                                    </div>
                                                    <div class='flex w-full gap-x-5 mt-5'>
                                                        <div class='w-1/3'>
                                                            <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Thumbnail</div>
                                                            {!image ? (
                                                                <div>
                                                                    <label
                                                                        style={{ fontFamily: 'Semi' }}
                                                                        className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                  >
                                                                        <BoltIcon className='w-4 h-4' />

                                                                        Upload Thumbnail
                                                                        <input
                                                                            id='inputFile'
                                                                            style={{
                                                                                display: 'none',
                                                                            }}
                                                                            type='file'
                                                                            onChange={uploadImage}

                                                                        />
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <div class='w-full rounded-xl shadow border p-5'>
                                                                    <img src={image} class='w-full rounded-xl' />
                                                                </div>
                                                            )}

                                                        </div>
                                                        <div class='flex-1 flex flex-col'>
                                                            <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Description</div>
                                                            <input name='description' onChange={(e) => handleChangeText(e)}
                                                                value={form.description} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                                <div class='text-xs mt-2 text-gray-500  font-["Face"]'>Set a breif description for donation</div>

                                                        </div>
                                                    </div>
                                                    {success && (
                                                    <div style={{ fontFamily: 'Face' }} className="bg-black text-white p-3 mt-3 rounded-xl">
                                                        Product created successfully
                                                    </div>
                                                )}

                                                <div class='mt-4 flex space-x-3'>
                                                    <button type='submit' class='py-6 border-0 w-full rounded-xl text-white bg-royalblue' style={{ fontFamily: 'Semi' }}>Create Donation</button>

                                        
                                                </div>
                                                </div>
                                                </div>
                                              
                                            </form>
                                        )}
                                        {type.audio === true && (
                                            <form onSubmit={formik.handleSubmit}>

                                                <div class='px-5 py-2 flex gap-10'>
                                                    <div class='flex w-1/3 h-full'>
                                                        <div class='w-full h-full border-[1px] rounded-2xl p-4 border-solid border-gainsboro'>
                                                            <div class='text-lg font-["Semi"]'>Thumbnail</div>
                                                            <div class='w-full border-dashed border-gainsboro border-[1px] h-32 mt-4 rounded-xl'>


                                                            </div>
                                                            <div class='text-gray-400 text-xs mt-3 px-2 text-center'>Set the product image thumbnail. Only *.png, *.jpeg, and *.jpg image files are accepted.</div>
                                                        </div>
                                                    </div>
                                                    <div class='w-full'>
                                                        <div class='flex gap-x-5'>
                                                            <div class='w-full flex flex-col'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Product name</div>
                                                                <input name='title' onChange={(e) => handleChangeText(e)}
                                                                    value={form.title} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                                <div class='text-xs mt-2 text-gray-500  font-["Face"]'>A product name is required & recommended to be unique</div>
                                                            </div>
                                                            <div class='w-full'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>File</div>
                                                                <label
                                                                    style={{ fontFamily: 'Semi' }}
                                                                    className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                >
                                                                    <BoltIcon className='w-4 h-4' />

                                                                    Upload File
                                                                    <input
                                                                        id='inputFile'
                                                                        style={{
                                                                            display: 'none',
                                                                        }}
                                                                        type='file'
                                                                        onChange={uploadFile}

                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class='flex w-full gap-x-5 mt-5'>
                                                            <div class='w-1/2'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Thumbnail</div>
                                                                {!image ? (
                                                                    <div>
                                                                        <label
                                                                            style={{ fontFamily: 'Semi' }}
                                                                            className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                        >
                                                                            <BoltIcon className='w-4 h-4' />

                                                                            Upload Thumbnail
                                                                            <input
                                                                                id='inputFile'
                                                                                style={{
                                                                                    display: 'none',
                                                                                }}
                                                                                type='file'
                                                                                onChange={uploadImage}

                                                                            />
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div class='w-full rounded-xl shadow border p-5'>
                                                                        <img src={image} class='w-full rounded-xl' />
                                                                    </div>
                                                                )}

                                                            </div>
                                                            <div class='flex-1 w-full flex flex-col'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Base price</div>
                                                                <input
                                                                    value={form.price}  // Set value dynamically
                                                                    placeholder='$0.00' // Use a placeholder
                                                                    style={{ fontFamily: 'Face' }}
                                                                    className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" id="price"
                                                                    type='number'
                                                                    name="price"
                                                                    onChange={(e) => handlePriceChange(e)} // Assuming you have an onChange handler
                                                                />
                                                                <div class='text-gray-500 text-xs font-["Face"] mt-2'>Set a price</div>

                                                            </div>

                                                        </div>
                                                        <div class='flex w-full gap-x-5 mt-5'>

                                                            <div class='flex-1 flex flex-col w-full'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Description</div>
                                                                <input name='description' onChange={(e) => handleChangeText(e)}
                                                                    value={form.description} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                                <div class='text-gray-500 text-xs font-["Face"] mt-2'>Set a brief description of product selling</div>
                                                            </div>
                                                        </div>
                                                        {success && (
                                                            <div style={{ fontFamily: 'Face' }} className="bg-black text-white p-3 mt-3 rounded-xl">
                                                                Product created successfully
                                                            </div>
                                                        )}

                                                        <div class='mt-4 flex space-x-3'>
                                                            <button type='submit' class='py-6 w-full rounded-xl text-[#fff] bg-royalblue border-0' style={{ fontFamily: 'Semi' }}>Create Audio</button>

                                                        </div>
                                                    </div>
                                                </div>

                                            </form>
                                        )}
                                        {type.ebook === true && (
                                            <form onSubmit={formik.handleSubmit}>


                                                <div class='px-5 py-2 flex gap-10'>
                                                    <div class='flex w-1/3 h-full'>
                                                        <div class='w-full h-full border-[1px] rounded-2xl p-4 border-solid border-gainsboro'>
                                                            <div class='text-lg font-["Semi"]'>Thumbnail</div>
                                                            <div class='w-full border-dashed border-gainsboro border-[1px] h-32 mt-4 rounded-xl'>


                                                            </div>
                                                            <div class='text-gray-400 text-xs mt-3 px-2 text-center'>Set the product image thumbnail. Only *.png, *.jpeg, and *.jpg image files are accepted.</div>
                                                        </div>
                                                    </div>
                                                    <div class='w-full'>
                                                        <div class='flex items-center gap-x-5'>
                                                            <div class='w-full flex flex-col'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Product name</div>
                                                                <input name='title' onChange={(e) => handleChangeText(e)}
                                                                    value={form.title} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                                <div class='text-xs mt-2 text-gray-500  font-["Face"]'>A product name is required & recommended to be unique</div>

                                                            </div>
                                                            <div class='w-full'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>File</div>
                                                                <label
                                                                    style={{ fontFamily: 'Semi' }}
                                                                    className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                >
                                                                    <BoltIcon className='w-4 h-4' />

                                                                    Upload File
                                                                    <input
                                                                        id='inputFile'
                                                                        style={{
                                                                            display: 'none',
                                                                        }}
                                                                        type='file'
                                                                        onChange={uploadFile}

                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class='flex w-full gap-x-5 mt-5'>
                                                            <div class='w-1/2'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Thumbnail</div>
                                                                {!image ? (
                                                                    <div>
                                                                        <label
                                                                            style={{ fontFamily: 'Semi' }}
                                                                            className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                        >
                                                                            <BoltIcon className='w-4 h-4' />

                                                                            Upload Thumbnail
                                                                            <input
                                                                                id='inputFile'
                                                                                style={{
                                                                                    display: 'none',
                                                                                }}
                                                                                type='file'
                                                                                onChange={uploadImage}

                                                                            />
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div class='w-full rounded-xl shadow border p-5'>
                                                                        <img src={image} class='w-full rounded-xl' />
                                                                    </div>
                                                                )}

                                                            </div>
                                                            <div class='flex-1 flex flex-col'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Base price</div>
                                                                <input
                                                                    value={form.price}  // Set value dynamically
                                                                    placeholder='$0.00' // Use a placeholder
                                                                    style={{ fontFamily: 'Face' }}
                                                                    className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" id="price"
                                                                    type='number'
                                                                    name="price"
                                                                    onChange={(e) => handlePriceChange(e)} // Assuming you have an onChange handler
                                                                />
                                                                <div class='text-xs mt-2 text-gray-500  font-["Face"]'>Set price</div>

                                                            </div>
                                                        </div>
                                                        <div class='flex w-full flex-col mt-5'>
                                                            <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Description</div>
                                                            <input name='description' onChange={(e) => handleChangeText(e)}
                                                                value={form.description} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                            <div class='text-xs mt-2 text-gray-500  font-["Face"]'>Set a brief description of product</div>

                                                        </div>
                                                        {success && (
                                                            <div style={{ fontFamily: 'Face' }} className="bg-black text-white p-3 mt-3 rounded-xl">
                                                                Product created successfully
                                                            </div>
                                                        )}

                                                        <div class='mt-4 flex space-x-3'>
                                                            <button type='submit' class='py-6 w-full rounded-xl text-[#fff] bg-royalblue border-0' style={{ fontFamily: 'Semi' }}>Create Ebook</button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                        {type.download === true && (
                                            <form onSubmit={formik.handleSubmit}>

                                                <div class='px-5 py-2 flex gap-10'>
                                                    <div class='flex w-1/3 h-full'>
                                                        <div class='w-full h-full border-[1px] rounded-2xl p-4 border-solid border-gainsboro'>
                                                            <div class='text-lg font-["Semi"]'>Thumbnail</div>
                                                            <div class='w-full border-dashed border-gainsboro border-[1px] h-32 mt-4 rounded-xl'>


                                                            </div>
                                                            <div class='text-gray-400 text-xs mt-3 px-2 text-center'>Set the product image thumbnail. Only *.png, *.jpeg, and *.jpg image files are accepted.</div>
                                                        </div>
                                                    </div>
                                                    <div class='w-full'>

                                                            <div class='flex items-center gap-x-5'>
                                                                <div class='w-full flex flex-col'>
                                                                    <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Product name</div>
                                                                    <input name='title' onChange={(e) => handleChangeText(e)}
                                                                        value={form.title} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />
                                                                    <div class='text-xs mt-2 text-gray-500  font-["Face"]'>A product name is required & recommended to be unique</div>

                                                                </div>
                                                                <div class='w-full'>
                                                                    <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>File</div>
                                                                    <label
                                                                        style={{ fontFamily: 'Semi' }}
                                                                        className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                    >
                                                                        <BoltIcon className='w-4 h-4' />

                                                                        Upload File
                                                                        <input
                                                                            id='inputFile'
                                                                            style={{
                                                                                display: 'none',
                                                                            }}
                                                                            type='file'
                                                                            onChange={uploadFile}

                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class='flex w-full gap-x-5 mt-5'>
                                                                <div class='w-1/2'>
                                                                    <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Thumbnail</div>
                                                                    {!image ? (
                                                                        <div>
                                                                            <label
                                                                                style={{ fontFamily: 'Semi' }}
                                                                                className='w-full flex text-sm py-4 items-center justify-center text-[#fff] gap-2 rounded-full bg-royalblue'
                                                                            >
                                                                                <BoltIcon className='w-4 h-4' />

                                                                                Upload Thumbnail
                                                                                <input
                                                                                    id='inputFile'
                                                                                    style={{
                                                                                        display: 'none',
                                                                                    }}
                                                                                    type='file'
                                                                                    onChange={uploadImage}

                                                                                />
                                                                            </label>
                                                                        </div>
                                                                    ) : (
                                                                        <div class='w-full rounded-xl shadow border p-5'>
                                                                            <img src={image} class='w-full rounded-xl' />
                                                                        </div>
                                                                    )}

                                                                </div>
                                                                <div class='flex-1 flex flex-col'>
                                                                    <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Base price</div>
                                                                    <input
                                                                        value={form.price}  // Set value dynamically
                                                                        placeholder='$0.00' // Use a placeholder
                                                                        style={{ fontFamily: 'Face' }}
                                                                        className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4"
                                                                        id="price"
                                                                        type='number'
                                                                        name="price"
                                                                        onChange={(e) => handlePriceChange(e)} // Assuming you have an onChange handler
                                                                    />
                                                                    <div class='text-xs mt-2 text-gray-500  font-["Face"]'>Set price</div>

                                                                </div>
                                                            </div>
                                                            <div class='flex w-full flex-col mt-5'>
                                                                <div class='text-sm mb-2' style={{ fontFamily: 'Semi' }}>Description</div>
                                                                <input name='description' onChange={(e) => handleChangeText(e)}
                                                                    value={form.description} style={{ fontFamily: 'Face' }} className="self-stretch focus:ring-offset-0 focus:ring-[5px] focus:ring-royalblue/[.100] focus:border-royalblue/[.75] focus:border-[1.5px] border border-gainsboro border-solid outline-0 self-stretch rounded-[13px] px-5 border sm:py-5 py-4" />

                                                                <div class='text-xs mt-2 text-gray-500  font-["Face"]'>Set a brief description</div>

                                                            </div>
                                                            {success && (
                                                            <div style={{ fontFamily: 'Face' }} className="bg-black text-white p-3 mt-3 rounded-xl">
                                                                Product created successfully
                                                            </div>
                                                        )}

                                                        <div class='mt-4 flex space-x-3'>
                                                            <button type='submit' class='py-6 w-full rounded-xl text-[#fff] bg-royalblue border-0' style={{ fontFamily: 'Semi' }}>Create Download</button>

                                                        </div>
                                                        </div>
                                                  
                                                    </div>
                                        
                                            </form>
                                        )}
                                        {type.product === true && (
                                            <div>
                                                <ProductForm />
                                            </div>
                                        )}

                                    </div>

                                    <div className="mt-4">

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Add