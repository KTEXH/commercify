import Vector3 from "./assets/Vector3";
import MaterialSymbolsAddCircleRounded from "./assets/MaterialSymbolsAddCircleRounded";
export default function TVector({
  className = "",
  container1 = "",
  text = "How do i sign up for the project?",
}) {
  return (
    <div
      className={`flex flex-col items-center gap-y-8 self-stretch text-left [max-width:616px] ${className}`}
    >
      <Vector3 className="h-px flex-shrink-0 self-stretch" />
      <div
        className={`flex flex-wrap items-center justify-center gap-y-3 pl-2.5 min-[1430px]:flex-nowrap ${container1}`}
      >
        <div>{text}</div>
        <MaterialSymbolsAddCircleRounded className="h-6 w-6 flex-shrink-0" />
      </div>
    </div>
  );
}
