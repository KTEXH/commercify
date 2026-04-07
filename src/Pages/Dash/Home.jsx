import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, TrendingDown, Minus, Search, Bell, Download, LayoutGrid, Package, ShoppingBag, Users, BarChart2, Settings, ChevronRight } from "lucide-react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useMutation, useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useFormik } from "formik";
import { CREATE_LINK_IN_BIO } from "../../Pages/Pages/Mutations/Mutations";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Utils/utils";
import SimpleChart from "../../components/Graphs/DailyPayout";
import Group from "../../components/assets/Group";

export const Banner = () => {
  return (
    <div className="h-11 px-5 w-full justify-between items-center flex bg-white border-b border-zinc-100 z-10 relative shrink-0">
      <Group className='w-4 h-4 text-zinc-900' />
      <div className='text-center text-xs flex items-center gap-2 font-["Medium"] text-zinc-600'>
        <span className='w-1 h-1 rounded-full bg-emerald-400' />
        Beta — 50% off Pro
      </div>
      <button className='bg-zinc-950 hover:bg-zinc-800 transition-colors rounded-lg h-6 px-3 gap-1.5 flex items-center font-["Semibold"] text-white text-xs'>
        Upgrade <ArrowRight className='w-3 h-3' />
      </button>
    </div>
  )
}

