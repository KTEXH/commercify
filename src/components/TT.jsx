export default function TT({
  className = "",
  container1 = "",
  container2 = "",
  container3 = "",
  text = "Ready to transform your digital dresence? Let's create magic together! book our services now!",
  container4 = "",
  text1 = "Book Call",
}) {
  return (
    <div
      className={`flex flex-col justify-end text-left ${container1} ${className}`}
    >
      <div className={`${container2}`}>
        <div className={`flex items-start self-stretch ${container3}`}>
          <p>{text}</p>
        </div>
        <div
          className={`px-12 py-4 text-center text-2xl leading-[normal] ${container4}`}
        >
          {text1}
        </div>
      </div>
    </div>
  );
}
