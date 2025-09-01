export default function Loader({ size = 48, color = "#ffffff" }) {
  return (
    <div
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-busy
      aria-live="polite"
      role="status"
    >
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

/*
Usage:

{loading ? <Loader /> : <Content />}

Props:
- size: diameter in px (default 48)
- color: spinner color (default white)
*/
