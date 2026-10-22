export default function Mark({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect width="100" height="100" rx="24" fill="#0857C3" />
      <path d="M32 24v52M32 50l26-26M32 50l26 26" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="73" cy="50" r="7" fill="#fff" />
    </svg>
  );
}
