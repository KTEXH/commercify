export default function T({
  className = "",
  container1 = "",
  attr1 = "/assets/IconSet10.svg",
  attr2 = "/assets/IconSet11.svg",
  attr3 = "/assets/IconSet12.svg",
  attr4 = "/assets/IconSet13.svg",
  container2 = "",
  attr5 = "/assets/IconSet14.svg",
  container3 = "",
  container4 = "",
  container5 = "",
  container6 = "",
}) {
  return (
    <div className={`text-left ${container1} ${className}`}>
      <img className={`${container2}`} src={attr1} loading="lazy" />
      <div className="flex flex-col items-center justify-end pt-40">
        <img className={`${container3}`} src={attr5} loading="lazy" />
      </div>
      <img className={`${container4}`} src={attr2} loading="lazy" />
      <img className={`${container5}`} src={attr3} loading="lazy" />
      <img className={`${container6}`} src={attr4} loading="lazy" />
    </div>
  );
}
