import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check, TrendingUp } from "lucide-react";
import { CheckIcon, ChevronDownIcon, EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { HexColorPicker } from "react-colorful";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { CREATE_STORE, LINK_CREATION, UPDATE_LINK, DELETE_LINK } from "./Mutations/Mutations";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel } from "@headlessui/react";
import { useFormik } from "formik";
import { supabase } from "../../Utils/utils";

export const Simple = ({ item, round, color, style, font, link, textColor }) => {
    return (
        <a href={link} style={{
            backgroundColor: style === 'color' && color,
            borderColor: (style === 'outline' || 'backdrop') && color,
            boxShadow: style === 'backdrop' && `5px 5px 0px 0px ${color}`,
        }}
            className={`flex items-center ${round === 'rounded-medium' && 'rounded-xl'} ${round === 'none' && ''} ${round === 'rounded-full' && 'rounded-full'} justify-between ${style === 'outline' && `border-[1px] border-[${color}]`} ${style === 'backdrop' && `border-[2px] border-[${color}]`} mt-3 px-1 py-1.5 w-full`}
        >

            <div className="flex items-center justify-center w-12 h-12 mr-3">
                {item.thumbnail || item.image ? (
                    <img src={item.thumbnail || item.image} className={`w-11 h-11 ${round === 'none' && ''} ${round === 'rounded-full' && 'rounded-full'} ${round === 'rounded-medium' && 'rounded-xl'} object-cover0`} />
                ) : (
                    <div className="w-11 h-11" />
                )}
            </div>
            <div style={{ color: textColor }} className={`flex-1 ${font === 'Cascadia' && 'font-["CSemibold"]'} ${font === 'Rubrik' && 'font-["RSemibold"]'} ${font === 'General-Sans' && 'font-["Semibold"]'} text-center text-[14px]`}>
                {item.title || item.linkText}
            </div>

            {/* Right: Ellipsis */}
            <div className="flex items-center justify-center w-6 h-6 ml-3 mr-3">
                <EllipsisHorizontalIcon style={{ color: textColor }} className="w-4 h-4" />
            </div>
        </a>
    )
}



export const Description = ({ item, style, round, font, textColor, color }) => {
    return (
        <div
            style={{
                backgroundColor: style === 'color' && color,
                borderColor: (style === 'outline' || 'backdrop') && color,
                boxShadow: style === 'backdrop' && `5px 5px 0px 0px ${color}`,
            }}
            className={`flex flex-col ${round === 'rounded-medium' && 'rounded-xl'} ${round === 'none' && ''} ${round === 'rounded-full' && 'rounded-2xl'} justify-between ${style === 'outline' && `border-[1px] border-[${color}]`} ${style === 'backdrop' && `border-[2px] border-[${color}]`} mt-3 px-2 py-1.5 w-full`}>
            {/* Avatar */}
            <div className={`w-full h-20 ${round === 'rounded-medium' && 'rounded-xl'} ${round === 'none' && ''} ${round === 'rounded-full' && 'rounded-2xl'} bg-black`} />

            {/* Title and Description */}
            <div className="flex flex-col flex-1 mt-2 px-3">
                <div style={{ color: textColor }} className={`line-clamp-1 text-center ${font === 'Cascadia' && 'font-["CSemibold"]'} ${font === 'Rubrik' && 'font-["RSemibold"]'} ${font === 'General-Sans' && 'font-["Semibold"]'} text-[12px]`}>{item.title}</div>
                <div className='text-gray-300 font-["Medium"] text-xs line-clamp-2'>{item.description}</div>
            </div>


        </div>

    )
}

export const Button = ({ item, style, color, round, textColor, font }) => {
    return (
        <div style={{
            backgroundColor: style === 'color' && color,
            borderColor: (style === 'outline' || 'backdrop') && color,
            boxShadow: style === 'backdrop' && `5px 5px 0px 0px ${color}`,
        }}
            className={`flex flex-col relative ${round === 'rounded-medium' && 'rounded-xl'} ${round === 'none' && ''} ${round === 'rounded-full' && 'rounded-3xl'} justify-between ${style === 'outline' && `border-[1px] border-[${color}]`} ${style === 'backdrop' && `border-[2px] border-[${color}]`} mt-3 overflow-hidden w-full`}>
            <img src={item.thumbnail || item.image} class='w-full h-full' />
              <div className="absolute top-3 right-3 rounded-full flex items-center justify-center w-8 h-8 bg-black bg-opacity-10">
          <EllipsisHorizontalIcon className="w-3 h-3 text-white" />
        </div>
             <div className="absolute w-full h-40 bottom-0 px-5 bg-gradient-to-t from-black via-transparent to-transparent shadow-lg">
              
                <div className="absolute bottom-5 text-start w-2/3 line-clamp-2 text-white font-['Semibold']">
                  {item.linkText || item.title}
              </div>
            </div>
        </div>
    )
}


