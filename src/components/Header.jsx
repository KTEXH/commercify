import React from "react"
import { gql, useQuery } from "@apollo/client"
import { ME_QUERY } from "../Data/Me"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
export const Header = () => {

    const { data, error, loading } = useQuery(ME_QUERY)

    if(loading) return <div>loading...</div>
    if(error) return <div>{error.message}</div>
    return(
        <div className="flex w-full self-stretch justify-between gap-y-3.5 border-b border-solid border-neutral-900/10 px-7 pb-[15px] pt-5 text-sm leading-5" >
        <div className="flex items-center gap-x-2">
          <img
            className="h-7 w-7 flex-shrink-0"
            src="/assets/Button.svg"
            loading="lazy"
          />
          <img
            className="h-7 w-7 flex-shrink-0"
            src="/assets/Button1.svg"
            loading="lazy"
          />
          <div className="pl-2 font-['Semibold'] text-neutral-900/40">Dashboards</div>
          <div className="pl-1 text-neutral-900/20"></div>
          <div className="pl-1 font-['Semibold'] text-neutral-900">Default</div>
        </div>
        <div className="flex items-center justify-center gap-x-5">
          <div className="flex items-center gap-x-2 w-52 rounded-full bg-neutral-900/5 px-4 py-2 text-neutral-900/20" >
            <MagnifyingGlassIcon class='w-4 h-4 text-gray-400' />
            <div className="w-24 flex-shrink-0 font-['Medium']">Search</div>
           
          </div>
          <div className="flex items-center justify-center gap-x-2">
  
            <img
              className="h-7 w-7 flex-shrink-0"
              src="/assets/Button3.svg"
              loading="lazy"
            />
            <img
              className="h-7 w-7 flex-shrink-0"
              src="/assets/Button4.svg"
              loading="lazy"
            />
       
            {data.me.avatar === null ? (
              <div class='justify-center flex capitalize font-["Semibold"] items-center h-7 w-7 rounded-full bg-sky-100'>
                {data?.me?.name.charAt(0)}
              </div>
            ) : (
              <img
              />
            )}

          </div>
        </div>
      </div>
    )
}