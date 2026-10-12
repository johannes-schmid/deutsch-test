import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "deutschtest üben",
    short_name: "deutschtest",
    description: "Realistische Modelltests für den DTZ und andere Deutschprüfungen.",
    lang: "de",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF1F6",
    theme_color: "#EEF1F6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
