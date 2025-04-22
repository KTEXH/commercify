import { useState, useEffect } from "react";
import { CheckCircle, Bell, User, Check, TrendingUp } from "lucide-react";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { RiCheckFill } from "@remixicon/react";
import logo from '../../components/assets/logo.svg'
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import { NavBar } from "../../components/NavBar";
export default function Default() {
  const { data, error, loading } = useQuery(ME_QUERY)
  const [showBanner, setShowBanner] = useState(true);

  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    if (data?.me?.Pages?.length > 0 && !selectedPage) {
      setSelectedPage(data.me.Pages[0]); // Set first page as default
    }
  }, [data, selectedPage]);

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
      <NavBar home={true} products={false} storefront={selectedPage?.storefront} />

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
          <div class='mt-7 font-["Semibold"] mb-3 text-3xl'>Dashboard</div>
          <div class='flex w-full h-96 border bg-white shadow-sm rounded-xl items-center'>
            <div className="p-16 w-2/3">
              <h1 className="text-4xl font-['Semibold']">Welcome, let’s get your page up and running</h1>
              <p className="text-gray-600 font-['Medium'] mt-2">
                We’ll have you up and running creating an audience for your product in minutes.
              </p>
              <button className="bg-black mt-5 px-6 py-3 rounded-full text-white font-['Semibold']" onClick={() => setShowBanner(false)}>Edit your page</button>
            </div>


            {/* Page Checklist */}
            <div class='border-l h-full flex items-center justify-center flex-col w-1/3'>
              <div>
                <h2 className="font-['Semibold'] mb-4">Page checklist</h2>
                <ul className="space-y-4">
                  <div class='flex items-center gap-2'>
                    <div class='bg-gray-200 rounded-full flex items-center justify-center w-7 h-7'><RiCheckFill className='w-4 h-4 text-white' /></div>
                    <div class='font-["Medium"] text-gray-400 text-sm'>Publish your page</div>
                  </div>
                  <div class='flex items-center gap-2'>
                    <div class='bg-gray-200 rounded-full flex items-center justify-center w-7 h-7'><RiCheckFill className='w-4 h-4 text-white' /></div>
                    <div class='font-["Medium"] text-gray-400 text-sm'>Add your product icon</div>
                  </div>
                  <div class='flex items-center gap-2'>
                    <div class='bg-gray-200 rounded-full flex items-center justify-center w-7 h-7'><RiCheckFill className='w-4 h-4 text-white' /></div>
                    <div class='font-["Medium"] text-gray-400 text-sm'>Add a product</div>
                  </div>
                  <div class='flex items-center gap-2'>
                    <div class='bg-gray-200 rounded-full flex items-center justify-center w-7 h-7'><RiCheckFill className='w-4 h-4 text-white' /></div>
                    <div class='font-["Medium"] text-gray-400 text-sm'>Publish your page</div>
                  </div>
                  <div class='flex items-center gap-2'>
                    <div class='bg-gray-200 rounded-full flex items-center justify-center w-7 h-7'><RiCheckFill className='w-4 h-4 text-white' /></div>
                    <div class='font-["Medium"] text-gray-400 text-sm'>Publish your page</div>
                  </div>


                </ul>
              </div>
            </div>

          </div>
          <div class='mt-10 grid grid-cols-4 gap-5'>
            <div class='border p-5 bg-white rounded-xl'>
              <div class='text-xs text-gray-400 font-["Medium"]'>Number of clicks</div>
              <div class='text-4xl font-["Semibold"]'>0</div>
              <div class='flex items-center text-sm mt-2 gap-2 text-green-500 font-["Medium"]'>
                <TrendingUp class='text-green-500 w-4 h-4' />
                <div class='flex items-center gap-1'>+0 <div class='text-gray-300'>from yesterday</div></div>
              </div>
            </div>
            <div class='border bg-white p-5 rounded-xl'>
              <div class='text-xs text-gray-400 font-["Medium"]'>Revenue today</div>
              <div class='text-4xl font-["Semibold"]'>$0</div>
              <div class='flex items-center text-sm mt-2 gap-2 text-green-500 font-["Medium"]'>
                <TrendingUp class='text-green-500 w-4 h-4' />
                <div class='flex items-center gap-1'>+0 <div class='text-gray-300'>from yesterday</div></div>
              </div>
            </div>
            <div class='border bg-white p-5 rounded-xl'>
              <div class='text-xs text-gray-400 font-["Medium"]'>Number of orders</div>
              <div class='text-4xl font-["Semibold"]'>{data.me.Payouts.length}</div>
              <div class='flex items-center text-sm mt-2 gap-2 text-green-500 font-["Medium"]'>
                <TrendingUp class='text-green-500 w-4 h-4' />
                <div class='flex items-center gap-1'>+0 <div class='text-gray-300'>from yesterday</div></div>
              </div>
            </div>
            <div class='border p-5 bg-white rounded-xl'>
              <div class='text-xs text-gray-400 font-["Medium"]'>Revenue in all</div>
              <div class='text-4xl font-["Semibold"]'>$0</div>
              <div class='flex items-center text-sm mt-2 gap-2 text-green-500 font-["Medium"]'>
                <TrendingUp class='text-green-500 w-4 h-4' />
                <div class='flex items-center gap-1'>+0 <div class='text-gray-300'>from yesterday</div></div>
              </div>
            </div>
          </div>
        </main>

        {/* Cookie Policy Notice */}

      </div>
    </div>
  );
}
