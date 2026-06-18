import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <Image
        src="/images/committee_bg.png"
        alt=""
        fill
        priority
        style={{
          objectFit: "cover",
          objectPosition: "top center",
        }}
      />
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}>
        <Link href="/">
          <button style={{
            padding: "12px 28px",
            fontSize: "16px",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}>
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}