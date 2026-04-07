import { useState, useEffect } from "react";
import { ChevronDownIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
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
import { ArrowRightIcon, ChevronRight, Sparkles, Star, Zap } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   FONT RESOLVER — maps font key → Tailwind/CSS class for semibold weight
──────────────────────────────────────────────────────────────────────────── */
export const fontSemibold = (font) => {
    const map = {
        'Cascadia':     'font-["CSemibold"]',
        'Rubrik':       'font-["RSemibold"]',
        'Inter':        'font-inter-semibold',
        'DM Sans':      'font-dmsans-semibold',
        'Playfair':     'font-playfair-semibold',
        'Space Grotesk':'font-spacegrotesk-semibold',
        'Outfit':       'font-outfit-semibold',
    };
    return map[font] || 'font-["Semibold"]';
};

/* ─────────────────────────────────────────────────────────────────────────
   PUBLIC PAGE COMPONENTS
   Each accepts: item, round, color, style, font, textColor, link
──────────────────────────────────────────────────────────────────────────── */

// Simple row — icon + label + chevron
export const Simple = ({ item, round, color, style, font, link, textColor }) => {
    const r = round === 'rounded-full' ? 'rounded-full' : round === 'rounded-medium' ? 'rounded-2xl' : 'rounded-xl';
    const cardStyle = {
        backgroundColor: style === 'color' ? color : undefined,
        borderColor: (style === 'outline' || style === 'backdrop') ? color : undefined,
        boxShadow: style === 'backdrop' ? `4px 4px 0px 0px ${color}` : undefined,
    };
    return (
        <a href={link} style={cardStyle}
            className={`flex items-center gap-3 ${r} bg-white/90 border border-black/8 backdrop-blur-sm px-3 py-2.5 w-full hover:scale-[0.99] active:scale-[0.97] transition-transform`}>
            {(item.thumbnail || item.image) ? (
                <img src={item.thumbnail || item.image} className={`w-10 h-10 object-cover shrink-0 ${r}`} />
            ) : (
                <div className={`w-10 h-10 bg-zinc-100 shrink-0 ${r}`} />
            )}
            <div style={{ color: textColor || '#09090b' }}
                className={`flex-1 text-sm line-clamp-1 ${fontSemibold(font)}`}>
                {item.title || item.linkText}
            </div>
            {item.price != null && (
                <div style={{ color: textColor || '#09090b' }} className='text-sm font-["Semibold"] shrink-0 opacity-60'>${item.price}</div>
            )}
            <ChevronRight className='w-3.5 h-3.5 shrink-0 opacity-40' style={{ color: textColor || '#71717a' }} />
            <ProductDialog item={null} isOpen={false} onClose={() => {}} />
        </a>
    );
}

// Card — image top + text below
export const Description = ({ item, style, round, font, textColor, color }) => {
    const r = round === 'rounded-full' ? 'rounded-2xl' : round === 'rounded-medium' ? 'rounded-xl' : 'rounded-lg';
    const cardStyle = {
        backgroundColor: style === 'color' ? color : undefined,
        borderColor: (style === 'outline' || style === 'backdrop') ? color : undefined,
        boxShadow: style === 'backdrop' ? `4px 4px 0px 0px ${color}` : undefined,
    };
    return (
        <div style={cardStyle}
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
                    className={`text-sm line-clamp-1 ${fontSemibold(font)}`}>
                    {item.title || item.linkText}
                </div>
                {item.description && (
                    <div className='text-xs font-["Medium"] opacity-50 mt-0.5 line-clamp-2' style={{ color: textColor || '#71717a' }}>{item.description}</div>
                )}
                {item.price != null && (
                    <div style={{ color: textColor || '#09090b' }} className='text-sm font-["Semibold"] mt-2'>${item.price}</div>
                )}
            </div>
        </div>
    );
}

// Hero — full image with gradient overlay + CTA
export const Button = ({ item, style, color, round, textColor, font }) => {
    const r = round === 'rounded-full' ? 'rounded-2xl' : round === 'rounded-medium' ? 'rounded-2xl' : 'rounded-xl';
    return (
        <div className={`relative w-full ${r} overflow-hidden aspect-[4/3]`}>
            {(item.thumbnail || item.image) ? (
                <img src={item.thumbnail || item.image} className='w-full h-full object-cover' />
            ) : (
                <div className='w-full h-full bg-zinc-200' />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                <div>
                    <div className='text-white font-["Semibold"] text-sm line-clamp-1'>{item.linkText || item.title}</div>
                    {item.price != null && <div className='text-white/70 font-["Medium"] text-xs mt-0.5'>${item.price}</div>}
                </div>
                <div className='bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2.5 py-1 text-white text-[10px] font-["Semibold"]'>View</div>
            </div>
        </div>
    );
}

// Pill — minimal pill button (great for link-in-bio)
export const Pill = ({ item, style, color, round, textColor, font, link }) => {
    const cardStyle = {
        backgroundColor: style === 'color' ? color : 'rgba(255,255,255,0.85)',
        borderColor: color || 'rgba(0,0,0,0.08)',
    };
    return (
        <a href={link} style={cardStyle}
            className='flex items-center justify-between rounded-full border backdrop-blur-sm px-4 py-3 w-full hover:scale-[0.99] active:scale-[0.97] transition-transform'>
            <div className='flex items-center gap-2.5'>
                {(item.thumbnail || item.image) ? (
                    <img src={item.thumbnail || item.image} className='w-8 h-8 rounded-full object-cover shrink-0' />
                ) : (
                    <div className='w-8 h-8 rounded-full bg-zinc-100 shrink-0' />
                )}
                <span style={{ color: textColor || '#09090b' }}
                    className={`text-sm line-clamp-1 ${fontSemibold(font)}`}>
                    {item.title || item.linkText}
                </span>
            </div>
            {item.price != null ? (
                <span style={{ color: textColor || '#09090b' }} className='text-xs font-["Semibold"] opacity-60 shrink-0'>${item.price}</span>
            ) : (
                <ArrowRightIcon className='w-3.5 h-3.5 shrink-0 opacity-40' />
            )}
        </a>
    );
}

// Feature — horizontal image-right layout with title + description
export const Feature = ({ item, style, color, round, textColor, font, link }) => {
    const r = round === 'rounded-full' ? 'rounded-2xl' : round === 'rounded-medium' ? 'rounded-xl' : 'rounded-lg';
    const cardStyle = {
        backgroundColor: style === 'color' ? color : 'rgba(255,255,255,0.9)',
        borderColor: (style === 'outline' || style === 'backdrop') ? color : 'rgba(0,0,0,0.08)',
        boxShadow: style === 'backdrop' ? `4px 4px 0px 0px ${color}` : undefined,
    };
    return (
        <a href={link} style={cardStyle}
            className={`flex items-center gap-3 ${r} border backdrop-blur-sm px-3 py-3 w-full hover:scale-[0.99] active:scale-[0.97] transition-transform`}>
            <div className='flex-1 min-w-0'>
                <div style={{ color: textColor || '#09090b' }}
                    className={`text-sm line-clamp-1 ${fontSemibold(font)}`}>
                    {item.title || item.linkText}
                </div>
                {item.description && (
                    <div style={{ color: textColor || '#71717a' }} className='text-[11px] font-["Medium"] opacity-60 mt-0.5 line-clamp-1'>{item.description}</div>
                )}
                {item.price != null && (
                    <div style={{ color: textColor || '#09090b' }} className='text-xs font-["Semibold"] mt-1 opacity-80'>${item.price}</div>
                )}
            </div>
            {(item.thumbnail || item.image) ? (
                <img src={item.thumbnail || item.image} className={`w-14 h-14 object-cover shrink-0 ${r}`} />
            ) : (
                <div className={`w-14 h-14 bg-zinc-100 shrink-0 ${r}`} />
            )}
        </a>
    );
}

// Glass — frosted glass card with large image and blurred footer
export const Glass = ({ item, style, color, round, textColor, font, link }) => {
    const r = round === 'rounded-full' ? 'rounded-3xl' : round === 'rounded-medium' ? 'rounded-2xl' : 'rounded-xl';
    return (
        <a href={link} className={`relative flex flex-col ${r} overflow-hidden cursor-pointer hover:scale-[0.99] active:scale-[0.97] transition-transform`}>
            <div className='w-full h-28 bg-zinc-100 overflow-hidden'>
                {(item.thumbnail || item.image) ? (
                    <img src={item.thumbnail || item.image} className='w-full h-full object-cover' />
                ) : (
                    <div className='w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200' />
                )}
            </div>
            <div className='bg-white/80 backdrop-blur-xl border-t border-white/50 px-3 py-2.5 flex items-center justify-between'>
                <div>
                    <div style={{ color: textColor || '#09090b' }}
                        className={`text-xs line-clamp-1 ${fontSemibold(font)}`}>
                        {item.title || item.linkText}
                    </div>
                    {item.price != null && (
                        <div style={{ color: textColor || '#09090b' }} className='text-[10px] font-["Medium"] opacity-60'>${item.price}</div>
                    )}
                </div>
                <div className='w-6 h-6 rounded-full bg-zinc-950 flex items-center justify-center shrink-0'>
                    <ChevronRight className='w-3 h-3 text-white' />
                </div>
            </div>
        </a>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   BUILDER PAGE
──────────────────────────────────────────────────────────────────────────── */

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
        featuredSection: false,
        newsletterSection: false,
        socialsSection: false,
        linksSection: false,
        newsletterHeading: '',
        newsletterSubText: '',
        subscribeText: '',
        subscribeSubText: '',
        actionButton: '',
        actionButtonText: '',
    });

    const [colorPicker, setColorPicker] = useState(false);
    const [page, setPage] = useState('Content');
    const [editingLinkIdx, setEditingLinkIdx] = useState(null);
    const [addingLink, setAddingLink] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("#ffffff");
    const [font, setFont] = useState('General-Sans');
    const [rounded, setRounded] = useState('rounded-full');
    const [styleColor, setStyleColor] = useState('#ededed');
    const [base, setBase] = useState('simple');
    const [style, setStyle] = useState('outline');
    const navigate = useNavigate();
    const [grid, setGrid] = useState(false);
    const [type, setType] = useState('Unlock');
    const [colorPickerBase, setColorPickerBase] = useState(false);
    const [textBaseColorPick, setTextBaseColorPicker] = useState(false);
    const [textColorPicker, setTextColorPicker] = useState(false);
    const [textColor, setTextColor] = useState("#000");
    const [baseText, setBaseText] = useState("#000");

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
        const freshPage = data?.me?.Pages?.find(p => p.id === selectedPage?.id);
        if (freshPage?.links) setExistingLinks(freshPage.links);
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
                secondaryImage: selectedPage?.secondaryImage || "",
                instagram: selectedPage?.instagram || "",
                facebook: selectedPage?.facebook || "",
                tiktok: selectedPage?.tiktok || "",
                twitter: selectedPage?.twitter || "",
                featuredSection: selectedPage?.featuredSection || false,
                newsletterSection: selectedPage?.newsletterSection || false,
                socialsSection: selectedPage?.socialsSection || false,
                linksSection: selectedPage?.linksSection || false,
                newsletterHeading: selectedPage?.newsletterHeading || "",
                newsletterSubText: selectedPage?.newsletterSubtext || "",
                subscribeText: selectedPage?.subscribeText || "",
                subscribeSubText: selectedPage?.subscribeSubText || "",
                actionButton: selectedPage?.actionButton || "",
                actionButtonText: selectedPage?.actionButtonText || "",
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
                const { error } = await supabase.storage.from("storage-images").upload(fileName, file);
                if (error) return "";
                const { data } = supabase.storage.from("storage-images").getPublicUrl(fileName);
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
                        name: formData.name,
                        headerText: formData.headerText,
                        secondaryText: formData.secondaryText,
                        description: formData.description,
                        backgroundColor: color,
                        base, rounded, style, font,
                        styleColor, published: true,
                        textColor, baseText,
                        headerImage: formData?.headerImage,
                        secondaryImage: formData?.secondaryImage,
                        grid, formType: type,
                        instagram: formData.instagram,
                        facebook: formData.facebook,
                        tiktok: formData.tiktok,
                        twitter: formData.twitter,
                        featuredSection: formData.featuredSection,
                        newsletterSection: formData.newsletterSection,
                        socialsSection: formData.socialsSection,
                        linksSection: formData.linksSection,
                        newsletterHeading: formData.newsletterHeading,
                        newsletterSubText: formData.newsletterSubText,
                        subscribeText: formData.subscribeText,
                        subscribeSubText: formData.subscribeSubText,
                        actionButton: formData.actionButton,
                        actionButtonText: formData.actionButtonText,
                    },
                });
                navigate("/dashboard");
            } catch (err) { console.error("Form submission error:", err.message); }
        },
    });

    async function uploadFile(fieldName, file) {
        if (!file) return;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `headers/${fileName}`;
        const { error } = await supabase.storage.from('storage-images').upload(filePath, file);
        if (error) { console.error('Upload failed:', error.message); return; }
        const { data: publicUrlData } = supabase.storage.from('storage-images').getPublicUrl(filePath);
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
            const { data: fresh } = await refetch();
            const page = fresh?.me?.Pages?.find(p => p.id === selectedPage?.id);
            if (page?.links) setExistingLinks(page.links);
        } catch (err) { console.error("Failed to refetch links:", err); }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const ColorOverlay = ({ show, value, onChange, onClose }) => !show ? null : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className='bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-2xl border border-zinc-100'>
                <HexColorPicker color={value} onChange={onChange} />
                <button onClick={onClose} className='w-full py-2.5 rounded-xl bg-zinc-950 font-["Semibold"] text-white text-sm'>Done</button>
            </div>
        </div>
    );

    const inputCls = 'w-full border border-zinc-200 bg-white rounded-xl px-4 py-2.5 text-sm font-["Medium"] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400';
    const labelCls = 'text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest block mb-1.5';

    // Component definitions for the Display tab picker
    const components = [
        {
            key: 'simple',
            label: 'Row',
            desc: 'Icon + title + arrow',
            preview: (
                <div className='flex items-center gap-2 bg-white rounded-xl border border-zinc-100 px-2.5 py-2'>
                    <div className='w-7 h-7 rounded-lg bg-zinc-100 shrink-0' />
                    <div className='flex-1'>
                        <div className='h-2 bg-zinc-200 rounded-full w-3/4' />
                    </div>
                    <div className='w-1.5 h-2.5 border-r border-b border-zinc-300 rotate-[-45deg] shrink-0' />
                </div>
            ),
        },
        {
            key: 'pill',
            label: 'Pill',
            desc: 'Rounded full-width pill',
            preview: (
                <div className='flex items-center gap-2 bg-white rounded-full border border-zinc-100 px-2.5 py-1.5'>
                    <div className='w-6 h-6 rounded-full bg-zinc-100 shrink-0' />
                    <div className='flex-1 h-2 bg-zinc-200 rounded-full' />
                    <div className='w-3 h-3 rounded-full border border-zinc-200 shrink-0' />
                </div>
            ),
        },
        {
            key: 'feature',
            label: 'Feature',
            desc: 'Text left, image right',
            preview: (
                <div className='flex items-center gap-2 bg-white rounded-xl border border-zinc-100 px-2.5 py-2'>
                    <div className='flex-1'>
                        <div className='h-2 bg-zinc-200 rounded-full w-3/4 mb-1' />
                        <div className='h-1.5 bg-zinc-100 rounded-full w-1/2' />
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-zinc-100 shrink-0' />
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Card',
            desc: 'Image top, text below',
            preview: (
                <div className='bg-white rounded-xl border border-zinc-100 overflow-hidden'>
                    <div className='w-full h-10 bg-zinc-100' />
                    <div className='px-2 py-1.5'>
                        <div className='h-2 bg-zinc-200 rounded-full w-3/4 mb-1' />
                        <div className='h-1.5 bg-zinc-100 rounded-full w-1/2' />
                    </div>
                </div>
            ),
        },
        {
            key: 'glass',
            label: 'Glass',
            desc: 'Frosted glass footer',
            preview: (
                <div className='bg-zinc-100 rounded-xl overflow-hidden'>
                    <div className='w-full h-10 bg-gradient-to-br from-zinc-200 to-zinc-300' />
                    <div className='bg-white/80 backdrop-blur-sm px-2 py-1.5 flex items-center justify-between border-t border-white/50'>
                        <div className='h-2 bg-zinc-200 rounded-full w-1/2' />
                        <div className='w-4 h-4 rounded-full bg-zinc-900' />
                    </div>
                </div>
            ),
        },
        {
            key: 'button',
            label: 'Hero',
            desc: 'Full image + gradient CTA',
            preview: (
                <div className='relative w-full h-14 bg-zinc-200 rounded-xl overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    <div className='absolute bottom-1.5 left-2 right-2 flex items-end justify-between'>
                        <div className='h-2 bg-white/60 rounded-full w-1/2' />
                        <div className='bg-white/25 rounded-full px-1.5 py-0.5'>
                            <div className='h-1.5 w-4 bg-white/60 rounded-full' />
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    // Render component in preview
    const renderComponent = (item) => {
        const props = { item, font, round: rounded, style, color: styleColor, textColor: baseText, link: item.link };
        if (base === 'simple') return <Simple {...props} />;
        if (base === 'pill') return <Pill {...props} />;
        if (base === 'feature') return <Feature {...props} />;
        if (base === 'glass') return <Glass {...props} />;
        if (base === 'button') return <Button {...props} />;
        if (base === 'description') return <Description {...props} />;
        return <Simple {...props} />;
    };

    const isGridComponent = base === 'description' || base === 'glass';
    const allItems = [...(data.me.OnlyProducts ?? []), ...(data.me.Services ?? [])];

    const tabs = ['Content', 'Style', 'Display', 'Sections'];
    if (selectedPage?.linkinbio) tabs.push('Links');
    if (selectedPage?.form) tabs.push('Type');

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
                                className='h-7 w-7 rounded-lg cursor-pointer transition-all object-cover hover:opacity-80'
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
                        <div className='flex items-center gap-2.5'>
                            <img src={selectedPage?.headerImage || logo} className='w-6 h-6 rounded-lg object-cover' />
                            <span className="font-['Semibold'] text-zinc-900 text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                            <span className='text-zinc-300 text-xs'>·</span>
                            <span className={`text-[10px] font-["Semibold"] px-2 py-0.5 rounded-full ${selectedPage?.published ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                {selectedPage?.published ? 'Live' : 'Draft'}
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            {/* Tab switcher */}
                            <div className='flex items-center bg-zinc-100 rounded-xl p-0.5 gap-0.5'>
                                {tabs.map(t => (
                                    <button key={t} onClick={() => setPage(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-["Semibold"] transition-all ${page === t ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setIsOpen(true)} className='h-8 px-4 bg-zinc-950 rounded-xl text-white font-["Semibold"] text-xs hover:bg-zinc-800 transition-colors flex items-center gap-1.5'>
                                <Zap className='w-3 h-3' /> Publish
                            </button>
                        </div>
                    </header>

                    {/* Publish dialog */}
                    <Dialog open={isOpen} as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                            <DialogPanel className="bg-white rounded-2xl border border-zinc-100 p-6 w-full max-w-sm shadow-2xl">
                                <h2 className='font-["Semibold"] text-lg text-zinc-950 tracking-tight'>Publish page</h2>
                                <p className='font-["Medium"] text-zinc-400 text-sm mt-1 mb-4'>Confirm your page URL before publishing.</p>
                                <div className='flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50'>
                                    <span className='px-3 py-2.5 text-sm font-["Medium"] text-zinc-400 border-r border-zinc-200 shrink-0'>cmhq.me/</span>
                                    <input
                                        onChange={handleNameChange}
                                        value={formData?.subdomain}
                                        name="subdomain"
                                        className='flex-1 bg-transparent px-3 py-2.5 text-sm font-["Medium"] text-zinc-900 focus:outline-none'
                                        placeholder='your-page-name'
                                    />
                                </div>
                                <form onSubmit={formik.handleSubmit} className='mt-4'>
                                    <button type="submit" className='w-full bg-zinc-950 text-white py-3 rounded-xl font-["Semibold"] text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2'>
                                        Publish page <ArrowRightIcon className='w-4 h-4' />
                                    </button>
                                </form>
                            </DialogPanel>
                        </div>
                    </Dialog>

                    <main className="flex-1 overflow-hidden">
                        <div className='w-full h-full flex'>
                            {/* Editor panel */}
                            <div className='flex-1 overflow-y-auto p-5'>

                                {/* ── Content tab ── */}
                                {page === 'Content' && (
                                    <div className='flex flex-col gap-4 max-w-xl'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Page info</div>
                                            </div>
                                            <div className='p-5 flex flex-col gap-4'>
                                                <div>
                                                    <label className={labelCls}>Display name</label>
                                                    <input onChange={handleNameChange} value={formData.headerText} name="headerText" className={inputCls} placeholder='Your name or business' />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Bio / Description</label>
                                                    <textarea onChange={handleNameChange} value={formData.description} name="description" rows={2}
                                                        className={`${inputCls} resize-none`} placeholder='A short description...' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Images</div>
                                            </div>
                                            <div className='p-5 flex gap-6'>
                                                {[
                                                    { label: 'Page icon', field: 'headerImage', src: formData.headerImage || selectedPage?.headerImage },
                                                    { label: 'Profile image', field: 'secondaryImage', src: formData.secondaryImage || selectedPage?.secondaryImage },
                                                ].map(({ label, field, src }) => (
                                                    <div key={field}>
                                                        <label className={labelCls}>{label}</label>
                                                        <div className='flex items-center gap-3 mt-1'>
                                                            {src ? (
                                                                <img src={src} className="w-12 h-12 rounded-xl object-cover border border-zinc-100" />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center">
                                                                    <PlusIcon className='w-4 h-4 text-zinc-400' />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <input id={`upload-${field}`} type="file" className='hidden' accept="image/*"
                                                                    onChange={(e) => e.target.files[0] && uploadFile(field, e.target.files[0])} />
                                                                <label htmlFor={`upload-${field}`} className='cursor-pointer font-["Semibold"] text-xs text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors block'>
                                                                    {src ? 'Change' : 'Upload'}
                                                                </label>
                                                                <div className='text-[10px] font-["Medium"] text-zinc-400 mt-1'>PNG, JPG</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Style tab ── */}
                                {page === 'Style' && (
                                    <div className='flex flex-col gap-4 max-w-xl'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Colors</div>
                                            </div>
                                            <div className='p-5 grid grid-cols-2 gap-3'>
                                                {[
                                                    { label: 'Background', value: color, onClick: () => setColorPicker(true) },
                                                    { label: 'Text', value: textColor, onClick: () => setTextColorPicker(true) },
                                                ].map(({ label, value, onClick }) => (
                                                    <button key={label} onClick={onClick} className='flex items-center gap-3 border border-zinc-200 rounded-xl px-3 py-3 hover:bg-zinc-50 transition-colors text-left'>
                                                        <div className='w-8 h-8 rounded-lg border border-zinc-200 shrink-0 shadow-sm' style={{ backgroundColor: value }} />
                                                        <div>
                                                            <div className='text-xs font-["Semibold"] text-zinc-700'>{label}</div>
                                                            <div className='text-[10px] font-["Medium"] text-zinc-400 uppercase'>{value}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Font</div>
                                            </div>
                                            <div className='p-5 grid grid-cols-2 gap-2'>
                                                {[
                                                    { key: 'General-Sans', label: 'General Sans', cls: 'font-["Medium"]',           desc: 'Clean & modern' },
                                                    { key: 'Inter',        label: 'Inter',        cls: 'font-inter-medium',          desc: 'Neutral & readable' },
                                                    { key: 'DM Sans',      label: 'DM Sans',      cls: 'font-dmsans-medium',         desc: 'Geometric & soft' },
                                                    { key: 'Outfit',       label: 'Outfit',       cls: 'font-outfit-medium',         desc: 'Friendly & rounded' },
                                                    { key: 'Space Grotesk',label: 'Space Grotesk',cls: 'font-spacegrotesk-medium',   desc: 'Techy & bold' },
                                                    { key: 'Playfair',     label: 'Playfair',     cls: 'font-playfair-medium',       desc: 'Elegant serif' },
                                                    { key: 'Cascadia',     label: 'Cascadia',     cls: 'font-["CMedium"]',           desc: 'Monospace / code' },
                                                    { key: 'Rubrik',       label: 'Rubrik',       cls: 'font-["RMedium"]',           desc: 'Rounded & fun' },
                                                ].map(({ key, label, cls, desc }) => (
                                                    <button key={key} onClick={() => setFont(key)}
                                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left ${font === key ? 'bg-zinc-950 border-zinc-950' : 'border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'}`}>
                                                        <span className={`text-2xl leading-none shrink-0 w-8 text-center ${cls} ${font === key ? 'text-white' : 'text-zinc-800'}`}>Aa</span>
                                                        <div>
                                                            <div className={`text-xs font-["Semibold"] ${font === key ? 'text-white' : 'text-zinc-800'}`}>{label}</div>
                                                            <div className={`text-[10px] font-["Medium"] text-zinc-400`}>{desc}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Display tab ── */}
                                {page === 'Display' && (
                                    <div className='flex flex-col gap-4 max-w-2xl'>
                                        {/* Component picker */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100 flex items-center justify-between'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Component style</div>
                                                <div className='flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1'>
                                                    <Sparkles className='w-3 h-3 text-zinc-400' />
                                                    <span className='text-[10px] font-["Semibold"] text-zinc-400'>6 styles</span>
                                                </div>
                                            </div>
                                            <div className='p-5 grid grid-cols-3 gap-3'>
                                                {components.map(({ key, label, desc, preview }) => (
                                                    <button key={key} onClick={() => setBase(key)}
                                                        className={`rounded-2xl border-2 p-3 text-left transition-all ${base === key ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300 hover:bg-white'}`}>
                                                        <div className={`mb-3 ${base === key ? 'opacity-60' : ''}`}>{preview}</div>
                                                        <div className={`text-xs font-["Semibold"] ${base === key ? 'text-white' : 'text-zinc-800'}`}>{label}</div>
                                                        <div className={`text-[10px] font-["Medium"] mt-0.5 ${base === key ? 'text-zinc-400' : 'text-zinc-400'}`}>{desc}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Card style */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Card style</div>
                                            </div>
                                            <div className='p-5 flex flex-col gap-4'>
                                                <div className='grid grid-cols-3 gap-2'>
                                                    {[
                                                        { key: 'outline', label: 'Outline', desc: 'Bordered' },
                                                        { key: 'backdrop', label: 'Shadow', desc: 'Drop shadow' },
                                                        { key: 'color', label: 'Filled', desc: 'Solid fill' },
                                                    ].map(({ key, label, desc }) => (
                                                        <button key={key} onClick={() => setStyle(key)}
                                                            className={`py-2.5 px-3 rounded-xl text-left border transition-all ${style === key ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                                                            <div className={`text-xs font-["Semibold"] ${style === key ? 'text-white' : 'text-zinc-800'}`}>{label}</div>
                                                            <div className={`text-[10px] font-["Medium"] mt-0.5 ${style === key ? 'text-zinc-400' : 'text-zinc-400'}`}>{desc}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className='grid grid-cols-2 gap-2'>
                                                    {[
                                                        { label: 'Card color', value: styleColor, onClick: () => setColorPickerBase(true) },
                                                        { label: 'Text color', value: baseText, onClick: () => setTextBaseColorPicker(true) },
                                                    ].map(({ label, value, onClick }) => (
                                                        <button key={label} onClick={onClick} className='flex items-center gap-2.5 border border-zinc-200 rounded-xl px-3 py-2.5 hover:bg-zinc-50 transition-colors'>
                                                            <div className='w-5 h-5 rounded-md border border-zinc-200 shrink-0' style={{ backgroundColor: value }} />
                                                            <span className='text-xs font-["Semibold"] text-zinc-700'>{label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Corners */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Corner radius</div>
                                            </div>
                                            <div className='p-5 flex gap-2'>
                                                {[
                                                    { key: 'rounded-full', label: 'Round', icon: <div className='w-6 h-5 border-2 border-current rounded-full'/> },
                                                    { key: 'rounded-medium', label: 'Soft', icon: <div className='w-6 h-5 border-2 border-current rounded-lg'/> },
                                                    { key: 'none', label: 'Sharp', icon: <div className='w-6 h-5 border-2 border-current rounded-sm'/> },
                                                ].map(({ key, label, icon }) => (
                                                    <button key={key} onClick={() => setRounded(key)}
                                                        className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${rounded === key ? 'bg-zinc-950 border-zinc-950 text-white' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
                                                        {icon}
                                                        <span className='text-[10px] font-["Semibold"]'>{label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Links tab ── */}
                                {page === 'Links' && (
                                    <div className='flex flex-col gap-4 max-w-xl'>
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Add links</div>
                                            </div>
                                            <div className='p-5 space-y-3'>
                                                {links.map((link, idx) => (
                                                    <div key={idx} className='bg-zinc-50 rounded-2xl border border-zinc-100 p-4 space-y-2'>
                                                        <input type="text" value={link.linkText} onChange={(e) => handleChange(idx, 'linkText', e.target.value)}
                                                            placeholder="Link label" className={inputCls} />
                                                        <input type="text" value={link.link} onChange={(e) => handleChange(idx, 'link', e.target.value)}
                                                            placeholder="https://..." className={inputCls} />
                                                        <div className='flex items-center gap-2'>
                                                            <input id={`linkImageUpload-${idx}`} type="file" accept="image/*"
                                                                onChange={(e) => handleFileChange(idx, e.target.files[0])} className="hidden" />
                                                            <label htmlFor={`linkImageUpload-${idx}`} className='cursor-pointer font-["Semibold"] text-xs bg-zinc-950 text-white px-3 py-2 rounded-xl hover:bg-zinc-800 transition-colors'>
                                                                Upload image
                                                            </label>
                                                            {link.file && <span className='text-xs font-["Medium"] text-zinc-400 truncate'>{link.file.name}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='flex gap-2'>
                                                    <button onClick={handleAddLink} className='flex-1 border border-zinc-200 bg-white text-xs font-["Semibold"] text-zinc-600 rounded-xl py-2.5 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1'>
                                                        <PlusIcon className='w-3.5 h-3.5' /> Add link
                                                    </button>
                                                    <button onClick={handleSubmit} className='flex-1 bg-zinc-950 text-white text-xs font-["Semibold"] rounded-xl py-2.5 hover:bg-zinc-800 transition-colors'>
                                                        Save links
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {existingLinks?.length > 0 && (
                                            <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                                <div className='px-5 pt-5 pb-3 border-b border-zinc-100'>
                                                    <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Existing links</div>
                                                </div>
                                                {existingLinks.map((link, idx) => (
                                                    <div key={idx} className={`p-4 ${idx < existingLinks.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                                        <input type="text" value={existingLinks[idx].linkText} onChange={(e) => handleUpdateLink(idx, 'linkText', e.target.value)} className={inputCls + ' mb-2'} />
                                                        <input type="text" value={existingLinks[idx].link} onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)} className={inputCls} />
                                                        <div className='flex gap-2 mt-2'>
                                                            <button onClick={() => submitUpdate(link.id, idx)} className='flex-1 bg-zinc-950 text-white text-xs font-["Semibold"] py-2 rounded-xl hover:bg-zinc-800 transition-colors'>Update</button>
                                                            <button onClick={() => handleDelete(link.id)} className='flex-1 bg-red-50 text-red-600 text-xs font-["Semibold"] py-2 rounded-xl hover:bg-red-100 transition-colors'>Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── Type tab ── */}
                                {page === 'Type' && (
                                    <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden max-w-xl'>
                                        <div className='px-5 pt-5 pb-4 border-b border-zinc-100'>
                                            <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Form type</div>
                                        </div>
                                        <div className='p-5 grid grid-cols-2 gap-2'>
                                            {['Contact', 'Feedback'].map(t => (
                                                <button key={t} onClick={() => setType(t)}
                                                    className={`py-4 rounded-xl text-sm font-["Semibold"] border transition-all ${type === t ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Sections tab ── */}
                                {page === 'Sections' && (
                                    <div className='flex flex-col gap-4 max-w-xl'>

                                        {/* Featured Products */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-5 flex items-center justify-between'>
                                                <div>
                                                    <div className='text-sm font-["Semibold"] text-zinc-900'>Featured Products</div>
                                                    <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>Highlight your top items at the top of the page</div>
                                                </div>
                                                <button
                                                    onClick={() => setFormData(p => ({ ...p, featuredSection: !p.featuredSection }))}
                                                    className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ml-4 ${formData.featuredSection ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.featuredSection ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Socials */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className={`px-5 pt-5 flex items-center justify-between ${formData.socialsSection ? 'pb-4 border-b border-zinc-100' : 'pb-5'}`}>
                                                <div>
                                                    <div className='text-sm font-["Semibold"] text-zinc-900'>Social Links</div>
                                                    <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>Show social media icons on your page</div>
                                                </div>
                                                <button
                                                    onClick={() => setFormData(p => ({ ...p, socialsSection: !p.socialsSection }))}
                                                    className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ml-4 ${formData.socialsSection ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.socialsSection ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                </button>
                                            </div>
                                            {formData.socialsSection && (
                                                <div className='p-5 grid grid-cols-2 gap-3'>
                                                    {[
                                                        { key: 'instagram', placeholder: '@yourhandle', label: 'Instagram' },
                                                        { key: 'tiktok', placeholder: '@yourhandle', label: 'TikTok' },
                                                        { key: 'twitter', placeholder: '@yourhandle', label: 'X / Twitter' },
                                                        { key: 'facebook', placeholder: 'facebook.com/page', label: 'Facebook' },
                                                    ].map(({ key, placeholder, label }) => (
                                                        <div key={key}>
                                                            <label className={labelCls}>{label}</label>
                                                            <input
                                                                value={formData[key]}
                                                                onChange={(e) => setFormData(p => ({ ...p, [key]: e.target.value }))}
                                                                placeholder={placeholder}
                                                                className={inputCls}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Newsletter */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className={`px-5 pt-5 flex items-center justify-between ${formData.newsletterSection ? 'pb-4 border-b border-zinc-100' : 'pb-5'}`}>
                                                <div>
                                                    <div className='text-sm font-["Semibold"] text-zinc-900'>Newsletter / Subscribe</div>
                                                    <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>Add an email subscribe section</div>
                                                </div>
                                                <button
                                                    onClick={() => setFormData(p => ({ ...p, newsletterSection: !p.newsletterSection }))}
                                                    className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ml-4 ${formData.newsletterSection ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.newsletterSection ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                </button>
                                            </div>
                                            {formData.newsletterSection && (
                                                <div className='p-5 flex flex-col gap-3'>
                                                    <div>
                                                        <label className={labelCls}>Heading</label>
                                                        <input value={formData.newsletterHeading} onChange={(e) => setFormData(p => ({ ...p, newsletterHeading: e.target.value }))} placeholder='Stay in the loop' className={inputCls} />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Subtext</label>
                                                        <input value={formData.newsletterSubText} onChange={(e) => setFormData(p => ({ ...p, newsletterSubText: e.target.value }))} placeholder='Subscribe to get updates' className={inputCls} />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Button label</label>
                                                        <input value={formData.subscribeText} onChange={(e) => setFormData(p => ({ ...p, subscribeText: e.target.value }))} placeholder='Subscribe' className={inputCls} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className={`px-5 pt-5 flex items-center justify-between ${formData.linksSection ? 'pb-4 border-b border-zinc-100' : 'pb-5'}`}>
                                                <div>
                                                    <div className='text-sm font-["Semibold"] text-zinc-900'>Call to Action</div>
                                                    <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>Add a prominent CTA button to your page</div>
                                                </div>
                                                <button
                                                    onClick={() => setFormData(p => ({ ...p, linksSection: !p.linksSection }))}
                                                    className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ml-4 ${formData.linksSection ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.linksSection ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                </button>
                                            </div>
                                            {formData.linksSection && (
                                                <div className='p-5 flex flex-col gap-3'>
                                                    <div>
                                                        <label className={labelCls}>Button URL</label>
                                                        <input value={formData.actionButton} onChange={(e) => setFormData(p => ({ ...p, actionButton: e.target.value }))} placeholder='https://...' className={inputCls} />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Button text</label>
                                                        <input value={formData.actionButtonText} onChange={(e) => setFormData(p => ({ ...p, actionButtonText: e.target.value }))} placeholder='Learn More' className={inputCls} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Links Manager ── */}
                                        <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                                            <div className='px-5 pt-5 pb-4 border-b border-zinc-100 flex items-center justify-between'>
                                                <div>
                                                    <div className='text-sm font-["Semibold"] text-zinc-900'>Links</div>
                                                    <div className='text-xs font-["Medium"] text-zinc-400 mt-0.5'>{existingLinks?.length || 0} saved links</div>
                                                </div>
                                                <button
                                                    onClick={() => { setAddingLink(v => !v); setEditingLinkIdx(null); }}
                                                    className='flex items-center gap-1.5 bg-zinc-950 text-white text-xs font-["Semibold"] px-3 py-1.5 rounded-xl hover:bg-zinc-800 transition-colors'
                                                >
                                                    <PlusIcon className='w-3 h-3' /> Add link
                                                </button>
                                            </div>

                                            {/* Add link form */}
                                            {addingLink && (
                                                <div className='p-4 border-b border-zinc-100 bg-zinc-50 space-y-2'>
                                                    {links.map((link, idx) => (
                                                        <div key={idx} className='space-y-2'>
                                                            <input type="text" value={link.linkText} onChange={(e) => handleChange(idx, 'linkText', e.target.value)}
                                                                placeholder="Link label" className={inputCls} />
                                                            <input type="text" value={link.link} onChange={(e) => handleChange(idx, 'link', e.target.value)}
                                                                placeholder="https://..." className={inputCls} />
                                                            <div className='flex items-center gap-2'>
                                                                <input id={`linkImg-${idx}`} type="file" accept="image/*" onChange={(e) => handleFileChange(idx, e.target.files[0])} className="hidden" />
                                                                <label htmlFor={`linkImg-${idx}`} className='cursor-pointer font-["Semibold"] text-xs text-zinc-600 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors'>
                                                                    {link.file ? link.file.name : 'Upload image'}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className='flex gap-2 pt-1'>
                                                        <button onClick={handleAddLink} className='flex-1 border border-zinc-200 bg-white text-xs font-["Semibold"] text-zinc-600 rounded-xl py-2 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1'>
                                                            <PlusIcon className='w-3 h-3' /> Another
                                                        </button>
                                                        <button onClick={async () => { await handleSubmit(); setAddingLink(false); await refetchExistingLinks(); }}
                                                            className='flex-1 bg-zinc-950 text-white text-xs font-["Semibold"] rounded-xl py-2 hover:bg-zinc-800 transition-colors'>
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Existing links list */}
                                            {existingLinks?.length > 0 ? (
                                                <div>
                                                    {existingLinks.map((link, idx) => (
                                                        <div key={link.id} className={idx < existingLinks.length - 1 ? 'border-b border-zinc-100' : ''}>
                                                            {/* Collapsed row */}
                                                            <div
                                                                className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-50 transition-colors'
                                                                onClick={() => setEditingLinkIdx(editingLinkIdx === idx ? null : idx)}
                                                            >
                                                                {link.image ? (
                                                                    <img src={link.image} className='w-9 h-9 rounded-xl object-cover shrink-0 border border-zinc-100' />
                                                                ) : (
                                                                    <div className='w-9 h-9 rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center'>
                                                                        <div className='w-3 h-3 rounded-full bg-zinc-300' />
                                                                    </div>
                                                                )}
                                                                <div className='flex-1 min-w-0'>
                                                                    <div className='text-sm font-["Semibold"] text-zinc-900 truncate'>{link.linkText || 'Untitled'}</div>
                                                                    <div className='text-[11px] font-["Medium"] text-zinc-400 truncate'>{link.link || 'No URL'}</div>
                                                                </div>
                                                                <ChevronDownIcon className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${editingLinkIdx === idx ? 'rotate-180' : ''}`} />
                                                            </div>

                                                            {/* Expanded edit form */}
                                                            {editingLinkIdx === idx && (
                                                                <div className='px-4 pb-4 space-y-2 bg-zinc-50 border-t border-zinc-100'>
                                                                    <div className='pt-3'>
                                                                        <label className={labelCls}>Label</label>
                                                                        <input type="text" value={existingLinks[idx].linkText} onChange={(e) => handleUpdateLink(idx, 'linkText', e.target.value)} className={inputCls} />
                                                                    </div>
                                                                    <div>
                                                                        <label className={labelCls}>URL</label>
                                                                        <input type="text" value={existingLinks[idx].link} onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)} className={inputCls} />
                                                                    </div>
                                                                    <div className='flex gap-2 pt-1'>
                                                                        <button
                                                                            onClick={async () => { await submitUpdate(link.id, idx); setEditingLinkIdx(null); }}
                                                                            className='flex-1 bg-zinc-950 text-white text-xs font-["Semibold"] py-2 rounded-xl hover:bg-zinc-800 transition-colors'
                                                                        >
                                                                            Save changes
                                                                        </button>
                                                                        <button
                                                                            onClick={async () => { await handleDelete(link.id); setEditingLinkIdx(null); }}
                                                                            className='px-4 bg-red-50 text-red-600 text-xs font-["Semibold"] py-2 rounded-xl hover:bg-red-100 transition-colors'
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                !addingLink && (
                                                    <div className='px-5 py-8 flex flex-col items-center gap-2 text-center'>
                                                        <div className='w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center mb-1'>
                                                            <PlusIcon className='w-5 h-5 text-zinc-400' />
                                                        </div>
                                                        <div className='text-sm font-["Semibold"] text-zinc-700'>No links yet</div>
                                                        <div className='text-xs font-["Medium"] text-zinc-400'>Add your first link to get started</div>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                    </div>
                                )}
                            </div>

                            {/* ── Live preview panel ── */}
                            <div className='w-72 shrink-0 p-5 overflow-y-auto flex flex-col items-center'>
                                <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-4 self-start'>Preview</div>

                                {/* Phone frame */}
                                <div className='relative' style={{ width: 220 }}>
                                    {/* Outer shell */}
                                    <div className='absolute inset-0 rounded-[36px] bg-zinc-900 shadow-[0_32px_64px_rgba(0,0,0,0.35)]' style={{ margin: '-5px' }} />
                                    {/* Side buttons */}
                                    <div className='absolute -left-[9px] top-16 w-[5px] h-7 bg-zinc-700 rounded-l-full' />
                                    <div className='absolute -left-[9px] top-[104px] w-[5px] h-9 bg-zinc-700 rounded-l-full' />
                                    <div className='absolute -left-[9px] top-[152px] w-[5px] h-9 bg-zinc-700 rounded-l-full' />
                                    <div className='absolute -right-[9px] top-24 w-[5px] h-12 bg-zinc-700 rounded-r-full' />

                                    {/* Screen */}
                                    <div style={{ backgroundColor: color, width: 220, borderRadius: 32, overflow: 'hidden', position: 'relative', minHeight: 420 }}>
                                        {/* Dynamic Island */}
                                        <div className='flex justify-center pt-3 pb-1'>
                                            <div className='w-20 h-5 rounded-full bg-zinc-900 flex items-center justify-center'>
                                                <div className='w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700' />
                                            </div>
                                        </div>

                                        {/* Page content */}
                                        <div className='px-3 pb-6'>
                                            {/* Profile */}
                                            <div className='flex flex-col items-center pt-3 pb-3'>
                                                <img src={formData?.secondaryImage || logo} className='w-14 h-14 rounded-full object-cover border-2 border-white/20' />
                                                <div style={{ color: textColor }}
                                                    className={`mt-2 text-center text-sm leading-tight ${fontSemibold(font)}`}>
                                                    {formData?.headerText || 'Your Name'}
                                                </div>
                                                <div style={{ color: textColor }}
                                                    className='mt-0.5 text-[10px] text-center opacity-50 font-["Medium"] px-4 line-clamp-2'>
                                                    {formData?.description || 'Your description'}
                                                </div>
                                            </div>

                                            {/* Components */}
                                            <div className={`mt-1 ${isGridComponent ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}`}>
                                                {(selectedPage?.storefront || selectedPage?.workshop) && (
                                                    allItems.slice(0, 4).map(item => (
                                                        <div key={item.id}>{renderComponent(item)}</div>
                                                    ))
                                                )}
                                                {selectedPage?.linkinbio && (
                                                    selectedPage?.links?.slice(0, 4).map(item => (
                                                        <div key={item.id}>{renderComponent(item)}</div>
                                                    ))
                                                )}
                                                {selectedPage?.form && (
                                                    <div className='space-y-2 col-span-2'>
                                                        {type === 'Contact' && (
                                                            <>
                                                                <div className='grid grid-cols-2 gap-1.5'>
                                                                    <input readOnly placeholder='Name' className='bg-white/80 border border-black/8 rounded-xl px-2.5 py-2 text-[11px] font-["Medium"] w-full' />
                                                                    <input readOnly placeholder='Email' className='bg-white/80 border border-black/8 rounded-xl px-2.5 py-2 text-[11px] font-["Medium"] w-full' />
                                                                </div>
                                                                <input readOnly placeholder='Phone number' className='bg-white/80 border border-black/8 rounded-xl px-2.5 py-2 text-[11px] font-["Medium"] w-full' />
                                                            </>
                                                        )}
                                                        {type === 'Feedback' && (
                                                            <textarea readOnly placeholder='Your feedback...' className='bg-white/80 border border-black/8 rounded-2xl px-2.5 py-2 text-[11px] font-["Medium"] w-full h-16 resize-none' />
                                                        )}
                                                        <button className='w-full py-2.5 rounded-xl bg-zinc-950 text-white text-[11px] font-["Semibold"] flex items-center justify-center gap-1'>
                                                            Submit <ArrowRightIcon className='w-3 h-3' />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Commercify badge */}
                                            <div className='mt-5 flex justify-center'>
                                                <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                    <Group className="h-3 w-3" />
                                                    <div className="font-['Semibold'] text-white text-[9px]">commercifyhq.com</div>
                                                </div>
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
