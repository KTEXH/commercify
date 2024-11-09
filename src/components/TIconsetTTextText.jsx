export default function TIconsetTTextText({
  className = "",
  container1 = "",
  attr1 = "/assets/BugBeetle.svg",
  container2 = "",
  text = "Just now",
  container3 = "",
  text1 = "You have a bug that needs to be fixed.",
}) {
  return (
    <div
      className={`flex items-start justify-center gap-x-2 text-left ${className}`}
    >
      <div
        className={`flex h-6 w-6 flex-shrink-0 flex-col items-center justify-center rounded-lg p-1 ${container1}`}
      >
        <img
          className="h-4 w-4 flex-shrink-0"
          src={attr1}
          loading="lazy"
         />
      </div>
      <div className="flex-grow [max-width:192px]">
        <div className={`${container2}`}>{text}</div>
        <div className={`${container3}`}>{text1}</div>
      </div>
    </div>
  );
}
