import React from "react";
import { ME_QUERY } from "../Data/Me";
import { useQuery } from "@apollo/client";

export const Notifications = () => {

    const { data, error, loading } = useQuery(ME_QUERY)

    if(error) return <div>{error.message}</div>
    if(loading) return <div>loading...</div>
    return (
      <div className="flex flex-col items-start  gap-y-2 border-l border-solid w-72 border-neutral-900/10 px-6 pt-7 text-sm leading-5 text-neutral-900" >
        <div>
        <div className="self-stretch font-semibold">
          Notifications
        </div>
        <div className="flex flex-col h-full w-full gap-y-4 pt-3" >
          {data.me.Notifications.length === 0 ? (
            <div class='font-["Bold"] w-full gap-2 flex flex-col items-center justify-center border h-full rounded-xl'>
              <div class='bg-sky-100 w-10 h-10 rounded-full flex items-center justify-center'>
                <img
                  className="h-5 w-5 flex-shrink-0"
                  src="/assets/BellSlash.svg"
                  loading="lazy"
                />
              </div>
              <div class='text-xs font-["Semibold"]'>No Notifications</div>
            </div>
          ) : (
            <div class='h-full flex flex-col gap-3 justify-between'>
              {data.me.Notifications.map(item => (
                <div class='flex items-center gap-2'>
                  <div>
                    <div class={`${item.message === "You've been booked" && 'bg-pink-100'} ${item.message === "You've made a sale" && 'bg-slate-100'} ${item.message === "Booking alert: You've been booked by a customer!" && 'bg-red-100'} flex font-["Semibold"] items-center justify-center w-9 h-9 rounded-full`}>
                      {item.message === "You've been booked" ? (<img src='/assets/Calendar.svg' class='w-4 h-4' />) : (<img src='/assets/CreditCard.svg' class='w-4 h-4' />)}
                    </div>
                  </div>
                  <div>
                    <label class='text-[11px] leading-[11px] font-["Semibold"] line-clamp-1'>{item.type}</label>
                    <div class='text-[11px] font-["Medium"] text-gray-400 line-clamp-1'>{item.message}</div>
                  </div>
                  <div>
                  </div>
                </div>
              ))}
              <div class='w-full flex justify-center items-center'>
                <div class='border text-[10px] px-3 py-1 font-["Semibold"] rounded-full'>See All</div>
              </div>
            </div>
          )}


        </div>
        </div>
        <div>
        <div className="self-stretch pt-7 w-[152px]">
          <div className="font-semibold">Activities</div>
        </div>
        <div className="flex flex-col h-full w-full pt-3" >
          {data.me.Activity.length === 0 ? (
            <div class='font-["Bold"] w-full gap-2 flex flex-col items-center justify-center border h-full rounded-xl'>
              <div class='bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center'>
                <img
                  className="h-5 w-5 flex-shrink-0"
                  src="/assets/Heartbeat.svg"
                  loading="lazy"
                />
              </div>
              <div class='text-xs font-["Semibold"]'>No Recent Activity</div>
            </div>
          ) : (
            <div class='h-full flex flex-col gap-3'>
              {data.me.Activity.map(item => (
                <div class='flex items-center gap-2'>
                  <div>
                    <div class='bg-sky-100 flex font-["Semibold"] items-center justify-center w-9 h-9 rounded-full'>
                      {item.type.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <label class='text-[11px] leading-[11px] font-["Semibold"] line-clamp-1'>{item.type}</label>
                    <div class='text-[11px] font-["Medium"] text-gray-400 line-clamp-1'>{item.message}</div>
                  </div>
                  <div>
                  </div>
                </div>
              ))}
              <div class='w-full flex justify-center items-center'>
                <div class='border text-[10px] px-3 py-1 font-["Semibold"] rounded-full'>See All</div>
              </div>
            </div>
          )}

        </div>
        </div>

       
      </div>
    )
  }