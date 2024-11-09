export default function TT({
  className = "",
  attr1 = "/assets/d.png",
  container1 = "",
  text = "You have a bug that needs to be fixed.",
  text1 = "Just now",
}) {
  return (
    <div
      className={`flex items-start justify-center gap-x-2 text-left ${className}`}
    >
      <div className="flex flex-col items-center gap-y-2">
        <img
          className="h-6 w-6 flex-shrink-0 rounded-full object-cover object-center"
          src={attr1}
          loading="lazy"
         />
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center pl-px">
            <div className="h-3.5 w-px flex-shrink-0 bg-neutral-900/10" />
          </div>
        </div>
      </div>
      <div className="flex-grow [max-width:192px]">
        <div className={`line-clamp-[1] overflow-ellipsis ${container1}`}>
          {text}
        </div>
        <div className="self-stretch text-xs leading-[18px] text-neutral-900/40" >
          {text1}
        </div>
      </div>
    </div>
  );
}
