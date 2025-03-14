export default function Group3({ className = "" }) {
    return (
        <div className={`${className} rounded-full`}>
            <svg width="100%" height="100%" viewBox="0 0 98 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="98" height="100" rx="30" fill="#fff" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M29 50L29 34C29 31.7909 30.7909 30 33 30L49.0053 30L48.9977 30C48.8856 30.0011 44.652 30.0904 36.8788 37.5758C29.0002 45.1625 29 49.9997 29 50ZM60.8182 62.4242C69 54.8485 69 50 69 50V66C69 68.2091 67.2091 70 65 70V70L49 70C49 70 52.6364 70 60.8182 62.4242ZM65 30V30C61.1583 30 57.4739 31.5261 54.7573 34.2427L33.2426 55.7573C30.5261 58.4739 29 62.1583 29 66V66C29 68.2091 30.7909 70 33 70V70C36.8318 70 40.5049 68.4695 43.203 65.7485L64.9634 43.8038C67.5491 41.1961 69 37.6724 69 34V34C69 31.7909 67.2091 30 65 30Z" fill="#000" />
                <defs>
                    <linearGradient id="paint0_linear_5002_2250" x1="29" y1="30" x2="69" y2="70" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" />
                        <stop offset="0.5" stop-color="#F2F2F7" />
                        <stop offset="1" stop-color="#F2F2F7" />
                    </linearGradient>
                </defs>
            </svg>

        </div>
    );
}
