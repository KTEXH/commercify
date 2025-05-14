import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { ArrowRightIcon, CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useMutation, useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Tab, TabGroup, TabList, TabPanel } from "@headlessui/react";
import { DELETE_LINK, LINK_CREATION, UPDATE_LINK } from "../../Pages/Pages/Mutations/Mutations";
import { supabase } from "../../Utils/utils";

export const Products = ({ className = "" }) => {
    const { data, error, loading } = useQuery(ME_QUERY)
    const [showBanner, setShowBanner] = useState(true);

    const categories = [
        { name: 'Products' },
        { name: 'Services' }
    ]
    const [createLinks] = useMutation(LINK_CREATION);
    const [updateLinkMutation] = useMutation(UPDATE_LINK);
    const [deleteLink] = useMutation(DELETE_LINK);
    const [selectedPage, setSelectedPage] = useState(null);

    const [links, setLinks] = useState([{ linkText: "", link: "", image: "", file: null }]);
    const [existingLinks, setExistingLinks] = useState([]);
    const handleChange = (index, field, value) => {
        const updated = [...links];
        updated[index][field] = value;
        setLinks(updated);
    };
    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);
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
    const handleUpdateLink = (index, field, value) => {
        const updated = [...existingLinks];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setExistingLinks(updated);
    };
    const refetchExistingLinks = async () => {
        try {
            const { data } = await refetch();
            setExistingLinks(data.me.Links);
        } catch (err) {
            console.error("Failed to refetch links:", err);
        }
    };
    const submitUpdate = async (id, idx) => {
        const link = existingLinks[idx];
        await updateLinkMutation({ variables: { id, link: link.link, linkText: link.linkText } });
    };
    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
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
            <NavBar home={false} products={true} workshop={selectedPage?.workshop} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

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
                <main className="p-6 px-16 flex-1">
                    <div class='flex items-center mt-7 justify-between w-full'>
                        <div class='font-["Semibold"] mb-3 text-3xl'>{selectedPage?.storefront === true && 'Products'}{selectedPage?.linkinbio === true && 'Links'}</div>
                        <div>
                        


                        </div>
                    </div>
                    <div>
                        {selectedPage?.storefront === true && (
                            <div class='mt-5 grid grid-cols-2 gap-7'>
                                {data.me.OnlyProducts.map(item => (
                                    <div class='w-full rounded-xl flex items-center bg-white justify-between border p-4'>
                                        <div class='flex items-center gap-5'>
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} />
                                            ) : (
                                                <div class='w-16 h-16 rounded-2xl bg-black' />
                                            )}

                                            <div class='w-2/3'>
                                                <div class='font-["Semibold"]'>{item.title}</div>
                                                <div class='line-clamp-1 font-["Medium"] text-gray-400 text-sm'>{item.description}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center gap-3'>
                                            <button class='text-sm bg-gray-200 text-black font-["Semibold"] px-5 py-2 rounded-full'>Options</button>
                                            <button class='px-5 py-2 rounded-full text-white font-["Semibold"] bg-black text-sm'>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedPage?.workshop === true && (


                            <div class='mt-5 grid grid-cols-2 gap-7'>
                                {data.me.Services.map(item => (
                                    <div class='w-full rounded-xl flex items-center justify-between border p-4'>
                                        <div class='flex items-center gap-5'>
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} />
                                            ) : (
                                                <div class='w-16 h-16 rounded-2xl bg-black' />
                                            )}

                                            <div class='w-2/3'>
                                                <div class='font-["Semibold"]'>{item.title}</div>
                                                <div class='line-clamp-1 font-["Medium"] text-gray-400 text-sm'>{item.description}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center gap-3'>
                                            <button class='text-sm bg-gray-200 text-black font-["Semibold"] px-5 py-2 rounded-full'>Options</button>
                                            <button class='px-5 py-2 rounded-full text-white font-["Semibold"] bg-black text-sm'>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedPage?.linkinbio === true && (
                             <div class='mt-5 grid grid-cols-2 gap-7'>
                                {data.me.Links.map(item => (
                                    <div class='w-full rounded-xl flex items-center justify-between border p-4'>
                                        <div class='flex items-center gap-5'>
                                            {item.image ? (
                                                <img src={item.image} class='w-12 h-12 rounded-rounded-full' />
                                            ) : (
                                                <div class='w-16 h-16 rounded-2xl bg-black' />
                                            )}

                                            <div class='w-2/3'>
                                                <div class='font-["Semibold"]'>{item.linkText}</div>
                                                <div class='line-clamp-1 font-["Medium"] text-gray-400 text-sm'>{item.description}</div>
                                            </div>
                                        </div>
                                        <div class='flex items-center gap-3'>
                                            <button class='text-sm bg-gray-200 text-black font-["Semibold"] px-5 py-2 rounded-full'>Options</button>
                                            <button class='px-5 py-2 rounded-full text-white font-["Semibold"] bg-black text-sm'>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
