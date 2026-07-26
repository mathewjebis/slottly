const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: { box: 24, text: "text-lg" },
    md: { box: 32, text: "text-xl" },
    lg: { box: 40, text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={s.box}
        height={s.box}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="32"
          height="32"
          rx="6"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        <rect x="0" y="0" width="32" height="10" rx="4" fill="#4f46e5" />
        <rect x="6" y="16" width="6" height="6" rx="1.5" fill="#818cf8" />
        <rect x="18" y="16" width="6" height="6" rx="1.5" fill="#c7d2fe" />
        <rect x="6" y="24" width="6" height="4" rx="1" fill="#818cf8" />
      </svg>
      <span className={`${s.text} font-bold text-white tracking-tight`}>
        Slottly
      </span>
    </div>
  );
};

export default Logo;
