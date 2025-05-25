import { useState, useEffect } from "react";
import { ChevronDownIcon, EllipsisHorizontalIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { HexColorPicker } from "react-colorful";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { CREATE_STORE, LINK_CREATION, UPDATE_LINK, DELETE_LINK } from "./Mutations/Mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel } from "@headlessui/react";
import { useFormik } from "formik";
import { supabase } from "../../Utils/utils";
import ProductDialog from "../../components/ProductDialog";
import Group from "../../components/assets/Group";
import { Banner } from "../../Pages/Dash/Home";
import flag from '../../components/assets/united-states.png'
import { ArrowRightIcon } from "lucide-react";

export const Simple = ({ item, round, color, style, font, link, textColor }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const closeDialog = () => {
        setSelectedPost(null);
    };

    const openDialog = (item) => {
        setSelectedPost(item);
    };


    return (
        <a href={link} onClick={() => openDialog(item)} style={{
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
            <div style={{ color: textColor }} className={`flex-1 ${font === 'Cascadia' && 'font-["CSemibold"]'} ${font === 'Rubrik' && 'font-["RSemibold"]'} line-clamp-2 py-1 ${font === 'General-Sans' && 'font-["Semibold"]'} text-center text-[14px]`}>
                {item.title || item.linkText}
            </div>

            {/* Right: Ellipsis */}
            <div className="flex items-center justify-center w-6 h-6 ml-3 mr-3">
                <EllipsisHorizontalIcon style={{ color: textColor }} className="w-4 h-4" />
            </div>

            <ProductDialog
                item={selectedPost}
                isOpen={!!selectedPost}
                onClose={closeDialog}
            />
        </a>
    )
}



export const Description = ({ item, style, round, font, textColor, color }) => {
    const [selectedPost, setSelectedPost] = useState(null);
  const closeDialog = () => {
    setSelectedPost(null);
};
    const openDialog = (item) => {
        setSelectedPost(item);
    };

    return (


        <div

            onClick={() => openDialog(item)}
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
                <div className='text-gray-300 font-["Medium"] text-center px-5 text-xs line-clamp-2'>{item.description}</div>
            </div>
            <ProductDialog
                item={selectedPost}
                isOpen={!!selectedPost}
                onClose={closeDialog}
            />

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
        secondaryImage: '',
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
                secondaryImage: selectedPage?.secondaryImage || ""
            }));
            setTextColor(selectedPage?.textColor)
            setColor(selectedPage?.backgroundColor || "#fff")
            setBase(selectedPage?.base)
            setStyleColor(selectedPage?.styleColor)
            setStyle(selectedPage?.style)
            setBaseText(selectedPage?.baseText)
            setRounded(selectedPage?.rounded)
            setGrid(selectedPage?.grid)
            setType(selectedPage?.formType)
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
                        published: true,
                        textColor: textColor,
                        baseText: baseText,
                        headerImage: formData?.headerImage,
                        secondaryImage: formData?.secondaryImage,
                        grid: grid,
                        formType: type
                    },
                });
                navigate("/dashboard");
            } catch (err) {
                console.error("Form submission error:", err.message);
            }
        },
    });

    const [grid, setGrid] = useState(false)
    const [type, setType] = useState('Unlock')

    async function uploadSecondaryImage(file) {
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
                secondaryImage: publicUrl,
            }));
        }
    }


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


    const refetchExistingLinks = async () => {
        try {
            const { data } = await refetch();
            setExistingLinks(data.me.Links);
        } catch (err) {
            console.error("Failed to refetch links:", err);
        }
    };

    const [colorPickerBase, setColorPickerBase] = useState(false)
    const [textBaseColorPick, setTextBaseColorPicker] = useState(false)
    const [textColorPicker, setTextColorPicker] = useState(false)
    const [textColor, setTextColor] = useState("#000")
    const [baseText, setBaseText] = useState("#000")

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    return (
        <div class='w-full h-full'>

            <Banner />

            {/* Curved panel overlapping the banner */}
            <div className="flex h-screen bg-gray-50 rounded-t-3xl -mt-5 relative z-20">

                <div class='w-16 mt-5 flex flex-col space-y-3 items-center'>
                    {data.me.Pages.map(item => (
                        <div key={item.id} className="relative flex items-center">
                            {/* Left curved indicator */}
                            {selectedPage?.id === item.id && (
                                <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-3 h-5 bg-white border-l border-t border-b rounded-l-lg"
                                ></div>
                            )}
                            <img key={item.id} onClick={() => setSelectedPage(item)} class='h-8 rounded-full' src={!item?.headerImage ? logo : item?.headerImage} />
                        </div>
                    ))}
                    <div class='flex items-center h-8 w-8 shadow-sm rounded-lg border justify-center'>
                        <PlusIcon class='w-4 h-4 text-black' />
                    </div>
                </div>
                <NavBar home={false} builder={true} products={false} linkinbio={selectedPage?.linkinbio} form={selectedPage?.form} workshop={selectedPage?.workshop} storefront={selectedPage?.storefront} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}

                    <div className="border-b items-center px-6 py-4">
                        <div class='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                        <div className="flex items-center gap-4">

                        </div>
                    </div>
                    {/* Dashboard Content */}
                    <main className="px-16 overflow-y-auto h-full flex-1">
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

                        {textBaseColorPick === true && (
                            <div class="w-full h-full z-50 flex items-center justify-center absolute top-0 left-0 opacity-50 bg-black">
                                <div class='z-50'>
                                    <HexColorPicker color={baseText} onChange={setBaseText} />
                                    <div onClick={() => setTextBaseColorPicker(false)} class='w-full py-3 rounded-xl bg-black font-["Semibold"] text-white'>Close</div>
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
                        <div class='w-full gap-6 h-full flex'>
                            <div class='w-2/3 p-5'>
                                <div className="flex z-50 items-center justify-between">
                                    <div class='text-2xl font-["Semibold"]'>{page}</div>
                                    <div class='flex items-center gap-3'>
                                        <Menu>
                                            <MenuButton className="inline-flex z-50 border gap-5 shadow-sm items-center bg-white px-5 py-2 rounded-full font-['Semibold'] text-sm">
                                                {page}
                                                <ChevronDownIcon className="size-4 fill-black" />
                                            </MenuButton>

                                            <MenuItems
                                                transition
                                                anchor="bottom end"
                                                className="w-52 z-50 origin-top-right rounded-xl border bg-white font-['Semibold'] mt-5 p-1 text-sm/6  text-black border shadow-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
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
                                                {selectedPage?.form === true && (
                                                    <MenuItem>
                                                        <button onClick={() => setPage('Type')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                            Type
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
                                        <button onClick={open} class='bg-black px-5 py-2 rounded-full text-white font-["Semibold"] text-sm'>Publish</button>
                                    </div>
                                </div>
                                <Dialog open={isOpen} as="div" className="relative w-full h-full bg-black z-50 focus:outline-none" onClose={close}>
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
                                                    class='py-2 px-4 my-4 text-sm font-["Medium"] rounded-full bg-white border w-full shadow-sm' placeholder='Name...' />
                                                <div className="">
                                                    <form onSubmit={formik.handleSubmit}>
                                                        <button type="submit" class='bg-black px-5 w-full py-2 rounded-full text-white font-["Semibold"] text-sm'>Publish</button>
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
                                                        <div class='w-10 h-10 shrink-0 rounded-full border' />
                                                        <div onClick={() => setColorPicker(true)} class='w-full py-2 border bg-white text-sm rounded-full shadow-sm flex items-center justify-center text-center font-["Semibold"]'>Change color</div>
                                                    </div>

                                                </div>
                                                <div class='w-full'>
                                                    <div class='mb-3 text-sm font-["Semibold"]'>Text Color</div>
                                                    <div class='flex items-center gap-3 w-full'>
                                                        <div class='w-10 h-10 shrink-0 rounded-full border' style={{}} />
                                                        <div onClick={() => setTextColorPicker(true)} class='w-full py-2 border bg-white text-sm rounded-full shadow-sm flex items-center justify-center text-center font-["Semibold"]'>Change color</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="mt-5">
                                                <div class='mb-3 text-sm font-["Semibold"]'>Fonts</div>
                                                <div class='flex items-center gap-3'>
                                                    <div onClick={() => setFont('General-Sans')} class='border shadow-sm bg-white rounded-full font-["Medium"] justify-center items-center flex py-2 px-4 text-sm'>
                                                        Normal
                                                    </div>
                                                    <div onClick={() => setFont('Cascadia')} class='border rounded-full shadow-sm font-["CMedium"] justify-center items-center flex py-2 px-4 text-sm'>
                                                        Cascadia
                                                    </div>
                                                    <div onClick={() => setFont('Rubrik')} class='border rounded-full shadow-sm font-["RMedium"] justify-center items-center flex py-2 px-4 text-sm'>
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
                                            <div class='font-["Semibold"] mt-5 text-sm'>Format</div>
                                            <div class='w-full flex items-center mt-3 gap-3' >
                                                <div onClick={() => setBase('simple')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-full border'>
                                                    <div class='flex border items-center p-2 rounded-full'>
                                                        <div class='w-full'>
                                                            <div class='w-6 h-6 rounded-full bg-black' />
                                                        </div>
                                                        <div class='font-["Semibold"] w-full text-xs'>Product</div>
                                                        <div class='w-full justify-end flex pr-2'>
                                                            <EllipsisHorizontalIcon class='w-3' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: formData.linkinbio === true && 'none' }} onClick={() => setBase('description')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-full shadow-sm border'>

                                                    <div class='flex border items-center p-2 rounded-full'>
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
                                                <div onClick={() => setBase('button')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-full border'>

                                                    <div class='flex border items-center p-2 rounded-full'>
                                                        <div class='w-full'>
                                                            <div class='w-8 h-8 rounded-full bg-black' />
                                                        </div>
                                                        <div class='font-["Semibold"] w-full text-xs'>Product</div>
                                                        <div class='w-full justify-end flex pr-2'>
                                                            <div class='px-2 font-["Semibold"] py-1 rounded-full text-[10px] bg-black text-white'>Buy</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class='font-["Semibold"] text-sm'>Style</div>
                                                <div class='w-full mt-3 flex items-center gap-5'>
                                                    <div onClick={() => setStyle('backdrop')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-full border'>
                                                        <div style={{ boxShadow: '0px 5px 0px 0px' }} class='flex border border-black border-[2px] w-full items-center p-2 py-4 rounded-full'>

                                                        </div>
                                                    </div>
                                                    <div onClick={() => setStyle('outline')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-full border'>
                                                        <div class='flex border border-black border-[2px] w-full items-center p-2 py-4 rounded-full'>

                                                        </div>
                                                    </div>
                                                    <div onClick={() => setStyle('color')} class='w-full bg-white shadow-sm px-5 py-3 justify-between rounded-full border'>
                                                        <div class='flex bg-black w-full items-center p-2 py-4 rounded-full'>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='flex mt-3 items-center gap-5'>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"] '>Rounded</div>
                                                    <div class=' mt-3 flex items-center gap-4'>
                                                        <div onClick={() => setRounded('rounded-full')} class='bg-white shadow-sm px-4 py-3 justify-between rounded-full border'>

                                                            <div class="flex w-7 items-center px-1 py-3 rounded-l-full border-l-2 border-r-2 border-t-2 border-b-2 border-l-black border-r-white border-t-black border-b-black">
                                                            </div>
                                                        </div>
                                                        <div onClick={() => setRounded('rounded-medium')} class='bg-white shadow-sm px-4 py-3 justify-between rounded-full border'>

                                                            <div class="flex w-7 items-center px-1 py-3 rounded-l-xl border-l-2 border-r-2 border-t-2 border-b-2 border-l-black border-r-white border-t-black border-b-black">

                                                            </div>
                                                        </div>
                                                        <div onClick={() => setRounded('none')} class='bg-white shadow-sm px-4 py-3 justify-between rounded-full border'>

                                                            <div class="flex w-7 items-center px-1 py-3 border-l-2 border-r-2 border-t-2 border-b-2 border-l-black border-r-white border-t-black border-b-black">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"] '>Color</div>
                                                    <div class='flex items-center mt-3 gap-3'>
                                                        <div onClick={() => setTextBaseColorPicker(true)} class='px-4 py-2 rounded-full shadow-sm border gap-2 text-sm flex whitespace-nowrap items-center font-["Semibold"]'><div>Change text color</div> <div class='w-5 h-5 rounded-full' style={{ backgroundColor: baseText }} /></div>
                                                        <div onClick={() => setColorPickerBase(true)} class='px-4 py-2 rounded-full shadow-sm border gap-2 text-sm flex whitespace-nowrap items-center font-["Semibold"]'><div>Change component color </div><div class='w-5 h-5 rounded-full' style={{ backgroundColor: styleColor }} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class={`grid grid-cols-2 ${base === 'description' && 'grid-cols-3'} gap-2 w-full`}>


                                                <div>
                                                    <div onClick={() => setGrid(true)}>{grid === true ? 'Grid' : 'No Grid'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {page === 'Links' && (
                                        <div className="space-y-6 mx-auto">
                                            <div className="space-y-4">
                                                {links.map((link, idx) => (
                                                    <div key={idx} className="border bg-white shadow-sm p-4 mt-5 rounded-3xl space-y-2">
                                                        <input
                                                            type="text"
                                                            value={link.linkText}
                                                            onChange={(e) => handleChange(idx, 'linkText', e.target.value)}
                                                            placeholder="Link Text"
                                                            className="w-full border px-6 text-sm py-3 font-['Medium'] rounded-full"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={link.link}
                                                            onChange={(e) => handleChange(idx, 'link', e.target.value)}
                                                            placeholder="URL"
                                                            className="w-full border px-6 text-sm py-3 font-['Medium'] rounded-full"
                                                        />
                                                        <input
                                                            id="linkImageUpload"

                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(idx, e.target.files[0])}
                                                            className="file-input hidden w-full"
                                                        />
                                                        <div className="w-full mt-7 flex justify-between">
                                                            <label htmlFor={`linkImageUpload-${idx}`}>
                                                                <div className='bg-black text-white font-["Semibold"] text-xs px-4 py-3 rounded-full inline-block'>
                                                                    Upload image
                                                                </div>
                                                            </label>

                                                            {/* ✅ Display file name if exists */}
                                                            {link.file && (
                                                                <p className="text-sm mt-2 text-gray-600 truncate">{link.file.name}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div class='flex items-center gap-5'>
                                                    <button
                                                        onClick={handleAddLink}
                                                        className="border shadow-sm bg-white w-full text-sm rounded-full px-4 py-3 font-['Semibold']"
                                                    >
                                                        Add New Link
                                                    </button>

                                                    <button
                                                        onClick={handleSubmit}
                                                        className="w-full bg-black font-['Semibold'] text-sm rounded-full text-white py-3"
                                                    >
                                                        Submit New Links
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Existing Links (Editable) */}
                                            <div className="space-y-4">
                                                <h2 className="font-['Semibold'] text-xl">Your Current Links</h2>
                                                {existingLinks.map((link, idx) => (
                                                    <div key={idx} className="border p-4 rounded-3xl shadow-sm bg-white space-y-2">
                                                        <input
                                                            type="text"
                                                            value={existingLinks[idx].linkText}
                                                            onChange={(e) => handleUpdateLink(idx, 'linkText', e.target.value)}
                                                            className="w-full border px-6 text-sm py-3 font-['Medium'] rounded-full"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={existingLinks[idx].link}
                                                            onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)}
                                                            className="w-full border px-6 text-sm py-3 font-['Medium'] rounded-full"
                                                        />
                                                        <div className="flex justify-between">
                                                            <button
                                                                onClick={() => submitUpdate(link.id, idx)}
                                                                className='bg-black text-white font-["Semibold"] text-xs px-4 py-3 rounded-full inline-block'>

                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(link.id)}
                                                                className='bg-red-500 text-white font-["Semibold"] text-xs px-4 py-3 rounded-full inline-block'>

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
                                            <div class='flex mt-5 w-full gap-5'>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"]'>Name</div>
                                                    <input
                                                        onChange={handleNameChange}
                                                        value={formData.headerText}
                                                        name="headerText"
                                                        className="px-5 py-2 text-sm w-full mt-3 font-['Medium'] rounded-full border bg-white shadow-sm"
                                                    />        </div>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"]'>Description</div>
                                                    <textarea
                                                        onChange={handleNameChange}
                                                        value={formData.description}
                                                        name="description"
                                                        className="px-5 py-2 h-24 text-sm w-full mt-3 font-['Medium'] rounded-[35px] border bg-white shadow-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div class='flex items-center justify-between w-full'>

                                                <div>
                                                    <div class='mb-3 mt-5 text-sm font-["Semibold"]'>Icon Image </div>
                                                    <div class='flex items-center gap-5'>
                                                        {!selectedPage?.headerImage ? (
                                                            <div className="w-12 h-12 bg-black rounded-xl" />
                                                        ) : (
                                                            <img src={selectedPage?.headerImage} className="w-12 h-12 bg-black rounded-full" />
                                                        )}
                                                        <div>
                                                            <input
                                                                id="headerImageUpload"
                                                                type="file"
                                                                class='hidden rounded-full'
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
                                                                className='cursor-pointer font-["Semibold"] bg-white px-4 py-2 text-sm shadow-sm border rounded-full inline-block'
                                                            >
                                                                Change icon image
                                                            </label>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div>
                                                    <div class='mb-3 mt-5 text-sm font-["Semibold"]'>Header Image </div>
                                                    <div class='flex items-center gap-5'>
                                                        {!selectedPage?.secondaryImage ? (
                                                            <div className="w-12 h-12 bg-black rounded-full" />
                                                        ) : (
                                                            <img src={selectedPage?.secondaryImage} className="w-12 h-12 bg-black rounded-full" />
                                                        )}
                                                        <div>
                                                            <input
                                                                id="headerSecondaryUpload"
                                                                type="file"
                                                                class='hidden rounded-full'
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        uploadSecondaryImage(file); // pass to upload function
                                                                    }
                                                                }}
                                                            />

                                                            <label
                                                                htmlFor="headerSecondaryUpload"
                                                                className='cursor-pointer font-["Semibold"] bg-white px-4 py-2 text-sm shadow-sm border rounded-full inline-block'
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
                                <div>
                                    {page === 'Type' && (
                                        <div class='w-full mt-5 grid grid-cols-3 gap-5'>
                                            <div onClick={() => setType('Contact')} class='w-full py-4 bg-white rounded-full shadow-sm rounded-full text-center border font-["Semibold"]'>
                                                <div>Contact</div>
                                            </div>
                                            
                                            <div onClick={() => setType('Feedback')} class='w-full py-4 bg-white rounded-full shadow-sm rounded-full text-center border font-["Semibold"]'>
                                                <div>Feedback</div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                            <div class='w-1/3 h-full p-5'>
                                <div style={{ backgroundColor: color }} class={`w-full overflow-hidden h-full relative border-4 border-black px-5 items-center flex-col flex bg-white rounded-3xl`}>
                                    <img src={!selectedPage?.secondaryImage ? logo : selectedPage?.secondaryImage} class='w-24 h-24 rounded-full mt-10' />
                                    <div style={{ color: textColor }} class={`mt-3 text-center text-xl ${font === 'Cascadia' && 'font-["CSemibold"]'} ${font === 'Rubrik' && 'font-["RSemibold"]'} ${font === 'General-Sans' && 'font-["Semibold"]'} `}>{formData?.headerText}</div>
                                    <div style={{ color: textColor }} class={`mt-1 text-sm text-center text-gray-400 ${font === 'Cascadia' && 'font-["CMedium"]'} ${font === 'Rubrik' && 'font-["RMedium"]'} ${font === 'General-Sans' && 'font-["Medium"]'} `}>{formData?.description}</div>
                                    {selectedPage?.storefront === true && (
                                        <div class='w-full'>
                                            <div class={`mt-7 space-y-2 ${base === 'descripion' && 'hidden'}  w-full`}>
                                                {data.me.Services.map(item => (
                                                    <div class='w-full flex'>
                                                        {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                        {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}

                                                    </div>
                                                ))}
                                            </div>
                                            <div class={`${grid === false ? 'flex flex-col' : 'grid grid-cols-2'} ${base === 'button' && 'hidden'} gap-2 w-full`}>
                                                {data.me.Services.map(item => (
                                                    <div class='w-full'>
                                                        {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPage?.workshop === true && (
                                        <div class='w-full'>
                                            <div class={`mt-7 space-y-2 ${base === 'descripion' && 'hidden'}  w-full`}>
                                                {data.me.Services.map(item => (
                                                    <div class='w-full flex'>
                                                        {base === 'simple' && (<Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                        {base === 'button' && (<Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}

                                                    </div>
                                                ))}
                                            </div>
                                            <div class={`${grid === false ? 'flex flex-col' : 'grid grid-cols-2'} ${base === 'button' && 'hidden'} gap-2 w-full`}>
                                                {data.me.Services.map(item => (
                                                    <div class='w-full'>
                                                        {base === 'description' && (<Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPage?.form === true && (
                                        <div class='w-full mt-7'>
                                            {type === 'Contact' && (
                                                <div class='w-full'>
                                                    <div class='grid grid-cols-2 gap-3'>
                                                        <div class='w-full'>
                                                            <div class='text-sm font-["Semibold"]'>Name</div>
                                                            <input placeholder='John Doe' class='px-4 py-3 shadow-sm mt-2 border font-["Medium"] rounded-full text-sm w-full rounded-full' />
                                                        </div>
                                                        <div class='w-full'>
                                                            <div class='text-sm font-["Semibold"]'>Email</div>
                                                            <input placeholder='John@gmail.com' class='px-4 py-3 shadow-sm mt-2 border font-["Medium"] rounded-full text-sm w-full rounded-full' />
                                                        </div>
                                                    </div>
                                                    <div class='w-full mt-5'>
                                                        <div class='text-sm font-["Semibold"]'>Mobile Number</div>
                                                        <div class='shadow-sm mt-2 border font-["Medium"] gap-2 rounded-full w-full px-3 flex items-center text-sm'>
                                                            <div class='py-2 px-3'>
                                                                <img src={flag} class='h-5 w-5' />
                                                            </div>
                                                            <div class='h-12 border-l' />
                                                            <input placeholder='(123)-456-7890' class='px-5' />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {type === 'Upload' && (
                                                <div class='w-full px-3'>
                                                    <div class='h-64 rounded-xl mt-5 flex items-center justify-center border-dashed border'>
                                                        <div class='flex text-center border rounded-xl font-["Semibold"] px-4 py-2 text-sm'>Upload file</div>
                                                    </div>
                                                </div>
                                            )}
                                            {type === 'Feedback' && (
                                                <div class='w-full'>
                                                    <div class='mt-4 font-["Semibold"] text-center text-sm'>Feedback</div>
                                                    <input placeholder='' class='mt-5 rounded-2xl border w-full h-40' />
                                                </div>
                                            )}
                                            <div class='w-full py-4 flex justify-center items-center gap-2 rounded-full bg-black mt-5 text-center text-white font-["Semibold"]'>
                                                Submit
                                                <ArrowRightIcon class='w-5 h-5' />
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

                                    <div className="absolute w-full h-28 bottom-0 flex justify-center items-center bg-gradient-to-t from-black via-transparent to-transparent shadow-lg">
                                        <div className="bottom-6 justify-center items-center flex flex-col space-y-3">
                                            <div className="bg-black px-3 py-3 rounded-full flex items-center space-x-2">
                                                <Group className="h-4 w-4" alt="Commercify logo" />
                                                <div className="font-['Semibold'] text-white text-xs">
                                                    commercifyhq.com
                                                </div>
                                                <XMarkIcon
                                                    className="w-4 h-4 ml-3 cursor-pointer text-gray-500"
                                                />
                                            </div>
                                            <div className="text-xs text-white font-['Semibold']">
                                                Get started with Commercify today!
                                            </div>
                                        </div>
                                    </div>
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
