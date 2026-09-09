const Logo = ({ size = "md", showWordmark = true, className = "" }) => {
  const sizes = {
    sm: { box: 28, text: "text-lg" },
    md: { box: 34, text: "text-xl" },
    lg: { box: 44, text: "text-3xl" },
    xl: { box: 56, text: "text-5xl md:text-6xl" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={s.box}
        height={s.box}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#0f766e" />
        <rect x="6" y="8" width="20" height="3" rx="1.5" fill="#ccfbf1" />
        <rect x="6" y="14.5" width="8" height="8" rx="2" fill="#5eead4" />
        <rect x="18" y="14.5" width="8" height="8" rx="2" fill="#99f6e4" />
      </svg>
      {showWordmark && (
        <span
          className={`${s.text} font-display font-bold text-ink tracking-tight`}
        >
          Slottly
        </span>
      )}
    </div>
  );
};

export default Logo;
