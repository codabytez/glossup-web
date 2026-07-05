interface ShareIconProps {
  className?: string;
}

export function ShareIcon({ className }: ShareIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M1.66602 14.1667L2.18352 16.2375C2.27364 16.5981 2.4817 16.9182 2.77462 17.1469C3.06755 17.3757 3.42852 17.4999 3.80018 17.5H16.1985C16.5702 17.4999 16.9312 17.3757 17.2241 17.1469C17.517 16.9182 17.7251 16.5981 17.8152 16.2375L18.3327 14.1667"
        stroke="currentColor"
        strokeWidth="0.833333"
        strokeLinecap="round"
      />
      <path d="M9.99939 2.5V12.5" stroke="#9F9FA9" strokeWidth="0.833333" strokeLinecap="round" />
      <path
        d="M13.3327 5.83333L9.99935 2.5L6.66602 5.83333"
        stroke="#9F9FA9"
        strokeWidth="0.833333"
        strokeLinecap="round"
      />
    </svg>
  );
}
