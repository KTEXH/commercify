import Group from "./assets/Group";
import Component from "./Component";
import Ellipse from "./assets/Ellipse";
import { PopoverButton, Popover, PopoverGroup, PopoverPanel } from "@headlessui/react";
import CompanyLogo from "./assets/CompanyLogo";
import CompanyLogo1 from "./assets/CompanyLogo1";
import CompanyLogo2 from "./assets/CompanyLogo2";
import CompanyLogo3 from "./assets/CompanyLogo3";
import CompanyLogo4 from "./assets/CompanyLogo4";
import CompanyLogo5 from "./assets/CompanyLogo5";
import CompanyLogo6 from "./assets/CompanyLogo6";
import CompanyLogo7 from "./assets/CompanyLogo7";
import CompanyLogo8 from "./assets/CompanyLogo8";
import CompanyLogo9 from "./assets/CompanyLogo9";
import Vector from "./assets/Vector";
import HeroiconsSolidLightningBolt from "./assets/HeroiconsSolidLightningBolt";
import FluentChess20Filled from "./assets/FluentChess20Filled";
import FluentTargetArrow16Filled from "./assets/FluentTargetArrow16Filled";
import PhRulerFill from "./assets/PhRulerFill";
import BgEllipse from "./assets/BgEllipse";
import Ellipse1 from "./assets/Ellipse1";
import Ellipse2 from "./assets/Ellipse2";
import TT from "./TT";
import BiArrowLeftShort from "./assets/BiArrowLeftShort";
import BiArrowLeftShort1 from "./assets/BiArrowLeftShort1";
import Ellipse3 from "./assets/Ellipse3";
import Ellipse4 from "./assets/Ellipse4";
import Ellipse5 from "./assets/Ellipse5";
import Vector1 from "./assets/Vector1";
import Vector2 from "./assets/Vector2";
import TVector from "./TVector";
import Vector3 from "./assets/Vector3";
import Ellipse6 from "./assets/Ellipse6";
import Polygon from "./assets/Polygon";
import RiInstagramFill from "./assets/RiInstagramFill";
import BiTwitter from "./assets/BiTwitter";
import IcBaselineFacebook from "./assets/IcBaselineFacebook";
export default function LandingPage({ className = "" }) {
  return (
    <div
      className={`font-general-sans w-full bg-white font-medium tracking-[0px] ${className}`}
    >
      <div className="fixed top-3 bg-white w-full max-w-screen-2xl mx-auto" >

        <div className="flex flex-grow flex-wrap items-center max-w-screen-xl mx-auto justify-between gap-x-10 gap-y-[11px] capitalize leading-[normal] " >
          <div class='flex items-center gap-3'>
            <Group className="h-7 w-7 flex-shrink-0" />
            <div className="text-xl font-['Semibold'] leading-[normal] tracking-[-2px]" >
              Commercify
            </div>
          </div>
          <div className="flex flex-wrap items-center text-xs font-['Semibold'] justify-center gap-x-10 gap-y-[11px] min-[1430px]:flex-nowrap" >
            <div>How it Works</div>
            <Popover>
              <PopoverButton class='outline-0'>Products</PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className="max-w-screen-lg bg-white text-sm/6 transition duration-200 ease-in-out"
              >
                <div className="p-3">
                  <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Insights</p>
                    <p className="text-white/50">Measure actions your users take</p>
                  </a>
                  <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Automations</p>
                    <p className="text-white/50">Create your own targeted content</p>
                  </a>
                  <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Reports</p>
                    <p className="text-white/50">Keep track of your growth</p>
                  </a>
                </div>
                <div className="p-3">
                  <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Documentation</p>
                    <p className="text-white/50">Start integrating products and tools</p>
                  </a>
                </div>
              </PopoverPanel>
            </Popover>
            <div>FAQ</div>
            <div>Comany</div>
            <div>Pricing</div>
            <div>About Us</div>
          </div>
          <div class='flex items-center gap-6'>
            <a href='/login' class='text-sm'>
              Login
            </a>
          <a href='/register' className="rounded-full underline-none bg-black px-4 py-2 text-center text-sm leading-5 text-white" >
            Get started for free
          </a>
        </div>
        </div>
      </div>
      <div className="flex items-end mt-36 justify-center px-[121px] pt-20">
        <div className="z-0 flex flex-grow flex-col">


          <div className="z-[1] flex justify-center flex items-center h-0 flex-shrink-0 flex-col justify-end gap-y-7 " >
            <div className="text-7xl font-['Semibold'] text-center capitalize leading-[99px] tracking-[-4px]" >
              <span>
                <p>{"Simplify E-commerce"}</p>
                <p>With One Platform</p>
              </span>
            </div>
            <div className="w-[508px] text-lg leading-8 text-black/60">
              We care about our work and we care about our clients.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end pt-32">
        <div className="flex flex-col gap-y-24 bg-neutral-50 px-[120px] pb-[135px] pt-20" >
          <div className="text-center text-4xl capitalize leading-[normal] tracking-[-1px]" >
            Companies we Work with
          </div>
          <div className="flex flex-col gap-y-24">
            <div className="flex flex-wrap items-center justify-between gap-x-9 gap-y-6 min-[1430px]:flex-nowrap" >
              <CompanyLogo className="h-12 w-36 flex-shrink-0" />
              <CompanyLogo1 className="h-12 w-28 flex-shrink-0" />
              <CompanyLogo2 className="h-12 w-[72px] flex-shrink-0" />
              <CompanyLogo3 className="h-12 w-40 flex-shrink-0" />
              <CompanyLogo4 className="h-12 w-32 flex-shrink-0" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6 min-[1430px]:flex-nowrap" >
              <CompanyLogo5 className="h-12 w-40 flex-shrink-0" />
              <CompanyLogo6 className="h-12 w-32 flex-shrink-0" />
              <CompanyLogo7 className="h-12 w-36 flex-shrink-0" />
              <CompanyLogo8 className="h-12 w-28 flex-shrink-0" />
              <CompanyLogo9 className="h-12 w-32 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}
