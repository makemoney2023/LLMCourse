import { ImageResponse } from "next/og";

export const alt =
  "LLM Leverage Course — master the context loop in 12 modules";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0c1f17 0%, #123527 100%)",
          color: "#f4f1ea",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#7fd8a8",
          }}
        >
          LLM Leverage Course
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            lineHeight: 1.1,
            fontWeight: 700,
            maxWidth: 980,
          }}
        >
          Master the context loop, not the tool of the week.
        </div>
        <div style={{ marginTop: 32, fontSize: 32, color: "#c8d8cd" }}>
          12 modules · rules, tools, memory, verification · free
        </div>
      </div>
    ),
    size,
  );
}
