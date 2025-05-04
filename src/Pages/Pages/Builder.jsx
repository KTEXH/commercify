import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check, TrendingUp } from "lucide-react";
import { CheckIcon, ChevronDownIcon, EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { HexColorPicker } from "react-colorful";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { CREATE_STORE, LINK_CREATION } from "./Mutations/Mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel } from "@headlessui/react";
import { useFormik } from "formik";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
    'https://hrvpmllpyogxsgxcwrcq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydnBtbGxweW9neHNneGN3cmNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjM5OTgwNywiZXhwIjoyMDU3OTc1ODA3fQ.Li3A-TLcPvQukSagJilD1D9rGuioodkursddKkYufYk'
);

export const Simple = ({ item }) => {
    return (
        <div style={{}} class='flex w-full border mt-3 items-center px-3 py-2 rounded-full'>

            <div class='w-full'>
                {item.thumbnail || item.image ? (
                    <img src={item.thumbnail || item.image} class='w-10 h-10 rounded-full' />
                ) : (
                    <div class='h-10 w-10 rounded-full' />
                )}
            </div>
            <div class='font-["Semibold"] w-full text-center text-sm'>{item.title || item.linkText}</div>
            <div class='w-full justify-end flex pr-2'>
                <EllipsisHorizontalIcon class='w-3' />
            </div>
        </div>
    )
}

