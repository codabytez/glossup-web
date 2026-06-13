export function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4.66654 2C2.82587 2 1.3332 3.47733 1.3332 5.3C1.3332 6.77133 1.91654 10.2633 7.65854 13.7933C7.76139 13.8559 7.87947 13.889 7.99987 13.889C8.12027 13.889 8.23835 13.8559 8.3412 13.7933C14.0832 10.2633 14.6665 6.77133 14.6665 5.3C14.6665 3.47733 13.1739 2 11.3332 2C9.49254 2 7.99987 4 7.99987 4C7.99987 4 6.5072 2 4.66654 2Z"
        fill={filled ? "#990B33" : "white"}
        fillOpacity={filled ? 1 : 0.2}
        stroke={filled ? "#990B33" : "#3F3F46"}
        strokeWidth="0.666667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
