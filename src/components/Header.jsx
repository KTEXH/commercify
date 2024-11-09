import React from "react"
import { gql, useQuery } from "@apollo/client"
import { ME_QUERY } from "../Data/Me"
export const Header = () => {

    const { data, error, loading } = useQuery(ME_QUERY)

    if(loading) return <div>loading...</div>
    if(error) return <div>{error.message}</div>
    return(
        <div className="flex w-full self-stretch justify-between gap-y-3.5 border-b border-solid border-neutral-900/10 px-7 pb-[19px] pt-5 text-sm leading-5" >
        <div className="flex gap-x-2">
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
          <div className="pl-2 font-['Medium'] text-neutral-900/40">Dashboards</div>
          <div className="pl-1 text-neutral-900/20">/</div>
          <div className="pl-1 font-['Medium'] text-neutral-900">Default</div>
        </div>
        <div className="flex items-center justify-center gap-x-5">
          <div className="flex items-center justify-center gap-x-1 rounded-lg bg-neutral-900/5 px-2 py-1 text-neutral-900/20" >
            <img
              className="h-4 w-4 flex-shrink-0"
              src="/assets/IconSet20.svg"
              loading="lazy"
            />
            <div className="w-24 flex-shrink-0">Search</div>
            <div className="flex items-center justify-end pl-1">
              <div className="h-5 w-5 flex-shrink-0">⌘/</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <img
              className="h-7 w-7 flex-shrink-0"
              src="/assets/Button2.svg"
              loading="lazy"
            />
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
            <img
              className="h-7 w-7 flex-shrink-0"
              src="/assets/Button5.svg"
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