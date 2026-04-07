export default function CommercifyLogo({ className = "", size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dark rounded square base */}
      <rect width="32" height="32" rx="9" fill="#0F0F0F" />

      {/* Bold "C" arc — clean geometric */}
      <path
        d="M22 10.5C20.3 9.0 18.25 8 16 8C11.0 8 7 12.0 7 17C7 22.0 11.0 26 16 26C18.25 26 20.3 25.0 22 23.5"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Blue dot accent — fills the C opening, suggests a spark/momentum */}
      <circle cx="23" cy="17" r="2.4" fill="#0A84FF" />
    </svg>
  );
}
