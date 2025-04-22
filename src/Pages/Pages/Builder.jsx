import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check, TrendingUp } from "lucide-react";
import { CheckIcon, ChevronDownIcon, EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { HexColorPicker } from "react-colorful";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
export const Builder = () => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);



    const [selectedPage, setSelectedPage] = useState(null);

    const [page, setPage] = useState('Content')

    const [formData, setFormData] = useState({
        title: "",
        description: "Description here",
        backgroundColor: '#fff'
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

    const Simple = ({ item }) => {
        return (
            <div class='flex w-full border mt-2 items-center p-2 rounded-full'>
                <div class='w-full'>
                    <div class='w-9 h-9 rounded-full bg-black' />
                </div>
                <div class='font-["Semibold"] w-full line-clamp-1 text-xs'>{item.title}</div>
                <div class='w-full justify-end flex pr-2'>
                    <EllipsisHorizontalIcon class='w-3' />
                </div>
            </div>
        )
    }

    const Description = ({ item }) => {
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

    const Button = ({ item }) => {
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
                                </div>
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
                                    )}
                                </div>
                                <div>
                                    {page === 'Content' && (
                                        <div class='w-full'>
                                            <div class='flex mt-5 w-full items-center gap-5'>
                                                <div class='w-full'>
                                                    <div class='text-sm font-["Semibold"]'>Title</div>
                                                    <input
                                                        onChange={handleNameChange}
                                                        value={formData.title}
                                                        name="title"
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
                                    <div class='mt-3 text-xl font-["Semibold"]'>{formData?.title}</div>
                                    <div class='mt-1 text-sm text-gray-400 font-["Medium"]'>{formData?.description}</div>
                                    {selectedPage?.storefront ? (
                                        <div class='mt-7 space-y-2 w-full '>
                                            {data.me.OnlyProducts.map(item => (
                                                <div class='w-full flex'>
                                                    {display.simple === true && (<Simple item={item} />)}
                                                    {display.description === true && (<Description item={item} />)}
                                                    {display.button === true && (<Button item={item} />)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
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
