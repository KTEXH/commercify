import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check } from "lucide-react";
import { ArrowRightIcon, CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import { ME_QUERY } from "../../Data/Me";
import { useMutation, useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Tab, TabGroup, TabList, TabPanel } from "@headlessui/react";
import { DELETE_LINK, LINK_CREATION, UPDATE_LINK } from "../../Pages/Pages/Mutations/Mutations";
import { supabase } from "../../Utils/utils";
import { Banner } from "./Home";
import logo from "../../components/assets/logo.svg";
import flag from '../../components/assets/united-states.png'
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate()

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
        <div>
            <Banner />
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
                <NavBar home={false} products={true} form={selectedPage?.form} workshop={selectedPage?.workshop} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <header className="flex justify-between border-b items-center px-6 py-4">
                        <div class='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>

                    </header>

                    {/* Dashboard Content */}
                    <main className="px-16 flex-1">
                        <div class='flex items-center mt-7 justify-between w-full'>
                            <div class='font-["Semibold"] mb-3 text-3xl'>{selectedPage?.workshop === true && 'Services'}{selectedPage?.storefront === true && 'Products'}{selectedPage?.linkinbio === true && 'Links'}</div>
                            <div>



                            </div>
                        </div>
                        <div>
                            {selectedPage?.storefront === true && (
                                <div class='mt-5 grid grid-cols-2 gap-4'>
                                    {data.me.OnlyProducts.map(item => (
                                        <div class='flex border bg-white py-5 justify-between shadow-sm rounded-3xl items-center w-full'>
                                            <div class='flex items-center'>
                                                <div class='px-2 text-xl w-28 shrink-0 text-center font-["Semibold"]'>
                                                    ${item?.price}
                                                </div>
                                                <div class='h-10 w-1 border-l' />
                                                <div class='px-5'>
                                                    <div class='text-sm font-["Semibold"] '>{item?.title}</div>
                                                    <div class='text-sm font-["Medium"] text-gray-300 line-clamp-2'>{item?.description}</div>

                                                    <div class='mt-1 flex items-center gap-[-3px]'>
                                                        <img src={selectedPage?.headerImage} class='w-5 h-5 border-2 border-white rounded-full' />
                                                        <img
                                                            src={
                                                                !item?.thumbnail ? logo : item?.thumbnail
                                                            }
                                                            className="w-5 h-5 ml-[-6px] border-2 border-white rounded-full"
                                                        />
                                                        <div class='h-5 w-5 ml-[-6px] rounded-full border-2 border-white flex items-center font-["Semibold"] justify-center text-[8px] bg-pink-200'>{item?.title?.charAt(0)}</div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class='pr-5'>
                                                <button onClick={() => navigate(`/product/${item?.id}`)} class='px-5 rounded-full text-white bg-black text-sm py-3 font-["Semibold"] '>Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedPage?.form === true && (
                                <div>
                                    <div class='text-3xl font-["Semibold"] mb-7'>Form Answers</div>
                                    {selectedPage?.formType === 'Feedback' && (
                                        <div className="grid grid-cols-3 gap-5">
                                            {selectedPage?.formAnswers
                                                ?.filter(item => item.feedback) // only include items with feedback
                                                .map(item => (
                                                    <div className='p-4 border shadow-sm bg-white rounded-3xl'>
                                                        <div className='flex items-center gap-2'>
                                                            <img className='w-4 h-4 rounded-full' src={selectedPage?.headerImage} />
                                                            <div className='text-sm font-["Semibold"]'>Feedback</div>
                                                        </div>
                                                        <div className='mt-2 text-sm line-clamp-4 font-["Semibold"]'>{item.feedback}</div>
                                                        <button class='mt-3 bg-black text-white w-full py-2 rounded-full font-["Semibold"]'>View</button>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    {selectedPage?.formType === 'Contact' && (
                                        <div className="grid grid-cols-2 gap-5">
                                            {selectedPage?.formAnswers
                                                ?.filter(item => item.mobileNumber) // only include items with feedback
                                                .map(item => (
                                                    <div className='px-3 py-3 border justify-between flex items-center shadow-sm bg-white rounded-full'>
                                                        <div class='flex items-center gap-5'>
                                                            <div className='flex items-center gap-2'>
                                                                <img className='w-14 h-14 rounded-full' src={selectedPage?.headerImage} />
                                                            </div>
                                                            <div class='h-10 border-l' />
                                                            <div>
                                                                <div class='rounded-full inline-flex items-center border py-1 px-2 gap-2 '>
                                                                    <img src={flag} class='w-4 h-4' />
                                                                    <div class='text-xs font-["Semibold"]'>+1{item.mobileNumber}</div>
                                                                </div>
                                                                <div class='flex items-center mt-2 gap-4'>
                                                                    <div class='rounded-full flex items-center border py-1 px-2 gap-2 '>
                                                                        <div class='text-xs font-["Semibold"]'>{item.name}</div>
                                                                    </div>
                                                                    <div class='rounded-full flex items-center border py-1 px-2 gap-2 '>
                                                                        <div class='text-xs font-["Semibold"]'>{item.email}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div class='bg-black text-white px-4 text-sm py-2 rounded-full font-["Semibold"]'>View</div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {selectedPage?.workshop === true && (


                                <div class='mt-5 grid grid-cols-2 gap-7'>
                                    {data.me.Services.map(item => (
                                        <div onClick={() => navigate(`/orders/${item.id}`)} class='flex border bg-white py-5 justify-between shadow-sm rounded-3xl items-center w-full'>
                                            <div class='flex items-center'>
                                                <div class='px-2 text-xl w-28 shrink-0 text-center font-["Semibold"]'>
                                                    ${item?.price}
                                                </div>
                                                <div class='h-10 w-1 border-l' />
                                                <div class='px-5'>
                                                    <div class='text-sm font-["Semibold"] '>{item?.title}</div>
                                                    <div class='text-sm font-["Medium"] text-gray-300 line-clamp-2'>{item?.description}</div>

                                                    <div class='mt-1 flex items-center gap-[-3px]'>
                                                        <img src={selectedPage?.headerImage} class='w-5 h-5 border-2 border-white rounded-full' />
                                                        <img
                                                            src={
                                                                !item?.thumbnail ? logo : item?.thumbnail
                                                            }
                                                            className="w-5 h-5 ml-[-6px] border-2 border-white rounded-full"
                                                        />
                                                        <div class='h-5 w-5 ml-[-6px] rounded-full border-2 border-white flex items-center font-["Semibold"] justify-center text-[8px] bg-pink-200'>{item?.title?.charAt(0)}</div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class='pr-5'>
                                                <button class='px-5 rounded-full text-white bg-black text-sm py-3 font-["Semibold"] '>Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedPage?.linkinbio === true && (
                                <div class='mt-5 grid grid-cols-2 gap-7'>
                                    {data.me.Links.map(item => (
                                        <div class='w-full rounded-full shadow-sm flex items-center justify-between border p-4'>
                                            <div class='flex items-center gap-5'>
                                                {item.image ? (
                                                    <img src={item.image} class='w-12 h-12 rounded-full' />
                                                ) : (
                                                    <div class='w-16 h-16 rounded-full bg-black' />
                                                )}

                                                <div class='w-2/3'>
                                                    <div class='font-["Semibold"] text-sm'>{item.linkText}</div>
                                                </div>
                                            </div>
                                            <div class='flex items-center gap-3'>
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
        </div>
    );
}
