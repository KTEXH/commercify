import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Header } from "../../components/Header";
import { NavBar } from "../../components/NavBar"
import { CREATE_STORE, CREATE_LINK_IN_BIO } from "./Mutations/Mutations";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ME_QUERY } from "../../Data/Me";
import { useQuery, useMutation, gql } from "@apollo/client";
import { TwitterPicker } from 'react-color'
import { RiDoorLockFill } from "@remixicon/react";
import { createClient } from "@supabase/supabase-js";
import group2 from "../../../public/assets/Group2.svg";
import { useFormik } from "formik";
import Group2 from "../../components/assets/Group2";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

const CREATE_LINKS_MUTATION = gql`
  mutation CreateLinks($links: [LinkInput!]!) {
    createLinks(links: $links) {
      id
      linkText
      link
      image
      User {
        id
        name
      }
    }
  }
`;

const supabase = createClient(
    'https://rbsteedexxccoqrnyczp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic3RlZWRleHhjY29xcm55Y3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU5MzIwMTksImV4cCI6MjAwMTUwODAxOX0.FT3oCWVeAGjrMRhLTdCFBSOtIdMDeZj6ApuALkJ185A'
);

export const BuilderForm = () => {
    const { type } = useParams()
    const { data, error, loading } = useQuery(ME_QUERY)
    const [createStorefront] = useMutation(CREATE_STORE);
    const [createForm] = useMutation(CREATE_FORMATS)
    const [formData, setFormData] = useState({
        headerText: '',
        subText: '',
        name: 'Untitled',
        subdomain: '',
    })

    const [colors, setColors] = useState({
        backgroundColor: '#fff',
        headerTextColor: '#000',
        subTextColor: '#888',
        submitButton: '#000',
        submitButtonTextColor: '#fff'
    })


    const [template, setTemplate] = useState(1)

    const basicLinks = useFormik({
        initialValues: {},
        onSubmit: (values) => {
            createLinkinbio({
                variables: {
                    name: formData.name,
                    subdomain: formData.subdomain,
                    headerText: formData.headerText,
                    subText: formData.subText,
                    backgroundColor: colors.backgroundColor,
                    headingColor: colors.headerTextColor,
                    template: template,
                    subTextColors: colors.subTextColors
                }
            })
                .then(() => alert('Linkinbio created successfully!'))
                .catch((err) => console.error(err));
        }
    })

   

    const basicWorkshop = useFormik({
        initialValues: {},
        onSubmit: (values) => {
            createStorefront({
                variables: {
                    name: formData.name,
                    subdomain: formData.subdomain,
                    headerText: formData.headerText,
                    subText: formData.subText,
                    backgroundColor: colors.backgroundColor,
                    headingColor: colors.headerTextColor,
                    template: template,
                    subTextColors: colors.subTextColors,
                    storefront: false
                }
            })
                .then(() => alert('Linkinbio created successfully!'))
                .catch((err) => console.error(err));
        }
    })

    const basicStore = useFormik({
        initialValues: {
            name: formData.name,
            subdomain: formData.subdomain,
            headerText: formData.headerText,
            secondaryText: formData.secondaryText,
            backgroundColor: colors.backgroundColor,
            headingColor: colors.headerTextColor,
            template: template,
            storefront: true,
            subTextColors: colors.subTextColors
        },

        onSubmit: (values) => {
            createStorefront({
                variables: {
                    id: data.me.id,
                    name: formData.name,
                    subdomain: formData.subdomain,
                    headerText: formData.headerText,
                    secondaryText: formData.secondaryText,
                    subTextColor: colors.subTextColor,
                    backgroundColor: colors.backgroundColor,
                    headingColor: colors.headerTextColor,
                    template: template,
                    storefront: true
                }
            })
                .then(() => alert('Storefront created successfully!'))
                .catch((err) => console.error(err));
        },
    })
    const [createLinks] = useMutation(CREATE_LINKS_MUTATION, {
        refetchQueries: [{ query: ME_QUERY }],
    });

    const [links, setLinks] = useState([{ linkText: '', linkUrl: '', fileName: '', publicFile: '' }]);
    const [uploading, setUploading] = useState(false);

    // Add a new blank link entry
    const addLink = () => setLinks([...links, { linkText: '', linkUrl: '', fileName: '', publicFile: '' }]);

    // Remove a link entry
    const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

    // Handle changes in link text or URL for each link entry
    const handleInputChange = (index, event) => {
        const updatedLinks = [...links];
        updatedLinks[index][event.target.name] = event.target.value;
        setLinks(updatedLinks);
    };

    // Handle file upload for each link entry
    const uploadFile = async (index, event) => {
        try {
            setUploading(true);
            const selectedFile = event.target.files && event.target.files[0];
            if (!selectedFile) throw new Error('Please select an image to upload.');

            const fileExt = selectedFile.name.split('.').pop();
            const randomFileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `content/${randomFileName}`;

            const { error: uploadError } = await supabase.storage.from('conten').upload(filePath, selectedFile);
            if (uploadError) throw uploadError;

            const { data: urlData, error: urlError } = supabase.storage.from('conten').getPublicUrl(filePath);
            if (urlError) throw urlError;

            const updatedLinks = [...links];
            updatedLinks[index].fileName = randomFileName;
            updatedLinks[index].publicFile = urlData.publicUrl;
            setLinks(updatedLinks);
        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const filledLinks = links.filter(link => link.linkText && link.linkUrl);

        if (filledLinks.length === 0) {
            alert("Please fill in all fields for each link and upload images.");
            return;
        }

        try {
            await createLinks({
                variables: {
                    links: filledLinks.map(({ linkText, linkUrl, publicFile }) => ({
                        linkText,
                        link: linkUrl,
                        image: publicFile,
                    })),
                },
            });

            // Reset the form after successful submission
            setLinks([{ linkText: '', linkUrl: '', fileName: '', publicFile: '' }]);
        } catch (error) {
            console.error("Error submitting links:", error.message);
            alert("There was an error submitting your links.");
        }
    };

    const [createLinkinbio, { data: lData, loading: lLoading, error: lError }] = useMutation(CREATE_LINK_IN_BIO);

    const submitLinkinbio = async (e) => {
        e.preventDefault();
        try {
            await createLinkinbio({});
            alert('Link in Bio created successfully!');
        } catch (err) {
            console.error(err);
            alert('Error creating Link in Bio.');
        }
    };


    const handleColorChange = (property) => (color) => {
        setColors(prevColors => ({
            ...prevColors, // Spread the existing colors
            [property]: color.hex // Dynamically update the color based on the property passed
        }));
    };

    const togglePicker = (property) => {
        setPickerVisible(prev => prev === property ? null : property);
    };

    const [pickerVisible, setPickerVisible] = useState(null); // Track which picker is active

    const handleTextChange = (event) => {
        const { name, value } = event.target

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))


    }

    const [format, setFormat] = useState({
        basic: true,
        basicMinus: false,
        image: false,
        link: false
    })

    const handleFormatChange = (key) => {
        setFormat({
            basic: false,
            basicMinus: false,
            image: false,
            link: false,
            [key]: true, // Only the selected key is set to true
        });
    };

    const Basic = ({ item }) => (
        <div class='border p-3 flex flex-col gap-2 w-full rounded-2xl'>
            <div class='flex flex-row items-center w-full gap-2'>
                {!item.thumbnail ? (
                    <div class='w-16 h-16 shrink-0 rounded-xl flex items-center justify-center text-sm font-["Semibold"] bg-sky-100'>
                        {item.title.charAt(0)}
                    </div>
                ) : (
                    <img />
                )}
                <div class=''>
                    <div class='font-["Semibold"] line-clamp-1 text-xs'>{item.title}</div>
                    <div class='font-["Medium"] text-xs text-gray-400 line-clamp-3'>{item.description}</div>
                </div>
            </div>
            <button class='bg-black w-full text-center py-2 rounded-full text-xs text-white font-["Semibold"]'>Buy</button>
        </div>
    )

    const BasicMinus = ({ item }) => (
        <div class='border p-3 flex flex-col gap-2 w-full rounded-2xl'>
            <div class='flex flex-row items-center w-full gap-2'>
                {!item.thumbnail ? (
                    <div class='w-16 h-16 shrink-0 rounded-xl flex items-center justify-center text-sm font-["Semibold"] bg-sky-100'>
                        {item.title.charAt(0)}
                    </div>
                ) : (
                    <img />
                )}
                <div class=''>
                    <div class='font-["Semibold"] line-clamp-1 text-xs'>{item.title}</div>
                    <div class='font-["Medium"] text-xs text-gray-400 line-clamp-3'>{item.description}</div>
                </div>
            </div>
        </div>
    )

    const Link = ({ item }) => (
        <div class='border p-3 flex gap-2 w-full rounded-2xl'>
            {!item.thumbnail ? (
                <div class='w-16 h-16 shrink-0 rounded-xl flex items-center justify-center text-sm font-["Semibold"] bg-sky-100'>
                    {item.title.charAt(0)}
                </div>
            ) : (
                <img />
            )}
            <div class=''>
                <div class='font-["Semibold"] line-clamp-1 text-xs'>{item.title}</div>
                <div class='font-["Medium"] text-xs text-gray-400 line-clamp-3'>{item.description}</div>
            </div>
            <button class='px-2 py-1 text-white bg-black text-xs text-white rounded-full font-["Semibold"]'>Buy</button>
        </div>
    )

    const [form, setForm] = useState("Email")

    const setFormEmail = () => {
        setForm('Email')
        setInputs(['Email'])
    }
    const [inputs, setInputs] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('#fff')
    const FormsTabs = [
        'Media',
        'Color',
        'Text',
        'Style',
    ]

    const LinkTabs = [
        'Links',
        'Color',
        'Text',
        'Media',
        'Embedded Links',
        'Affiliate Links'
    ]

    const combinedArray = data?.me?.Links.concat(links);


    const StoreTabs = [
        'Details',
        'Text',
        'Media',
        'Format',
    ]

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    return (
        <div
            className='flex w-full items-start h-full self-stretch flex-col rounded-3xl'
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar pagesNav={true} products={false} builder={true} pages={false} home={false} analytics={false} bookings={false} orders={false} />
                    <div className="flex flex-col h-full w-full self-stretch">
                        <Header />
                        <div class='h-full flex flex-col'>
                            {type === 'form' &&
                                <div class='h-full w-full flex'>
                                    <div class='w-72 border-r flex flex-col p-4 self-stretch h-full'>
                                        <div class='font-["Semibold"] text-xs'>Form Type</div>
                                        <div class='flex flex-col space-y-3 mt-3'>
                                            <div onClick={() => setForm('Short Form')} class='p-3 rounded-xl border'>
                                                <div class='font-["Semibold"] text-xs'>Short Form</div>
                                                <div class='text-xs text-gray-400 font-["Medium"]'>Create forms to take emails from users</div>
                                            </div>
                                            <div onClick={() => setForm('Long Form')} class='p-3 rounded-xl border'>
                                                <div class='font-["Semibold"] text-xs'>Long Form</div>
                                                <div class='text-xs text-gray-400 font-["Medium"]'>Create a contact form for users to reach you</div>
                                            </div>
                                            <div onClick={() => setForm('Contact')} class='p-3 rounded-xl border'>
                                                <div class='font-["Semibold"] text-xs'>Contact</div>
                                                <div class='text-xs text-gray-400 font-["Medium"]'>Create a custom form</div>
                                            </div>
                                            <div onClick={() => setForm('Payment')} class='p-3 rounded-xl border'>
                                                <div class='font-["Semibold"] text-xs'>Payment</div>
                                                <div class='text-xs text-gray-400 font-["Medium"]'>Create a custom form</div>
                                            </div>
                                            <div onClick={() => setForm('Pay')} class='p-3 rounded-xl border'>
                                                <div class='font-["Semibold"] text-xs'>Email</div>
                                                <div class='text-xs text-gray-400 font-["Medium"]'>Create a custom form</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='w-full flex p-5'>
                                        <form onSubmit={basicForms.handleSubmit}  class='flex flex-col w-2/3'>
                                        <TabGroup>
                                            <TabList class='inline-flex justify-center items-center px-3 py-2 bg-gray-100 space-x-2 rounded-full'>
                                                {FormsTabs.map(item => (
                                                    <Tab key={item}
                                                        className="rounded-full text-xs py-2 px-3 font-[Semibold] text-gray-400 focus:outline-none data-[selected]:bg-white data-[hover]:bg-white/5 data-[selected]:text-black data-[focus]:outline-1 data-[focus]:outline-white"
                                                    >
                                                        {item}
                                                    </Tab>
                                                ))}
                                                <button type="submit" class='text-xs px-3 py-2 bg-black font-["Semibold"] text-white rounded-full'>Submit</button>
                                            </TabList>

                                                <TabPanel class='w-full p-5'>
                                                    <div class='items-center flex gap-2'>
                                                        <div class='w-10 h-10 flex items-center justify-center rounded-lg bg-sky-100'>

                                                        </div>
                                                        <div class='bg-black px-4 py-2 rounded-md text-xs text-white font-["Semibold"]'>
                                                            Upload image
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel class='p-5 grid grid-cols-2 gap-y-4 gap-2'>
                                                    {['backgroundColor', 'headerTextColor', 'subTextColor', 'submitButton', 'submitButtonTextColor'].map((colorProperty, index) => (
                                                        <div className='space-x-2 flex items-center' key={index}>
                                                            <div className='w-8 h-8 rounded-md border' style={{ backgroundColor: colors[colorProperty] }} />
                                                            <button
                                                                className='bg-black rounded-md text-white text-xs font-medium px-3 py-2'
                                                                onClick={() => togglePicker(colorProperty)}
                                                            >
                                                                {colorProperty.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                            </button>
                                                            {pickerVisible === colorProperty && (
                                                                <div style={{ position: 'absolute', zIndex: 2 }}>
                                                                    <TwitterPicker
                                                                        color={colors[colorProperty]}
                                                                        onChange={handleColorChange(colorProperty)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {pickerVisible && (
                                                        <div
                                                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                                                            onClick={() => setPickerVisible(null)}
                                                        />
                                                    )}
                                                </TabPanel>
                                                <TabPanel class='w-full flex p-5'>
                                                    <div class='w-2/3 grid-cols-2 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Header Text</div>
                                                            <input onChange={handleTextChange} name='headerText' value={formData.headerText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Sub Text</div>
                                                            <input onChange={handleTextChange} name='subText' value={formData.subText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>

                                                </TabPanel>
                                            </TabGroup>
                                        </form>
                                        <div class='flex flex-col w-1/3 h-full p-5 px-10'>
                                        <div style={{ backgroundColor: colors.backgroundColor }} class='border p-5 h-full items-center justify-center w-full flex flex-col rounded-3xl'>
                                                {form === 'Short Form' && (
                                                    <div class='flex flex-col w-full items-center justify-center h-full'>
                                                        <div class='w-20 h-20 flex items-center justify-center text-2xl capitalize font-["Semibold"] rounded-full bg-sky-100'>
                                                            {data.me.name.charAt(0)}
                                                        </div>
                                                        <div class='font-["Semibold"] mt-2'>{formData.headerText || 'Email Form'}</div>
                                                        <div class='text-sm text-gray-300 font-["Medium"] text-center'>{formData.secondaryText || 'Enter email to stay updtated with us!'}</div>
                                                        <div class='w-full relative'>
                                                            <input class='border font-["Medium"] rounded-full mt-4 p-2 px-3 text-sm w-full' placeholder='Enter email' />
                                                        </div>
                                                        <button class='bg-black rounded-full flex items-center gap-2 text-white w-full py-2 text-sm justify-center font-["Semibold"] mt-2'>
                                                            Submit
                                                            <ArrowRightIcon class='text-white w-3 h-3' />
                                                        </button>
                                                    </div>
                                                )}
                                                {form === 'Long Form' && (
                                                    <div class='flex flex-col w-full items-center justify-center h-full'>
                                                        <div class='w-20 h-20 flex items-center justify-center text-2xl capitalize font-["Semibold"] rounded-full bg-sky-100'>
                                                            {data.me.name.charAt(0)}
                                                        </div>
                                                        <div class='font-["Semibold"] mt-2'>Contact us</div>
                                                        <div class='text-xs text-gray-400 font-["Medium"] text-center'>Contct us for any Questions</div>
                                                        <div class='w-full flex flex-col gap-2 mt-4'>
                                                            <div class='w-full gap-2 flex flex-col'>
                                                                <div class='font-["Semibold"] text-xs'>Name</div>
                                                                <input class='border font-["Medium"] p-2 px-3 rounded-xl text-xs w-full' />
                                                            </div>
                                                            <div class='w-full gap-2 flex flex-col'>
                                                                <div class='font-["Semibold"] text-xs'>Email</div>
                                                                <input class='border font-["Medium"] p-2 px-3 rounded-xl text-xs w-full' />
                                                            </div>
                                                            <div class='w-full gap-2 flex flex-col'>
                                                                <div class='font-["Semibold"] text-xs'>Message</div>
                                                                <textarea class='border font-["Medium"] p-2 px-3 rounded-xl text-xs w-full' />
                                                            </div>
                                                        </div>
                                                        <button class='bg-black text-white w-full py-2 text-sm rounded-lg font-["Semibold"] mt-2'>
                                                            Submit
                                                        </button>
                                                    </div>
                                                )}
                                                {form === 'Contact' && (
                                                    <div class='flex flex-col w-full items-center justify-center h-full'>
                                                        <div class='w-20 h-20 flex items-center justify-center text-2xl capitalize font-["Semibold"] rounded-full bg-sky-100'>
                                                            {data.me.name.charAt(0)}
                                                        </div>
                                                        <div class='font-["Semibold"] mt-2'>{formData.headerText || 'Custom Form'}</div>
                                                        <div class='text-sm text-gray-300 font-["Medium"] text-center'>{formData.secondaryText || 'Create your custom form'}</div>
                                                        <div class='w-full relative'>
                                                            <input class='border font-["Normal"] mt-4 p-2 px-3 rounded-xl text-sm w-full' placeholder='Enter email' />
                                                        </div>
                                                        <button class='bg-black text-white w-full py-2 text-sm rounded-lg font-["Semibold"] mt-2'>
                                                            Submit
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                        </div>

                        <div class='h-full flex w-full flex-col'>
                            {type === 'storefront' &&
                                <form onSubmit={basicStore.handleSubmit} class='h-full w-full flex'>
                                    <div class='w-full relative items-center justify-center flex flex-col p-4 '>
                                        <TabGroup class='flex absolute top-3 items-center justify-center flex-col'>
                                            <TabList class='inline-flex justify-center items-center px-3 py-2 bg-gray-100 space-x-2 rounded-full'>
                                                {StoreTabs.map(item => (
                                                    <Tab key={item}
                                                        className="rounded-full text-xs py-2 px-3 font-[Semibold] text-gray-400 focus:outline-none data-[selected]:bg-white data-[hover]:bg-white/5 data-[selected]:text-black data-[focus]:outline-1 data-[focus]:outline-white"
                                                    >
                                                        {item}
                                                    </Tab>
                                                ))}
                                                <button type="submit" class='text-xs px-3 py-2 bg-black font-["Semibold"] text-white rounded-full'>Submit</button>
                                            </TabList>
                                            <TabPanels>

                                                <TabPanel class='p-5 space-y-3'>
                                                    <div class='w-2/3 grid-cols-2 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-xs font-["Semibold"]'>Subdomain</div>
                                                            <input onChange={handleTextChange} name='subdomain' value={formData.subdomain} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                            <div>{formData.subdomain}</div>
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-xs font-["Semibold"]'>Name</div>
                                                            <input onChange={handleTextChange} name='name' value={formData.name} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                    <div class='my-2 font-["Semibold"] text-sm'>Colors</div>
                                                    <div class='flex items-center gap-3'>
                                                        {['backgroundColor', 'headerTextColor', 'subTextColor'].map((colorProperty, index) => (
                                                            <div className='space-x-2 flex items-center' key={index}>
                                                                <div className='w-8 h-8 rounded-full border' style={{ backgroundColor: colors[colorProperty] }} />
                                                                <button
                                                                    className='border rounded-full text-xs font-["Semibold"] px-3 py-2'
                                                                    onClick={() => togglePicker(colorProperty)}
                                                                >
                                                                    {colorProperty.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                                </button>
                                                                {pickerVisible === colorProperty && (
                                                                    <div style={{ position: 'absolute', zIndex: 2 }}>
                                                                        <TwitterPicker
                                                                            color={colors[colorProperty]}
                                                                            onChange={handleColorChange(colorProperty)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {pickerVisible && (
                                                            <div
                                                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                                                                onClick={() => setPickerVisible(null)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div class='my-2 font-["Semibold"] text-sm'>Sections</div>
                                                    <div class='grid grid-cols-3 gap-4'>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>
                                                    <div class='w-2/3 grid-cols-2 px-10 py-5 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Header Text</div>
                                                            <input onChange={handleTextChange} name='headerText' value={formData.headerText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Sub Text</div>
                                                            <input onChange={handleTextChange} name='secondaryText' value={formData.secondaryText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel class='p-4 grid grid-cols-2 gap-5'>
                                                    <div class='w-full border flex flex-col p-3 rounded-xl'>
                                                        <div class='flex gap-2 items-center'>
                                                            <div class='rounded-2xl font-["Bold"] justify-center items-center flex bg-pink-100 w-14 h-14'>
                                                                H
                                                            </div>
                                                            <div>
                                                                <div class='font-["Semibold"] text-sm'>Header Image</div>
                                                                <div class='text-xs font-["Medium"] text-gray-400 mt-1'>Add header image to your storefront</div>
                                                            </div>
                                                        </div>
                                                        <div class='w-full px-3 text-center py-3 border text-xs mt-3 rounded-full font-["Semibold"]'>
                                                            Add Header
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel class='p-4 grid grid-cols-2 gap-5'>
                                                    <div class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='p-3 rounded-xl border w-full'>
                                                            <div class='flex w-full items-center gap-2'>
                                                                <div class='h-14 w-14 shrink-0 rounded-xl bg-pink-100'>

                                                                </div>
                                                                <div class='w-full'>
                                                                    <div class='w-full bg-black h-2 rounded-full' />
                                                                    <div class='mt-2 flex flex-col space-y-1'>
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div class='mt-2 w-full text-xs font-["Semibold"] text-white text-center rounded-full bg-black py-2 '>
                                                                Buy
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div onClick={() => handleFormatChange('basicMinus')} class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='p-3 rounded-xl border w-full'>
                                                            <div class='flex w-full items-center gap-2'>
                                                                <div class='h-14 w-14 shrink-0 rounded-xl bg-pink-100'>

                                                                </div>
                                                                <div class='w-full'>
                                                                    <div class='w-full bg-black h-2 rounded-full' />
                                                                    <div class='mt-2 flex flex-col space-y-1'>
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='rounded-xl w-28 flex-col flex'>
                                                            <div class='h-16 w-full mb-3 shrink-0 rounded-xl bg-pink-100'>

                                                            </div>
                                                            <div class='w-full'>
                                                                <div class='w-full bg-black h-2 rounded-full' />
                                                                <div class='mt-2 flex flex-col space-y-1'>
                                                                    <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class='h-40 border w-full rounded-2xl'></div>
                                                    <div class='h-40 border w-full rounded-2xl'></div>
                                                    <div class='h-40 border w-full rounded-2xl'></div>
                                                </TabPanel>
                                                <TabPanel>

                                                </TabPanel>

                                            </TabPanels>
                                        </TabGroup>
                                    </div>

                                    <div class='flex flex-col w-1/3 h-full p-5 px-10'>
                                        <div style={{ backgroundColor: colors.backgroundColor }} class='border p-5 h-full items-center justify-center w-full flex flex-col rounded-3xl'>
                                            <div class='w-20 h-20 flex mt-5 items-center justify-center text-2xl capitalize font-["Semibold"] rounded-full bg-sky-100'>
                                                {data.me.name.charAt(0)}
                                            </div>
                                            <div class='text-lg font-["Semibold"] capitalize mt-1'>{formData.headerText || 'Text goes here'}</div>
                                            <div class='text-gray-500 font-["Medium"] text-center text-sm'>{formData.secondaryText || 'Text goes here'}</div>
                                            <div class='w-full my-3'>
                                                {format.basic === true && (
                                                    <div>
                                                        {data.me.OnlyProducts.map(item => (
                                                            <Basic item={item} />
                                                        ))}
                                                    </div>
                                                )}
                                                {format.basicMinus === true && (
                                                    <div>
                                                        {data.me.OnlyProducts.map(item => (
                                                            <BasicMinus item={item} />
                                                        ))}
                                                    </div>
                                                )}

                                            </div>
                                            <div class='bg-black px-4 py-2 flex items-center gap-2 rounded-full'>
                                                <Group2 className='w-4 h-4' />
                                                <div className="font-['Semibold'] text-[10px] text-white">Commercify</div>
                                            </div>
                                        </div>
                                    </div>
                                </form>}

                            {type === 'linkhandler' &&
                                <div class='h-full w-full flex'>
                                    <form onSubmit={basicLinks.handleSubmit} class='w-72 p-4 border-r h-full'>
                                        <button type='submit'>Submit</button>
                                    </form>
                                    <RiDoorLockFill> </RiDoorLockFill>
                                    <div class='w-full p-4 '>
                                        <TabGroup>
                                            <TabList className='w-full px-4 w-full'>
                                                {LinkTabs.map(item => (
                                                    <Tab key={item}
                                                        className="rounded-lg bg-white text-xs py-1 px-3 font-[Semibold] text-black focus:outline-none data-[selected]:bg-black data-[hover]:bg-white/5 data-[selected]:text-white data-[focus]:outline-1 data-[focus]:outline-white"
                                                    >
                                                        {item}
                                                    </Tab>
                                                ))}
                                            </TabList>
                                            <TabPanels>
                                                <TabPanel className='w-full p-4'>
                                                    <form onSubmit={handleSubmit}>
                                                        {links.map((link, index) => (
                                                            <div key={index} className="link-entry">

                                                                <input
                                                                    class='border px-4 py-2 rounded-lg text-sm font-["Normal"]'
                                                                    type="text"
                                                                    name="linkText"
                                                                    placeholder="Link Text"
                                                                    value={link.linkText}
                                                                    onChange={(e) => handleInputChange(index, e)}
                                                                    required
                                                                />

                                                                <input
                                                                    class='border px-4 py-2 rounded-lg text-sm font-["Normal"]'
                                                                    type="url"
                                                                    name="linkUrl"
                                                                    placeholder="URL"
                                                                    value={link.linkUrl}
                                                                    onChange={(e) => handleInputChange(index, e)}
                                                                    required
                                                                />
                                                                <label htmlFor="file-upload" class='bg-black px-4 py-2 rounded-lg font-["Medium"] text-xs'>
                                                                    Upload
                                                                    <input
                                                                        id="file-upload"
                                                                        name="file-upload"
                                                                        type="file"
                                                                        onChange={(e) => uploadFile(index, e)}
                                                                        disabled={uploading}
                                                                        style={{ display: "none" }} className="sr-only" />
                                                                </label>
                                                                {uploading && <p>Uploading...</p>}
                                                                {link.publicFile && (
                                                                    <div>
                                                                        <p>Image uploaded successfully:</p>
                                                                        <a href={link.publicFile} target="_blank" rel="noopener noreferrer">
                                                                            {link.fileName}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                {links.length > 1 && (
                                                                    <button type="button" onClick={() => removeLink(index)}>
                                                                        Remove Link
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}


                                                        <button type="button" onClick={addLink}>
                                                            Add Another Link
                                                        </button>
                                                        <button type="submit">Submit All Links</button>
                                                    </form>
                                                    <h2>Your Links</h2>

                                                </TabPanel>
                                                <TabPanel>
                                                    {['backgroundColor', 'headerTextColor', 'secondaryTextColor'].map((colorProperty, index) => (
                                                        <div className='space-x-2 flex items-center' key={index}>
                                                            <div className='w-8 h-8 rounded-md border' style={{ backgroundColor: colors[colorProperty] }} />
                                                            <button
                                                                className='bg-black rounded-md text-white text-xs font-medium px-3 py-2'
                                                                onClick={() => togglePicker(colorProperty)}
                                                            >
                                                                {colorProperty.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                            </button>
                                                            {pickerVisible === colorProperty && (
                                                                <div style={{ position: 'absolute', zIndex: 2 }}>
                                                                    <TwitterPicker
                                                                        color={colors[colorProperty]}
                                                                        onChange={handleColorChange(colorProperty)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {pickerVisible && (
                                                        <div
                                                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                                                            onClick={() => setPickerVisible(null)}
                                                        />
                                                    )}
                                                </TabPanel>
                                                <TabPanel>
                                                    <div class='w-2/3 grid-cols-2 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Header Text</div>
                                                            <input onChange={handleTextChange} name='headerText' value={formData.headerText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Secondary Text</div>
                                                            <input onChange={handleTextChange} name='subText' value={formData.subText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>
                                                    <div class='w-2/3 grid-cols-2 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Subdomain</div>
                                                            <input onChange={handleTextChange} name='subdomain' value={formData.subdomain} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                            <div>{formData.subdomain}</div>
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Name</div>
                                                            <input onChange={handleTextChange} name='name' value={formData.name} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                            </TabPanels>
                                        </TabGroup>
                                    </div>
                                    <div class='flex flex-col w-1/3 border-l h-full p-5 px-10'>
                                        <div style={{ backgroundColor: colors.backgroundColor }} class='border-4 p-5 h-full items-center justify-center w-full flex flex-col rounded-3xl border-black'>
                                            <div class='w-20 h-20 flex mt-5 items-center justify-center text-2xl capitalize font-["Semibold"] rounded-full bg-sky-100'>
                                                {data.me.name.charAt(0)}
                                            </div>
                                            <div class='text-lg font-["Semibold"] capitalize mt-1'>{formData.headerText}</div>
                                            <div class='text-gray-500 font-["Medium"] text-sm'>{formData.secondaryText || 'Text goes here'}</div>
                                            <div class='w-full'>
                                                {data.me.Links.map(item => (
                                                    <div class='px-4 py-2 rounded-full w-full flex items-center justify-between'>
                                                        <img src={item.image} class='h-6 w-6 rounded-full' />
                                                        <div>{item.linkText}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>}
                            {type === 'workshop' && (
                                <form onSubmit={basicWorkshop.handleSubmit} class='h-full w-full flex'>
                                    <div class='w-full relative items-center justify-center flex flex-col p-4 '>
                                        <TabGroup class='flex absolute top-3 items-center justify-center flex-col'>
                                            <TabList class='inline-flex justify-center items-center px-3 py-2 bg-gray-100 space-x-2 rounded-full'>
                                                {StoreTabs.map(item => (
                                                    <Tab key={item}
                                                        className="rounded-full text-xs py-2 px-3 font-[Semibold] text-gray-400 focus:outline-none data-[selected]:bg-white data-[hover]:bg-white/5 data-[selected]:text-black data-[focus]:outline-1 data-[focus]:outline-white"
                                                    >
                                                        {item}
                                                    </Tab>
                                                ))}
                                                <button type="submit" class='text-xs px-3 py-2 bg-black font-["Semibold"] text-white rounded-full'>Submit</button>
                                            </TabList>
                                            <TabPanels>

                                                <TabPanel class='p-5 space-y-3'>
                                                    <div class='w-2/3 grid-cols-2 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-xs font-["Semibold"]'>Subdomain</div>
                                                            <input onChange={handleTextChange} name='subdomain' value={formData.subdomain} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                            <div>{formData.subdomain}</div>
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-xs font-["Semibold"]'>Name</div>
                                                            <input onChange={handleTextChange} name='name' value={formData.name} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                    <div class='my-2 font-["Semibold"] text-sm'>Colors</div>
                                                    <div class='flex items-center gap-3'>
                                                        {['backgroundColor', 'headerTextColor', 'subTextColor'].map((colorProperty, index) => (
                                                            <div className='space-x-2 flex items-center' key={index}>
                                                                <div className='w-8 h-8 rounded-full border' style={{ backgroundColor: colors[colorProperty] }} />
                                                                <button
                                                                    className='border rounded-full text-xs font-["Semibold"] px-3 py-2'
                                                                    onClick={() => togglePicker(colorProperty)}
                                                                >
                                                                    {colorProperty.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                                </button>
                                                                {pickerVisible === colorProperty && (
                                                                    <div style={{ position: 'absolute', zIndex: 2 }}>
                                                                        <TwitterPicker
                                                                            color={colors[colorProperty]}
                                                                            onChange={handleColorChange(colorProperty)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {pickerVisible && (
                                                            <div
                                                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                                                                onClick={() => setPickerVisible(null)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div class='my-2 font-["Semibold"] text-sm'>Sections</div>
                                                    <div class='grid grid-cols-3 gap-4'>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                        <div class='h-20 w-full border rounded-2xl'>

                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>
                                                    <div class='w-2/3 grid-cols-2 px-10 py-5 grid gap-5'>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Header Text</div>
                                                            <input onChange={handleTextChange} name='headerText' value={formData.headerText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                        <div class='gap-2 flex flex-col'>
                                                            <div class='text-sm font-["Semibold"]'>Sub Text</div>
                                                            <input onChange={handleTextChange} name='secondaryText' value={formData.secondaryText} class='px-3 py-2 text-xs border rounded-xl font-["Medium"]' />
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel class='p-4 grid grid-cols-2 gap-5'>
                                                    <div class='w-full border flex flex-col p-3 rounded-xl'>
                                                        <div class='flex gap-2 items-center'>
                                                            <div class='rounded-2xl font-["Bold"] justify-center items-center flex bg-pink-100 w-14 h-14'>
                                                                H
                                                            </div>
                                                            <div>
                                                                <div class='font-["Semibold"] text-sm'>Header Image</div>
                                                                <div class='text-xs font-["Medium"] text-gray-400 mt-1'>Add header image to your storefront</div>
                                                            </div>
                                                        </div>
                                                        <div class='w-full px-3 text-center py-3 border text-xs mt-3 rounded-full font-["Semibold"]'>
                                                            Add Header
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel class='p-4 grid grid-cols-2 gap-5'>
                                                    <div class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='p-3 rounded-xl border w-full'>
                                                            <div class='flex w-full items-center gap-2'>
                                                                <div class='h-14 w-14 shrink-0 rounded-xl bg-pink-100'>

                                                                </div>
                                                                <div class='w-full'>
                                                                    <div class='w-full bg-black h-2 rounded-full' />
                                                                    <div class='mt-2 flex flex-col space-y-1'>
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div class='mt-2 w-full text-xs font-["Semibold"] text-white text-center rounded-full bg-black py-2 '>
                                                                Buy
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div onClick={() => handleFormatChange('basicMinus')} class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='p-3 rounded-xl border w-full'>
                                                            <div class='flex w-full items-center gap-2'>
                                                                <div class='h-14 w-14 shrink-0 rounded-xl bg-pink-100'>

                                                                </div>
                                                                <div class='w-full'>
                                                                    <div class='w-full bg-black h-2 rounded-full' />
                                                                    <div class='mt-2 flex flex-col space-y-1'>
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='rounded-xl w-28 flex-col flex'>
                                                            <div class='h-16 w-full mb-3 shrink-0 rounded-xl bg-pink-100'>

                                                            </div>
                                                            <div class='w-full'>
                                                                <div class='w-full bg-black h-2 rounded-full' />
                                                                <div class='mt-2 flex flex-col space-y-1'>
                                                                    <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div onClick={() => handleFormatChange('link')} class='h-40 border w-full p-4 flex items-center justify-center rounded-2xl'>
                                                        <div class='p-3 rounded-xl border w-full'>
                                                            <div class='flex w-full items-center gap-2'>
                                                                <div class='h-10 w-10 shrink-0 rounded-xl bg-pink-100'>

                                                                </div>
                                                                <div class='w-full'>
                                                                    <div class='w-full bg-black h-2 rounded-full' />
                                                                    <div class='mt-2 flex flex-col space-y-1'>
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                        <div class='w-full bg-gray-200 h-2 rounded-full' />
                                                                    </div>

                                                                </div>
                                                                <button>Buy</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class='h-40 border w-full rounded-2xl'></div>
                                                    <div class='h-40 border w-full rounded-2xl'></div>
                                                </TabPanel>
                                                <TabPanel>

                                                </TabPanel>

                                            </TabPanels>
                                        </TabGroup>
                                    </div>

                                    <div class='flex flex-col w-1/3 h-full p-5 px-10'>
                                        <div style={{ backgroundColor: colors.backgroundColor }} class='border p-5 h-full items-center justify-center w-full flex flex-col rounded-3xl'>
                                            <div class='w-20 h-20 flex mt-5 items-center justify-center text-2xl capitalize font-["Semibold"] rounded-full bg-sky-100'>
                                                {data.me.name.charAt(0)}
                                            </div>
                                            <div class='text-lg font-["Semibold"] capitalize mt-1'>{formData.headerText || 'Text goes here'}</div>
                                            <div class='text-gray-500 font-["Medium"] text-center text-sm'>{formData.secondaryText || 'Text goes here'}</div>
                                            <div class='w-full my-3'>
                                                {format.basic === true && (
                                                    <div>
                                                        {data.me.Services.map(item => (
                                                            <Basic item={item} />
                                                        ))}
                                                    </div>
                                                )}
                                                {format.basicMinus === true && (
                                                    <div>
                                                        {data.me.Services.map(item => (
                                                            <BasicMinus item={item} />
                                                        ))}
                                                    </div>
                                                )}
                                                {format.link === true && (
                                                <div>
                                                    {data.me.Services.map(item => (
                                                        <Link item={item} />
                                                    ))}
                                                </div>
                                                )}
                                            </div>
                                            <div class='bg-black px-4 py-2 flex items-center gap-2 rounded-full'>
                                                <Group2 className='w-4 h-4' />
                                                <div className="font-['Semibold'] text-[10px] text-white">Commercify</div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                    </div>


                </div>
            </div>
        </div >
    )
}