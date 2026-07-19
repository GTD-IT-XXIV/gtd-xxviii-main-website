/* eslint-disable @next/next/no-img-element */

function LogoXL({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} style={{ height: 96, width: "auto", maxWidth: 320, objectFit: "contain" }} />;
}

function LogoL({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} style={{ height: 64, width: "auto", maxWidth: 200, objectFit: "contain" }} />;
}

function LogoM({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} style={{ height: 44, width: "auto", maxWidth: 150, objectFit: "contain" }} />;
}


export default function SponsorsSection() {
  return (
    <section className="w-full bg-white py-14 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">

        {/* ── Sponsored by ── */}
        <div className="w-full flex flex-col items-center gap-8">
          <h2
            className="text-2xl font-bold tracking-wide text-gray-700"
            style={{ fontFamily: "UncialAntiqua, serif" }}
          >
            Sponsored by:
          </h2>

          {/* XL — Carasun */}
          <LogoXL src="/images/sponsors/CARASUN MAIN LOGO.png" alt="Carasun" />

          {/* L tier row — Eight Telecom · Three Legs Brand · CHAT */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <LogoL src="/images/sponsors/[EIGHT] Logo.png" alt="Eight Telecom" />
            <LogoL src="/images/sponsors/[Cooltopia] Company Logo.jpeg" alt="Three Legs Brand (Cooltopia)" />
            <LogoL src="/images/sponsors/[CHAT] Logo Horizontal_RGB_C.png" alt="CHAT – Young People's Minds Matter" />
          </div>

          {/* M tier — Cloversoft */}
          <LogoM src="/images/sponsors/[Cloversoft] Logo (Grey Green).png" alt="Cloversoft" />
        </div>

        {/* divider */}
        <hr className="w-full border-gray-200" />

        {/* ── Supported by ── */}
        <div className="w-full flex flex-col items-center gap-8">
          <h2
            className="text-2xl font-bold tracking-wide text-gray-700"
            style={{ fontFamily: "UncialAntiqua, serif" }}
          >
            Supported by:
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-10">
            <LogoL src="/images/sponsors/logo KBRI.jpeg" alt="Embassy of the Republic of Indonesia in Singapore" />
            <LogoL src="/images/sponsors/logo PINTU.png" alt="Pintu" />
            <LogoL src="/images/sponsors/PPIS Singapura.png" alt="PPI Singapura" />
          </div>
        </div>

      </div>
    </section>
  );
}