export const Add = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState({ link: false, form: false, storefront: false, workshop: false });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [create] = useMutation(CREATE_LINK_IN_BIO);
  const navigate = useNavigate();

  const setSinglePage = (key) => setPage({ link: false, form: false, storefront: false, workshop: false, [key]: true });

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('bubble').upload(fileName, file);
    if (!error) {
      const { data: publicUrl } = supabase.storage.from('bubble').getPublicUrl(fileName);
      setUrl(publicUrl.publicUrl);
    }
    setUploading(false);
  };

  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: async (values) => {
      try {
        await create({ variables: { name: values.name, linkinbio: page.link, form: page.form, storefront: page.storefront, workshop: page.workshop, headerImage: url } });
        navigate('/dashboard');
      } catch (err) { console.error('Create error:', err); }
    },
  });

  const pageTypes = [
    { key: 'storefront', label: 'Storefront', desc: 'Sell products' },
    { key: 'workshop', label: 'Workshop', desc: 'Book services' },
    { key: 'form', label: 'Form', desc: 'Collect responses' },
    { key: 'link', label: 'Link-in-bio', desc: 'Share links' },
  ];

  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="flex items-center h-7 w-7 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors justify-center cursor-pointer">
        <PlusIcon className="w-3.5 h-3.5 text-zinc-700" />
      </div>
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <DialogPanel className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <h2 className='font-["Semibold"] text-zinc-950 text-lg tracking-tight'>New page</h2>
                <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>Create a page for your business.</p>
              </div>
              <input
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder="Page name"
                className='w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm font-["Medium"] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all'
              />
              <div className="grid grid-cols-2 gap-2">
                {pageTypes.map(({ key, label, desc }) => (
                  <button key={key} type="button" onClick={() => setSinglePage(key)}
                    className={`p-3 rounded-xl text-left transition-all border ${page[key] ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}>
                    <div className={`font-["Semibold"] text-xs ${page[key] ? 'text-white' : 'text-zinc-800'}`}>{label}</div>
                    <div className={`font-["Medium"] text-[10px] mt-0.5 ${page[key] ? 'text-zinc-400' : 'text-zinc-400'}`}>{desc}</div>
                  </button>
                ))}
              </div>
              <div>
                <label className='font-["Semibold"] text-xs text-zinc-500 uppercase tracking-wide block mb-2'>Page icon</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                />
                {file && (
                  <button type="button" onClick={handleUpload} disabled={uploading}
                    className="mt-2 w-full bg-zinc-100 text-zinc-700 py-2 rounded-xl text-sm font-['Semibold'] hover:bg-zinc-200 transition-colors">
                    {uploading ? 'Uploading...' : 'Upload icon'}
                  </button>
                )}
                {url && <img src={url} alt="Preview" className="w-12 h-12 rounded-xl mt-2 object-cover" />}
              </div>
              <button type="submit" className='w-full bg-zinc-950 text-white py-3 rounded-xl text-sm font-["Semibold"] hover:bg-zinc-800 transition-colors'>
                Create page
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

const Trend = ({ dir, val }) => {
  if (dir === 'flat') return (
    <div className='flex items-center gap-1 mt-1.5'>
      <Minus className='text-zinc-300 w-3 h-3' />
      <span className='text-[11px] font-["Semibold"] text-zinc-400'>{val.toFixed(1)}%</span>
      <span className='text-[11px] font-["Medium"] text-zinc-400'>vs yesterday</span>
    </div>
  );
  return (
    <div className={`inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded-md ${dir === 'up' ? 'bg-emerald-50' : 'bg-red-50'}`}>
      {dir === 'up'
        ? <TrendingUp className='text-emerald-500 w-3 h-3' />
        : <TrendingDown className='text-red-500 w-3 h-3' />
      }
      <span className={`text-[11px] font-["Semibold"] ${dir === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>{val.toFixed(1)}%</span>
      <span className='text-[11px] font-["Medium"] text-zinc-400'>vs yesterday</span>
    </div>
  );
};

export default function Default() {
  const { data, error, loading } = useQuery(ME_QUERY)
  const navigate = useNavigate()
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    if (data?.me?.Pages?.length > 0 && !selectedPage) setSelectedPage(data.me.Pages[0]);
  }, [data, selectedPage]);

  const getDateString = (date) => date.toISOString().split('T')[0];
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayStr = getDateString(today);
  const yesterdayStr = getDateString(yesterday);

  const revenueToday = data?.me?.Orders?.reduce((acc, o) => getDateString(new Date(o.createdAt)) === todayStr ? acc + o.amount : acc, 0) || 0;
  const revenueYesterday = data?.me?.Orders?.reduce((acc, o) => getDateString(new Date(o.createdAt)) === yesterdayStr ? acc + o.amount : acc, 0) || 0;
  const revenueChange = revenueYesterday === 0 ? 0 : ((revenueToday - revenueYesterday) / revenueYesterday) * 100;
  const revenueDirection = revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'flat';

  const ordersToday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === todayStr).length || 0;
  const ordersYesterday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === yesterdayStr).length || 0;
  const orderChange = ordersYesterday === 0 ? 0 : ((ordersToday - ordersYesterday) / ordersYesterday) * 100;
  const orderDirection = orderChange > 0 ? 'up' : orderChange < 0 ? 'down' : 'flat';
  const revenueAll = data?.me?.Payouts?.reduce((total, payout) => total + payout.amount, 0) || 0;

  const dateLabel = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (error) return <div>{error.message}</div>
  if (loading) return <div>loading...</div>

  const products = data?.me?.OnlyProducts ?? [];
  const services = data?.me?.Services ?? [];
  const allItems = [...products, ...services].slice(0, 5);

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
                  <Banner />

      <div className="flex flex-1 bg-[#F2F2F7] overflow-hidden">
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
        

        <NavBar home={true} products={false} workshop={selectedPage?.workshop} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="h-12 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl flex items-center justify-between px-5 shrink-0 gap-4">
            <div className='flex items-center gap-2 flex-1 max-w-xs'>
              <div className='flex-1 flex items-center gap-2 bg-zinc-100 rounded-xl px-3 h-8'>
                <Search className='w-3.5 h-3.5 text-zinc-400 shrink-0' />
                <span className='text-xs font-["Medium"] text-zinc-400'>Search anything...</span>
                <span className='ml-auto text-[10px] font-["Semibold"] text-zinc-300 bg-white rounded-md px-1.5 py-0.5 border border-zinc-200'>⌘K</span>
              </div>
            </div>
            <div className='flex items-center gap-2.5'>
              <span className='text-xs font-["Medium"] text-zinc-400'>{dateLabel}</span>
              <button className='w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors'>
                <Bell className='w-3.5 h-3.5 text-zinc-500' />
              </button>
              <div className='w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-xs font-["Semibold"]'>
                {data?.me?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5">
            {/* Page header */}
            <div className='flex items-center justify-between mb-5'>
              <div>
                <h1 className='font-["Semibold"] text-xl text-zinc-950 tracking-tight'>Dashboard</h1>
                <p className='font-["Medium"] text-zinc-400 text-sm mt-0.5'>
                  {selectedPage ? `cmhq.me/${selectedPage?.subdomain}` : 'Overview'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => navigate('/editor')}
                  className='h-8 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-["Semibold"] text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-1.5'
                >
                  <LayoutGrid className='w-3.5 h-3.5' /> Edit page
                </button>
                <button className='h-8 px-3 rounded-xl bg-zinc-950 text-white text-xs font-["Semibold"] hover:bg-zinc-800 transition-colors flex items-center gap-1.5'>
                  <Download className='w-3.5 h-3.5' /> Export
                </button>
              </div>
            </div>

            {/* 4 Stat cards */}
            <div className='grid grid-cols-4 gap-3 mb-4'>
              {[
                { label: 'Total bookings', value: data?.me?.Bookings?.length ?? 0, prefix: '', dir: 'flat', change: 0, iconColor: '#3B82F6', iconBg: '#EFF6FF' },
                { label: 'Revenue today', value: revenueToday.toFixed(0), prefix: '$', dir: revenueDirection, change: revenueChange, iconColor: '#10B981', iconBg: '#ECFDF5' },
                { label: 'Orders today', value: ordersToday, prefix: '', dir: orderDirection, change: orderChange, iconColor: '#F59E0B', iconBg: '#FFFBEB' },
                { label: 'Total revenue', value: revenueAll.toFixed(0), prefix: '$', dir: 'flat', change: 0, iconColor: '#EC4899', iconBg: '#FDF2F8' },
              ].map((stat, i) => (
                <div key={i} className='bg-white rounded-2xl p-4 border border-zinc-200/60 hover:shadow-sm transition-shadow'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>{stat.label}</div>
                    <div className='w-7 h-7 rounded-xl flex items-center justify-center' style={{ backgroundColor: stat.iconBg }}>
                      {i === 0 && <ShoppingBag className='w-3.5 h-3.5' style={{ color: stat.iconColor }} />}
                      {i === 1 && <BarChart2 className='w-3.5 h-3.5' style={{ color: stat.iconColor }} />}
                      {i === 2 && <Package className='w-3.5 h-3.5' style={{ color: stat.iconColor }} />}
                      {i === 3 && <TrendingUp className='w-3.5 h-3.5' style={{ color: stat.iconColor }} />}
                    </div>
                  </div>
                  <div className='text-3xl font-["Semibold"] text-zinc-950 tabular-nums tracking-tight'>
                    {stat.prefix}{Number(stat.value).toLocaleString()}
                  </div>
                  <Trend dir={stat.dir} val={stat.change} />
                </div>
              ))}
            </div>

            {/* Main two-column layout */}
            <div className='grid grid-cols-5 gap-4'>
              {/* Left column - 3/5 */}
              <div className='col-span-3 flex flex-col gap-4'>
                {/* Revenue chart */}
                <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                  <div className='flex items-center justify-between mb-1'>
                    <div className='font-["Semibold"] text-sm text-zinc-900'>Total Revenue</div>
                    <span className='text-xs font-["Medium"] text-zinc-400'>All time</span>
                  </div>
                  <div className='flex items-baseline gap-2 mb-4'>
                    <span className='text-3xl font-["Semibold"] text-zinc-950 tabular-nums'>${revenueAll.toLocaleString()}</span>
                    {revenueDirection !== 'flat' && (
                      <span className={`text-xs font-["Semibold"] ${revenueDirection === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {revenueDirection === 'up' ? '+' : ''}{revenueChange.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <SimpleChart total={revenueAll} payouts={data?.me?.Payouts} />
                </div>

                {/* Best Selling Products table */}
                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                  <div className='px-5 py-4 flex items-center justify-between border-b border-zinc-100'>
                    <div className='font-["Semibold"] text-sm text-zinc-900'>Best Selling Products</div>
                    <a href='/products' className='text-xs font-["Semibold"] text-zinc-400 hover:text-zinc-700 transition-colors flex items-center gap-1'>
                      View all <ChevronRight className='w-3 h-3' />
                    </a>
                  </div>
                  {allItems.length === 0 ? (
                    <div className='px-5 py-8 text-center'>
                      <div className='text-zinc-400 text-sm font-["Medium"]'>No products yet</div>
                      <button onClick={() => navigate('/products')} className='mt-3 text-xs font-["Semibold"] text-zinc-950 hover:underline'>
                        Add your first product →
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className='grid grid-cols-12 px-5 py-2 bg-zinc-50 border-b border-zinc-100'>
                        <div className='col-span-1 text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>#</div>
                        <div className='col-span-5 text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Name</div>
                        <div className='col-span-3 text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest'>Type</div>
                        <div className='col-span-3 text-[10px] font-["Semibold"] text-zinc-400 uppercase tracking-widest text-right'>Price</div>
                      </div>
                      {allItems.map((item, i) => (
                        <div key={item.id} className={`grid grid-cols-12 px-5 py-3 items-center hover:bg-zinc-50 transition-colors ${i < allItems.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                          <div className='col-span-1 text-xs font-["Semibold"] text-zinc-300'>#{String(i + 1).padStart(2, '0')}</div>
                          <div className='col-span-5 flex items-center gap-2.5'>
                            {item.thumbnail ? (
                              <img src={item.thumbnail} className='w-7 h-7 rounded-lg object-cover bg-zinc-100' />
                            ) : (
                              <div className='w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center'>
                                <Package className='w-3.5 h-3.5 text-zinc-300' />
                              </div>
                            )}
                            <span className='text-xs font-["Semibold"] text-zinc-800 truncate'>{item.title}</span>
                          </div>
                          <div className='col-span-3'>
                            <span className='text-[10px] font-["Semibold"] text-zinc-500 bg-zinc-100 rounded-md px-2 py-0.5'>
                              {item.serviceOrProduct === 'Service' ? 'Service' : item.type ?? 'Product'}
                            </span>
                          </div>
                          <div className='col-span-3 text-right text-xs font-["Semibold"] text-zinc-900'>${item.price}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - 2/5 */}
              <div className='col-span-2 flex flex-col gap-4'>
                {/* Setup checklist */}
                <div className='bg-white rounded-2xl border border-zinc-200/60 overflow-hidden'>
                  <div className='px-5 pt-5 pb-4'>
                    <div className='inline-flex items-center gap-1 bg-zinc-100 rounded-full px-2.5 py-1 text-[10px] font-["Semibold"] text-zinc-500 uppercase tracking-widest mb-3'>Setup</div>
                    <h2 className="text-sm font-['Semibold'] text-zinc-950 leading-snug">Get your page live</h2>
                    <p className="text-zinc-400 font-['Medium'] mt-1 text-xs leading-relaxed">
                      Complete these steps to start selling.
                    </p>
                  </div>
                  <div className='px-5 pb-5 space-y-2.5'>
                    {[
                      { done: !!selectedPage?.headerImage, label: 'Add page icon' },
                      selectedPage?.storefront ? { done: data?.me?.OnlyProducts?.length > 0, label: 'Add a product' } : null,
                      selectedPage?.workshop ? { done: data?.me?.Services?.length > 0, label: 'Add a service' } : null,
                      selectedPage?.linkinbio ? { done: selectedPage?.links?.length > 0, label: 'Add a link' } : null,
                      { done: selectedPage?.published === true, label: 'Publish page' },
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} className='flex items-center gap-2.5'>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-emerald-500' : 'bg-zinc-100'}`}>
                          <RiCheckFill className={`w-2.5 h-2.5 ${item.done ? 'text-white' : 'text-zinc-300'}`} />
                        </div>
                        <span className={`font-["Medium"] text-xs ${item.done ? 'text-zinc-300 line-through' : 'text-zinc-600'}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className='px-5 pb-5'>
                    <button
                      onClick={() => navigate('/editor')}
                      className='w-full bg-zinc-950 py-2.5 rounded-xl text-white font-["Semibold"] text-xs hover:bg-zinc-800 transition-colors'
                    >
                      Edit page
                    </button>
                  </div>
                </div>

                {/* Quick stats widget */}
                <div className='bg-white rounded-2xl border border-zinc-200/60 p-5'>
                  <div className='font-["Semibold"] text-sm text-zinc-900 mb-4'>Activity</div>
                  <div className='space-y-4'>
                    {[
                      { label: 'Products', value: data?.me?.OnlyProducts?.length ?? 0, max: 10, color: '#3B82F6' },
                      { label: 'Services', value: data?.me?.Services?.length ?? 0, max: 10, color: '#8B5CF6' },
                      { label: 'Orders', value: data?.me?.Orders?.length ?? 0, max: Math.max(data?.me?.Orders?.length ?? 1, 1), color: '#10B981' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className='flex items-center justify-between mb-1.5'>
                          <span className='text-xs font-["Semibold"] text-zinc-600'>{item.label}</span>
                          <span className='text-xs font-["Semibold"] text-zinc-950 tabular-nums'>{item.value}</span>
                        </div>
                        <div className='h-1.5 bg-zinc-100 rounded-full overflow-hidden'>
                          <div
                            className='h-full rounded-full transition-all duration-500'
                            style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Page info */}
                <div className='bg-zinc-950 rounded-2xl p-5 text-white'>
                  <div className='flex items-center gap-3 mb-4'>
                    <img
                      src={selectedPage?.headerImage ?? logo}
                      className='w-10 h-10 rounded-xl object-cover bg-zinc-800'
                    />
                    <div>
                      <div className='font-["Semibold"] text-sm'>{selectedPage?.name ?? 'Your page'}</div>
                      <div className='text-zinc-500 text-xs font-["Medium"]'>cmhq.me/{selectedPage?.subdomain}</div>
                    </div>
                  </div>
                  <p className='text-zinc-400 font-["Medium"] text-xs leading-relaxed mb-4'>
                    Upgrade to Plus for custom domains, advanced analytics, and no transaction fees.
                  </p>
                  <button className='w-full bg-white text-zinc-950 py-2.5 rounded-xl text-xs font-["Semibold"] hover:bg-zinc-100 transition-colors'>
                    Upgrade to Plus
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