export const Description = ({ item }) => {
    return (
        <div className="flex w-full border mt-2 items-center p-2 rounded-full">
            {/* Avatar */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-black" />

            {/* Title and Description */}
            <div className="flex flex-col flex-1 px-3 text-center">
                <div className='font-["Semibold"] text-sm line-clamp-1'>{item.title}</div>
                <div className='text-gray-300 font-["Medium"] text-xs line-clamp-2'>{item.description}</div>
            </div>

            {/* Ellipsis Icon */}
            <div className="flex-shrink-0 pr-1">
                <EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" />
            </div>
        </div>

    )
}

export const Button = ({ item }) => {
    return (
        <div className="flex w-full border mt-2 items-center p-2 rounded-xl">
            {/* Avatar */}
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-black" />

            {/* Title and Description */}
            <div className="flex text-start flex-col flex-1 px-3 text-center">
                <div className='font-["Semibold"] text-sm line-clamp-1'>{item.title}</div>
                <div class='line-clamp-1 text-xs font-["Medium"] text-gray-300'>{item.description}</div>
            </div>

            {/* Ellipsis Icon */}
            <div className="flex-shrink-0 pr-1">
                <div class='bg-black px-2 py-1 rounded-full text-white font-["Medium"] text-xs'>Buy</div>
            </div>
        </div>
    )
}


export const Builder = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);
    const [create] = useMutation(CREATE_STORE)
    let [isOpen, setIsOpen] = useState(false)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const [links, setLinks] = useState([{ linkText: '', link: '', image: '', file: null }]);
    const [createLinks] = useMutation(LINK_CREATION);

    const handleAddLink = () => {
        setLinks([...links, { linkText: '', link: '', image: '', file: null }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...links];
        updated[index][field] = value;
        setLinks(updated);
    };

    const handleFileChange = (index, file) => {
        const updated = [...links];
        updated[index].file = file;
        setLinks(updated);
    };

    const uploadImages = async () => {
        return await Promise.all(
            links.map(async (item) => {
                if (!item.file) return '';
                const fileExt = item.file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

                const { error } = await supabase.storage.from('bubble').upload(fileName, item.file);
                if (error) {
                    console.error('Upload error:', error.message);
                    return '';
                }

                const { data: publicUrl } = supabase.storage.from('bubble').getPublicUrl(fileName);
                return publicUrl.publicUrl;
            })
        );
    };

    const handleSubmit = async () => {
        const imageUrls = await uploadImages();

        const payload = links.map((item, i) => ({
            linkText: item.linkText,
            link: item.link,
            image: imageUrls[i],
        }));

        try {
            await createLinks({ variables: { links: payload } });
            alert('Links created!');
            setLinks([{ linkText: '', link: '', image: '', file: null }]);
        } catch (error) {
            console.error('Create error:', error.message);
        }
    };


    const navigate = useNavigate()
    const [selectedPage, setSelectedPage] = useState(null);

    const [page, setPage] = useState('Content')

    const [formData, setFormData] = useState({
        id: selectedPage?.id,
        subdomain: '',
        name: 'Untitled',
        backgroundColor: '#fff',
        storefrontIsPasscode: false,
        storefrontPass: '',
        newsletterSection: true,
        headerText: 'Text here',
        secondaryText: '',
        newsletterImage: '',
        componentColor: '',
        storefront: true,
        headingColor: '',
        subTextColor: '',
        embeddedLink: '',
        featuredSection: true,
        socialsSection: true,
        actionButton: '',
        actionButtonText: '',
        linksSection: true,
        newsletterSubText: '',
        newsletterHeading: '',
        instagramShown: true,
        tiktokShown: true,
        facebookShown: true,
        twitterShown: true,
        instagram: '',
        facebook: '',
        tiktok: '',
        font: '',
        workshop: false,
        form: false,
        linkinbio: false,
        formType: 'No Type',
        twitter: '',
        subscribeText: '',
        subscribeSubText: '',
        headerImage: '',
        secondaryImage: '',
        subText: '',
        description: 'Description goes here',
        template: 1,
    });


    const formik = useFormik({
        initialValues: {
            formData
        },

        onSubmit: async (values) => {
            try {
                const response = await create({
                    variables: {
                        id: selectedPage?.id,
                        description: formData.description,
                        headerText: formData.headerText,
                        desc: display.description,
                        simple: display.simple,
                        button: display.button,
                        backdrop: style.backdrop,
                        subdomain: formData.subdomain
                    },
                });
                navigate('/dashboard');
            } catch (err) {
                console.error('Login error:', err);
            }
        },
    });

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);

    useEffect(() => {
        if (selectedPage) {
            setFormData((prev) => ({
                ...prev,
                title: selectedPage.name || "",

            }));
        }
    }, [selectedPage]);

    const [display, setDisplay] = useState({
        simple: true,
        description: false,
        button: false
    })

    const [style, setStyle] = useState({
        backdrop: false,
        outline: false,
        color: false
    })

    const updateStyle = (key, value) => {
        if (!value) return; // prevent setting false, because one must stay true

        setStyle((prev) => {
            const updated = Object.keys(prev).reduce((acc, currKey) => {
                acc[currKey] = currKey === key ? true : false;
                return acc;
            }, {});
            return updated;
        });
    };


    const updateDisplay = (key, value) => {
        if (!value) return; // prevent setting false, because one must stay true

        setDisplay((prev) => {
            const updated = Object.keys(prev).reduce((acc, currKey) => {
                acc[currKey] = currKey === key ? true : false;
                return acc;
            }, {});
            return updated;
        });
    };

    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [primaryText, setPrimaryText] = useState('#000000')
    const [secondaryText, setSecondaryText] = useState('#777777')

    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const [colorPicker, setColorPicker] = useState(false)

    const handleDescriptionChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [color, setColor] = useState("#ffffff");

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <div class='w-full h-full'>
            {colorPicker === true && (
                <div class="w-full h-full z-50 flex items-center justify-center absolute top-0 left-0 opacity-50 bg-black">
                    <div class='z-50'>
                        <HexColorPicker color={color} onChange={setColor} />
                        <div onClick={() => setColorPicker(false)} class='w-full py-3 rounded-xl bg-black font-["Semibold"] text-white'>Close</div>
                    </div>
                </div>
            )}
            <div className="flex h-screen bg-gray-50">

                <div class='w-16 mt-5 flex flex-col space-y-3 items-center'>
                    {data.me.Pages.map(item => (
                        <div key={item.id} className="relative flex items-center">
                            {/* Left curved indicator */}
                            {selectedPage?.id === item.id && (
                                <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-3 h-5 bg-white border-l border-t border-b rounded-l-lg"
                                ></div>
                            )}
                            <img key={item.id} onClick={() => setSelectedPage(item)} class='h-8 rounded-lg' src={!item?.headerImage ? logo : item?.headerImage} />
                        </div>
                    ))}
                    <div class='flex items-center h-8 w-8 shadow-sm rounded-lg border justify-center'>
                        <PlusIcon class='w-4 h-4 text-black' />
                    </div>
                </div>
                <NavBar home={false} builder={true} products={false} storefront={selectedPage?.storefront} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <header className="flex justify-between border-b items-center px-6 py-4 bg-white">
                        <div class='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">{selectedPage?.name} • commercifyhq.com/{selectedPage?.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Bell className="text-gray-600" />
                            <User className="text-gray-600" />
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <main className="p-6 px-16 h-full flex-1">

                        <div class='w-full gap-6 h-full flex'>
                            <div class='w-2/3 p-5'>
                                <div className="flex items-center justify-between">
                                    <div class='text-2xl font-["Semibold"]'>{page}</div>
                                    <div class='flex items-center gap-3'>
                                        <Menu>
                                            <MenuButton className="inline-flex border gap-5 shadow-sm items-center bg-white px-5 py-2 rounded-lg font-['Semibold'] text-sm">
                                                {page}
                                                <ChevronDownIcon className="size-4 fill-black" />
                                            </MenuButton>

                                            <MenuItems
                                                transition
                                                anchor="bottom end"
                                                className="w-52 origin-top-right rounded-xl border bg-white font-['Semibold'] mt-5 p-1 text-sm/6  text-black border shadow-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                            >
                                                <MenuItem>
                                                    <button onClick={() => setPage('Content')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                        Content
                                                    </button>
                                                </MenuItem>
                                                {selectedPage?.linkinbio === true && (
                                                    <MenuItem>
                                                        <button onClick={() => setPage('Links')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                            Links
                                                        </button>
                                                    </MenuItem>
                                                )}
                                                <MenuItem>
                                                    <button onClick={() => setPage('Style')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                        Style
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button onClick={() => setPage('Display')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                        Display
                                                    </button>
                                                </MenuItem>

                                            </MenuItems>
                                        </Menu>
                                        <button onClick={open} class='bg-black px-5 py-2 rounded-md text-white font-["Semibold"] text-sm'>Publish</button>
                                    </div>
                                </div>
                                <Dialog open={isOpen} as="div" className="relative w-full h-full bg-black z-10 focus:outline-none" onClose={close}>
                                    <div className="fixed inset-0 w-screen overflow-y-auto flex items-center justify-center bg-black bg-opacity-25">
                                        <div className="flex min-h-full items-center justify-center p-4">
                                            <DialogPanel
                                                transition
                                                className="w-full max-w-md rounded-xl z-50 p-6 border bg-white duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                            >
                                                <div className="text-lg font-['Semibold']">
                                                    Name your page
                                                </div>
                                                <p className="mt-1 text-sm text-gray-400 font-['Medium']">
                                                    Give your page a name before you publish.
                                                </p>
                                                <input
                                                    onChange={handleNameChange}
                                                    value={formData.subdomain}
                                                    name="subdomain"
                                                    class='py-2 px-4 my-4 text-sm font-["Medium"] rounded-lg border w-full' placeholder='Name...' />
                                                <div className="">
                                                    <form onSubmit={formik.handleSubmit}>
                                                        <button type="submit" class='bg-black px-5 w-full py-2 rounded-md text-white font-["Semibold"] text-sm'>Publish</button>
                                                    </form>
                                                </div>
                                            </DialogPanel>
                                        </div>
                                    </div>
                                </Dialog>
                                <div>
                                    {page === 'Style' && (
                                        <div class='w-full'>
                                            <div class='grid grid-cols-2 gap-4 mt-5 w-full items-center gap-5'>
                                                <div class='w-full'>
                                                    <div class='mb-3 text-sm font-["Semibold"]'>Background Color</div>
                                                    <div class='flex items-center gap-3 w-full'>
                                                        <div class='w-10 h-10 shrink-0 rounded-md border' style={{ backgroundColor: color }} />
                                                        <div onClick={() => setColorPicker(true)} class='w-full py-2 border bg-white text-sm rounded-lg shadow-sm flex items-center justify-center text-center font-["Semibold"]'>Change color</div>
                                                    </div>

                                                </div>
                                                <div class='w-full'>
                                                    <div class='mb-3 text-sm font-["Semibold"]'>Primary Color</div>
                                                    <div class='flex items-center gap-3 w-full'>
                                                        <div class='w-10 h-10 shrink-0 rounded-md border' style={{ backgroundColor: primaryText }} />
                                                        <div class='w-full py-2 border bg-white text-sm rounded-lg shadow-sm flex items-center justify-center text-center font-["Semibold"]'>Change color</div>
                                                    </div>
                                                </div>
                                                <div class='w-full'>
                                                    <div class='mb-3 text-sm font-["Semibold"]'>Secondary Color</div>
                                                    <div class='flex items-center gap-3 w-full'>
                                                        <div class='w-10 h-10 shrink-0 rounded-md border' style={{ backgroundColor: secondaryText }} />
                                                        <div class='w-full py-2 border bg-white text-sm rounded-lg shadow-sm flex items-center justify-center text-center font-["Semibold"]'>Change color</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {page === 'Display' && (
                                        <div class='w-full flex flex-col'>
                                            <div class='w-full grid mt-5 grid-cols-3 gap-3'>
                                                <div onClick={() => updateDisplay('simple', true)} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Simple</div>

                                                    <div class='flex border mt-2 items-center p-2 rounded-full'>
                                                        <div class='w-full'>
                                                            <div class='w-6 h-6 rounded-full bg-black' />
                                                        </div>
                                                        <div class='font-["Semibold"] w-full text-xs'>Product</div>
                                                        <div class='w-full justify-end flex pr-2'>
                                                            <EllipsisHorizontalIcon class='w-3' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div onClick={() => updateDisplay('description', true)} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Description</div>

                                                    <div class='flex border mt-2 items-center p-2 rounded-full'>
                                                        <div class='w-full'>
                                                            <div class='w-6 h-6 rounded-full bg-black' />
                                                        </div>
                                                        <div class='font-["Semibold"] w-full text-xs'>
                                                            <div class='text-center'>Product</div>
                                                            <div class='text-gray-300 line-clamp-1 font-["Medium"] text-center'>Product description</div>
                                                        </div>
                                                        <div class='w-full justify-end flex pr-2'>
                                                            <EllipsisHorizontalIcon class='w-3' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div onClick={() => updateDisplay('button', true)} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Button</div>

                                                    <div class='flex border mt-2 items-center p-2 rounded-xl'>
                                                        <div class='w-full'>
                                                            <div class='w-8 h-8 rounded-xl bg-black' />
                                                        </div>
                                                        <div class='font-["Semibold"] w-full text-xs'>Product</div>
                                                        <div class='w-full justify-end flex pr-2'>
                                                            <div class='px-2 font-["Semibold"] py-1 rounded-full text-[10px] bg-black text-white'>Buy</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                                <div class='grid w-full mt-5 grid-cols-3 gap-5'>
                                                    <div onClick={() => updateStyle('backdrop', true)} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                        <div class='text-sm font-["Semibold"]'>Backdrop</div>

                                                        <div style={{ boxShadow: '0px 5px 0px 0px'}} class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4 rounded-full'>
                                                           
                                                        </div>
                                                    </div>
                                                    <div onClick={() => updateStyle('outline', true)} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                        <div class='text-sm font-["Semibold"]'>Outline</div>

                                                        <div class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4 rounded-full'>
                                                           
                                                           </div>
                                                    </div>
                                                    <div onClick={() => updateStyle('color', true)} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                        <div class='text-sm font-["Semibold"]'>Color</div>

                                                        <div class='flex bg-black w-full mt-2 items-center p-2 py-4 rounded-full'>
                                                           
                                                           </div>
                                                    </div>
                                                </div>
                                            </div>
                                    )}
                                </div>
                                <div>
                                    {page === 'Links' && (
                                        <div className="space-y-4 max-w-lg mx-auto">
                                            {links.map((link, idx) => (
                                                <div key={idx} className="border p-4 rounded-lg space-y-2">
                                                    <input
                                                        type="text"
                                                        value={link.linkText}
                                                        onChange={(e) => handleChange(idx, 'linkText', e.target.value)}
                                                        placeholder="Link Text"
                                                        className="w-full border px-3 py-2 rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={link.link}
                                                        onChange={(e) => handleChange(idx, 'link', e.target.value)}
                                                        placeholder="URL"
                                                        className="w-full border px-3 py-2 rounded"
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(idx, e.target.files[0])}
                                                        className="file-input w-full"
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                onClick={handleAddLink}
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                Add Another Link
                                            </button>

                                            <button
                                                onClick={handleSubmit}
                                                className="w-full bg-black text-white py-2 rounded-lg"
                                            >
                                                Submit All Links
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {page === 'Content' && (
                                        <div class='w-full'>
                                            <div class='flex mt-5 w-full items-center gap-5'>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"]'>Name</div>
                                                    <input
                                                        onChange={handleNameChange}
                                                        value={formData.headerText}
                                                        name="headerText"
                                                        className="px-5 py-2 text-sm w-full mt-3 font-['Medium'] rounded-md border bg-white shadow-sm"
                                                    />        </div>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"]'>Description</div>
                                                    <input
                                                        onChange={handleNameChange}
                                                        value={formData.description}
                                                        name="description"
                                                        className="px-5 py-2 text-sm w-full mt-3 font-['Medium'] rounded-md border bg-white shadow-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div class='flex items-center justify-between w-full'>
                                                <div>
                                                    <div class='mb-3 mt-5 text-sm font-["Semibold"]'>Page icon</div>

                                                    <div class='flex items-center gap-5'>
                                                        {!selectedPage?.headerImage ? (
                                                            <div className="w-12 h-12 bg-black rounded-xl" />
                                                        ) : (
                                                            <img src={selectedPage?.headerImage} className="w-12 h-12 bg-black rounded-xl" />
                                                        )}


                                                        <div>
                                                            <div class='font-["Semibold"] px-4 py-2 text-sm shadow-sm border rounded-lg'>Change page icon</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class='mb-3 mt-5 text-sm font-["Semibold"]'>Header Image </div>
                                                    <div class='flex items-center gap-5'>
                                                        {!selectedPage?.headerImage ? (
                                                            <div className="w-12 h-12 bg-black rounded-xl" />
                                                        ) : (
                                                            <img src={selectedPage?.headerImage} className="w-12 h-12 bg-black rounded-xl" />
                                                        )}
                                                        <div>
                                                            <div class='font-["Semibold"] px-4 py-2 text-sm shadow-sm border rounded-lg'>Change header image</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div class='w-1/3 h-full p-5'>
                                <div style={{ backgroundColor: color }} class='w-full h-full border-2 flex  px-5 flex-col items-center bg-white rounded-2xl'>
                                    <img src={!selectedPage?.headerImage ? logo : selectedPage?.headerImage} class='w-24 h-24 rounded-full mt-10' />
                                    <div class='mt-3 text-xl font-["Semibold"]'>{formData?.headerText}</div>
                                    <div class='mt-1 text-sm text-gray-400 font-["Medium"]'>{formData?.description}</div>
                                    {selectedPage?.storefront === true && (
                                        <div class='mt-7 space-y-2 w-full '>
                                            {data.me.OnlyProducts.map(item => (
                                                <div class='w-full flex'>
                                                    {display.simple === true && (<Simple item={item} />)}
                                                    {display.description === true && (<Description item={item} />)}
                                                    {display.button === true && (<Button item={item} />)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedPage?.workshop === true && (
                                        <div class='mt-7 space-y-2 w-full '>
                                            {data.me.Services.map(item => (
                                                <div class='w-full flex'>
                                                    {display.simple === true && (<Simple item={item} />)}
                                                    {display.description === true && (<Description item={item} />)}
                                                    {display.button === true && (<Button item={item} />)}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedPage?.linkinbio === true && (
                                        <div class='mt-7 space-y-2 w-full '>
                                            {data.me.Links.map(item => (
                                                <div class='w-full flex'>
                                                    {display.simple === true && (<Simple item={item} />)}
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Cookie Policy Notice */}
                </div>
            </div>
        </div>
    );
}
