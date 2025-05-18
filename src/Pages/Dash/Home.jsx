import { useState, useEffect } from "react";
import { Bell, User, TrendingUp, ArrowRight, TrendingDown, Minus } from "lucide-react";
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
import { createClient } from "@supabase/supabase-js";
import SimpleChart from "../../components/Graphs/DailyPayout";
import Group from "../../components/assets/Group";


const supabase = createClient(
  'https://hrvpmllpyogxsgxcwrcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydnBtbGxweW9neHNneGN3cmNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjM5OTgwNywiZXhwIjoyMDU3OTc1ODA3fQ.Li3A-TLcPvQukSagJilD1D9rGuioodkursddKkYufYk'
);

export const Banner = () => {
  return (
    <div className="h-16 px-4 w-full justify-between align-center flex pt-2 bg-black z-10 relative">
      <Group className='w-8 h-8' />
      <div class='text-center text-sm flex mt-2 font-["Medium"] text-white'>Try Test Pro at 50% off — exclusive beta offer.</div>
      <button class='bg-white rounded-full h-7 mt-[2px] px-3 gap-2 flex items-center font-["Semibold"] text-xs'>Upgrade
        <ArrowRight class='w-3 h-3' />
      </button>
    </div>
  )
}

export const Add = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState({
    link: false,
    form: false,
    storefront: false,
    workshop: false,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const [create] = useMutation(CREATE_LINK_IN_BIO);
  const navigate = useNavigate();

  const setSinglePage = (key) => {
    setPage({
      link: false,
      form: false,
      storefront: false,
      workshop: false,
      [key]: true,
    });
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('bubble')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error.message);
    } else {
      const { data: publicUrl } = supabase.storage
        .from('bubble')
        .getPublicUrl(fileName);
      setUrl(publicUrl.publicUrl);
    }

    setUploading(false);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        await create({
          variables: {
            name: values.name,
            linkinbio: page.link,
            form: page.form,
            storefront: page.storefront,
            workshop: page.workshop,
            headerImage: url,
          },
        });
        navigate('/dashboard');
      } catch (err) {
        console.error('Create error:', err);
      }
    },
  });

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center h-8 w-8 rounded-full shadow-sm border justify-center cursor-pointer"
      >
        <PlusIcon className="w-4 h-4 text-black" />
      </div>

      <Dialog open={isOpen} as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="p-4 w-full max-w-md">
            <DialogPanel className="bg-white border p-6 rounded-xl shadow-xl">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Name your page</h2>
                  <p className="text-sm text-gray-500">Give your page a name before you publish.</p>
                </div>

                <input
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder="Name..."
                  className="w-full border px-4 py-2 rounded-lg text-sm"
                />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSinglePage('form')}
                    className={`py-2 rounded-lg text-white ${page.form ? 'bg-blue-700' : 'bg-black'}`}
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setSinglePage('storefront')}
                    className={`py-2 rounded-lg text-white ${page.storefront ? 'bg-blue-700' : 'bg-black'}`}
                  >
                    Storefront
                  </button>
                  <button
                    type="button"
                    onClick={() => setSinglePage('workshop')}
                    className={`py-2 rounded-lg text-white ${page.workshop ? 'bg-blue-700' : 'bg-black'}`}
                  >
                    Workshop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSinglePage('link')}
                    className={`py-2 rounded-lg text-white ${page.link ? 'bg-blue-700' : 'bg-black'}`}
                  >
                    Link-in-bio
                  </button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>

                {url && (
                  <img src={url} alt="Uploaded preview" className="w-full rounded-lg mt-2" />
                )}

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold"
                >
                  Publish
                </button>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default function Default() {
  const { data, error, loading } = useQuery(ME_QUERY)
  const [showBanner, setShowBanner] = useState(true);

  const navigate = useNavigate()
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    if (data?.me?.Pages?.length > 0 && !selectedPage) {
      setSelectedPage(data.me.Pages[0]); // Set first page as default
    }
  }, [data, selectedPage]);

  const getDateString = (date) => date.toISOString().split('T')[0];

  // Today & Yesterday dates
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = getDateString(today);
  const yesterdayStr = getDateString(yesterday);
  // Revenue from orders (assumes each order has `amount`)
  const revenueToday = data?.me?.Orders?.reduce((acc, o) => {
    return getDateString(new Date(o.createdAt)) === todayStr ? acc + o.amount : acc;
  }, 0) || 0;

  const revenueYesterday = data?.me?.Orders?.reduce((acc, o) => {
    return getDateString(new Date(o.createdAt)) === yesterdayStr ? acc + o.amount : acc;
  }, 0) || 0;

  const revenueChange = revenueYesterday === 0 ? 0 : ((revenueToday - revenueYesterday) / revenueYesterday) * 100;
  const revenueDirection = revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'flat';

  const ordersToday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === todayStr).length || 0;
  const ordersYesterday = data?.me?.Orders?.filter(o => getDateString(new Date(o.createdAt)) === yesterdayStr).length || 0;

  const orderChange = ordersYesterday === 0 ? 0 : ((ordersToday - ordersYesterday) / ordersYesterday) * 100;
  const orderDirection = orderChange > 0 ? 'up' : orderChange < 0 ? 'down' : 'flat';

  const revenueAll = data?.me?.Payouts?.reduce((total, payout) => total + payout.amount, 0) || 0;


  if (error) return <div>{error.message}</div>
  if (loading) return <div>loading...</div>
  return (
    <div>
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
          <Add />
        </div>
        <NavBar home={true} products={false} workshop={selectedPage?.workshop} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

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
          <main className="flex-1 overflow-y-auto py-2 px-16">
            <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Dashboard</div>
            <div class='flex w-full h-96 border bg-white shadow-sm rounded-xl items-center'>
              <div className="p-16 w-2/3">
                <h1 className="text-4xl font-['Semibold']">Welcome, let’s get your page up and running</h1>
                <p className="text-gray-600 font-['Medium'] mt-2">
                  We’ll have you up and running creating an audience for your product in minutes.
                </p>
                <button className="bg-black mt-5 px-6 py-3 rounded-full text-white font-['Semibold']" onClick={() => navigate('/editor')}>Edit your page</button>
              </div>


              {/* Page Checklist */}
              <div class='border-l h-full flex items-center justify-center flex-col w-1/3'>
                <div>
                  <h2 className="font-['Semibold'] mb-4">Page checklist</h2>
                  <ul className="space-y-4">

                    <div class='flex items-center gap-2'>
                      <div class={`${selectedPage?.headerImage === "" ? 'bg-gray-200' : 'bg-green-500'} rounded-full flex items-center justify-center w-7 h-7`}><RiCheckFill className='w-4 h-4 text-white' /></div>
                      <div class='font-["Medium"]  text-gray-400 text-sm'>Add your product icon</div>
                    </div>
                    <div>
                      {selectedPage?.storefront && (
                        <div class='flex items-center gap-2'>
                          <div class={`${data?.me?.OnlyProducts.length === 0 ? 'bg-gray-200' : 'bg-green-500'} rounded-full flex items-center justify-center w-7 h-7`}><RiCheckFill className='w-4 h-4 text-white' /></div>
                          <div class='font-["Medium"] text-gray-400 text-sm'>Add a product</div>
                        </div>
                      )}

                      {selectedPage?.workshop && (
                        <div class='flex items-center gap-2'>
                          <div class={`${data?.me?.Services.length === 0 ? 'bg-gray-200' : 'bg-green-500'} rounded-full flex items-center justify-center w-7 h-7`}><RiCheckFill className='w-4 h-4 text-white' /></div>
                          <div class='font-["Medium"] text-gray-400 text-sm'>Add a service</div>
                        </div>
                      )}
                      {selectedPage?.linkinbio && (
                        <div class='flex items-center gap-2'>
                          <div class={`${data?.me?.Links.length === 0 ? 'bg-gray-200' : 'bg-green-500'} rounded-full flex items-center justify-center w-7 h-7`}><RiCheckFill className='w-4 h-4 text-white' /></div>
                          <div class='font-["Medium"] text-gray-400 text-sm'>Add a link</div>
                        </div>
                      )}
                    </div>
                    <div class='flex items-center gap-2'>
                      <div class={`rounded-full ${selectedPage?.published === true ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center w-7 h-7`}><RiCheckFill className='w-4 h-4 text-white' /></div>
                      <div class='font-["Medium"] text-gray-400 text-sm'>Publish your page</div>
                    </div>


                  </ul>
                </div>
              </div>

            </div>
            <div className='mt-2 grid grid-cols-3 mt-6 gap-5'>
              <div className='border p-5 bg-white rounded-3xl shadow-sm'>
                <div className='text-xs text-gray-400 font-["Medium"]'>All of bookings</div>
                <div className='text-4xl font-["Semibold"]'>{data?.me?.Bookings.length}</div>

              </div>

              {/* Revenue Today */}
              {/* Revenue Today */}
              <div className='border p-5 bg-white rounded-3xl shadow-sm'>
                <div className='text-xs text-gray-400 font-["Medium"]'>Revenue today</div>
                <div className='text-4xl font-["Semibold"]'>${revenueToday.toFixed(2)}</div>
                <div className='flex items-center text-sm mt-2 gap-2 font-["Medium"]'>
                  {revenueDirection === 'up' && <TrendingUp className='text-green-500 w-4 h-4' />}
                  {revenueDirection === 'down' && <TrendingDown className='text-red-500 w-4 h-4' />}
                  {revenueDirection === 'flat' && <Minus className='text-gray-400 w-4 h-4' />}
                  <div className={`flex font-["Semibold"] items-center gap-1 ${revenueDirection === 'up' ? 'text-green-500' : revenueDirection === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                    {revenueChange.toFixed(1)}%
                    <div className='text-gray-300'>from yesterday</div>
                  </div>
                </div>
              </div>

              {/* Number of Orders */}
              <div className='border p-5 bg-white rounded-3xl shadow-sm'>
                <div className='text-xs text-gray-400 font-["Medium"]'>Number of orders</div>
                <div className='text-4xl font-["Semibold"]'>{ordersToday}</div>
                <div className='flex items-center text-sm mt-2 gap-2 font-["Medium"]'>
                  {orderDirection === 'up' && <TrendingUp className='text-green-500 w-4 h-4' />}
                  {orderDirection === 'down' && <TrendingDown className='text-red-500 w-4 h-4' />}
                  {orderDirection === 'flat' && <Minus className='text-gray-400 w-4 h-4' />}
                  <div className={`flex font-["Semibold"] items-center gap-1 ${orderDirection === 'up' ? 'text-green-500' : orderDirection === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                    {orderChange.toFixed(1)}%
                    <div className='text-gray-300'>from yesterday</div>
                  </div>
                </div>
              </div>

            </div>
            <SimpleChart total={revenueAll} />
          </main>

          {/* Cookie Policy Notice */}

        </div>
      </div>
    </div>
  );
}
