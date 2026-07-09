import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/heroSection";
import Anthem from "./components/anthem";
import FAQ from "./components/FAQ";
import ContactUs from "./components/contactUs";

export default function Page() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
        <Image
          src="/images/abt_page_bg.png"
          alt=""
          fill
          priority
          style={{
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>

      {/* Added flex, flex-col, and gap-6 to evenly space all sections */}
      <div 
        className="relative z-10 flex flex-col gap-6 md:gap-8 pb-10 pt-4"
      >
        <HeroSection />
        <Anthem />
        <FAQ />
        <ContactUs />
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px"
        }}>
          <Link href="/?map=1">
            <button style={{
              padding: "12px 28px",
              fontSize: "16px",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
      
    </div>
  );
}