export const Builder = () => {
    const { data, error, loading, refetch } = useQuery(ME_QUERY);
    const [create] = useMutation(CREATE_STORE);
    const [createLinks] = useMutation(LINK_CREATION);
    const [updateLinkMutation] = useMutation(UPDATE_LINK);
    const [deleteLink] = useMutation(DELETE_LINK);

    const [selectedPage, setSelectedPage] = useState(null);
    const [links, setLinks] = useState([{ linkText: "", link: "", image: "", file: null }]);
    const [existingLinks, setExistingLinks] = useState([]);
    const [formData, setFormData] = useState({
        id: selectedPage?.id,
        subdomain: selectedPage?.subdomain || '',
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
        // Add all other default fields here as needed
    });



    const [display, setDisplay] = useState({ simple: true, description: false, button: false });
    const [colorPicker, setColorPicker] = useState(false)
    const [page, setPage] = useState('Content')
    const [isOpen, setIsOpen] = useState(false)
    const [color, setColor] = useState("#ffffff");
    const [font, setFont] = useState('General-Sans')
    const [rounded, setRounded] = useState('rounded-full')
    const [styleColor, setStyleColor] = useState('#ededed')
    const [base, setBase] = useState('simple')
    const [style, setStyle] = useState('outline')
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]);
        }
        if (data?.me?.Links) {
            setExistingLinks(data.me.Links);
        }
    }, [data]);

    useEffect(() => {
        if (selectedPage) {
            setFormData((prev) => ({
                ...prev,
                subdomain: selectedPage.subdomain || "",
                name: selectedPage.name || "",
                headerText: selectedPage.headerText || "",
                description: selectedPage.description || "",
                headerImage: selectedPage.headerImage || "",
                linkinbio: selectedPage.linkinbio,
            }));
            setTextColor(selectedPage?.textColor)
            setColor(selectedPage?.backgroundColor)
            setBase(selectedPage?.base)
            setStyleColor(selectedPage?.styleColor)
            setStyle(selectedPage?.style)
            setBaseText(selectedPage?.baseText)
            setRounded(selectedPage?.rounded)
        }
    }, [selectedPage]);

    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChange = (index, field, value) => {
        const updated = [...links];
        updated[index][field] = value;
        setLinks(updated);
    };


    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const handleFileChange = (index, file) => {
        const updated = [...links];
        updated[index].file = file;
        setLinks(updated);
    };

    const uploadImages = async () => {
        return await Promise.all(
            links.map(async ({ file }) => {
                if (!file) return "";
                const fileName = `${Date.now()}-${Math.random()}.${file.name.split(".").pop()}`;
                const { error } = await supabase.storage.from("bubble").upload(fileName, file);
                if (error) return "";
                const { data } = supabase.storage.from("bubble").getPublicUrl(fileName);
                return data?.publicUrl || "";
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
            alert("Links created!");
            setLinks([{ linkText: "", link: "", image: "", file: null }]);
        } catch (err) {
            console.error("Link creation failed:", err.message);
        }
    };

    const handleAddLink = () => {
        setLinks([...links, { linkText: '', link: '', image: '', file: null }]);
    };

    const handleDelete = async (id) => {
        await deleteLink({ variables: { id } });
        await refetchExistingLinks();
    };

    const formik = useFormik({
        initialValues: { formData },
        onSubmit: async () => {
            try {
                await create({
                    variables: {
                        id: selectedPage?.id,
                        subdomain: formData.subdomain,
                        description: formData.description,
                        backgroundColor: color,
                        headerText: formData.headerText,
                        base: base,
                        rounded: rounded,
                        style: style,
                        font: font,
                        styleColor: styleColor,
                        textColor: textColor,
                        baseText: baseText,
                        headerImage: formData?.headerImage
                    },
                });
                navigate("/dashboard");
            } catch (err) {
                console.error("Form submission error:", err.message);
            }
        },
    });



    async function uploadHeaderImage(file) {
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `headers/${fileName}`;

        const { data, error } = await supabase.storage
            .from('bubble') // your bucket name
            .upload(filePath, file);

        if (error) {
            console.error('Upload failed:', error.message);
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from('bubble')
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData?.publicUrl;

        if (publicUrl) {
            // 🔄 Update formData.headerImage with the public URL
            setFormData((prev) => ({
                ...prev,
                headerImage: publicUrl,
            }));
        }
    }

    const handleUpdateLink = (index, field, value) => {
        const updated = [...existingLinks];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setExistingLinks(updated);
    };

    const submitUpdate = async (id, idx) => {
        const link = existingLinks[idx];
        await updateLinkMutation({ variables: { id, link: link.link, linkText: link.linkText } });
    };

    const handleExistingDelete = async (id) => {
        await deleteLink({ variables: { id } });
        refetchExistingLinks();
    };

    const refetchExistingLinks = async () => {
        try {
            const { data } = await refetch();
            setExistingLinks(data.me.Links);
        } catch (err) {
            console.error("Failed to refetch links:", err);
        }
    };

    const [colorPickerBase, setColorPickerBase] = useState(false)
    const [textColorPicker, setTextColorPicker] = useState(false)
    const [textColor, setTextColor] = useState("#000")
    const [baseText, setBaseText] = useState("#000")

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
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
            {colorPickerBase === true && (
                <div class="w-full h-full z-50 flex items-center justify-center absolute top-0 left-0 opacity-50 bg-black">
                    <div class='z-50'>
                        <HexColorPicker color={styleColor} onChange={setStyleColor} />
                        <div onClick={() => setColorPickerBase(false)} class='w-full py-3 rounded-xl bg-black font-["Semibold"] text-white'>Close</div>
                    </div>
                </div>
            )}
            {textColorPicker === true && (
                <div class="w-full h-full z-50 flex items-center justify-center absolute top-0 left-0 opacity-50 bg-black">
                    <div class='z-50'>
                        <HexColorPicker color={textColor} onChange={setTextColor} />
                        <div onClick={() => setTextColorPicker(false)} class='w-full py-3 rounded-xl bg-black font-["Semibold"] text-white'>Close</div>
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
                <NavBar home={false} builder={true} products={false} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

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
                                                    value={formData?.subdomain}
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
                                                    <div class='mb-3 text-sm font-["Semibold"]'>Text Color</div>
                                                    <div class='flex items-center gap-3 w-full'>
                                                        <div class='w-10 h-10 shrink-0 rounded-md border' style={{}} />
                                                        <div onClick={() => setTextColorPicker(true)} class='w-full py-2 border bg-white text-sm rounded-lg shadow-sm flex items-center justify-center text-center font-["Semibold"]'>Change color</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div>
                                                <div>Fonts</div>
                                                <div class='grid grid-cols-4 mt-4 gap-3'>
                                                    <div onClick={() => setFont('General-Sans')} class='border rounded-xl font-["Normal"] w-full justify-center items-center flex py-5'>
                                                        Normal
                                                    </div>
                                                    <div onClick={() => setFont('Cascadia')} class='border rounded-xl font-["CNormal"] w-full justify-center items-center flex py-5'>
                                                        Cascadia
                                                    </div>
                                                    <div onClick={() => setFont('Rubrik')} class='border rounded-xl font-["RNormal"] w-full justify-center items-center flex py-5'>
                                                        Rubrik
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {page === 'Display' && (
                                        <div class='w-full flex flex-col'>
                                            <div class='w-full grid mt-5 grid-cols-3 gap-3' >
                                                <div onClick={() => setBase('simple')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
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
                                                <div style={{ display: formData.linkinbio === true && 'none' }} onClick={() => setBase('description')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
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
                                                <div onClick={() => setBase('button')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
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
                                                <div onClick={() => setStyle('backdrop')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Backdrop</div>

                                                    <div style={{ boxShadow: '0px 5px 0px 0px' }} class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4 rounded-full'>

                                                    </div>
                                                </div>
                                                <div onClick={() => setStyle('outline')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Outline</div>

                                                    <div class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4 rounded-full'>

                                                    </div>
                                                </div>
                                                <div onClick={() => setStyle('color')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Color</div>

                                                    <div class='flex bg-black w-full mt-2 items-center p-2 py-4 rounded-full'>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class='grid w-full mt-5 grid-cols-3 gap-5'>
                                                <div onClick={() => setRounded('rounded-full')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Rounded full</div>

                                                    <div class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4 rounded-full'>

                                                    </div>
                                                </div>
                                                <div onClick={() => setRounded('rounded-medium')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Rounded medium</div>

                                                    <div class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4 rounded-xl'>

                                                    </div>
                                                </div>
                                                <div onClick={() => setRounded('none')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-lg border'>
                                                    <div class='text-sm font-["Semibold"]'>Square</div>

                                                    <div class='flex border border-black border-[2px] w-full mt-2 items-center p-2 py-4'>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class='grid grid-cols-2 gap-2 w-full'>
                                                <div>
                                                    <button onClick={() => setColorPickerBase(true)}>setcolor</button>

                                                </div>
                                                <div>
                                                    <HexColorPicker color={baseText} onChange={setBaseText} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {page === 'Links' && (
                                        <div className="space-y-6 max-w-lg mx-auto">
                                            <div className="space-y-4">
                                                <h2 className="font-bold">Create New Links</h2>
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
                                                    Add New Link
                                                </button>

                                                <button
                                                    onClick={handleSubmit}
                                                    className="w-full bg-black text-white py-2 rounded-lg"
                                                >
                                                    Submit New Links
                                                </button>
                                            </div>
                                            {/* Existing Links (Editable) */}
                                            <div className="space-y-4">
                                                <h2 className="font-bold">Your Current Links</h2>
                                                {existingLinks.map((link, idx) => (
                                                    <div key={idx} className="border p-4 rounded-lg space-y-2">
                                                        <input
                                                            type="text"
                                                            value={existingLinks[idx].linkText}
                                                            onChange={(e) => handleUpdateLink(idx, 'linkText', e.target.value)}
                                                            className="w-full border px-3 py-2 rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={existingLinks[idx].link}
                                                            onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)}
                                                            className="w-full border px-3 py-2 rounded"
                                                        />
                                                        <div className="flex justify-between">
                                                            <button
                                                                onClick={() => submitUpdate(link.id, idx)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(link.id)}
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* New Links (Add Mode) */}

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
                                                    <div class='mb-3 mt-5 text-sm font-["Semibold"]'>Header Image </div>
                                                    <div class='flex items-center gap-5'>
                                                        {!selectedPage?.headerImage ? (
                                                            <div className="w-12 h-12 bg-black rounded-xl" />
                                                        ) : (
                                                            <img src={selectedPage?.headerImage} className="w-12 h-12 bg-black rounded-xl" />
                                                        )}
                                                        <div>
                                                            <input
                                                                id="headerImageUpload"
                                                                type="file"
                                                                class='hidden'
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        uploadHeaderImage(file); // pass to upload function
                                                                    }
                                                                }}
                                                            />

                                                            <label
                                                                htmlFor="headerImageUpload"
                                                                className='cursor-pointer font-["Semibold"] bg-white px-4 py-2 text-sm shadow-sm border rounded-lg inline-block'
                                                            >
                                                                Change header image
                                                            </label>
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
                                    <div style={{ color: textColor }} class={`mt-3 text-xl ${font === 'Cascadia' && 'font-["CSemibold"]'} ${font === 'Rubrik' && 'font-["RSemibold"]'} ${font === 'General-Sans' && 'font-["Semibold"]'} `}>{formData?.headerText}</div>
                                    <div style={{ color: textColor }} class={`mt-1 text-sm text-gray-400 ${font === 'Cascadia' && 'font-["CMedium"]'} ${font === 'Rubrik' && 'font-["RMedium"]'} ${font === 'General-Sans' && 'font-["Medium"]'} `}>{formData?.description}</div>
                                    {selectedPage?.storefront === true && (
                                        <div class='w-full'>
                                            <div class={`mt-7 space-y-2 ${base === 'descripion' && 'hidden'} w-full`}>
                                                {data.me.OnlyProducts.map(item => (
                                                    <div class='w-full flex'>
                                                        {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                        {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}

                                                    </div>
                                                ))}
                                            </div>
                                            <div class={`${base === 'simple' && 'hidden'} ${base === 'button' && 'hidden'} grid grid-cols-2 gap-2 w-full`}>
                                                {data.me.OnlyProducts.map(item => (
                                                    <div class='w-full'>
                                                        {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPage?.workshop === true && (
                                        <div class='w-full'>
                                            <div class={`mt-7 space-y-2 ${base === 'descripion' && 'hidden'} w-full`}>
                                                {data.me.Services.map(item => (
                                                    <div class='w-full flex'>
                                                        {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                        {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}

                                                    </div>
                                                ))}
                                            </div>
                                            <div class={`${base === 'simple' && 'hidden'} ${base === 'button' && 'hidden'} grid grid-cols-2 gap-2 w-full`}>
                                                {data.me.Services.map(item => (
                                                    <div class='w-full'>
                                                        {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPage?.linkinbio === true && (
                                        <div class='mt-7 space-y-2 w-full '>
                                            {data.me.Links.map(item => (
                                                <div class='w-full flex'>
                                                    {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                    {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
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
