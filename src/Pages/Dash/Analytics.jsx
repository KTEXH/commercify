import { NavBar } from '../../components/NavBar'
import { ME_QUERY } from '../../Data/Me'
import { Header } from '../../components/Header'
import { useQuery } from '@apollo/client'
import Card from '../../components/Card'
import SimpleChart from '../../components/Graphs/AnalyricsGraph'
export const Analytics = ({ className = "" }) => {

    const { data, error, loading } = useQuery(ME_QUERY)

    if (error) return <div>{error.message}</div>
    if (loading) return <div>Loading..</div>
    return (
        <div
            className={`flex w-full items-start h-full self-stretch flex-col rounded-3xl ${className}`}
        >
            <div className="h-full w-full flex-shrink-0 overflow-clip rounded-3xl bg-white" >
                <div className="font-general-sans flex flex  flex-shrink-0  tracking-[0px] " >
                    <NavBar home={false} pagesNav={false} pages={false} analytics={true} orders={false} bookings={false} products={false} />
                    <div className="flex flex-col gap-y-5 w-full self-stretch">
                        <Header />
                        <div className="flex items-end self-stretch px-9 pt-3">
                            <div className="flex items-center justify-center gap-x-1">
                                <div className="text-sm font-semibold leading-5 text-neutral-900" >
                                    Analytics
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
                                <div class='w-full flex flex-col'>
                                    <label class='text-black font-["Semibold"] text-xs'>Earnings</label>
                                </div>
                                <div class='w-full flex flex-col'>
                                    <label class='text-black font-["Semibold"] text-xs'>Earnings</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}