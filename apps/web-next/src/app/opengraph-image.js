import { ImageResponse } from "next/og";

export const alt = "Ricardo Mazo | Digital Strategist & Solutions Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen OG por defecto para todo el sitio (home, /blog, /proyectos y
// cualquier ruta que no defina la suya propia -- cada artículo de blog sí
// define la suya via generateMetadata con post.cover_image). Se genera en
// el momento con next/og, sin depender de ningún archivo estático en
// /public ni de fuentes externas, así que no añade ninguna dependencia de
// red al build.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0a0e14",
          backgroundImage:
            "linear-gradient(#182230 1px, transparent 1px), linear-gradient(90deg, #182230 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              backgroundColor: "#f5a623",
            }}
          />
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#f5a623",
              fontFamily: "monospace",
            }}
          >
            Digital Strategist & Solutions Developer
          </div>
        </div>
        <div
          style={{
            fontSize: "84px",
            fontWeight: 700,
            color: "#eef1f5",
            lineHeight: 1.05,
          }}
        >
          Ricardo Mazo
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          {["Digital Strategy", "AI Agents", "Automation"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: "24px",
                color: "#36b8ad",
                border: "2px solid #182230",
                borderRadius: "9999px",
                padding: "10px 24px",
                fontFamily: "monospace",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
