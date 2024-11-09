import Card from "../../components/Card";
import { useState } from "react";
import { ME_QUERY } from "../../Data/Me";
import { useQuery } from "@apollo/client";
import SimpleChart from "../../components/Graphs/PayoutGraph";
import moment from "moment";
import { NavBar } from "../../components/NavBar";
import { Notifications } from '../../components/Notifications'
import { Header } from "../../components/Header";
import Group from "../../components/assets/Group";
import Group2 from "../../components/assets/Group2";

export default function Default({ className = "" }) {

  const { data, error, loading } = useQuery(ME_QUERY)

  const [percentageWidth, setPercentage] = useState(0)



  const formattedDate = (item) => {
    const date = moment(item);  // Ensure `item` is a valid date or timestamp
    return date.fromNow();      // Returns the relative time like "X days ago"
  };


  if (loading) return <div class='w-full h-screen flex items-center justify-center'><Group className='w-20 h-20' /></div>
  if (error) return <div>{error.message}</div>

  return (
    <div
      className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
    >
      <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
        <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
          <NavBar home={true} pagesNav={false} orders={false} analytics={false} pages={false} bookings={false} products={false} />
          <div className="flex flex-col gap-y-5 w-full self-stretch">
            <Header />
            <div className="flex items-end self-stretch px-9 pt-3">
              <div className="flex items-center justify-center gap-x-1">
                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                  Home Dashboard
                </div>
                <img
                  className="h-4 w-4 flex-shrink-0"
                  src="/assets/IconSet21.svg"
                  loading="lazy"
                />
              </div>
            </div>
            <div class='w-full px-9'>
              <div className="flex w-full self-stretch gap-x-7 gap-y-7 text-neutral-900" >
                <Card
                  container1="bg-sky-100"
                  text="Clicks"
                  container2="gap-x-8"
                  text1="721K"
                  attr1="/assets/IconSet22.svg"
                  text2="+11.01%"
                />
                <Card
                  container1="bg-slate-200"
                  text="Orders"
                  container2="gap-x-8"
                  text1="367K"
                  attr1="/assets/IconSet23.svg"
                  text2="-0.03%"
                />
                <Card
                  container1="bg-sky-100"
                  text="Audience"
                  container2="gap-x-7"
                  text1="1,156"
                  attr1="/assets/IconSet24.svg"
                  text2="+15.03%"
                />
                <Card
                  container1="bg-slate-200"
                  text="Net"
                  container2="gap-x-7"
                  text1="239K"
                  attr1="/assets/IconSet25.svg"
                  text2="+6.08%"
                />
              </div>
              <div class='flex mt-2 gap-5'>
                <div class='w-full'>
                  <label class='text-black font-["Semibold"] text-xs'>Earnings</label>
                  <SimpleChart />
                </div>

              </div>
              <div class='flex mt-3 gap-3'>

                <div class='w-2/3'>
                  <label class='font-["Semibold"] text-xs' >Product List</label>
                  <div class='border p-4 rounded-lg mt-3'>
                    {data.me.OnlyProducts.map((item, index) => {
                      const productTitle = item.title;
                      const percentage = percentageWidth[productTitle] || 0;

                      return (
                        <div key={index}>
                          {/* Product Item */}
                          <div class='w-full  items-center flex'>
                            <div class='flex items-center w-[25%] gap-2'>
                              {!item.thumbnail ? (
                                <div class='bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-["Semibold"]'>
                                  {item.title.charAt(0)}
                                </div>
                              ) : (
                                <img />
                              )}
                              <div>
                                <label class='text-[10px] line-clamp-1 font-["Semibold"]'>{item.title}</label>
                              </div>
                            </div>
                            <div class='w-[10%]'>
                              <div class='px-3 py-1 rounded-full gap-1 inline-flex items-center border font-["Semibold"] text-[10px]'>
                                ${item.price}
                                <img class='w-3 h-3' src='/assets/Tag.svg' />
                              </div>
                            </div>
                       
                            <div class='w-[15%] flex items-center gap-1'>
                              <img class='w-4 h-4' src='/assets/CalendarBlank.svg' />
                              <div class='font-["Semibold"] line-clamp-1 text-[11px]'>{formattedDate(item.createdAt)}</div>
                            </div>
                        
                            <div class='w-[25%]'>
                              <div class='font-["Semibold"] px-3 py-1 bg-gray-100 inline-block text-gray-500 rounded-md capitalize text-[10px]'>{item.type}</div>
                            </div>
                            <div class='w-[15%] flex items-center gap-2'>
                              <div class='text-xs text-black font-["Semibold"]'>{percentage.toFixed(0)}%</div>
                              <div className="w-full bg-gray-100 h-1.5 overflow-hidden rounded-full relative">
                                <div className="bg-black h-1.5" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                            <div class='w-[5%] flex justify-end'>
                              <img src='/assets/DotsThree.svg' class='w-4 h-4' />
                            </div>
                          </div>

                          {/* Divider */}
                          {index !== data.me.OnlyProducts.length - 1 && (
                            <hr class="border-t" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div class='w-1/3'>
                  <div class='bg-black p-5 rounded-lg'>
                        <div class='flex flex-row items-center gap-2'>
                             <Group2 class='w-4 h-4'/>
                             <div class='font-["Semibold"] text-white'>Commercify</div>
                        </div>
                        <div class='text-2xl font-["Semibold"] text-white'>
                            Get more with premium. Get started!
                        </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
