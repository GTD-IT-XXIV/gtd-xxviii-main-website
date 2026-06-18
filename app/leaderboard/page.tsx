import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        backgroundImage: "url('/images/leaderboard_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link href="/?map=1">
        <button
          style={{
            padding: "12px 28px",
            fontSize: "16px",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}