export default function Card({
  className = "",
  container1 = "",
  text = "Views",
  container2 = "",
  text1 = "721K",
  attr1 = "/assets/IconSet22.svg",
  text2 = "+11.01%",
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center gap-y-2 w-full border rounded-2xl p-6 text-left ${container1} ${className}`}
    >
      <div className="self-stretch text-sm font-['Semibold'] leading-5">
        {text}
      </div>
      <div className={`flex items-center justify-center ${container2}`}>
        <div className="text-2xl font-['Semibold'] leading-9">{text1}</div>
        <div className="flex items-center justify-center gap-x-1">
          <div className="text-xs font-['Semibold'] leading-[18px]">{text2}</div>
          <img
            className="h-4 w-4 flex-shrink-0"
            src={attr1}
            loading="lazy"
           />
        </div>
      </div>
    </div>
  );
}
