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
import { Banner, Add } from "../../Pages/Dash/Home";
import flag from '../../components/assets/united-states.png'
import { ArrowRightIcon } from "lucide-react";

/* ─── Public page components ─────────────────────────────────────────── */

export const Simple = ({ item, round, color, style, font, link, textColor }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const r = round === 'rounded-full' ? 'rounded-full' : round === 'rounded-medium' ? 'rounded-2xl' : 'rounded-xl';
    const cardStyle = {
        backgroundColor: style === 'color' ? color : undefined,
        borderColor: (style === 'outline' || style === 'backdrop') ? color : undefined,
        boxShadow: style === 'backdrop' ? `4px 4px 0px 0px ${color}` : undefined,
    };
    return (
        <a href={link} style={cardStyle}
            className={`flex items-center gap-3 ${r} bg-white/90 border border-black/8 backdrop-blur-sm px-3 py-2.5 w-full hover:scale-[0.99] active:scale-[0.97] transition-transform`}
        >
            {(item.thumbnail || item.image) ? (
                <img src={item.thumbnail || item.image} className={`w-10 h-10 object-cover shrink-0 ${r}`} />
            ) : (
                <div className={`w-10 h-10 bg-zinc-100 shrink-0 ${r}`} />
            )}
            <div style={{ color: textColor || '#09090b' }}
                className={`flex-1 text-sm line-clamp-1 ${font === 'Cascadia' ? 'font-["CSemibold"]' : font === 'Rubrik' ? 'font-["RSemibold"]' : 'font-["Semibold"]'}`}>
                {item.title || item.linkText}
            </div>
            {item.price != null && (
                <div style={{ color: textColor || '#09090b' }} className='text-sm font-["Semibold"] shrink-0 opacity-60'>${item.price}</div>
            )}
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className='shrink-0'>
                <path d="M1 1L5 5L1 9" stroke={textColor || '#71717a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <ProductDialog item={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
        </a>
    );
}

export const Description = ({ item, style, round, font, textColor, color }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const r = round === 'rounded-full' ? 'rounded-2xl' : round === 'rounded-medium' ? 'rounded-xl' : 'rounded-lg';
    const cardStyle = {
        backgroundColor: style === 'color' ? color : undefined,
        borderColor: (style === 'outline' || style === 'backdrop') ? color : undefined,
        boxShadow: style === 'backdrop' ? `4px 4px 0px 0px ${color}` : undefined,
    };
    return (
        <div onClick={() => setSelectedPost(item)} style={cardStyle}
            className={`flex flex-col ${r} bg-white/90 border border-black/8 overflow-hidden cursor-pointer hover:scale-[0.99] active:scale-[0.97] transition-transform`}>
            <div className='w-full aspect-square bg-zinc-100 overflow-hidden'>
                {(item.thumbnail || item.image) ? (
                    <img src={item.thumbnail || item.image} className='w-full h-full object-cover' />
                ) : (
                    <div className='w-full h-full bg-zinc-100' />
                )}
            </div>
            <div className="p-3">
                <div style={{ color: textColor || '#09090b' }}
                    className={`text-sm line-clamp-1 ${font === 'Cascadia' ? 'font-["CSemibold"]' : font === 'Rubrik' ? 'font-["RSemibold"]' : 'font-["Semibold"]'}`}>
                    {item.title}
                </div>
                {item.description && (
                    <div className='text-xs font-["Medium"] opacity-50 mt-0.5 line-clamp-2' style={{ color: textColor || '#71717a' }}>{item.description}</div>
                )}
                {item.price != null && (
                    <div style={{ color: textColor || '#09090b' }} className='text-sm font-["Semibold"] mt-2'>${item.price}</div>
                )}
            </div>
            <ProductDialog item={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
        </div>
    );
}

export const Button = ({ item, style, color, round, textColor, font }) => {
    const r = round === 'rounded-full' ? 'rounded-3xl' : round === 'rounded-medium' ? 'rounded-2xl' : 'rounded-xl';
    return (
        <div style={{
            borderColor: (style === 'outline' || style === 'backdrop') ? color : undefined,
            boxShadow: style === 'backdrop' ? `4px 4px 0px 0px ${color}` : undefined,
        }}
            className={`relative w-full ${r} overflow-hidden aspect-[4/3] ${(style === 'outline' || style === 'backdrop') ? 'border-2' : ''}`}>
            {(item.thumbnail || item.image) ? (
                <img src={item.thumbnail || item.image} className='w-full h-full object-cover' />
            ) : (
                <div className='w-full h-full bg-zinc-200' />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5">
                <div className='text-white font-["Semibold"] text-sm line-clamp-1'>{item.linkText || item.title}</div>
                {item.price != null && <div className='text-white/70 font-["Medium"] text-xs mt-0.5'>${item.price}</div>}
            </div>
        </div>
    );
}

/* ─── Builder page ────────────────────────────────────────────────────── */

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
        headerText: 'Text here',
        secondaryText: '',
        componentColor: '',
        storefront: true,
        embeddedLink: '',
        instagramShown: true, tiktokShown: true, facebookShown: true, twitterShown: true,
        instagram: '', facebook: '', tiktok: '', twitter: '',
        font: '', workshop: false, form: false, linkinbio: false,
        formType: 'No Type',
        headerImage: '', secondaryImage: '',
        subText: '', description: 'Description goes here',
        template: 1,
    });

    const [colorPicker, setColorPicker] = useState(false);
    const [page, setPage] = useState('Content');
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("#ffffff");
    const [font, setFont] = useState('General-Sans');
    const [rounded, setRounded] = useState('rounded-full');
    const [styleColor, setStyleColor] = useState('#ededed');
    const [base, setBase] = useState('simple');
    const [style, setStyle] = useState('outline');
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
        if (selectedPage?.links) setExistingLinks(selectedPage?.links);
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
            setTextColor(selectedPage?.textColor);
            setColor(selectedPage?.backgroundColor || "#fff");
            setBase(selectedPage?.base);
            setStyleColor(selectedPage?.styleColor);
            setStyle(selectedPage?.style);
            setBaseText(selectedPage?.baseText);
            setRounded(selectedPage?.rounded);
            setGrid(selectedPage?.grid);
            setType(selectedPage?.formType);
        }
    }, [selectedPage]);

    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        const payload = links.map((item, i) => ({ linkText: item.linkText, link: item.link, image: imageUrls[i], pageId: selectedPage?.id }));
        try {
            await createLinks({ variables: { links: payload } });
            alert("Links created!");
            setLinks([{ linkText: "", link: "", image: "", file: null }]);
        } catch (err) { console.error("Link creation failed:", err.message); }
    };

    const handleAddLink = () => {
        setLinks([...links, { linkText: '', link: '', image: '', file: null, pageId: selectedPage?.id }]);
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
                        base, rounded, style, font,
                        styleColor, published: true,
                        textColor, baseText,
                        headerImage: formData?.headerImage,
                        secondaryImage: formData?.secondaryImage,
                        grid, formType: type
                    },
                });
                navigate("/dashboard");
            } catch (err) { console.error("Form submission error:", err.message); }
        },
    });

    const [grid, setGrid] = useState(false);
    const [type, setType] = useState('Unlock');

    async function uploadFile(fieldName, file) {
        if (!file) return;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `headers/${fileName}`;
        const { error } = await supabase.storage.from('bubble').upload(filePath, file);
        if (error) { console.error('Upload failed:', error.message); return; }
        const { data: publicUrlData } = supabase.storage.from('bubble').getPublicUrl(filePath);
        const publicUrl = publicUrlData?.publicUrl;
        if (publicUrl) setFormData((prev) => ({ ...prev, [fieldName]: publicUrl }));
    }

    const handleUpdateLink = (index, field, value) => {
        const updated = [...existingLinks];
        updated[index] = { ...updated[index], [field]: value };
        setExistingLinks(updated);
    };

    const submitUpdate = async (id, idx) => {
        const link = existingLinks[idx];
        await updateLinkMutation({ variables: { id, link: link.link, linkText: link.linkText } });
    };

    const refetchExistingLinks = async () => {
        try {
            await refetch();
            setExistingLinks(selectedPage?.links);
        } catch (err) { console.error("Failed to refetch links:", err); }
    };

    const [colorPickerBase, setColorPickerBase] = useState(false);
    const [textBaseColorPick, setTextBaseColorPicker] = useState(false);
    const [textColorPicker, setTextColorPicker] = useState(false);
    const [textColor, setTextColor] = useState("#000");
    const [baseText, setBaseText] = useState("#000");

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const ColorOverlay = ({ show, value, onChange, onClose }) => !show ? null : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className='bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-2xl'>
                <HexColorPicker color={value} onChange={onChange} />
                <button onClick={onClose} className='w-full py-2.5 rounded-xl bg-zinc-950 font-["Semibold"] text-white text-sm'>Done</button>
            </div>
        </div>
    );

    const inputCls = 'w-full border border-zinc-200 bg-zinc-50 rounded-xl px-4 py-2.5 text-sm font-["Medium"] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all';
    const labelCls = 'text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest block mb-1.5';

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <Banner />
            <div className="flex flex-1 bg-[#F2F2F7] overflow-hidden">
                {/* Color overlays */}
                <ColorOverlay show={colorPicker} value={color} onChange={setColor} onClose={() => setColorPicker(false)} />
                <ColorOverlay show={colorPickerBase} value={styleColor} onChange={setStyleColor} onClose={() => setColorPickerBase(false)} />
                <ColorOverlay show={textBaseColorPick} value={baseText} onChange={setBaseText} onClose={() => setTextBaseColorPicker(false)} />
                <ColorOverlay show={textColorPicker} value={textColor} onChange={setTextColor} onClose={() => setTextColorPicker(false)} />

                {/* Page icon rail */}
               <div className='w-12 flex flex-col pt-3 pb-3 items-center gap-2.5 bg-white border-r border-zinc-100'>
                                           {data.me.Pages.map(item => (
                                               <div key={item.id} className="relative flex items-center">
                                                   {selectedPage?.id === item.id && (
                                                       <div className="absolute left-[40px] top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-950 rounded-full" />
                                                   )}
                                                   <img
                                                       onClick={() => setSelectedPage(item)}
                                                       className={`h-7 w-7 rounded-lg cursor-pointer transition-all object-cover `}
                                                       src={!item?.headerImage ? logo : item?.headerImage}
                                                   />
                                               </div>
                                           ))}
                                           <Add />
                                       </div>

                <NavBar home={false} builder={true} products={false} linkinbio={selectedPage?.linkinbio} form={selectedPage?.form} workshop={selectedPage?.workshop} storefront={selectedPage?.storefront} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top bar */}
                    <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center justify-between px-5 shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Menu>
                                <MenuButton className="h-8 flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 transition-colors border border-zinc-200 px-3 rounded-xl font-['Semibold'] text-xs text-zinc-700">
                                    {page}
                                    <ChevronDownIcon className="w-3 h-3 text-zinc-500" />
                                </MenuButton>
                                <MenuItems anchor="bottom end"
                                    className="w-44 origin-top-right rounded-2xl border border-zinc-100 bg-white shadow-lg mt-1 p-1 text-sm font-['Semibold'] text-zinc-700 z-50">
                                    {['Content', 'Style', 'Display'].map(p => (
                                        <MenuItem key={p}>
                                            <button onClick={() => setPage(p)} className="w-full text-left px-3 py-2 rounded-xl text-sm font-['Semibold'] hover:bg-zinc-50 transition-colors">
                                                {p}
                                            </button>
                                        </MenuItem>
                                    ))}
                                    {selectedPage?.linkinbio && (
                                        <MenuItem>
                                            <button onClick={() => setPage('Links')} className="w-full text-left px-3 py-2 rounded-xl text-sm font-['Semibold'] hover:bg-zinc-50">Links</button>
                                        </MenuItem>
                                    )}
                                    {selectedPage?.form && (
                                        <MenuItem>
                                            <button onClick={() => setPage('Type')} className="w-full text-left px-3 py-2 rounded-xl text-sm font-['Semibold'] hover:bg-zinc-50">Type</button>
                                        </MenuItem>
                                    )}
                                </MenuItems>
                            </Menu>
                            <button onClick={() => setIsOpen(true)} className='h-8 px-4 bg-zinc-950 rounded-xl text-white font-["Semibold"] text-xs hover:bg-zinc-800 transition-colors'>
                                Publish
                            </button>
                        </div>
                    </header>

                    {/* Publish dialog */}
                    <Dialog open={isOpen} as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                            <DialogPanel className="bg-white rounded-2xl border border-zinc-100 p-6 w-full max-w-sm shadow-2xl">
                                <h2 className='font-["Semibold"] text-lg text-zinc-950 tracking-tight'>Publish page</h2>
                                <p className='font-["Medium"] text-zinc-400 text-sm mt-1 mb-4'>Confirm your page URL before publishing.</p>
                                <input
                                    onChange={handleNameChange}
                                    value={formData?.subdomain}
                                    name="subdomain"
                                    className={inputCls}
                                    placeholder='your-page-name'
                                />
                                <form onSubmit={formik.handleSubmit} className='mt-4'>
                                    <button type="submit" className='w-full bg-zinc-950 text-white py-3 rounded-xl font-["Semibold"] text-sm hover:bg-zinc-800 transition-colors'>
                                        Publish →
                                    </button>
                                </form>
                            </DialogPanel>
                        </div>
                    </Dialog>

                    <main className="flex-1 overflow-hidden">
                        <div className='w-full h-full flex'>
                            {/* Editor panel */}
                            <div className='flex-1 overflow-y-auto p-6'>

                                {/* Content tab */}
                                {page === 'Content' && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Page info</div>
                                            <div className='flex gap-4'>
                                                <div className='flex-1'>
                                                    <label className={labelCls}>Display name</label>
                                                    <input onChange={handleNameChange} value={formData.headerText} name="headerText" className={inputCls} />
                                                </div>
                                                <div className='flex-1'>
                                                    <label className={labelCls}>Description</label>
                                                    <textarea onChange={handleNameChange} value={formData.description} name="description" className={`${inputCls} h-[42px] resize-none`} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Images</div>
                                            <div className='flex gap-6'>
                                                <div>
                                                    <label className={labelCls}>Page icon</label>
                                                    <div className='flex items-center gap-3 mt-1'>
                                                        {selectedPage?.headerImage ? (
                                                            <img src={selectedPage.headerImage} className="w-10 h-10 rounded-xl object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                                        )}
                                                        <input id="headerImageUpload" type="file" className='hidden' accept="image/*"
                                                            onChange={(e) => e.target.files[0] && uploadFile('headerImage', e.target.files[0])} />
                                                        <label htmlFor="headerImageUpload" className='cursor-pointer font-["Semibold"] text-xs text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl transition-colors'>
                                                            Change
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Profile image</label>
                                                    <div className='flex items-center gap-3 mt-1'>
                                                        {selectedPage?.secondaryImage ? (
                                                            <img src={selectedPage.secondaryImage} className="w-10 h-10 rounded-xl object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                                        )}
                                                        <input id="headerSecondaryUpload" type="file" className='hidden' accept="image/*"
                                                            onChange={(e) => e.target.files[0] && uploadFile('secondaryImage', e.target.files[0])} />
                                                        <label htmlFor="headerSecondaryUpload" className='cursor-pointer font-["Semibold"] text-xs text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl transition-colors'>
                                                            Change
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Style tab */}
                                {page === 'Style' && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Colors</div>
                                            <div className='grid grid-cols-2 gap-3'>
                                                <button onClick={() => setColorPicker(true)} className='flex items-center gap-2.5 border border-zinc-200 rounded-xl px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left'>
                                                    <div className='w-5 h-5 rounded-lg border border-zinc-200 shrink-0' style={{ backgroundColor: color }} />
                                                    <span className='text-xs font-["Semibold"] text-zinc-700'>Background</span>
                                                </button>
                                                <button onClick={() => setTextColorPicker(true)} className='flex items-center gap-2.5 border border-zinc-200 rounded-xl px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left'>
                                                    <div className='w-5 h-5 rounded-lg border border-zinc-200 shrink-0' style={{ backgroundColor: textColor }} />
                                                    <span className='text-xs font-["Semibold"] text-zinc-700'>Text</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Font</div>
                                            <div className='flex gap-2'>
                                                {[['General-Sans', 'Normal', 'font-["Medium"]'], ['Cascadia', 'Cascadia', 'font-["CMedium"]'], ['Rubrik', 'Rubrik', 'font-["RMedium"]']].map(([f, label, cls]) => (
                                                    <button key={f} onClick={() => setFont(f)}
                                                        className={`flex-1 py-2 rounded-xl text-sm border transition-all ${cls} ${font === f ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Display tab */}
                                {page === 'Display' && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Layout</div>
                                            <div className='grid grid-cols-3 gap-2'>
                                                {[
                                                    { key: 'simple', preview: <div className='flex items-center gap-1'><div className='w-4 h-4 rounded-lg bg-zinc-300'/><div className='h-2 flex-1 bg-zinc-200 rounded'/></div> },
                                                    { key: 'description', preview: <div className='flex flex-col gap-1'><div className='w-full h-8 bg-zinc-200 rounded-lg'/><div className='h-1.5 w-3/4 bg-zinc-200 rounded'/></div> },
                                                    { key: 'button', preview: <div className='w-full h-10 bg-zinc-200 rounded-xl relative overflow-hidden'><div className='absolute bottom-1 left-1.5 right-1.5 h-2 bg-zinc-300 rounded'/></div> },
                                                ].map(({ key, preview }) => (
                                                    <button key={key} onClick={() => setBase(key)}
                                                        className={`p-3 rounded-xl border transition-all ${base === key ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}`}>
                                                        <div className={`text-[10px] font-["Semibold"] mb-2 ${base === key ? 'text-white' : 'text-zinc-500'} uppercase tracking-wide`}>{key}</div>
                                                        <div className={base === key ? 'opacity-40' : ''}>{preview}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Card style</div>
                                            <div className='grid grid-cols-3 gap-2 mb-4'>
                                                {[
                                                    { key: 'outline', label: 'Outline' },
                                                    { key: 'backdrop', label: 'Shadow' },
                                                    { key: 'color', label: 'Filled' },
                                                ].map(({ key, label }) => (
                                                    <button key={key} onClick={() => setStyle(key)}
                                                        className={`py-2 rounded-xl text-xs font-["Semibold"] border transition-all ${style === key ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className='flex gap-2'>
                                                <button onClick={() => setColorPickerBase(true)} className='flex-1 flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2 hover:bg-zinc-50 transition-colors'>
                                                    <div className='w-4 h-4 rounded-md border border-zinc-200 shrink-0' style={{ backgroundColor: styleColor }} />
                                                    <span className='text-xs font-["Semibold"] text-zinc-700'>Card color</span>
                                                </button>
                                                <button onClick={() => setTextBaseColorPicker(true)} className='flex-1 flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2 hover:bg-zinc-50 transition-colors'>
                                                    <div className='w-4 h-4 rounded-md border border-zinc-200 shrink-0' style={{ backgroundColor: baseText }} />
                                                    <span className='text-xs font-["Semibold"] text-zinc-700'>Text color</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Corners</div>
                                            <div className='flex gap-2'>
                                                {[
                                                    { key: 'rounded-full', icon: <div className='w-6 h-4 border-2 border-zinc-700 rounded-full'/> },
                                                    { key: 'rounded-medium', icon: <div className='w-6 h-4 border-2 border-zinc-700 rounded-lg'/> },
                                                    { key: 'none', icon: <div className='w-6 h-4 border-2 border-zinc-700'/> },
                                                ].map(({ key, icon }) => (
                                                    <button key={key} onClick={() => setRounded(key)}
                                                        className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border transition-all ${rounded === key ? 'bg-zinc-950 border-zinc-950' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                                                        <div className={rounded === key ? 'opacity-40' : ''}>{icon}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Links tab */}
                                {page === 'Links' && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Add links</div>
                                            <div className='space-y-3'>
                                                {links.map((link, idx) => (
                                                    <div key={idx} className='bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-2'>
                                                        <input type="text" value={link.linkText} onChange={(e) => handleChange(idx, 'linkText', e.target.value)}
                                                            placeholder="Link text" className={inputCls} />
                                                        <input type="text" value={link.link} onChange={(e) => handleChange(idx, 'link', e.target.value)}
                                                            placeholder="https://..." className={inputCls} />
                                                        <div className='flex items-center gap-2 mt-2'>
                                                            <input id={`linkImageUpload-${idx}`} type="file" accept="image/*"
                                                                onChange={(e) => handleFileChange(idx, e.target.files[0])} className="hidden" />
                                                            <label htmlFor={`linkImageUpload-${idx}`} className='cursor-pointer font-["Semibold"] text-xs bg-zinc-950 text-white px-3 py-2 rounded-xl hover:bg-zinc-800 transition-colors'>
                                                                Upload image
                                                            </label>
                                                            {link.file && <span className='text-xs font-["Medium"] text-zinc-400 truncate'>{link.file.name}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='flex gap-2 mt-3'>
                                                <button onClick={handleAddLink} className='flex-1 border border-zinc-200 bg-white text-xs font-["Semibold"] text-zinc-600 rounded-xl py-2.5 hover:bg-zinc-50 transition-colors'>
                                                    + Add link
                                                </button>
                                                <button onClick={handleSubmit} className='flex-1 bg-zinc-950 text-white text-xs font-["Semibold"] rounded-xl py-2.5 hover:bg-zinc-800 transition-colors'>
                                                    Save links
                                                </button>
                                            </div>
                                        </div>
                                        {existingLinks?.length > 0 && (
                                            <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                                <div className='px-5 pt-4 pb-2 text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Current links</div>
                                                {existingLinks.map((link, idx) => (
                                                    <div key={idx} className={`px-5 py-3 ${idx < existingLinks.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                                        <input type="text" value={existingLinks[idx].linkText} onChange={(e) => handleUpdateLink(idx, 'linkText', e.target.value)} className={inputCls + ' mb-2'} />
                                                        <input type="text" value={existingLinks[idx].link} onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)} className={inputCls} />
                                                        <div className='flex gap-2 mt-2'>
                                                            <button onClick={() => submitUpdate(link.id, idx)} className='flex-1 bg-zinc-950 text-white text-xs font-["Semibold"] py-2 rounded-xl hover:bg-zinc-800 transition-colors'>Update</button>
                                                            <button onClick={() => handleDelete(link.id)} className='flex-1 bg-red-500 text-white text-xs font-["Semibold"] py-2 rounded-xl hover:bg-red-600 transition-colors'>Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Type tab */}
                                {page === 'Type' && (
                                    <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                                        <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4'>Form type</div>
                                        <div className='grid grid-cols-2 gap-2'>
                                            {['Contact', 'Feedback'].map(t => (
                                                <button key={t} onClick={() => setType(t)}
                                                    className={`py-3 rounded-xl text-sm font-["Semibold"] border transition-all ${type === t ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Live preview panel */}
                            <div className='w-72 shrink-0 p-5 overflow-y-auto'>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-3'>Preview</div>
                                <div style={{ backgroundColor: color }}
                                    className='w-full overflow-hidden rounded-[28px] border-4 border-zinc-900 relative shadow-2xl'>
                                    {/* Phone notch */}
                                    <div className='flex justify-center pt-3 pb-2 bg-inherit'>
                                        <div className='w-16 h-4 rounded-full bg-zinc-900' />
                                    </div>
                                    <div className='px-4 pb-8'>
                                        <div className='flex flex-col items-center pt-4 pb-3'>
                                            <img src={!formData?.secondaryImage ? logo : formData.secondaryImage} className='w-16 h-16 rounded-full object-cover' />
                                            <div style={{ color: textColor }}
                                                className={`mt-2 text-center text-sm font-["Semibold"] ${font === 'Cascadia' ? 'font-["CSemibold"]' : font === 'Rubrik' ? 'font-["RSemibold"]' : ''}`}>
                                                {formData?.headerText}
                                            </div>
                                            <div style={{ color: textColor }}
                                                className={`mt-0.5 text-xs text-center opacity-60 ${font === 'Cascadia' ? 'font-["CMedium"]' : font === 'Rubrik' ? 'font-["RMedium"]' : 'font-["Medium"]'}`}>
                                                {formData?.description}
                                            </div>
                                        </div>

                                        {/* Products / Services */}
                                        {(selectedPage?.storefront || selectedPage?.workshop) && (
                                            <div className='space-y-2 mt-2'>
                                                {data.me.Services.map(item => (
                                                    <div key={item.id} className='w-full'>
                                                        {base === 'simple' && <Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />}
                                                        {base === 'button' && <Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />}
                                                    </div>
                                                ))}
                                                <div className={`${base === 'button' && 'hidden'} ${grid ? 'grid grid-cols-2' : 'flex flex-col'} gap-2`}>
                                                    {data.me.Services.map(item => (
                                                        <div key={item.id}>
                                                            {base === 'description' && <Description textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Links */}
                                        {selectedPage?.linkinbio && (
                                            <div className='mt-2 space-y-2'>
                                                {selectedPage?.links?.map(item => (
                                                    <div key={item.id} className='w-full'>
                                                        {base === 'simple' && <Simple textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />}
                                                        {base === 'button' && <Button textColor={baseText} item={item} font={font} round={rounded} style={style} color={styleColor} />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Form preview */}
                                        {selectedPage?.form && (
                                            <div className='mt-3 space-y-2'>
                                                {type === 'Contact' && (
                                                    <div className='space-y-2'>
                                                        <div className='grid grid-cols-2 gap-2'>
                                                            <input readOnly placeholder='Name' className='bg-white/80 border border-black/10 rounded-xl px-3 py-2 text-xs font-["Medium"] w-full' />
                                                            <input readOnly placeholder='Email' className='bg-white/80 border border-black/10 rounded-xl px-3 py-2 text-xs font-["Medium"] w-full' />
                                                        </div>
                                                        <input readOnly placeholder='Phone' className='bg-white/80 border border-black/10 rounded-xl px-3 py-2 text-xs font-["Medium"] w-full' />
                                                    </div>
                                                )}
                                                {type === 'Feedback' && (
                                                    <textarea readOnly placeholder='Your feedback...' className='bg-white/80 border border-black/10 rounded-2xl px-3 py-2.5 text-xs font-["Medium"] w-full h-20 resize-none' />
                                                )}
                                                <button className='w-full py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-["Semibold"] flex items-center justify-center gap-1.5'>
                                                    Submit <ArrowRightIcon className='w-3 h-3' />
                                                </button>
                                            </div>
                                        )}

                                        {/* Commercify badge */}
                                        <div className='mt-6 flex justify-center'>
                                            <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1.5">
                                                <Group className="h-3 w-3 text-white" />
                                                <div className="font-['Semibold'] text-white text-[10px]">commercifyhq.com</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
