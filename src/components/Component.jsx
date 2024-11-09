export default function Component({
  className = "",
  container1 = "",
  container2 = "",
  container3 = "",
  container4 = "",
  text = "😍",
}) {
  return (
    <div className={`flex text-left ${container1} ${className}`}>
      <div className={`flex ${container2}`}>
        <div className={`${container3}`}>
          <div className={`${container4}`}>{text}</div>
        </div>
      </div>
    </div>
  );
}
