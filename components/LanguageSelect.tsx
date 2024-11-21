export const LanguageSelect = ({ value, onChange, options, label }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white/10 backdrop-blur-md text-white 
                px-4 py-2 pr-8 rounded-lg border border-white/20 
                hover:border-white/40 focus:border-white/60
                shadow-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                cursor-pointer min-w-[200px]"
        >
            {options.map((lang) => (
                <option 
                    key={`${label}-${lang.code}`} 
                    value={lang.code}
                    className="bg-gray-800 text-white"
                >
                    {lang.flag} {lang.name} ({label})
                </option>
            ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
            <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                />
            </svg>
        </div>
    </div>
);