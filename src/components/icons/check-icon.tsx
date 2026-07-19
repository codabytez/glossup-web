export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <rect width="20" height="20" rx="10" fill="#FFD2D2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2473 6.15835L8.28066 11.9167L6.69733 10.225C6.40566 9.95002 5.94733 9.93335 5.614 10.1667C5.289 10.4084 5.19733 10.8334 5.39733 11.175L7.27233 14.225C7.45566 14.5084 7.77233 14.6834 8.13066 14.6834C8.47233 14.6834 8.79733 14.5084 8.98066 14.225C9.28066 13.8334 15.0057 7.00835 15.0057 7.00835C15.7557 6.24169 14.8473 5.56669 14.2473 6.15002V6.15835Z"
        fill="#990B33"
      />
    </svg>
  );
}
