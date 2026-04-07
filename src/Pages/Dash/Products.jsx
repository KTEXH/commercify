import { useState, useEffect } from "react";
import { ME_QUERY } from "../../Data/Me";
import { useMutation, useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { DELETE_LINK, LINK_CREATION, UPDATE_LINK } from "../../Pages/Pages/Mutations/Mutations";
import { supabase } from "../../Utils/utils";
import { Banner, Add } from "./Home";
import logo from "../../components/assets/logo.svg";
import flag from '../../components/assets/united-states.png'
import { useNavigate } from "react-router-dom";

export const Products = () => {
    const { data, error, loading, refetch } = useQuery(ME_QUERY)
    const [createLinks] = useMutation(LINK_CREATION);
    const [updateLinkMutation] = useMutation(UPDATE_LINK);
    const [deleteLink] = useMutation(DELETE_LINK);
    const [selectedPage, setSelectedPage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
    }, [data, selectedPage]);

    const handleDelete = async (id) => {
        await deleteLink({ variables: { id } });
        refetch();
    };

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>

    const sectionTitle = selectedPage?.workshop ? 'Services' : selectedPage?.storefront ? 'Products' : selectedPage?.linkinbio ? 'Links' : selectedPage?.form ? 'Responses' : 'Items';

    const Empty = () => (
        <div className='flex items-center justify-center h-48'>
            <div className='text-center'>
                <div className='text-3xl mb-2'>—</div>
                <p className='font-["Medium"] text-zinc-400 text-sm'>No {sectionTitle.toLowerCase()} yet</p>
            </div>
        </div>
    );

    const ItemRow = ({ price, title, description, thumbnail, onDetails, index, total }) => (
        <div className={`flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors cursor-pointer ${index < total - 1 ? 'border-b border-zinc-100' : ''}`}
            onClick={onDetails}>
            <div className='flex items-center gap-4'>
                <div className='shrink-0 w-16 text-right'>
                    <div className='text-sm font-["Semibold"] text-zinc-950 tabular-nums'>${price}</div>
                </div>
                <div className='w-px h-6 bg-zinc-100' />
                <div>
                    <div className='text-sm font-["Semibold"] text-zinc-900'>{title}</div>
                    {description && <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5 line-clamp-1'>{description}</div>}
                </div>
            </div>
            <span className='text-xs font-["Semibold"] text-zinc-400'>Details →</span>
        </div>
    );

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <Banner />
            <div className="flex flex-1 bg-[#F2F2F7] overflow-hidden">
                <div className='w-12 flex flex-col pt-3 pb-3 items-center gap-2.5 bg-white border-r border-zinc-100'>
                    {data.me.Pages.map(item => (
                        <div key={item.id} className="relative flex items-center">
                            {selectedPage?.id === item.id && (
                                <div className="absolute left-[40px] top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-950 rounded-full" />
                            )}
                            <img
                                onClick={() => setSelectedPage(item)}
                                className={`h-7 w-7 rounded-lg cursor-pointer transition-all object-cover ${selectedPage?.id === item.id ? 'ring-2 ring-zinc-950 ring-offset-1 ring-offset-white' : 'opacity-30 hover:opacity-80'}`}
                                src={!item?.headerImage ? logo : item?.headerImage}
                            />
                        </div>
                    ))}
                    <Add />
                </div>

                <NavBar home={false} products={true} form={selectedPage?.form} workshop={selectedPage?.workshop} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center px-5 shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6">
                        <div className='mb-5'>
                            <h1 className='font-["Semibold"] text-xl text-zinc-950 tracking-tight'>{sectionTitle}</h1>
                            <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>Manage your {sectionTitle.toLowerCase()}.</p>
                        </div>

                        {/* Products (Storefront) */}
                        {selectedPage?.storefront && (
                            data.me.OnlyProducts.length === 0 ? <Empty /> : (
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    {data.me.OnlyProducts.map((item, i) => (
                                        <ItemRow key={item.id} price={item?.price} title={item?.title} description={item?.description}
                                            thumbnail={item?.thumbnail} index={i} total={data.me.OnlyProducts.length}
                                            onDetails={() => navigate(`/product/${item?.id}`)} />
                                    ))}
                                </div>
                            )
                        )}

                        {/* Services (Workshop) */}
                        {selectedPage?.workshop && (
                            data.me.Services.length === 0 ? <Empty /> : (
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    {data.me.Services.map((item, i) => (
                                        <ItemRow key={item.id} price={item?.price} title={item?.title} description={item?.description}
                                            thumbnail={item?.thumbnail} index={i} total={data.me.Services.length}
                                            onDetails={() => navigate(`/orders/${item?.id}`)} />
                                    ))}
                                </div>
                            )
                        )}

                        {/* Form Answers */}
                        {selectedPage?.form && (
                            <div>
                                {selectedPage?.formType === 'Feedback' && (
                                    selectedPage?.formAnswers?.filter(i => i.feedback).length === 0 ? <Empty /> : (
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            {selectedPage?.formAnswers?.filter(item => item.feedback).map((item, i, arr) => (
                                                <div key={i} className={`px-5 py-4 ${i < arr.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <img className='w-4 h-4 rounded-full object-cover' src={selectedPage?.headerImage} />
                                                        <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Feedback</div>
                                                    </div>
                                                    <div className='text-sm font-["Medium"] text-zinc-700 line-clamp-3 leading-relaxed'>{item.feedback}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                                {selectedPage?.formType === 'Contact' && (
                                    selectedPage?.formAnswers?.filter(i => i.mobileNumber).length === 0 ? <Empty /> : (
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            {selectedPage?.formAnswers?.filter(item => item.mobileNumber).map((item, i, arr) => (
                                                <div key={i} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                                    <div className='flex items-center gap-4'>
                                                        <img className='w-8 h-8 rounded-full object-cover' src={selectedPage?.headerImage} />
                                                        <div>
                                                            <div className='flex items-center gap-1.5'>
                                                                <img src={flag} className='w-3 h-3' />
                                                                <span className='text-sm font-["Semibold"] text-zinc-900'>+1{item.mobileNumber}</span>
                                                            </div>
                                                            <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>{item.name} · {item.email}</div>
                                                        </div>
                                                    </div>
                                                    <span className='text-xs font-["Semibold"] text-zinc-400'>View →</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* Links (Link-in-bio) */}
                        {selectedPage?.linkinbio && (
                            !selectedPage?.links?.length ? <Empty /> : (
                                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                    {selectedPage?.links?.map((item, i) => (
                                        <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < selectedPage.links.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                            <div className='flex items-center gap-3'>
                                                {item.image ? (
                                                    <img src={item.image} className='w-8 h-8 rounded-lg object-cover' />
                                                ) : (
                                                    <div className='w-8 h-8 rounded-lg bg-zinc-100' />
                                                )}
                                                <div className='font-["Semibold"] text-sm text-zinc-900'>{item.linkText}</div>
                                            </div>
                                            <button className='text-xs font-["Semibold"] text-zinc-400 hover:text-zinc-700 transition-colors'>Edit</button>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
