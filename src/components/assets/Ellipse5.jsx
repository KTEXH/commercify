export default function Ellipse5({ className = "" }) {
  return (
    <div className={`${className}`}>
      <svg width="100%" height="100%" style={{"overflow":"visible"}} preserveAspectRatio="none" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <circle cx="42.5" cy="42.5" r="42.5" fill="#D9D9D9"/>
      <circle cx="42.5" cy="42.5" r="42.5" fill="url(#pattern-1:778-0_1_778)"/>
      <defs>
      <pattern id="pattern-1:778-0_1_778" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image0_1_778" transform="translate(0 -0.25) scale(0.003125)"/>
      </pattern>
      <image id="image0_1_778" width="320" height="480" xlinkHref="/assets/ellipse-5.png"/>
      </defs>
      </svg>
      
    </div>
  );
}
