export default function Ellipse({ className = "" }) {
  return (
    <div className={`${className}`}>
      <svg width="100%" height="100%" style={{"overflow":"visible"}} preserveAspectRatio="none" viewBox="0 0 241 240" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <ellipse cx="120.613" cy="120" rx="120.5" ry="120" fill="#E0FF22"/>
      <ellipse cx="120.613" cy="120" rx="120.5" ry="120" fill="url(#pattern-1:942-0_1_942)"/>
      <defs>
      <pattern id="pattern-1:942-0_1_942" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image0_1_942" transform="matrix(0.00207469 0 0 0.00208333 0 -0.00104167)"/>
      </pattern>
      <image id="image0_1_942" width="482" height="481" xlinkHref="/assets/ellipse.png"/>
      </defs>
      </svg>
      
    </div>
  );
}
